<script setup>
import { computed } from 'vue'
import { getRAGHex } from '@/utils/formatters'
import { THRESHOLDS } from '@/utils/thresholds'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (v) => ['green', 'amber', 'red', 'neutral'].includes(v),
  },
  label: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  thresholdKey: { type: String, default: '' },
})

const dotSize = computed(() => {
  if (props.size === 'sm') return '8px'
  if (props.size === 'lg') return '16px'
  return '12px'
})

const color = computed(() => getRAGHex(props.status))

const tooltip = computed(() => {
  if (!props.thresholdKey) {
    if (props.status === 'green') return 'On target'
    if (props.status === 'amber') return 'Needs attention'
    if (props.status === 'red') return 'Critical'
    return ''
  }
  const t = THRESHOLDS[props.thresholdKey]
  if (!t) return ''
  return `Green: ≤ ${t.green} • Amber: ≤ ${t.amber} • Red: > ${t.amber}`
})
</script>

<template>
  <v-tooltip :text="tooltip" location="top">
    <template #activator="{ props: tipProps }">
      <span class="rag-indicator d-inline-flex align-center" v-bind="tipProps">
        <span
          class="rag-dot"
          :class="{ 'rag-dot--pulse': status === 'red' }"
          :style="{ width: dotSize, height: dotSize, backgroundColor: color }"
        />
        <span v-if="label" class="ml-2 text-body-2">{{ label }}</span>
      </span>
    </template>
  </v-tooltip>
</template>

<style scoped>
.rag-dot {
  border-radius: 50%;
  display: inline-block;
}
.rag-dot--pulse {
  animation: rag-pulse 1.4s infinite;
}
@keyframes rag-pulse {
  0% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.65); }
  70% { box-shadow: 0 0 0 8px rgba(198, 40, 40, 0); }
  100% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0); }
}
</style>
