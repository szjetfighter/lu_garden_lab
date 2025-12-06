import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useSensors(containerRef?: Ref<HTMLElement | null>) {
  // 陀螺仪数据 (倾斜)
  const tilt = ref({ x: 0, y: 0 })
  
  // 鼠标/触摸位置 (归一化到 -1 ~ 1，相对于Canvas)
  // active: 鼠标/触摸在画布上移动
  // pressed: 鼠标按下或触摸中
  const pointer = ref({ x: 0, y: 0, active: false, pressed: false })
  
  // 摇晃检测
  const shakeIntensity = ref(0)
  const isShaking = ref(false)
  
  // 摇晃阈值
  const SHAKE_THRESHOLD = 15
  let lastShakeTime = 0

  // 陀螺仪处理
  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (e.gamma !== null && e.beta !== null) {
      // gamma: 左右倾斜 (-90 ~ 90)
      // beta: 前后倾斜 (-180 ~ 180)
      tilt.value = {
        x: Math.max(-1, Math.min(1, (e.gamma || 0) / 45)),
        y: Math.max(-1, Math.min(1, (e.beta || 0) / 45)),
      }
    }
  }

  // 加速计处理 (摇晃检测)
  const handleMotion = (e: DeviceMotionEvent) => {
    const acc = e.accelerationIncludingGravity
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return

    const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2)
    const shake = Math.abs(magnitude - 9.8) // 减去重力

    shakeIntensity.value = shake

    if (shake > SHAKE_THRESHOLD) {
      const now = Date.now()
      if (now - lastShakeTime > 500) {
        isShaking.value = true
        lastShakeTime = now
        setTimeout(() => {
          isShaking.value = false
        }, 300)
      }
    }
  }

  // 计算相对于Canvas的归一化坐标 (-1 ~ 1)
  const getCanvasPointer = (clientX: number, clientY: number) => {
    // 获取容器内的canvas
    const container = containerRef?.value
    const canvas = container?.querySelector('canvas')
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1,
      }
    }
    // 降级：使用窗口坐标
    return {
      x: (clientX / window.innerWidth) * 2 - 1,
      y: -(clientY / window.innerHeight) * 2 + 1,
    }
  }

  // 鼠标移动
  const handleMouseMove = (e: MouseEvent) => {
    const pos = getCanvasPointer(e.clientX, e.clientY)
    pointer.value = { ...pointer.value, ...pos, active: true }
  }

  const handleMouseDown = () => {
    pointer.value.pressed = true
  }

  const handleMouseUp = () => {
    pointer.value.pressed = false
  }

  const handleMouseLeave = () => {
    pointer.value.active = false
    pointer.value.pressed = false
  }

  // 触摸
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      const pos = getCanvasPointer(touch.clientX, touch.clientY)
      pointer.value = { ...pointer.value, ...pos, active: true, pressed: true }
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      const pos = getCanvasPointer(touch.clientX, touch.clientY)
      pointer.value = { ...pointer.value, ...pos, active: true }
    }
  }

  const handleTouchEnd = () => {
    pointer.value.active = false
    pointer.value.pressed = false
  }

  // 请求陀螺仪权限 (iOS 13+)
  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        return permission === 'granted'
      } catch {
        return false
      }
    }
    return true // 非iOS或旧版本不需要权限
  }

  onMounted(async () => {
    // 陀螺仪
    const hasPermission = await requestPermission()
    if (hasPermission) {
      window.addEventListener('deviceorientation', handleOrientation)
      window.addEventListener('devicemotion', handleMotion)
    }

    // 鼠标
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseLeave)

    // 触摸
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
  })

  onUnmounted(() => {
    window.removeEventListener('deviceorientation', handleOrientation)
    window.removeEventListener('devicemotion', handleMotion)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('mouseleave', handleMouseLeave)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
  })

  return {
    tilt,
    pointer,
    shakeIntensity,
    isShaking,
    requestPermission,
  }
}
