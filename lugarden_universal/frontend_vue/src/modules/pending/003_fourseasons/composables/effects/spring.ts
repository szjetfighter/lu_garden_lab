import type { CharParticle } from '../useTextParticles'

// 春天季节参数
export const springParams = {
  homeForce: 0.05,      // 强回家力
  damping: 0.85,
  repulsionRadius: 0,   // 春天不斥力，而是生长
  repulsionStrength: 0,
  jitter: 0,
  gravity: { x: 0, y: 0 },
  initialScale: 0.1,    // 初始很小（种子）
}

// 初始化春天（设置为种子状态）
export function initSpring(particles: CharParticle[]) {
  particles.forEach(p => {
    p.mesh.scale?.setScalar(0.1)
    p.mesh.fillOpacity = 0.8
  })
}

// 春天效果：自然生长
// 初始文字很小（种子），随时间自然生长到完整大小
export function applySpringGrowth(
  particles: CharParticle[],
  _deltaTime: number
) {
  particles.forEach((p, index) => {
    const currentScale = p.mesh.scale?.x || 0.1
    // 每个字有不同的生长延迟，形成波浪效果
    const growthSpeed = 0.008
    
    if (currentScale < 1) {
      const newScale = Math.min(1, currentScale + growthSpeed)
      p.mesh.scale?.setScalar(newScale)
      
      // 生长时略微上浮
      if (currentScale < 0.5) {
        p.velocity.y += 0.002
      }
    }
    
    // 完全长成后轻微呼吸效果
    if (currentScale >= 0.99) {
      const breath = Math.sin(Date.now() * 0.002 + index * 0.1) * 0.02
      p.mesh.scale?.setScalar(1 + breath)
    }
  })
}
