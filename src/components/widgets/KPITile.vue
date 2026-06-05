<script setup>
import { computed } from 'vue'
import { getRAGColor, getRAGHex } from '@/utils/formatters'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: 'mdi-information-outline' },
  status: {
    type: String,
    default: 'neutral',
    validator: (v) => ['green', 'amber', 'red', 'neutral'].includes(v),
  },
  trend: {
    type: String,
    default: '',
    validator: (v) => ['', 'up', 'down', 'stable'].includes(v),
  },
  trendLabel: { type: String, default: '' },
})

const accent = computed(() =>
  props.status === 'neutral' ? '#1565C0' : getRAGHex(props.status)
)

const iconColor = computed(() =>
  props.status === 'neutral' ? 'primary' : getRAGColor(props.status)
)

const trendIcon = computed(() => {
  if (props.trend === 'up') return 'mdi-trending-up'
  if (props.trend === 'down') return 'mdi-trending-down'
  if (props.trend === 'stable') return 'mdi-trending-neutral'
  return ''
})

const trendColor = computed(() => {
  if (props.trend === 'up') return 'success'
  if (props.trend === 'down') return 'error'
  return 'grey-darken-1'
})
</script>

<template>
  <v-card
    class="kpi-tile pa-4 h-100"
    :style="{ borderLeft: `4px solid ${accent}` }"
    elevation="1"
  >
    <div class="d-flex justify-space-between align-start">
      <div>
        <div class="kpi-title text-uppercase">{{ title }}</div>
        <div class="kpi-value mt-1">{{ value }}</div>
        <div v-if="subtitle" class="kpi-subtitle mt-1">{{ subtitle }}</div>
      </div>
      <v-avatar :color="iconColor" size="44" variant="tonal">
        <v-icon :icon="icon" size="24" />
      </v-avatar>
    </div>
    <div v-if="trend" class="d-flex align-center mt-3">
      <v-icon :icon="trendIcon" :color="trendColor" size="18" class="mr-1" />
      <span class="text-caption text-grey-darken-1">{{ trendLabel || trend }}</span>
    </div>
  </v-card>
</template>
