<script setup>
import { computed } from 'vue'

const props = defineProps({
  forecastData: { type: Array, required: true },
  title: { type: String, default: '' },
  showConfidence: { type: Boolean, default: true },
  capacityThreshold: { type: Number, default: 200 },
})

const labels = computed(() =>
  props.forecastData.map((p) => `${String(p.hour).padStart(2, '0')}:00`)
)

const series = computed(() => {
  const census = props.forecastData.map((p) => p.predictedCensus)
  if (!props.showConfidence) {
    return [
      {
        name: 'Predicted Census',
        type: 'line',
        smooth: true,
        data: census,
        lineStyle: { width: 3, color: '#42A5F5' },
        itemStyle: { color: '#42A5F5' },
        symbolSize: 4,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(66, 165, 245, 0.45)' },
              { offset: 1, color: 'rgba(66, 165, 245, 0.05)' },
            ],
          },
        },
      },
    ]
  }
  const lower = census.map((v) => Math.round(v * 0.95))
  const band = census.map((v, i) => Math.round(v * 1.05) - lower[i])
  return [
    {
      name: 'Lower bound',
      type: 'line',
      data: lower,
      lineStyle: { opacity: 0 },
      stack: 'confidence',
      symbol: 'none',
      tooltip: { show: false },
    },
    {
      name: 'Confidence band',
      type: 'line',
      data: band,
      lineStyle: { opacity: 0 },
      areaStyle: { color: 'rgba(66, 165, 245, 0.22)' },
      stack: 'confidence',
      symbol: 'none',
      tooltip: { show: false },
    },
    {
      name: 'Predicted Census',
      type: 'line',
      smooth: true,
      data: census,
      lineStyle: { width: 3, color: '#42A5F5' },
      itemStyle: { color: '#42A5F5' },
      symbolSize: 4,
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: '#EF5350', type: 'dashed', width: 2 },
        label: { color: '#EF5350' },
        data: [{ yAxis: props.capacityThreshold, label: { formatter: 'Capacity threshold' } }],
      },
    },
  ]
})

const option = computed(() => ({
  textStyle: {
    color: '#E3E8F2',
    fontFamily: "'Google Sans', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  title: props.title
    ? { text: props.title, left: 'center', textStyle: { fontSize: 14, color: '#E3E8F2' } }
    : undefined,
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#1A2236',
    borderColor: '#243049',
    textStyle: { color: '#E3E8F2' },
  },
  legend: {
    bottom: 0,
    data: ['Predicted Census'],
    textStyle: { color: '#E3E8F2' },
  },
  grid: { left: 50, right: 30, top: 40, bottom: 50 },
  xAxis: {
    type: 'category',
    data: labels.value,
    boundaryGap: false,
    axisLabel: { fontSize: 10, interval: 1, color: '#E3E8F2' },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.18)' } },
  },
  yAxis: {
    type: 'value',
    name: 'Patients',
    nameTextStyle: { fontSize: 11, color: 'rgba(227,232,242,0.7)' },
    axisLabel: { color: '#E3E8F2' },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.18)' } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
  },
  series: series.value,
}))
</script>

<template>
  <v-chart class="forecast" :option="option" autoresize />
</template>

<style scoped>
.forecast {
  height: 320px;
  width: 100%;
}
</style>
