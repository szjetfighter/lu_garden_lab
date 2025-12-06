<template>
  <div ref="containerRef" class="poem-scene" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import * as THREE from 'three'
import { useThreeScene } from '../composables/useThreeScene'
import { useTextParticles } from '../composables/useTextParticles'
import { useSensors } from '../composables/useSensors'
import { useSeasonEffects, type Season } from '../composables/useSeasonEffects'
import { useTransition } from '../composables/useTransition'
import { poems } from '../data/poems'

const props = defineProps<{
  season: Season
}>()

const containerRef = ref<HTMLElement | null>(null)

// 场景
const { scene, camera, onUpdate } = useThreeScene(containerRef)

// Raycaster用于精确碰撞检测
const raycaster = new THREE.Raycaster()
const pointerVec = new THREE.Vector2()

// 文字粒子
const {
  particles,
  isReady,
  createParticles,
  clearParticles,
  applyHomeForce,
  applyRepulsion,
  applyDamping,
  updatePositions,
  applyGravity,
  getCardMesh,
} = useTextParticles(scene)

// 传感器（传入容器引用以获取正确的Canvas坐标）
const { tilt, pointer, shakeIntensity, isShaking } = useSensors(containerRef)

// 季节效果
const {
  seasonParams,
  setSeason,
  applySpringGrowth,
  initSpring,
  applySummerHeat,
  initSummer,
  applyAutumnWind,
  initAutumn,
  applyWinterFreeze,
  initWinter,
} = useSeasonEffects()

// 过渡动画
const {
  isTransitioning,
  dissolveParticles,
  dissolveCard,
  assembleParticles,
  assembleCard,
} = useTransition()

// 是否首次加载
let isFirstLoad = true

// 初始化季节效果
const initSeasonEffect = (season: Season) => {
  if (particles.value.length === 0) return
  
  if (season === 'spring') {
    initSpring(particles.value)
  } else if (season === 'summer') {
    initSummer(particles.value)
  } else if (season === 'autumn') {
    initAutumn(particles.value)
  } else if (season === 'winter') {
    initWinter(particles.value)
  }
}

// 加载诗歌并初始化季节效果（带过渡动画）
const loadPoem = async (season: Season) => {
  const poem = poems.find(p => p.season === season)
  if (!poem) return

  // 首次加载：无过渡，直接创建
  if (isFirstLoad) {
    isFirstLoad = false
    await createParticles(poem.content, season)
    
    // 聚合动画
    assembleParticles(particles.value, 800, () => {
      initSeasonEffect(season)
    })
    assembleCard(getCardMesh(), 800)
    return
  }

  // 非首次：先崩解旧内容，再创建新内容
  const oldParticles = [...particles.value]
  const oldCard = getCardMesh()

  // 崩解动画
  dissolveParticles(oldParticles, 600)
  dissolveCard(oldCard, 600, async () => {
    // 崩解完成后，清理并创建新内容
    clearParticles()
    await createParticles(poem.content, season)
    
    // 聚合动画
    assembleParticles(particles.value, 800, () => {
      initSeasonEffect(season)
    })
    assembleCard(getCardMesh(), 800)
  })
}

// 监听季节变化
watch(() => props.season, async (newSeason) => {
  setSeason(newSeason)
  await loadPoem(newSeason)
}, { immediate: true })

// 渲染循环
onUpdate((delta) => {
  if (!isReady.value || particles.value.length === 0) return
  
  // 过渡动画期间跳过物理和季节效果
  if (isTransitioning.value) return

  const params = seasonParams.value

  // 基础物理
  applyHomeForce(params.homeForce)
  applyDamping(params.damping)

  // 重力
  if (params.gravity.x !== 0 || params.gravity.y !== 0) {
    applyGravity(params.gravity.x, params.gravity.y)
  }

  // 斥力（仅夏天和秋天）
  if (params.repulsionRadius > 0 && pointer.value.active) {
    applyRepulsion(
      pointer.value.x,
      pointer.value.y,
      params.repulsionRadius,
      params.repulsionStrength
    )
  }

  // 季节特效
  switch (props.season) {
    case 'spring':
      // 自然生长，不需要交互
      applySpringGrowth(particles.value, delta)
      break
      
    case 'summer':
      // 用Raycaster检测是否点击到卡片
      let hitCard = false
      if (pointer.value.active) {
        pointerVec.set(pointer.value.x, pointer.value.y)  // 已经是-1~1
        raycaster.setFromCamera(pointerVec, camera)
        const intersects = raycaster.intersectObjects(scene.children, false)
        hitCard = intersects.length > 0
      }
      applySummerHeat(particles.value, hitCard, scene, getCardMesh())
      break
      
    case 'autumn':
      // 把NDC坐标转换到世界坐标，用距离检测
      let hitParticles: typeof particles.value = []
      if (pointer.value.active) {
        // NDC -> 世界坐标
        const worldPos = new THREE.Vector3(pointer.value.x, pointer.value.y, 0)
        worldPos.unproject(camera)
        
        // 检测距离小于阈值的粒子
        const hitRadius = 0.3
        hitParticles = particles.value.filter(p => {
          const dx = p.position.x - worldPos.x
          const dy = p.position.y - worldPos.y
          return dx * dx + dy * dy < hitRadius * hitRadius
        })
      }
      applyAutumnWind(
        particles.value,
        hitParticles,
        tilt.value.x,
        tilt.value.y
      )
      break
      
    case 'winter':
      // 冰封状态，摇晃解冻
      applyWinterFreeze(
        particles.value,
        shakeIntensity.value,
        isShaking.value
      )
      break
  }

  // 更新位置
  updatePositions()
})
</script>

<style scoped>
.poem-scene {
  width: 100%;
  height: 100%;
  background: var(--color-brand-dark, #2d4a4a);
  border-radius: inherit;
}
</style>
