<script setup>
import { computed } from 'vue'

const props = defineProps({
  unitName: { type: String, required: true },
  occupancyPercent: { type: Number, required: true },
  occupiedBeds: { type: Number, required: true },
  totalBeds: { type: Number, required: true },
  status: { type: String, default: 'green' },
  pendingDischarges: { type: Number, default: 0 },
  pendingAdmissions: { type: Number, default: 0 },
})

const option = computed(() => ({
  series: [
    {
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      progress: { show: true, width: 10 },
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.8, '#2E7D32'],
            [0.9, '#F57F17'],
            [1, '#C62828'],
          ],
        },
      },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '5%'],
        fontSize: 22,
        fontWeight: 600,
        formatter: '{value}%',
        color: 'auto',
      },
      data: [{ value: Math.round(props.occupancyPercent) }],
    },
  ],
}))
</script>

<template>
  <v-card variant="flat" class="pa-2 text-center" border>
    <div class="text-subtitle-2 font-weight-medium pt-2">{{ unitName }}</div>
    <v-chart class="gauge" :option="option" autoresize />
    <div class="text-caption text-grey-darken-1">
      {{ occupiedBeds }} / {{ totalBeds }} beds
    </div>
    <div class="d-flex justify-center mt-1 mb-2">
      <v-chip v-if="pendingDischarges > 0" size="x-small" color="success" variant="tonal" class="mx-1">
        <v-icon start size="14" icon="mdi-logout" />{{ pendingDischarges }} disch
      </v-chip>
      <v-chip v-if="pendingAdmissions > 0" size="x-small" color="info" variant="tonal" class="mx-1">
        <v-icon start size="14" icon="mdi-login" />{{ pendingAdmissions }} adm
      </v-chip>
    </div>
  </v-card>
</template>

<style scoped>
.gauge {
  height: 130px;
  width: 100%;
}
</style>
