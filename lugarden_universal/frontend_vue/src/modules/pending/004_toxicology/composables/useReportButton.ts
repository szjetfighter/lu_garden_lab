/**
 * 3D 报告按钮
 * WebGL 元素，会受到后期处理效果影响
 */
import * as THREE from 'three'
import { ref, shallowRef } from 'vue'

export function useReportButton(scene: THREE.Scene, camera: THREE.Camera) {
  const buttonMesh = shallowRef<THREE.Mesh | null>(null)
  const isVisible = ref(false)
  
  // 创建文字纹理
  const createTextTexture = (text: string): THREE.Texture => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = 512
    canvas.height = 128
    
    // 背景（半透明深色）
    ctx.fillStyle = 'rgba(30, 30, 35, 0.8)'
    ctx.roundRect(0, 0, canvas.width, canvas.height, 12)
    ctx.fill()
    
    // 边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.roundRect(2, 2, canvas.width - 4, canvas.height - 4, 10)
    ctx.stroke()
    
    // 文字
    ctx.fillStyle = '#f0f0f0'
    ctx.font = '32px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }
  
  // 创建按钮
  const create = () => {
    const texture = createTextTexture('查看毒理报告')
    
    const geometry = new THREE.PlaneGeometry(4, 1)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    })
    
    buttonMesh.value = new THREE.Mesh(geometry, material)
    buttonMesh.value.position.set(0, 0, 4)  // 靠近相机
    buttonMesh.value.visible = false
    buttonMesh.value.userData.isReportButton = true
    
    scene.add(buttonMesh.value)
  }
  
  // 显示按钮（带渐入动画）
  const show = () => {
    if (!buttonMesh.value) return
    isVisible.value = true
    buttonMesh.value.visible = true
    buttonMesh.value.scale.setScalar(0.5)
    
    const material = buttonMesh.value.material as THREE.MeshBasicMaterial
    material.opacity = 0
  }
  
  // 更新动画（呼吸效果）
  let breatheTime = 0
  const update = (delta: number) => {
    if (!buttonMesh.value || !isVisible.value) return
    
    const material = buttonMesh.value.material as THREE.MeshBasicMaterial
    
    // 渐入
    if (material.opacity < 1) {
      material.opacity = Math.min(1, material.opacity + delta * 0.5)
      const scale = 0.5 + material.opacity * 0.5
      buttonMesh.value.scale.setScalar(scale)
    }
    
    // 呼吸效果
    breatheTime += delta
    const breathe = Math.sin(breatheTime * 2) * 0.5 + 0.5  // 0-1
    material.opacity = 0.6 + breathe * 0.4  // 0.6-1
    const scale = 1 + breathe * 0.05  // 1-1.05
    buttonMesh.value.scale.setScalar(scale)
    
    // 始终面向相机
    buttonMesh.value.lookAt(camera.position)
  }
  
  // 隐藏
  const hide = () => {
    if (!buttonMesh.value) return
    isVisible.value = false
    buttonMesh.value.visible = false
  }
  
  // 检测点击
  const checkClick = (raycaster: THREE.Raycaster): boolean => {
    if (!buttonMesh.value || !isVisible.value) return false
    
    const intersects = raycaster.intersectObject(buttonMesh.value)
    return intersects.length > 0
  }
  
  // 清理
  const dispose = () => {
    if (buttonMesh.value) {
      scene.remove(buttonMesh.value)
      buttonMesh.value.geometry.dispose()
      const material = buttonMesh.value.material as THREE.MeshBasicMaterial
      material.map?.dispose()
      material.dispose()
      buttonMesh.value = null
    }
  }
  
  return {
    buttonMesh,
    isVisible,
    create,
    show,
    hide,
    update,
    checkClick,
    dispose
  }
}
