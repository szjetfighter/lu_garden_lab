import type { CharParticle } from '../useTextParticles'

// 春天季节参数
export const springParams = {
  homeForce: 0.05,      // 强回家力
  damping: 0.85,
  repulsionRadius: 0,   // 春天不斥力，而是生长
  repulsionStrength: 0,
  jitter: 0,
  gravity: { x: 0, y: 0 },
  initialScale: 0.5,    // 聚合动画终点（种子状态）
}

// 初始化春天（聚合动画已设置种子状态，此处仅确认）
// 聚合动画终点：opacity=0.15, scale=0.5
export function initSpring(_particles: CharParticle[]) {
  // 聚合动画已设置正确的初始状态，无需重复设置
}

// 春天效果：持续生长（按着时停止）
// 从种子状态（opacity=0.15, scale=0.5）不断生长到15倍（约30秒）
// isPressed: 用户是否按着屏幕，按着时停止生长
export function applySpringGrowth(
  particles: CharParticle[],
  _deltaTime: number,
  isPressed: boolean = false
) {
  // 按着时不生长
  if (isPressed) return
  
  particles.forEach((p, _index) => {
    const currentScale = p.mesh.scale?.x || 0.5
    const currentOpacity = p.mesh.fillOpacity
    const growthSpeed = 0.002
    const maxScale = 15
    
    if (currentScale < maxScale) {
      // scale: 0.5 → 15（持续生长）
      const newScale = Math.min(maxScale, currentScale + growthSpeed)
      p.mesh.scale?.setScalar(newScale)
      
      // opacity: 0.15 → 1（在scale达到1之前完成）
      if (currentOpacity < 1) {
        const opacitySpeed = growthSpeed * 1.7
        const newOpacity = Math.min(1, currentOpacity + opacitySpeed)
        p.mesh.fillOpacity = newOpacity
      }
      
      // 生长初期略微上浮
      if (currentScale < 0.7) {
        p.velocity.y += 0.002
      }
    }
  })
}
