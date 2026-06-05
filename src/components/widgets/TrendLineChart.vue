<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

const props = defineProps({
  labels: { type: Array, required: true },
  datasets: { type: Array, required: true },
  title: { type: String, default: '' },
  height: { type: Number, default: 240 },
  showLegend: { type: Boolean, default: true },
  yMin: { type: Number, default: undefined },
  yMax: { type: Number, default: undefined },
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets,
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: props.showLegend, position: 'bottom' },
    title: { display: !!props.title, text: props.title },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: { font: { size: 11 } },
      min: props.yMin,
      max: props.yMax,
    },
  },
  elements: {
    line: { tension: 0.3, borderWidth: 2 },
    point: { radius: 2, hoverRadius: 4 },
  },
}))
</script>

<template>
  <div :style="{ height: height + 'px', position: 'relative' }">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
