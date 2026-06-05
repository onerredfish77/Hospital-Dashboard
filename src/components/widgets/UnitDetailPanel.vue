<script setup>
import { computed } from 'vue'
import { addHours, format } from 'date-fns'
import VChart from 'vue-echarts'
import { useDashboardStore } from '@/stores/dashboardStore'
import { occupancyToColor } from '@/utils/colorInterpolator'

const props = defineProps({
  unitId: { type: String, default: null },
  selectedHour: { type: Number, required: true },
})

const store = useDashboardStore()

const censusEntry = computed(() =>
  props.unitId ? store.census.find((u) => u.unitId === props.unitId) : null
)

const staffingEntry = computed(() =>
  props.unitId ? store.staffing.find((s) => s.unitId === props.unitId) : null
)

const hourlySeries = computed(() => {
  if (!props.unitId) return null
  const entry = store.forecast?.hourlyByUnit?.find((u) => u.unitId === props.unitId)
  return entry ? entry.hours : null
})

const totalBeds = computed(() => censusEntry.value?.totalBeds ?? 0)

const occupancyAtHour = computed(() => {
  if (!censusEntry.value) return null
  if (props.selectedHour === 0) {
    return {
      occupiedBeds: censusEntry.value.occupiedBeds,
      percent: censusEntry.value.occupancyPercent,
      status: censusEntry.value.status,
    }
  }
  const hr = hourlySeries.value?.[props.selectedHour]
  if (!hr) return null
  return {
    occupiedBeds: hr.predictedOccupiedBeds,
    percent: hr.predictedOccupancyPercent,
    status: hr.predictedStatus,
  }
})

const statusColorMap = { green: 'success', amber: 'warning', red: 'error' }
const statusChipColor = computed(() =>
  occupancyAtHour.value ? statusColorMap[occupancyAtHour.value.status] : 'grey'
)

const timeLabel = computed(() => {
  if (props.selectedHour === 0) return 'Now'
  return format(addHours(new Date(), props.selectedHour), 'EEE MMM d • h:mm a')
})

const forecastWarning = computed(() => {
  if (!hourlySeries.value) return null
  const startHr = Math.max(0, props.selectedHour)
  const endHr = Math.min(72, startHr + 24)
  for (let h = startHr + 1; h <= endHr; h++) {
    const slot = hourlySeries.value[h]
    if (slot && slot.predictedStatus === 'red') {
      return {
        hoursAhead: h - startHr,
        when: format(addHours(new Date(), h), 'EEE h a'),
        percent: slot.predictedOccupancyPercent,
      }
    }
  }
  return null
})

const sparklineOption = computed(() => {
  if (!hourlySeries.value) return {}
  const data = hourlySeries.value.map((h) => h.predictedOccupancyPercent)
  return {
    textStyle: {
      color: '#E3E8F2',
      fontFamily: "'Google Sans', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    grid: { left: 38, right: 12, top: 18, bottom: 22 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1A2236',
      borderColor: '#243049',
      textStyle: { color: '#E3E8F2' },
      formatter: (params) => {
        const p = params[0]
        return `+${p.dataIndex}h<br/><strong>${p.value}%</strong>`
      },
    },
    xAxis: {
      type: 'category',
      data: hourlySeries.value.map((h) => h.hoursFromNow),
      axisLabel: { color: 'rgba(227,232,242,0.65)', fontSize: 10, interval: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.18)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { color: 'rgba(227,232,242,0.65)', fontSize: 10, formatter: '{value}%' },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: false,
        data,
        lineStyle: { color: '#42A5F5', width: 2 },
        areaStyle: { color: 'rgba(66, 165, 245, 0.18)' },
        markLine: {
          symbol: 'none',
          silent: true,
          data: [
            {
              yAxis: 90,
              lineStyle: { color: '#EF5350', type: 'dashed', width: 1 },
              label: { show: true, formatter: '90%', color: '#EF5350', fontSize: 10 },
            },
            {
              xAxis: props.selectedHour,
              lineStyle: { color: '#FFB74D', type: 'solid', width: 1 },
              label: {
                show: true,
                formatter: timeLabel.value,
                color: '#FFB74D',
                fontSize: 10,
                position: 'insideEndTop',
              },
            },
          ],
        },
      },
    ],
  }
})

const indicatorBgColor = computed(() =>
  occupancyAtHour.value ? occupancyToColor(occupancyAtHour.value.percent) : '#37474F'
)
</script>

<template>
  <v-card variant="flat" class="detail-card pa-4 fill-height">
    <template v-if="!unitId">
      <div class="empty-state d-flex flex-column align-center justify-center text-center pa-6">
        <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-map-marker</v-icon>
        <div class="text-body-2 text-grey-lighten-1">
          Select a unit on the map to view details
        </div>
      </div>
    </template>

    <template v-else-if="censusEntry">
      <div class="d-flex align-center mb-3">
        <div class="status-swatch mr-3" :style="{ backgroundColor: indicatorBgColor }" />
        <div class="flex-grow-1">
          <div class="text-subtitle-1 font-weight-bold">{{ censusEntry.unitName }}</div>
          <div class="text-caption text-grey-lighten-1">{{ censusEntry.type }}</div>
        </div>
        <v-chip
          :color="statusChipColor"
          size="small"
          variant="elevated"
          class="font-weight-bold"
        >
          {{ occupancyAtHour?.status.toUpperCase() }}
        </v-chip>
      </div>

      <div class="d-flex align-baseline mb-1">
        <span class="text-h4 font-weight-bold">
          {{ occupancyAtHour?.occupiedBeds }} / {{ totalBeds }}
        </span>
        <span class="text-h6 ml-2 text-grey-lighten-2">
          {{ occupancyAtHour?.percent }}%
        </span>
      </div>
      <div class="text-caption text-grey-lighten-1 mb-3">
        {{ timeLabel }}
      </div>

      <div class="d-flex flex-wrap ga-2 mb-3">
        <v-chip size="small" variant="tonal" prepend-icon="mdi-account-supervisor">
          Ratio {{ staffingEntry?.nurseToPatientRatio?.current ?? '—' }}
        </v-chip>
        <v-chip size="small" variant="tonal" prepend-icon="mdi-logout">
          {{ censusEntry.pendingDischarges }} pending DC
        </v-chip>
        <v-chip size="small" variant="tonal" prepend-icon="mdi-login">
          {{ censusEntry.pendingAdmissions }} pending adm
        </v-chip>
      </div>

      <v-alert
        v-if="forecastWarning"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-3"
      >
        Projected to hit {{ forecastWarning.percent }}% by {{ forecastWarning.when }}
        ({{ forecastWarning.hoursAhead }}h ahead)
      </v-alert>

      <div class="text-caption text-grey-lighten-1 mb-1">72-hour forecast</div>
      <div class="sparkline-wrap">
        <v-chart :option="sparklineOption" autoresize />
      </div>

      <div class="mt-3 d-flex justify-end">
        <v-chip
          size="x-small"
          :color="selectedHour === 0 ? 'success' : 'info'"
          variant="elevated"
          class="font-weight-bold"
        >
          {{ selectedHour === 0 ? 'LIVE DATA' : 'FORECAST DATA' }}
        </v-chip>
      </div>
    </template>
  </v-card>
</template>

<style scoped>
.detail-card {
  background-color: #1A2236;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}
.empty-state {
  min-height: 320px;
}
.status-swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.12);
}
.sparkline-wrap {
  height: 160px;
  width: 100%;
}
</style>
