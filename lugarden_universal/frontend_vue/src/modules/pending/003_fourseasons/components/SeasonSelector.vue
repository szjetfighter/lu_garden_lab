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
  { key: 'spring' as Season, name: '脱囊', color: '#4ade80' },
  { key: 'summer' as Season, name: '动身', color: '#f97316' },
  { key: 'autumn' as Season, name: '解离', color: '#eab308' },
  { key: 'winter' as Season, name: '坐定', color: '#60a5fa' },
]
</script>

<style scoped>
.season-selector {
  display: flex;
  gap: 0.75rem;
}

.season-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 36px;
  padding: 0.5rem 1rem;
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: 600;
  background: var(--bg-secondary, #ffffff);
  border: 1px solid var(--color-primary-200, #d1d5db);
  border-radius: var(--radius-lg, 12px);
  cursor: pointer;
  transition: all 0.2s ease-out;
  box-shadow: var(--shadow-sm);
}

.season-btn:hover {
  border-color: var(--color-brand-primary, #bca09e);
  transform: translateY(-2px);
  box-shadow: var(--shadow-base);
}

.season-btn.active {
  background: linear-gradient(145deg, var(--color-primary-600, #1f2937), var(--color-primary-700, #111827));
  border-color: var(--color-primary-700, #111827);
  box-shadow: 0 4px 12px rgba(31, 41, 55, 0.3);
}

.season-name {
  color: var(--text-primary, #1f2937);
}

.season-btn.active .season-name {
  color: var(--text-light, #f0e8d9);
}
</style>
