import { ref } from 'vue'
import type { CharParticle } from '../useTextParticles'

// 冬天季节参数
export const winterParams = {
  homeForce: 0.03,
  damping: 0.9,
  repulsionRadius: 0,   // 冬天冻住，不响应
  repulsionStrength: 0,
  jitter: 0,
  gravity: { x: 0, y: 0 },
  initialScale: 0.95,   // 聚合动画终点（冰封状态）
}

// 冬天解冻进度 (0-1)
export const winterThawProgress = ref(0)

// 初始化冬天（聚合动画已设置冰封状态，此处仅重置解冻进度）
// 聚合动画终点：opacity=0.15, scale=0.95, color=0xaaddff
export function initWinter(_particles: CharParticle[]) {
  winterThawProgress.value = 0
  // 聚合动画已设置正确的冰封状态，无需重复设置
}

// 冬天效果：冰封+摇晃解冻
// 初始冰封状态，摇晃手机可以解冻
export function applyWinterFreeze(
  particles: CharParticle[],
  shakeIntensity: number,
  isShaking: boolean
) {
  // 摇晃时增加解冻进度
  if (isShaking || shakeIntensity > 8) {
    winterThawProgress.value = Math.min(1, winterThawProgress.value + 0.05)
  } else {
    // 不摇晃时慢慢重新冻住
    winterThawProgress.value = Math.max(0, winterThawProgress.value - 0.002)
  }

  const thaw = winterThawProgress.value

  particles.forEach((p, _index) => {
    // 冰封效果：模糊+偏蓝色
    const baseOpacity = 0.15 + thaw * 0.85
    p.mesh.fillOpacity = baseOpacity
    
    // 解冻时的颜色变化（冰蓝->白）
    const blue = Math.floor(255 - thaw * 55)
    const color = (255 << 16) | (255 << 8) | blue
    p.mesh.color = thaw > 0.8 ? 0xffffff : color
    
    // 解冻时轻微抖动
    if (thaw > 0.3 && thaw < 1) {
      p.velocity.x += (Math.random() - 0.5) * 0.01 * thaw
      p.velocity.y += (Math.random() - 0.5) * 0.01 * thaw
    }
    
    // 完全解冻后恢复正常
    if (thaw >= 1) {
      p.mesh.scale?.setScalar(1)
    } else {
      // 冻住时略微缩小
      p.mesh.scale?.setScalar(0.95 + thaw * 0.05)
    }
  })
}
