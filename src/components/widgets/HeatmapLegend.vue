<script setup>
import { HEATMAP_GRADIENT } from '@/utils/colorInterpolator'

const zoneLabels = [
  { x: '10%', label: 'Available' },
  { x: '40%', label: 'Filling' },
  { x: '75%', label: 'Near Capacity' },
  { x: '95%', label: 'Critical' },
]

const tickLabels = [0, 40, 80, 90, 100]
</script>

<template>
  <v-card variant="outlined" class="pa-3 legend-card">
    <div class="text-caption text-grey-lighten-1 mb-1">Occupancy heatmap scale</div>
    <div class="zone-labels">
      <span
        v-for="z in zoneLabels"
        :key="z.label"
        :style="{ left: z.x }"
        class="zone-label"
      >{{ z.label }}</span>
    </div>
    <svg width="100%" height="18" viewBox="0 0 100 18" preserveAspectRatio="none" class="gradient-bar">
      <defs>
        <linearGradient id="heatmapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            v-for="stop in HEATMAP_GRADIENT"
            :key="stop.percent"
            :offset="`${stop.percent}%`"
            :stop-color="stop.hex"
          />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="18" rx="2" fill="url(#heatmapGradient)" />
    </svg>
    <div class="tick-labels">
      <span v-for="t in tickLabels" :key="t" :style="{ left: `${t}%` }" class="tick-label">{{ t }}%</span>
    </div>
  </v-card>
</template>

<style scoped>
.legend-card {
  background-color: #1A2236;
}
.gradient-bar {
  display: block;
  border-radius: 4px;
}
.zone-labels,
.tick-labels {
  position: relative;
  height: 16px;
}
.zone-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgba(227, 232, 242, 0.85);
  white-space: nowrap;
}
.tick-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgba(227, 232, 242, 0.65);
  margin-top: 2px;
}
</style>
