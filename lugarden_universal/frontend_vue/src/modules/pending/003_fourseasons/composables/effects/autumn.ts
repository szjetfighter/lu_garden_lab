import type { CharParticle } from '../useTextParticles'

// 秋天季节参数
export const autumnParams = {
  homeForce: 0.002,     // 很弱的回家力
  damping: 0.98,        // 高阻尼，飘得慢
  repulsionRadius: 2.5,
  repulsionStrength: 0.5,
  jitter: 0.01,
  gravity: { x: 0, y: -0.005 }, // 缓慢下落
  initialScale: 1,
}

// 秋天效果：风吹落叶
// 手滑过或倾斜手机产生风，文字像落叶一样飘散
export function applyAutumnWind(
  particles: CharParticle[],
  pointerX: number,
  pointerY: number,
  pointerActive: boolean,
  tiltX: number,
  tiltY: number
) {
  // 手滑过产生风
  if (pointerActive) {
    const pointerPos = { x: pointerX * 4, y: pointerY * 3 }
    const windRadius = 3
    
    particles.forEach(p => {
      const dx = p.position.x - pointerPos.x
      const dy = p.position.y - pointerPos.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < windRadius) {
        const intensity = 1 - distance / windRadius
        // 被风吹走
        p.velocity.x += dx * 0.02 * intensity
        p.velocity.y += dy * 0.02 * intensity
        // 旋转
        p.mesh.rotation.z += (Math.random() - 0.5) * 0.1 * intensity
      }
    })
  }
  
  // 手机倾斜也产生风
  const windStrength = 0.015
  particles.forEach(p => {
    p.velocity.x += tiltX * windStrength
    p.velocity.y -= tiltY * windStrength * 0.3
    
    // 随机飘动
    p.velocity.x += (Math.random() - 0.5) * 0.005
    p.velocity.y += (Math.random() - 0.5) * 0.005
    
    // 轻微旋转（落叶翻转）
    p.mesh.rotation.z += (Math.random() - 0.5) * 0.01
  })
}
