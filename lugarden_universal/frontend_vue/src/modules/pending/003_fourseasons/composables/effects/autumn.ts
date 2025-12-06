/**
 * 秋季效果：解离
 * 
 * 交互设计：
 * 1. 手指/鼠标扫过 → 单个字符被吹走（消失）
 * 2. 倾斜手机 → 剩余文字随机飘动加剧
 */

import type { CharParticle } from '../useTextParticles'

// 秋天季节参数
export const autumnParams = {
  homeForce: 0.06,      // 较强回家力
  damping: 0.92,        // 适度阻尼
  repulsionRadius: 0,   // 无斥力
  repulsionStrength: 0,
  jitter: 0,
  gravity: { x: 0, y: 0 },
  initialScale: 1,
}

// 被吹走的粒子集合
const blownAway = new Set<CharParticle>()

// 重置（切换季节时调用）
export function resetAutumn() {
  blownAway.clear()
}

// 初始化秋季（恢复所有粒子可见）
export function initAutumn(particles: CharParticle[]) {
  blownAway.clear()
  particles.forEach(p => {
    p.mesh.fillOpacity = 1
  })
}

// 秋天效果函数
// hitParticles: 由Raycaster检测到的被触碰的粒子
export function applyAutumnWind(
  particles: CharParticle[],
  hitParticles: CharParticle[],
  tiltX: number,
  tiltY: number
) {
  // 被触碰的粒子：吹走消失
  for (const p of hitParticles) {
    if (!blownAway.has(p)) {
      blownAway.add(p)
      p.mesh.fillOpacity = 0
    }
  }
  
  // 处理所有粒子
  for (const p of particles) {
    // 已吹走的粒子：保持透明
    if (blownAway.has(p)) {
      p.mesh.fillOpacity = 0
      continue
    }
    
    // 效果2：倾斜 → 抖动
    const tiltStrength = Math.abs(tiltX) + Math.abs(tiltY)
    if (tiltStrength > 0.05) {
      const shake = tiltStrength * 0.008
      p.velocity.x += (Math.random() - 0.5) * shake
      p.velocity.y += (Math.random() - 0.5) * shake
    }
  }
}
