import { ref, computed } from 'vue'
import * as THREE from 'three'
import type { CharParticle } from './useTextParticles'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export function useSeasonEffects() {
  const currentSeason = ref<Season>('summer')
  
  // 冬天解冻进度 (0-1)
  const winterThawProgress = ref(0)
  
  // 季节特定参数
  const seasonParams = computed(() => {
    switch (currentSeason.value) {
      case 'spring':
        return {
          homeForce: 0.05,      // 强回家力
          damping: 0.85,
          repulsionRadius: 0,   // 春天不斥力，而是生长
          repulsionStrength: 0,
          jitter: 0,
          gravity: { x: 0, y: 0 },
          initialScale: 0.1,    // 初始很小（种子）
        }
      case 'summer':
        return {
          homeForce: 0,         // 无回家力（蒸发后不回来）
          damping: 0.96,
          repulsionRadius: 0,   // 不用斥力，用触碰检测
          repulsionStrength: 0,
          jitter: 0,            // 初始静态
          gravity: { x: 0, y: 0 },
          initialScale: 1,
        }
      case 'autumn':
        return {
          homeForce: 0.002,     // 很弱的回家力
          damping: 0.98,        // 高阻尼，飘得慢
          repulsionRadius: 2.5,
          repulsionStrength: 0.5,
          jitter: 0.01,
          gravity: { x: 0, y: -0.005 }, // 缓慢下落
          initialScale: 1,
        }
      case 'winter':
        return {
          homeForce: 0.03,
          damping: 0.9,
          repulsionRadius: 0,   // 冬天冻住，不响应
          repulsionStrength: 0,
          jitter: 0,
          gravity: { x: 0, y: 0 },
          initialScale: 1,
        }
    }
  })

  // 切换季节
  const setSeason = (season: Season) => {
    currentSeason.value = season
    // 重置冬天解冻进度
    if (season === 'winter') {
      winterThawProgress.value = 0
    }
  }

  // ========== 春天：自然生长 ==========
  // 初始文字很小（种子），随时间自然生长到完整大小
  const applySpringGrowth = (
    particles: CharParticle[],
    _deltaTime: number
  ) => {
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

  // 初始化春天（设置为种子状态）
  const initSpring = (particles: CharParticle[]) => {
    particles.forEach(p => {
      p.mesh.scale?.setScalar(0.1)
      p.mesh.fillOpacity = 0.8
    })
  }

  // ========== 夏天：对角线蒸发 ==========
  // 蒸发进度 (0-1)，触碰后开始推进
  let summerEvaporateProgress = 0
  let summerEvaporateTriggered = false
  
  const applySummerHeat = (
    particles: CharParticle[],
    hitCard: boolean,  // 由Raycaster检测传入
    scene: THREE.Scene,
    cardMesh: THREE.Mesh | null  // 卡片mesh
  ) => {
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
    if (hitCard && !summerEvaporateTriggered) {
      summerEvaporateTriggered = true
    }
    
    // 未触发时不处理
    if (!summerEvaporateTriggered) return
    
    // 推进蒸发进度（放慢速度，更有仪式感）
    summerEvaporateProgress += 0.002
    
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
      
      // 判断在对角线的上方还是下方（用于分区delay）
      // 对角线上方: dx/dy 比值小于对角线斜率
      const diagSlope = (maxY - minY) / (minX - maxX)
      const pointSlope = dy / (dx || 0.001)
      const isAboveDiag = pointSlope > diagSlope
      const regionDelay = isAboveDiag ? 0.1 : 0  // 上区延迟
      
      // 蒸发阈值：进度越大，能蒸发的距离越远
      const evaporateThreshold = summerEvaporateProgress * 1.1
      
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
        
        if (summerEvaporateProgress > 0.05) {
          const cardProgress = (summerEvaporateProgress - 0.05) * 1.0  // 延迟启动
          
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
  
  // 初始化夏天（静态显示）
  const initSummer = (particles: CharParticle[]) => {
    summerEvaporateProgress = 0
    summerEvaporateTriggered = false
    particles.forEach(p => {
      p.mesh.fillOpacity = 1
      p.mesh.scale?.setScalar(1)
      p.velocity.set(0, 0, 0)
    })
  }

  // ========== 秋天：风吹落叶 ==========
  const applyAutumnWind = (
    particles: CharParticle[],
    pointerX: number,
    pointerY: number,
    pointerActive: boolean,
    tiltX: number,
    tiltY: number
  ) => {
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

  // ========== 冬天：冰封+摇晃解冻 ==========
  const applyWinterFreeze = (
    particles: CharParticle[],
    shakeIntensity: number,
    isShaking: boolean
  ) => {
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

  // 初始化冬天（冰封状态）
  const initWinter = (particles: CharParticle[]) => {
    winterThawProgress.value = 0
    particles.forEach(p => {
      p.mesh.fillOpacity = 0.15
      p.mesh.color = 0xaaddff  // 冰蓝色
      p.mesh.scale?.setScalar(0.95)
    })
  }

  return {
    currentSeason,
    seasonParams,
    winterThawProgress,
    setSeason,
    applySpringGrowth,
    initSpring,
    applySummerHeat,
    initSummer,
    applyAutumnWind,
    applyWinterFreeze,
    initWinter,
  }
}
