/**
 * 四季效果调度器
 * 统一管理四季的参数和效果函数
 */
import { ref, computed } from 'vue'

// 导入各季节效果
import {
  springParams,
  initSpring,
  applySpringGrowth,
} from './effects/spring'

import {
  summerParams,
  initSummer,
  applySummerHeat,
} from './effects/summer'

import {
  autumnParams,
  applyAutumnWind,
  resetAutumn,
  initAutumn,
} from './effects/autumn'

import {
  winterParams,
  winterThawProgress,
  initWinter,
  applyWinterFreeze,
} from './effects/winter'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export function useSeasonEffects() {
  const currentSeason = ref<Season>('summer')
  
  // 季节参数映射
  const paramsMap = {
    spring: springParams,
    summer: summerParams,
    autumn: autumnParams,
    winter: winterParams,
  }
  
  // 当前季节参数（响应式）
  const seasonParams = computed(() => paramsMap[currentSeason.value])

  // 切换季节
  const setSeason = (season: Season) => {
    currentSeason.value = season
    // 重置秋天消失的粒子
    resetAutumn()
    // 重置冬天解冻进度
    if (season === 'winter') {
      winterThawProgress.value = 0
    }
  }

  return {
    // 状态
    currentSeason,
    seasonParams,
    winterThawProgress,
    
    // 调度
    setSeason,
    
    // 春天
    applySpringGrowth,
    initSpring,
    
    // 夏天
    applySummerHeat,
    initSummer,
    
    // 秋天
    applyAutumnWind,
    initAutumn,
    
    // 冬天
    applyWinterFreeze,
    initWinter,
  }
}
