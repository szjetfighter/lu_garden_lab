<template>
  <div class="china-map-echarts w-full h-full" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  activeId: string | null
  hoveredId: string | null
}>()

const emit = defineEmits<{
  hover: [id: string | null]
  select: [id: string]
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

// 6个故事集的经纬度坐标
const locations = [
  { id: 'shui_collection_bohai', name: '渤海', value: [120.00, 38.50] },
  { id: 'shui_collection_taiyuan', name: '太原', value: [112.55, 37.87] },
  { id: 'shui_collection_jiangdong', name: '江东', value: [118.80, 31.60] },
  { id: 'shui_collection_shanghai', name: '上海', value: [121.47, 31.23] },
  { id: 'shui_collection_nanling', name: '南岭', value: [112.90, 25.10] },
  { id: 'shui_collection_nanxi', name: '南溪', value: [113.05, 25.78] }
]

// 生成散点数据
function getScatterData() {
  return locations.map(loc => ({
    name: loc.name,
    value: loc.value,
    id: loc.id,
    itemStyle: {
      color: props.activeId === loc.id ? '#3b82f6' : '#93c5fd',
      shadowBlur: props.activeId === loc.id ? 20 : 10,
      shadowColor: props.activeId === loc.id ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.3)'
    },
    symbolSize: props.activeId === loc.id ? 24 : 16
  }))
}

// 生成航线数据
function getLineData() {
  const coords = locations.map(l => l.value)
  return [{
    coords: coords
  }]
}

async function initChart() {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  
  // 加载中国地图GeoJSON
  try {
    const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    const geoJson = await response.json()
    echarts.registerMap('china', geoJson)
    
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.2,
        center: [116, 32],
        label: { show: false },
        itemStyle: {
          areaColor: '#e8f4f8',
          borderColor: '#b8d4e3',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            areaColor: '#d0e8f0'
          },
          label: { show: false }
        }
      },
      series: [
        {
          name: '航线',
          type: 'lines',
          coordinateSystem: 'geo',
          data: getLineData(),
          lineStyle: {
            color: '#93c5fd',
            width: 1.5,
            opacity: 0.6,
            type: 'dashed'
          },
          effect: {
            show: true,
            period: 8,
            trailLength: 0.2,
            symbol: 'circle',
            symbolSize: 4,
            color: '#60a5fa'
          },
          zlevel: 1
        },
        {
          name: '故事集',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: getScatterData(),
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 3,
            period: 4
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            fontSize: 13,
            color: '#475569',
            fontFamily: 'serif'
          },
          zlevel: 2
        }
      ]
    }
    
    chart.setOption(option)
    
    // 绑定事件
    chart.on('click', (params: any) => {
      if (params.componentType === 'series' && params.data?.id) {
        emit('select', params.data.id)
      }
    })
    
    chart.on('mouseover', (params: any) => {
      if (params.componentType === 'series' && params.data?.id) {
        emit('hover', params.data.id)
      }
    })
    
    chart.on('mouseout', () => {
      emit('hover', null)
    })
    
  } catch (error) {
    console.error('[ChinaMap] 加载地图失败:', error)
  }
}

// 更新高亮状态
function updateHighlight() {
  if (!chart) return
  chart.setOption({
    series: [{}, { data: getScatterData() }]
  })
}

watch(() => props.activeId, updateHighlight)
watch(() => props.hoveredId, updateHighlight)

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', () => chart?.resize())
})
</script>

<style scoped>
.china-map-echarts {
  min-height: 300px;
}
</style>
