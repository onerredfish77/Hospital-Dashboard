<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { addHours, format } from 'date-fns'
import { useDashboardStore } from '@/stores/dashboardStore'
import { occupancyToColor } from '@/utils/colorInterpolator'
import mapLayoutData from '@/data/map_layout.json'
import HeatmapLegend from '@/components/widgets/HeatmapLegend.vue'
import UnitDetailPanel from '@/components/widgets/UnitDetailPanel.vue'

const store = useDashboardStore()

const selectedUnitId = ref(null)
const hoveredUnitId = ref(null)
const selectedHour = ref(0)
const isPlaying = ref(false)
let playInterval = null

const mapUnits = mapLayoutData.units
const corridors = mapLayoutData.corridors
const structuralElements = mapLayoutData.structuralElements
const mapMeta = mapLayoutData.mapMeta
const mapWidth = mapLayoutData.mapWidth
const mapHeight = mapLayoutData.mapHeight

function censusFor(unitId) {
  return store.census.find((u) => u.unitId === unitId)
}

function hourlyFor(unitId, hour) {
  const entry = store.forecast?.hourlyByUnit?.find((u) => u.unitId === unitId)
  return entry?.hours?.[hour]
}

function getOccupancyAtHour(unitId, hour) {
  if (hour === 0) {
    const c = censusFor(unitId)
    return c ? c.occupancyPercent : 0
  }
  const slot = hourlyFor(unitId, hour)
  return slot ? slot.predictedOccupancyPercent : 0
}

function getUnitFill(unitId) {
  return occupancyToColor(getOccupancyAtHour(unitId, selectedHour.value))
}

function getUnitStatus(unitId) {
  if (selectedHour.value === 0) {
    return censusFor(unitId)?.status ?? 'green'
  }
  return hourlyFor(unitId, selectedHour.value)?.predictedStatus ?? 'green'
}

const currentTimeLabel = computed(() => {
  if (selectedHour.value === 0) {
    return `Now — ${format(new Date(), 'EEE MMM d • h:mm a')}`
  }
  const projected = format(addHours(new Date(), selectedHour.value), 'EEE MMM d • h:mm a')
  return `${projected} (+${selectedHour.value}h)`
})

const liveOrForecast = computed(() => (selectedHour.value === 0 ? 'LIVE' : 'FORECAST'))

const alertUnits = computed(() => store.census.filter((u) => u.status === 'red'))

const statusCounts = computed(() => {
  const counts = { green: 0, amber: 0, red: 0 }
  for (const u of mapUnits) {
    counts[getUnitStatus(u.id)] = (counts[getUnitStatus(u.id)] || 0) + 1
  }
  return counts
})

const sliderTicks = computed(() => ({
  0: 'Now',
  12: '+12h',
  24: '+24h',
  36: '+36h',
  48: '+48h',
  60: '+60h',
  72: '+72h',
}))

function startPlay() {
  if (selectedHour.value >= 72) selectedHour.value = 0
  isPlaying.value = true
  playInterval = setInterval(() => {
    if (selectedHour.value >= 72) {
      stopPlay()
      return
    }
    selectedHour.value++
  }, 800)
}

function stopPlay() {
  isPlaying.value = false
  if (playInterval) {
    clearInterval(playInterval)
    playInterval = null
  }
}

function togglePlay() {
  if (isPlaying.value) stopPlay()
  else startPlay()
}

function resetSlider() {
  stopPlay()
  selectedHour.value = 0
}

function unitById(id) {
  return mapUnits.find((u) => u.id === id)
}

function alertCenter(unit) {
  return { cx: unit.x + unit.width - 14, cy: unit.y + 14 }
}

onUnmounted(() => {
  if (playInterval) clearInterval(playInterval)
})
</script>

<template>
  <div>
    <!-- Section A: Page header -->
    <div class="d-flex align-center mb-3">
      <div class="flex-grow-1">
        <div class="text-h5 font-weight-bold">Hospital Capacity Map</div>
        <div class="text-caption text-grey-lighten-1">
          {{ mapMeta.facilityName }} — {{ mapMeta.floorLabel }}
        </div>
      </div>
      <v-chip
        :color="selectedHour === 0 ? 'success' : 'info'"
        variant="elevated"
        class="font-weight-bold"
      >
        <v-icon start :icon="selectedHour === 0 ? 'mdi-broadcast' : 'mdi-crystal-ball'" />
        {{ liveOrForecast }}
      </v-chip>
    </div>

    <!-- Section B: Time slider -->
    <v-card variant="flat" class="pa-4 mb-3 slider-card">
      <div class="d-flex align-center ga-2 mb-2">
        <v-btn
          :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
          :color="isPlaying ? 'warning' : 'primary'"
          variant="elevated"
          size="small"
          @click="togglePlay"
        />
        <v-btn
          icon="mdi-skip-backward"
          variant="text"
          size="small"
          @click="resetSlider"
        />
        <div class="text-h6 ml-2 flex-grow-1">{{ currentTimeLabel }}</div>
        <div class="d-flex ga-1">
          <v-chip size="small" color="success" variant="tonal">{{ statusCounts.green }} Green</v-chip>
          <v-chip size="small" color="warning" variant="tonal">{{ statusCounts.amber }} Amber</v-chip>
          <v-chip size="small" color="error" variant="tonal">{{ statusCounts.red }} Red</v-chip>
        </div>
      </div>
      <v-slider
        v-model="selectedHour"
        :min="0"
        :max="72"
        :step="1"
        color="primary"
        track-color="rgba(255,255,255,0.12)"
        thumb-label
        hide-details
      >
        <template #thumb-label="{ modelValue }">
          {{ modelValue === 0 ? 'Now' : `+${modelValue}h` }}
        </template>
      </v-slider>
      <div class="d-flex justify-space-between tick-row">
        <span v-for="(label, hour) in sliderTicks" :key="hour" class="tick">{{ label }}</span>
      </div>
    </v-card>

    <!-- Section C: Map + Detail Panel -->
    <v-row dense>
      <v-col cols="12" md="8">
        <v-card variant="flat" class="pa-3 map-card">
          <svg
            :viewBox="`0 0 ${mapWidth} ${mapHeight}`"
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            class="hospital-svg"
          >
            <!-- 1. Background -->
            <rect :x="0" :y="0" :width="mapWidth" :height="mapHeight" fill="#ECEFF1" />

            <!-- 2. Corridors -->
            <rect
              v-for="(c, idx) in corridors"
              :key="`corr-${idx}`"
              :x="c.x"
              :y="c.y"
              :width="c.width"
              :height="c.height"
              fill="#B0BEC5"
            />

            <!-- 3. Structural elements -->
            <g v-for="(s, idx) in structuralElements" :key="`struct-${idx}`">
              <rect
                :x="s.x"
                :y="s.y"
                :width="s.width"
                :height="s.height"
                :fill="s.type === 'nurseStation' ? '#78909C' : '#CFD8DC'"
                :stroke="s.type === 'landmark' ? '#90A4AE' : 'none'"
                stroke-dasharray="3,3"
                rx="4"
              />
              <text
                :x="s.x + s.width / 2"
                :y="s.y + s.height / 2 + 4"
                text-anchor="middle"
                font-size="10"
                :fill="s.type === 'nurseStation' ? '#ECEFF1' : '#455A64'"
                font-weight="500"
              >{{ s.label }}</text>
            </g>

            <!-- 4. Unit zones -->
            <rect
              v-for="unit in mapUnits"
              :key="`zone-${unit.id}`"
              :x="unit.x"
              :y="unit.y"
              :width="unit.width"
              :height="unit.height"
              :fill="getUnitFill(unit.id)"
              :stroke="selectedUnitId === unit.id ? '#42A5F5' : hoveredUnitId === unit.id ? '#CFD8DC' : '#37474F'"
              :stroke-width="selectedUnitId === unit.id ? 3 : 1.5"
              rx="8"
              class="unit-zone"
              @mouseenter="hoveredUnitId = unit.id"
              @mouseleave="hoveredUnitId = null"
              @click="selectedUnitId = unit.id"
            />

            <!-- 5. Unit name labels -->
            <text
              v-for="unit in mapUnits"
              :key="`label-${unit.id}`"
              :x="unit.labelX"
              :y="unit.labelY"
              font-size="13"
              font-weight="600"
              fill="white"
              text-anchor="middle"
              pointer-events="none"
            >{{ unit.label }}</text>

            <!-- 6. Unit sublabels -->
            <text
              v-for="unit in mapUnits"
              :key="`sublabel-${unit.id}`"
              :x="unit.sublabelX"
              :y="unit.sublabelY"
              font-size="10"
              fill="rgba(255,255,255,0.85)"
              text-anchor="middle"
              pointer-events="none"
            >{{ unit.sublabel }}</text>

            <!-- 7. Occupancy percent labels -->
            <text
              v-for="unit in mapUnits"
              :key="`pct-${unit.id}`"
              :x="unit.x + unit.width / 2"
              :y="unit.y + unit.height - 14"
              font-size="14"
              fill="white"
              font-weight="700"
              text-anchor="middle"
              pointer-events="none"
            >{{ getOccupancyAtHour(unit.id, selectedHour) }}%</text>

            <!-- 8. Alert pulse indicators (live only) -->
            <g
              v-for="alertUnit in alertUnits"
              :key="`alert-${alertUnit.unitId}`"
            >
              <template v-if="unitById(alertUnit.unitId)">
                <circle
                  :cx="alertCenter(unitById(alertUnit.unitId)).cx"
                  :cy="alertCenter(unitById(alertUnit.unitId)).cy"
                  r="7"
                  fill="none"
                  stroke="#C62828"
                  stroke-width="2"
                  class="alert-pulse"
                />
                <circle
                  :cx="alertCenter(unitById(alertUnit.unitId)).cx"
                  :cy="alertCenter(unitById(alertUnit.unitId)).cy"
                  r="7"
                  fill="#C62828"
                />
              </template>
            </g>

            <!-- 9. Map footer -->
            <text
              :x="mapWidth / 2"
              :y="mapHeight - 6"
              font-size="11"
              fill="#546E7A"
              text-anchor="middle"
            >{{ mapMeta.facilityName }} • {{ mapMeta.floorLabel }} • {{ mapMeta.totalBeds }} beds</text>
          </svg>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <UnitDetailPanel :unit-id="selectedUnitId" :selected-hour="selectedHour" />
      </v-col>
    </v-row>

    <!-- Section D: Legend -->
    <v-row dense class="mt-1">
      <v-col cols="12" md="8">
        <HeatmapLegend />
      </v-col>
      <v-col cols="12" md="4" class="d-flex align-center justify-end">
        <span class="text-caption text-grey-lighten-1">
          {{ selectedHour === 0 ? 'Showing live occupancy' : `Showing forecast at +${selectedHour}h` }}
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.slider-card,
.map-card {
  background-color: #1A2236;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}
.hospital-svg {
  display: block;
  border-radius: 8px;
  background: #ECEFF1;
}
.unit-zone {
  transition: fill 0.6s ease, stroke 0.2s ease, opacity 0.2s ease;
  cursor: pointer;
}
.unit-zone:hover {
  opacity: 0.88;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25));
}
@keyframes alert-pulse {
  0% { r: 7; opacity: 1; }
  100% { r: 18; opacity: 0; }
}
.alert-pulse {
  animation: alert-pulse 1.5s ease-out infinite;
  transform-origin: center;
}
.tick-row {
  margin-top: -4px;
  padding: 0 8px;
}
.tick {
  font-size: 10px;
  color: rgba(227, 232, 242, 0.55);
}
</style>
