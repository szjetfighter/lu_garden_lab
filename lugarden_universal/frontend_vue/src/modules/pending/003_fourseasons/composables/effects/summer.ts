import * as THREE from 'three'
import type { CharParticle } from '../useTextParticles'

// 夏天季节参数
export const summerParams = {
  homeForce: 0,         // 无回家力（蒸发后不回来）
  damping: 0.96,
  repulsionRadius: 0,   // 不用斥力，用触碰检测
  repulsionStrength: 0,
  jitter: 0,            // 初始静态
  gravity: { x: 0, y: 0 },
  initialScale: 1,
}

// 蒸发状态
let evaporateProgress = 0
let evaporateTriggered = false

// 初始化夏天（静态显示）
export function initSummer(particles: CharParticle[]) {
  evaporateProgress = 0
  evaporateTriggered = false
  particles.forEach(p => {
    p.mesh.fillOpacity = 1
    p.mesh.scale?.setScalar(1)
    p.velocity.set(0, 0, 0)
  })
}

// 夏天效果：对角线蒸发
// 触碰卡片后，从右下角沿对角线向左上角逐词消失
export function applySummerHeat(
  particles: CharParticle[],
  hitCard: boolean,  // 由Raycaster检测传入
  scene: THREE.Scene,
  cardMesh: THREE.Mesh | null  // 卡片mesh
) {
  if (particles.length === 0) return
  
  // 计算诗歌的边界
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  particles.forEach(p => {
    minX = Math.min(minX, p.home.x)
    maxX = Math.max(maxX, p.home.x)
    minY = Math.min(minY, p.home.y)
    maxY = Math.max(maxY, p.home.y)
  })
  
  // 只有触碰卡片区域才触发蒸发
  if (hitCard && !evaporateTriggered) {
    evaporateTriggered = true
  }
  
  // 未触发时不处理
  if (!evaporateTriggered) return
  
  // 推进蒸发进度（30秒完成整体动画）
  // 计算：30s * 60fps = 1800帧，progress需达1.25，每帧 ≈ 0.0007
  evaporateProgress += 0.0007
  
  const diagonalLength = Math.sqrt((maxX - minX) ** 2 + (maxY - minY) ** 2)
  
  // 对角线方向（从右下角到左上角）
  const diagDirX = (minX - maxX) / diagonalLength
  const diagDirY = (maxY - minY) / diagonalLength
  
  particles.forEach(p => {
    // 计算沿对角线的投影距离（直线扩散）
    const dx = p.home.x - maxX
    const dy = p.home.y - minY
    const projDist = dx * diagDirX + dy * diagDirY  // 点积
    const normalizedDist = projDist / diagonalLength
    
    // 方案2：去掉分区延迟，只用噪声产生不规则边缘
    // 每个字有独立的随机偏移（基于位置的伪随机）
    const noise = Math.sin(p.home.x * 10 + p.home.y * 7) * 0.05
    const regionDelay = noise  // 纯噪声，无分区
    
    // 蒸发阈值：进度越大，能蒸发的距离越远
    const evaporateThreshold = evaporateProgress * 1.1
    
    // 多米诺效果：只有在阈值范围内的字才开始蒸发
    // 用更窄的过渡带，形成更锐利的边界
    const transitionWidth = 0.05  // 过渡带宽度
    
    // 应用分区延迟
    const adjustedDist = normalizedDist + regionDelay
    
    if (adjustedDist < evaporateThreshold) {
      // 计算该字在过渡带中的位置 (0=刚进入, 1=完全进入)
      const distIntoZone = evaporateThreshold - adjustedDist
      const intensity = Math.min(1, distIntoZone / transitionWidth)
      
      // 直接修改位置（绕过阻尼）
      // 颤抖 + 随机漂移
      p.position.x += (Math.random() - 0.5) * 0.02 * intensity
      p.position.y += (Math.random() - 0.5) * 0.02 * intensity
      
      // 向上腾空
      p.position.y += 0.015 * intensity
      // 朝相机飘（Z轴正向），形成腾空消散感
      p.position.z += 0.025 * intensity
      
      // 同步到mesh
      p.mesh.position.copy(p.position)
      
      // 旋转（像烟雾飘散）
      if (p.mesh.rotation) {
        p.mesh.rotation.x += (Math.random() - 0.5) * 0.08 * intensity
        p.mesh.rotation.y += (Math.random() - 0.5) * 0.08 * intensity
        p.mesh.rotation.z += (Math.random() - 0.5) * 0.05 * intensity
      }
      
      // 渐隐
      const targetOpacity = Math.max(0, 1 - intensity * 2)
      p.mesh.fillOpacity = targetOpacity
      
      // 缩小
      const targetScale = Math.max(0.1, 1 - intensity * 0.7)
      p.mesh.scale?.setScalar(targetScale)
      
      // 完全消失后移除
      if (p.mesh.fillOpacity <= 0.05) {
        scene.remove(p.mesh)
        if (p.mesh.dispose) p.mesh.dispose()
      }
    }
  })
  
  // 卡片燃烧消失效果（延迟启动，通过shader实现从右下角开始）
  if (cardMesh) {
    const material = cardMesh.material as THREE.ShaderMaterial
    if (material.uniforms) {
      // 更新时间用于火焰闪烁
      material.uniforms.uTime.value = performance.now() * 0.001
      
      if (evaporateProgress > 0.05) {
        const cardProgress = (evaporateProgress - 0.05) * 1.0  // 延迟启动
        
        if (cardProgress < 1.2) {
          // 更新shader的进度uniform
          material.uniforms.uProgress.value = cardProgress
        } else {
          // 完全消失
          scene.remove(cardMesh)
          material.dispose()
        }
      }
    }
  }
}
