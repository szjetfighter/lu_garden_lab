/**
 * 秋季效果：解离
 * 
 * 交互设计：
 * 1. 手指/鼠标扫过 → 字符渐隐+飘散消失（不回来）
 * 2. 倾斜手机 → 未消失的文字抖动，越倾斜越剧烈
 */

import * as THREE from 'three'
import type { CharParticle } from '../useTextParticles'

// 秋天季节参数
export const autumnParams = {
  homeForce: 0.06,      // 较强回家力（未消失的粒子保持位置）
  damping: 0.92,        // 适度阻尼
  repulsionRadius: 0,
  repulsionStrength: 0,
  jitter: 0,
  gravity: { x: 0, y: 0 },
  initialScale: 1,
}

// 消失状态
interface BlowState {
  progress: number      // 0~1，消失进度
  velocityX: number     // 飘散方向
  velocityY: number
}

// 正在消失的粒子
const blowingParticles = new Map<CharParticle, BlowState>()
// 已完全消失的粒子
const blownAway = new Set<CharParticle>()

// 重置（切换季节时调用）
export function resetAutumn() {
  blowingParticles.clear()
  blownAway.clear()
}

// 初始化秋季（恢复所有粒子可见）
export function initAutumn(particles: CharParticle[]) {
  resetAutumn()
  particles.forEach(p => {
    p.mesh.fillOpacity = 1
    p.mesh.scale?.setScalar(1)
  })
}

// 秋天效果函数
export function applyAutumnWind(
  particles: CharParticle[],
  hitParticles: CharParticle[],
  tiltX: number,
  tiltY: number,
  scene: THREE.Scene
) {
  // 新触碰的粒子：开始消失动画
  for (const p of hitParticles) {
    if (!blownAway.has(p) && !blowingParticles.has(p)) {
      blowingParticles.set(p, {
        progress: 0,
        velocityX: (Math.random() - 0.5) * 0.03,
        velocityY: Math.random() * 0.02 + 0.01,  // 向上飘
      })
    }
  }
  
  // 更新正在消失的粒子
  blowingParticles.forEach((state, p) => {
    state.progress += 0.04  // 约25帧（~0.4秒）完成，更快消失
    
    // 渐隐
    const opacity = Math.max(0, 1 - state.progress * 1.5)
    p.mesh.fillOpacity = opacity
    
    // 飘散
    p.position.x += state.velocityX
    p.position.y += state.velocityY
    
    // 缩小到0
    const scale = Math.max(0, 1 - state.progress)
    p.mesh.scale?.setScalar(scale)
    
    // 轻微旋转
    if (p.mesh.rotation) {
      p.mesh.rotation.z += (Math.random() - 0.5) * 0.05
    }
    
    // opacity很低时提前移除（避免残影）
    if (opacity <= 0.1 || state.progress >= 1) {
      // 完全隐藏
      p.mesh.visible = false
      p.mesh.fillOpacity = 0
      p.mesh.text = ''  // 清空文本
      // 从场景移除
      scene.remove(p.mesh)
      if (p.mesh.dispose) p.mesh.dispose()
      blowingParticles.delete(p)
      blownAway.add(p)
    }
  })
  
  // 处理未消失的粒子：倾斜抖动
  for (const p of particles) {
    if (blownAway.has(p) || blowingParticles.has(p)) continue
    
    const tiltStrength = Math.abs(tiltX) + Math.abs(tiltY)
    if (tiltStrength > 0.05) {
      const shake = tiltStrength * 0.006
      p.velocity.x += (Math.random() - 0.5) * shake
      p.velocity.y += (Math.random() - 0.5) * shake
    }
  }
}
