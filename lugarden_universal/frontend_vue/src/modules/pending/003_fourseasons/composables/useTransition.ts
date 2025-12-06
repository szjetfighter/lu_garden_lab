import { ref } from 'vue'
import * as THREE from 'three'
import type { CharParticle } from './useTextParticles'
import type { Season } from './useSeasonEffects'

export interface CardFragment {
  mesh: THREE.Mesh
  home: THREE.Vector3
  position: THREE.Vector3
  velocity: THREE.Vector3
}

export function useTransition() {
  const isTransitioning = ref(false)
  const transitionProgress = ref(0)
  
  // 崩解动画状态
  let dissolveAnimationId: number | null = null
  let assembleAnimationId: number | null = null

  /**
   * 文字粒子崩解效果
   * 粒子向外飞散并淡出
   */
  const dissolveParticles = (
    particles: CharParticle[],
    duration: number = 600,
    onComplete?: () => void
  ) => {
    if (particles.length === 0) {
      onComplete?.()
      return
    }

    isTransitioning.value = true
    const startTime = Date.now()

    // 给每个粒子随机速度
    particles.forEach(p => {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.05 + Math.random() * 0.1
      p.velocity.set(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        (Math.random() - 0.5) * 0.05
      )
    })

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      transitionProgress.value = progress

      // 更新位置
      particles.forEach(p => {
        p.position.add(p.velocity)
        p.mesh.position.copy(p.position)
        
        // 淡出
        p.mesh.fillOpacity = 1 - progress
        
        // 轻微缩小
        const scale = 1 - progress * 0.3
        p.mesh.scale?.setScalar(scale)
      })

      if (progress < 1) {
        dissolveAnimationId = requestAnimationFrame(animate)
      } else {
        dissolveAnimationId = null
        onComplete?.()
      }
    }

    dissolveAnimationId = requestAnimationFrame(animate)
  }

  /**
   * 卡片崩解效果
   * 光晕爆发后消失
   */
  const dissolveCard = (
    cardMesh: THREE.Mesh | null,
    duration: number = 600,
    onComplete?: () => void
  ) => {
    if (!cardMesh) {
      onComplete?.()
      return
    }

    const startTime = Date.now()
    const material = cardMesh.material as THREE.ShaderMaterial

    // 设置为崩解模式
    if (material.uniforms?.uGlowIn) {
      material.uniforms.uGlowIn.value = false
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 使用光晕效果
      if (material.uniforms?.uGlowProgress) {
        material.uniforms.uGlowProgress.value = progress
      }

      // 缩小到0
      const scale = 1 - progress
      cardMesh.scale.setScalar(scale)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // 重置光晕进度
        if (material.uniforms?.uGlowProgress) {
          material.uniforms.uGlowProgress.value = 0
        }
        onComplete?.()
      }
    }

    requestAnimationFrame(animate)
  }

  /**
   * 文字粒子聚合效果
   * 粒子从随机位置飞入，根据季节设置不同的终点状态
   */
  const assembleParticles = (
    particles: CharParticle[],
    duration: number = 800,
    season: Season,
    onComplete?: () => void
  ) => {
    if (particles.length === 0) {
      onComplete?.()
      return
    }

    // 根据季节设置聚合动画的终点状态
    // 春/冬：保持"未完成"状态，由季节效果继续演变
    // 夏/秋：直接完全显示
    const endState: Record<Season, { opacity: number; scale: number; color: number }> = {
      spring: { opacity: 0.15, scale: 0.5, color: 0xffffff },
      summer: { opacity: 1, scale: 1, color: 0xffffff },
      autumn: { opacity: 1, scale: 1, color: 0xffffff },
      winter: { opacity: 0.15, scale: 0.95, color: 0xaaddff },
    }
    const target = endState[season]

    const startTime = Date.now()

    // 初始化：粒子从随机位置开始，透明
    particles.forEach(p => {
      const angle = Math.random() * Math.PI * 2
      const distance = 3 + Math.random() * 2
      p.position.set(
        p.home.x + Math.cos(angle) * distance,
        p.home.y + Math.sin(angle) * distance,
        p.home.z + (Math.random() - 0.5) * 2
      )
      p.mesh.position.copy(p.position)
      p.mesh.fillOpacity = 0
      p.mesh.scale?.setScalar(0)
    })

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // 使用easeOutCubic缓动
      const eased = 1 - Math.pow(1 - progress, 3)
      transitionProgress.value = eased

      particles.forEach(p => {
        // 位置插值回home
        p.position.lerpVectors(
          new THREE.Vector3(
            p.home.x + (p.position.x - p.home.x) / (1 - eased * 0.1 + 0.1),
            p.home.y + (p.position.y - p.home.y) / (1 - eased * 0.1 + 0.1),
            p.home.z + (p.position.z - p.home.z) / (1 - eased * 0.1 + 0.1)
          ),
          p.home,
          eased
        )
        p.mesh.position.copy(p.position)
        
        // 淡入到目标opacity
        p.mesh.fillOpacity = eased * target.opacity
        
        // 放大到目标scale
        const scale = eased * target.scale
        p.mesh.scale?.setScalar(scale)
        
        // 冬季设置冰蓝色
        if (season === 'winter' && p.mesh.color !== undefined) {
          p.mesh.color = target.color
        }
      })

      if (progress < 1) {
        assembleAnimationId = requestAnimationFrame(animate)
      } else {
        assembleAnimationId = null
        isTransitioning.value = false
        
        // 确保最终状态正确（使用季节目标值）
        particles.forEach(p => {
          p.position.copy(p.home)
          p.mesh.position.copy(p.home)
          p.mesh.fillOpacity = target.opacity
          p.mesh.scale?.setScalar(target.scale)
          p.velocity.set(0, 0, 0)
          if (season === 'winter' && p.mesh.color !== undefined) {
            p.mesh.color = target.color
          }
        })
        
        onComplete?.()
      }
    }

    assembleAnimationId = requestAnimationFrame(animate)
  }

  /**
   * 卡片聚合效果
   * 从光晕中显现
   */
  const assembleCard = (
    cardMesh: THREE.Mesh | null,
    duration: number = 800,
    onComplete?: () => void
  ) => {
    if (!cardMesh) {
      onComplete?.()
      return
    }

    const startTime = Date.now()
    const material = cardMesh.material as THREE.ShaderMaterial

    // 初始状态：设置为聚合模式，从50%开始
    cardMesh.scale.setScalar(0.5)
    if (material.uniforms?.uGlowIn) {
      material.uniforms.uGlowIn.value = true
    }
    if (material.uniforms?.uGlowProgress) {
      material.uniforms.uGlowProgress.value = 0.001 // 激活光晕模式
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)

      // 光晕进度0->1（从白光中显现）
      if (material.uniforms?.uGlowProgress) {
        material.uniforms.uGlowProgress.value = eased
      }

      // 从50%放大到正常
      const scale = 0.5 + eased * 0.5
      cardMesh.scale.setScalar(scale)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // 确保最终状态：关闭光晕模式
        cardMesh.scale.setScalar(1)
        if (material.uniforms?.uGlowProgress) {
          material.uniforms.uGlowProgress.value = 0
        }
        onComplete?.()
      }
    }

    requestAnimationFrame(animate)
  }

  /**
   * 停止所有动画
   */
  const stopAllAnimations = () => {
    if (dissolveAnimationId) {
      cancelAnimationFrame(dissolveAnimationId)
      dissolveAnimationId = null
    }
    if (assembleAnimationId) {
      cancelAnimationFrame(assembleAnimationId)
      assembleAnimationId = null
    }
    isTransitioning.value = false
  }

  return {
    isTransitioning,
    transitionProgress,
    dissolveParticles,
    dissolveCard,
    assembleParticles,
    assembleCard,
    stopAllAnimations,
  }
}
