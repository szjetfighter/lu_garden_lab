/**
 * 毒理学报告 - 文字粒子系统
 * 
 * 粒子在试管内部，真正的离心效果：
 * - 高权重词沉淀在底部，颜色变深
 * - 低权重词被甩到上方/消散
 */

import { ref, shallowRef, markRaw } from 'vue'
import * as THREE from 'three'
import type { ToxicPoem, ToxicToken } from '../data/loader'

// 试管参数（与 useCentrifugeDevice 一致）
const TUBE_COUNT = 4
const TUBE_RADIUS = 0.15  // 略小于试管内径
const TUBE_HEIGHT = 2.5   // 试管有效高度
const TUBE_DISTANCE = 1   // 试管距中心距离
const DISK_Y = 0.7        // 圆盘高度（试管锚点）
const MAX_TILT = (35 / 180) * Math.PI  // 最大倾斜角度 35°

export interface ToxicParticle {
  mesh: THREE.Mesh
  char: string
  weight: number           // 权重 (0, 0.5, 1) - 高权重沉底
  type: 'core' | 'link' | 'dust'
  tubeIndex: number        // 所在试管索引 (0-3)
  localY: number           // 试管内垂直位置 (0=顶部, 1=底部)
  localAngle: number       // 试管内角度位置
  localRadius: number      // 试管内径向位置
  targetY: number          // 目标Y位置
  settled: number          // 沉淀程度 (0-1)
  opacity: number
  scale: number
}

// 创建字符纹理
function createCharTexture(char: string, size: number = 128): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = '#00ff00'
  ctx.font = `bold ${size * 0.7}px "Courier New", monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = '#00ff00'
  ctx.shadowBlur = 8
  ctx.fillText(char, size / 2, size / 2)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const textureCache = new Map<string, THREE.Texture>()

function getCharTexture(char: string): THREE.Texture {
  if (!textureCache.has(char)) {
    textureCache.set(char, createCharTexture(char))
  }
  return textureCache.get(char)!
}

// 获取试管中心世界坐标
function getTubeCenter(tubeIndex: number): THREE.Vector3 {
  const angle = (tubeIndex / TUBE_COUNT) * Math.PI * 2
  return new THREE.Vector3(
    Math.cos(angle) * TUBE_DISTANCE,
    DISK_Y,
    Math.sin(angle) * TUBE_DISTANCE
  )
}

export function useToxicParticles(scene: THREE.Scene, camera?: THREE.PerspectiveCamera) {
  const particles = ref<ToxicParticle[]>([])
  const meshGroup = shallowRef<THREE.Group | null>(null)
  
  const charSize = 0.12  // 更小的字符适应试管

  const loadPoem = (poem: ToxicPoem) => {
    clear()
    
    const group = new THREE.Group()
    meshGroup.value = markRaw(group)
    
    // 新格式：tokens 已经是扁平化的
    const allTokens = poem.tokens
    
    if (allTokens.length === 0) return
    
    const geometry = new THREE.PlaneGeometry(charSize, charSize)
    
    // 将粒子分配到4个试管
    allTokens.forEach((token, idx) => {
      const tubeIndex = idx % TUBE_COUNT
      
      // 随机初始位置（试管内部）
      const localY = Math.random() * 0.8 + 0.1  // 0.1-0.9
      const localAngle = Math.random() * Math.PI * 2
      const localRadius = Math.random() * TUBE_RADIUS * 0.8
      
      // 创建材质
      const texture = getCharTexture(token.char)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      })
      
      // 初始颜色
      if (token.type === 'core') {
        material.color.setHex(0xffffff)
      } else if (token.type === 'link') {
        material.color.setHex(0xaaffaa)
      } else {
        material.color.setHex(0x66ff66)
      }
      
      const mesh = new THREE.Mesh(geometry, material)
      
      const particle: ToxicParticle = {
        mesh: markRaw(mesh),
        char: token.char,
        weight: token.weight,
        type: token.type,
        tubeIndex,
        localY,
        localAngle,
        localRadius,
        targetY: localY,
        settled: 0,
        opacity: 1,
        scale: 1
      }
      
      particles.value.push(particle)
      group.add(mesh)
    })
    
    scene.add(group)
    
    // 初始更新位置
    updateAllPositions(0, 0)
  }

  // 更新所有粒子的世界位置（考虑试管倾斜）
  const updateAllPositions = (globalRotation: number, rpmRatio: number) => {
    const tiltAngle = rpmRatio * MAX_TILT  // 当前倾斜角度
    
    particles.value.forEach(p => {
      // 正在消散的粒子跳过位置更新（让消散效果自由控制）
      if (p.weight < 0.5 && p.opacity < 0.9) {
        return
      }
      
      const tubeAngle = (p.tubeIndex / TUBE_COUNT) * Math.PI * 2 + globalRotation
      
      // 试管锚点位置（圆盘孔位置，跟随旋转）
      const anchorX = Math.cos(tubeAngle) * TUBE_DISTANCE
      const anchorZ = Math.sin(tubeAngle) * TUBE_DISTANCE
      
      // 试管内局部偏移（未倾斜状态）
      const localOffsetX = Math.cos(p.localAngle) * p.localRadius
      const localOffsetZ = Math.sin(p.localAngle) * p.localRadius
      const localOffsetY = -p.localY * TUBE_HEIGHT  // 向下
      
      // 应用试管倾斜变换
      // 试管绕切线轴旋转，方向是底部向外（径向）
      // 倾斜轴：切线方向 = (-sin(tubeAngle), 0, cos(tubeAngle))
      // 旋转后：局部Y轴（试管轴）向外倾斜
      
      // 使用四元数进行旋转
      const tangentAxis = new THREE.Vector3(-Math.sin(tubeAngle), 0, Math.cos(tubeAngle))
      const quaternion = new THREE.Quaternion().setFromAxisAngle(tangentAxis, tiltAngle)
      
      // 局部偏移向量
      const localOffset = new THREE.Vector3(localOffsetX, localOffsetY, localOffsetZ)
      localOffset.applyQuaternion(quaternion)
      
      // 世界坐标 = 锚点 + 倾斜后的偏移
      p.mesh.position.set(
        anchorX + localOffset.x,
        DISK_Y + localOffset.y,
        anchorZ + localOffset.z
      )
      
      // 面向相机
      p.mesh.rotation.y = -tubeAngle
      
      p.mesh.scale.setScalar(p.scale)
      
      const material = p.mesh.material as THREE.MeshBasicMaterial
      material.opacity = p.opacity
    })
  }

  /**
   * 应用离心力 - 真正的离心效果
   */
  const applyCentrifuge = (rpm: number, deltaTime: number) => {
    if (!meshGroup.value) return
    
    const rpmRatio = rpm / 9000
    
    particles.value.forEach(p => {
      // 计算目标位置：高权重沉底，低权重上浮
      // weight=1 (core) -> targetY = 0.9 (底部)
      // weight=0 (dust) -> targetY = 0.1 (顶部) 并逐渐消失
      
      if (rpmRatio > 0.1) {
        // 离心效果激活
        const centrifugeForce = rpmRatio * 2
        
        if (p.weight >= 0.7) {
          // 高权重：沉淀到底部
          p.targetY = 0.85 + p.weight * 0.1
          p.localY += (p.targetY - p.localY) * deltaTime * centrifugeForce
          p.settled = Math.min(1, p.settled + deltaTime * rpmRatio)
          
          // 沉淀后颜色变深
          const material = p.mesh.material as THREE.MeshBasicMaterial
          const darkness = p.settled * 0.8
          const r = 1 - darkness * 0.9
          const g = 1 - darkness * 0.5
          const b = 1 - darkness * 0.9
          material.color.setRGB(r, g, b)
          
        } else if (p.weight < 0.5) {
          // 中低权重：蒸发消散效果（类似夏天）
          const evaporateIntensity = rpmRatio * (1 - p.weight / 0.5)  // 权重越低消散越快
          
          // 颤抖 + 随机漂移
          p.mesh.position.x += (Math.random() - 0.5) * 0.02 * evaporateIntensity
          p.mesh.position.y += (Math.random() - 0.5) * 0.02 * evaporateIntensity
          
          // 向上腾空
          p.mesh.position.y += 0.01 * evaporateIntensity
          // 朝相机飘（Z轴正向）
          p.mesh.position.z += 0.015 * evaporateIntensity
          
          // 旋转（像烟雾飘散）
          p.mesh.rotation.x += (Math.random() - 0.5) * 0.05 * evaporateIntensity
          p.mesh.rotation.y += (Math.random() - 0.5) * 0.05 * evaporateIntensity
          p.mesh.rotation.z += (Math.random() - 0.5) * 0.03 * evaporateIntensity
          
          // 渐隐
          p.opacity = Math.max(0, p.opacity - deltaTime * rpmRatio * 1.5)
          // 缩小
          p.scale = Math.max(0.1, p.scale - deltaTime * rpmRatio * 0.8)
          
          // 更新材质
          const material = p.mesh.material as THREE.MeshBasicMaterial
          material.opacity = p.opacity
          material.color.setHex(0xff6666)  // 变红
          p.mesh.scale.setScalar(p.scale)
          
        } else {
          // 中等权重：缓慢下沉
          p.targetY = 0.5 + p.weight * 0.3
          p.localY += (p.targetY - p.localY) * deltaTime * centrifugeForce * 0.3
        }
        
        // 径向扩散
        p.localRadius = Math.min(TUBE_RADIUS * 0.9, p.localRadius + deltaTime * rpmRatio * 0.1)
        p.localAngle += deltaTime * rpm * 0.001  // 轻微旋转
      }
    })
  }

  /**
   * 更新（由外部调用）
   */
  const update = (globalRotation: number, rpmRatio: number) => {
    updateAllPositions(globalRotation, rpmRatio)
  }

  const reset = () => {
    particles.value.forEach(p => {
      // 重置位置
      p.localY = Math.random() * 0.8 + 0.1
      p.localRadius = Math.random() * TUBE_RADIUS * 0.8
      p.targetY = p.localY
      p.settled = 0
      p.opacity = 1
      p.scale = 1
      
      // 恢复颜色
      const material = p.mesh.material as THREE.MeshBasicMaterial
      if (p.type === 'core') {
        material.color.setHex(0xffffff)
      } else if (p.type === 'link') {
        material.color.setHex(0xaaffaa)
      } else {
        material.color.setHex(0x66ff66)
      }
      material.opacity = 1
    })
    
    updateAllPositions(0, 0)
  }

  const clear = () => {
    if (meshGroup.value) {
      scene.remove(meshGroup.value)
      
      particles.value.forEach(p => {
        const material = p.mesh.material as THREE.MeshBasicMaterial
        material.dispose()
      })
      
      meshGroup.value = null
    }
    particles.value = []
  }

  const getResidue = (): string => {
    return particles.value
      .filter(p => p.settled > 0.5 && p.weight >= 0.7)
      .map(p => p.char)
      .join('')
  }

  const getExtractionRate = (): number => {
    const total = particles.value.length
    const settled = particles.value.filter(p => p.settled > 0.5).length
    return total > 0 ? settled / total : 0
  }

  // 获取指定试管的所有词（随机顺序）
  const getTubeWords = (tubeIndex: number): string[] => {
    const tubeParticles = particles.value.filter(p => p.tubeIndex === tubeIndex)
    // 随机打乱
    const shuffled = [...tubeParticles].sort(() => Math.random() - 0.5)
    return shuffled.map(p => p.char)
  }

  // 悬浮展示状态
  let floatingTube = -1  // 当前悬浮展示的试管索引，-1 表示无
  let isReturning = false  // 是否正在收回
  const floatTargets = new Map<ToxicParticle, THREE.Vector3>()
  const returnTargets = new Map<ToxicParticle, THREE.Vector3>()

  // 让指定试管的词悬浮出来（向相机弹射）
  const floatOutTube = (tubeIndex: number) => {
    if (floatingTube === tubeIndex) {
      // 点击同一个试管，收回
      returnToTube()
      return
    }
    
    floatingTube = tubeIndex
    floatTargets.clear()
    
    // 只展示还可见的粒子（过滤掉已消散的）
    const tubeParticles = particles.value.filter(p => p.tubeIndex === tubeIndex && p.opacity > 0.1)
    
    // 获取相机位置，计算弹射方向
    const camPos = camera?.position.clone() || new THREE.Vector3(0, 0, 10)
    // 在相机前方 3-5 单位处展示
    const displayDistance = 5
    const displayCenter = camPos.clone().normalize().multiplyScalar(displayDistance)
    
    // 在相机前方排列成云状
    tubeParticles.forEach((p, i) => {
      // 随机分布在相机前方区域
      const row = Math.floor(i / 8)
      const col = i % 8
      const offsetX = (col - 3.5) * 0.25 + (Math.random() - 0.5) * 0.1
      const offsetY = -row * 0.35 + (Math.random() - 0.5) * 0.1
      
      const target = displayCenter.clone()
      target.x += offsetX
      target.y += offsetY + 1  // 稍微抬高
      
      floatTargets.set(p, target)
      
      // 放大并变亮
      p.scale = 2
      const material = p.mesh.material as THREE.MeshBasicMaterial
      material.color.setHex(0x00ff00)
      material.opacity = 1
    })
  }

  // 收回悬浮的词
  const returnToTube = () => {
    if (floatingTube < 0) return
    
    isReturning = true
    returnTargets.clear()
    
    // 为悬浮的粒子设置返回目标（试管内位置）
    floatTargets.forEach((_, p) => {
      // 计算试管内的目标位置
      const tubeAngle = (p.tubeIndex / TUBE_COUNT) * Math.PI * 2
      const anchorX = Math.cos(tubeAngle) * TUBE_DISTANCE
      const anchorZ = Math.sin(tubeAngle) * TUBE_DISTANCE
      const targetY = DISK_Y - p.localY * TUBE_HEIGHT
      
      returnTargets.set(p, new THREE.Vector3(anchorX, targetY, anchorZ))
      
      // 恢复大小
      p.scale = 1
    })
    
    floatTargets.clear()
  }

  // 更新悬浮动画
  const updateFloating = () => {
    const camPos = camera?.position || new THREE.Vector3(0, 0, 10)
    
    // 处理收回动画
    if (isReturning && returnTargets.size > 0) {
      let allReturned = true
      
      returnTargets.forEach((target, p) => {
        p.mesh.position.lerp(target, 0.15)
        p.mesh.scale.setScalar(p.scale)
        
        // 检查是否到达目标
        if (p.mesh.position.distanceTo(target) > 0.1) {
          allReturned = false
        }
      })
      
      // 全部返回后结束
      if (allReturned) {
        isReturning = false
        floatingTube = -1
        returnTargets.clear()
      }
      return
    }
    
    // 处理悬浮动画
    if (floatingTube < 0) return
    
    floatTargets.forEach((target, p) => {
      // 平滑移动到目标位置
      p.mesh.position.lerp(target, 0.1)
      p.mesh.scale.setScalar(p.scale)
      
      // 面向相机
      p.mesh.lookAt(camPos)
    })
  }

  // 检查是否有悬浮状态
  const isFloating = () => floatingTube >= 0 || isReturning

  return {
    particles,
    meshGroup,
    loadPoem,
    applyCentrifuge,
    update,
    reset,
    clear,
    getResidue,
    getExtractionRate,
    getTubeWords,
    floatOutTube,
    returnToTube,
    updateFloating,
    isFloating
  }
}
