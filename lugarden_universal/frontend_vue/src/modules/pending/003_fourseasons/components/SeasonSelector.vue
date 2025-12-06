<template>
  <div class="season-selector">
    <button
      v-for="s in seasons"
      :key="s.key"
      class="season-btn"
      :class="{ active: modelValue === s.key }"
      :style="{ '--season-color': s.color }"
      @click="emit('update:modelValue', s.key)"
    >
      <span class="season-name">{{ s.name }}</span>
      <span class="season-effect">{{ s.effect }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Season } from '../composables/useSeasonEffects'

defineProps<{
  modelValue: Season
}>()

const emit = defineEmits<{
  'update:modelValue': [season: Season]
}>()

const seasons = [
  { key: 'spring' as Season, name: '春', effect: '生长', color: '#4ade80' },
  { key: 'summer' as Season, name: '夏', effect: '蒸发', color: '#f97316' },
  { key: 'autumn' as Season, name: '秋', effect: '飘落', color: '#eab308' },
  { key: 'winter' as Season, name: '冬', effect: '冰封', color: '#60a5fa' },
]
</script>

<style scoped>
.season-selector {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
}

.season-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 4rem;
}

.season-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--season-color);
}

.season-btn.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--season-color);
}

.season-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--season-color);
  margin-bottom: 0.25rem;
}

.season-effect {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.5);
}

.season-btn.active .season-effect {
  color: var(--season-color);
}
</style>
