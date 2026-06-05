<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { getRAGColor } from '@/utils/formatters'
import KPITile from '@/components/widgets/KPITile.vue'
import ForecastChart from '@/components/widgets/ForecastChart.vue'
import OccupancyHeatmap from '@/components/widgets/OccupancyHeatmap.vue'

const store = useDashboardStore()

const peakNext24 = computed(() => {
  const max = store.forecast.next24Hours.reduce(
    (acc, h) => (h.predictedCensus > acc ? h.predictedCensus : acc),
    0
  )
  return max
})

const peakStatus = computed(() => {
  const pct = (peakNext24.value / store.totalBeds) * 100
  if (pct >= 90) return 'red'
  if (pct >= 80) return 'amber'
  return 'green'
})

const weekendRisk = computed(() => {
  const sat = store.forecast.next72Hours[1]
  return sat
})

const weekendStatus = computed(() => {
  if (weekendRisk.value.surgeRisk === 'high') return 'red'
  if (weekendRisk.value.surgeRisk === 'medium') return 'amber'
  return 'green'
})

const scheduledNext24 = computed(() =>
  store.forecast.scheduledAdmissions
    .filter((s) => s.date === store.forecast.next72Hours[0].date)
    .reduce((sum, s) => sum + s.count, 0)
)

const trendIcon = (trend) => {
  if (trend === 'increasing') return 'mdi-arrow-top-right'
  if (trend === 'decreasing') return 'mdi-arrow-bottom-right'
  return 'mdi-arrow-right'
}

const trendColor = (trend) => {
  if (trend === 'increasing') return 'error'
  if (trend === 'decreasing') return 'success'
  return 'grey'
}

const unitForecastHeaders = [
  { title: 'Unit', key: 'unitName' },
  { title: 'Now', key: 'currentOccupancy', align: 'end' },
  { title: '+24h', key: 'predictedOccupancy24h', align: 'end' },
  { title: '+48h', key: 'predictedOccupancy48h', align: 'end' },
  { title: '+72h', key: 'predictedOccupancy72h', align: 'end' },
  { title: 'Trend', key: 'trend', align: 'center' },
]

const scheduledHeaders = [
  { title: 'Date', key: 'date' },
  { title: 'Type', key: 'type' },
  { title: 'Count', key: 'count', align: 'end' },
]

function riskColor(risk) {
  if (risk === 'high') return 'error'
  if (risk === 'medium') return 'warning'
  return 'success'
}
</script>

<template>
  <div>
    <v-row dense>
      <v-col cols="12" sm="4">
        <KPITile
          title="Predicted Peak (24h)"
          :value="peakNext24"
          subtitle="Patients at peak"
          icon="mdi-chart-line"
          :status="peakStatus"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <KPITile
          title="Weekend Surge Risk"
          :value="weekendRisk.surgeRisk.toUpperCase()"
          :subtitle="`Saturday peak: ${weekendRisk.predictedPeakCensus} @ ${weekendRisk.predictedPeakTime}`"
          icon="mdi-alert-circle-outline"
          :status="weekendStatus"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <KPITile
          title="Scheduled Admissions"
          :value="scheduledNext24"
          subtitle="Booked next 24h"
          icon="mdi-calendar-clock"
          status="neutral"
        />
      </v-col>
    </v-row>

    <v-row dense class="mt-4">
      <v-col cols="12">
        <v-card class="pa-4">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            24-Hour Census Forecast
          </div>
          <ForecastChart
            :forecast-data="store.forecast.next24Hours"
            :capacity-threshold="Math.round(store.totalBeds * 0.9)"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt-4">
      <v-col cols="12" md="7">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            72-Hour Occupancy Heatmap
          </div>
          <OccupancyHeatmap :forecast-data="store.forecast.byUnit" />
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <div class="d-flex flex-column h-100" style="gap: 12px;">
          <v-card
            v-for="day in store.forecast.next72Hours"
            :key="day.date"
            class="pa-3"
            border
            variant="flat"
          >
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-subtitle-2 font-weight-medium">{{ day.dayLabel }}</div>
                <div class="text-caption text-grey-darken-1">{{ day.date }}</div>
              </div>
              <v-chip :color="riskColor(day.surgeRisk)" size="small" variant="elevated">
                {{ day.surgeRisk.toUpperCase() }} risk
              </v-chip>
            </div>
            <div class="mt-2 d-flex justify-space-between">
              <div>
                <div class="kpi-title">Peak Census</div>
                <div class="text-h6 font-weight-bold">{{ day.predictedPeakCensus }}</div>
              </div>
              <div>
                <div class="kpi-title">Peak Time</div>
                <div class="text-h6 font-weight-bold">{{ day.predictedPeakTime }}</div>
              </div>
              <div>
                <div class="kpi-title">Adm / Disch</div>
                <div class="text-h6 font-weight-bold">
                  {{ day.predictedAdmissions }}/{{ day.predictedDischarges }}
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row dense class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Scheduled Admissions
          </div>
          <v-data-table
            :items="store.forecast.scheduledAdmissions"
            :headers="scheduledHeaders"
            :items-per-page="-1"
            density="compact"
            hide-default-footer
          />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Unit Forecast Trend
          </div>
          <v-data-table
            :items="store.forecast.byUnit"
            :headers="unitForecastHeaders"
            :items-per-page="-1"
            density="compact"
            hide-default-footer
          >
            <template #[`item.currentOccupancy`]="{ item }">{{ item.currentOccupancy }}%</template>
            <template #[`item.predictedOccupancy24h`]="{ item }">{{ item.predictedOccupancy24h }}%</template>
            <template #[`item.predictedOccupancy48h`]="{ item }">{{ item.predictedOccupancy48h }}%</template>
            <template #[`item.predictedOccupancy72h`]="{ item }">{{ item.predictedOccupancy72h }}%</template>
            <template #[`item.trend`]="{ item }">
              <v-icon :icon="trendIcon(item.trend)" :color="trendColor(item.trend)" size="20" />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
