<script setup>
import { computed } from 'vue'

const props = defineProps({
  forecastData: { type: Array, required: true },
})

const xLabels = ['Now', '+24h', '+48h', '+72h']

const yLabels = computed(() =>
  props.forecastData.map((u) => u.unitName).reverse()
)

const cells = computed(() => {
  const data = []
  const reversed = [...props.forecastData].reverse()
  reversed.forEach((unit, yIdx) => {
    const values = [
      unit.currentOccupancy,
      unit.predictedOccupancy24h,
      unit.predictedOccupancy48h,
      unit.predictedOccupancy72h,
    ]
    values.forEach((value, xIdx) => {
      data.push([xIdx, yIdx, Math.round(value)])
    })
  })
  return data
})

const option = computed(() => ({
  tooltip: {
    position: 'top',
    formatter: (params) => {
      const [x, y, val] = params.value
      return `${yLabels.value[y]} • ${xLabels[x]}<br/><strong>${val}% occupancy</strong>`
    },
  },
  grid: { left: 100, right: 30, top: 30, bottom: 40 },
  xAxis: {
    type: 'category',
    data: xLabels,
    splitArea: { show: true },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'category',
    data: yLabels.value,
    splitArea: { show: true },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  visualMap: {
    min: 50,
    max: 100,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: 0,
    inRange: {
      color: ['#A5D6A7', '#FFE082', '#EF9A9A'],
    },
    text: ['100%', '50%'],
  },
  series: [
    {
      name: 'Occupancy',
      type: 'heatmap',
      data: cells.value,
      label: { show: true, formatter: '{@[2]}%', fontSize: 11, fontWeight: 600 },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' },
      },
    },
  ],
}))
</script>

<template>
  <v-chart class="heatmap" :option="option" autoresize />
</template>

<style scoped>
.heatmap {
  height: 360px;
  width: 100%;
}
</style>
