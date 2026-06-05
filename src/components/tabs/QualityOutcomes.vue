<script setup>
import { computed } from 'vue'
import { Bar, Radar } from 'vue-chartjs'
import { useDashboardStore } from '@/stores/dashboardStore'
import { getRAGColor, formatPercent } from '@/utils/formatters'
import KPITile from '@/components/widgets/KPITile.vue'
import TrendLineChart from '@/components/widgets/TrendLineChart.vue'

const store = useDashboardStore()
const role = computed(() => store.activeRole)

const hospitalAlos = computed(() => {
  const last7 = store.admissions.last30Days.slice(-7)
  const avgCensus = last7.reduce((s, d) => s + d.census, 0) / last7.length
  const avgDischarges = last7.reduce((s, d) => s + d.discharges, 0) / last7.length
  if (!avgDischarges) return 0
  return Number((avgCensus / avgDischarges).toFixed(1))
})

const eventsTrend = computed(() => {
  const cur = store.qualityEvents.summary.totalEventsThisMonth
  const prev = store.qualityEvents.summary.totalEventsLastMonth
  if (cur < prev) return 'down'
  if (cur > prev) return 'up'
  return 'stable'
})

const hcahpsBarData = computed(() => ({
  labels: store.patientSatisfaction.byDomain.map((d) => d.domain),
  datasets: [
    {
      label: 'Score',
      data: store.patientSatisfaction.byDomain.map((d) => d.score),
      backgroundColor: '#1565C0',
    },
    {
      label: 'Benchmark',
      data: store.patientSatisfaction.byDomain.map((d) => d.benchmark),
      backgroundColor: 'rgba(0,0,0,0.15)',
    },
  ],
}))

const hcahpsBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: { legend: { position: 'bottom' } },
  scales: {
    x: { beginAtZero: true, max: 100 },
    y: { ticks: { font: { size: 11 } } },
  },
}

const radarData = computed(() => ({
  labels: ['Health Outcomes', 'Patient Experience', 'Care Team Experience', 'Cost of Care'],
  datasets: [
    {
      label: 'Current',
      data: [
        Math.round((1 - store.readmissions.summary.rate30Day) * 100),
        store.patientSatisfaction.overall.hcahpsScore,
        store.workforceHealth.summary.engagementScore,
        72,
      ],
      backgroundColor: 'rgba(21, 101, 192, 0.25)',
      borderColor: '#1565C0',
      borderWidth: 2,
    },
    {
      label: 'Target',
      data: [88, 85, 80, 80],
      backgroundColor: 'rgba(46, 125, 50, 0.15)',
      borderColor: '#2E7D32',
      borderWidth: 2,
      borderDash: [4, 4],
    },
  ],
}))

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } },
}

const readmissionTrendLabels = computed(() =>
  store.readmissions.trend.map((m) => m.month.slice(2))
)

const readmissionTrendDatasets = computed(() => [
  {
    label: 'Readmission Rate',
    data: store.readmissions.trend.map((m) => Number((m.rate * 100).toFixed(1))),
    borderColor: '#C62828',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    fill: true,
  },
])

const overallStatus = computed(() => {
  const s = store.patientSatisfaction.overall.hcahpsScore
  if (s >= 85) return 'green'
  if (s >= 75) return 'amber'
  return 'red'
})

const readmissionStatus = computed(() => store.readmissions.summary.status)
</script>

<template>
  <div>
    <v-row v-if="role === 'cmo'" dense class="mb-2">
      <v-col cols="12">
        <v-card class="pa-4 cmo-callout" color="primary" theme="dark">
          <div class="d-flex align-center">
            <v-icon icon="mdi-shield-star" size="32" class="mr-3" />
            <div>
              <div class="text-subtitle-1 font-weight-bold">System Health Overview</div>
              <div class="text-caption">
                HCAHPS {{ store.patientSatisfaction.overall.hcahpsScore }} •
                30-day readmission {{ formatPercent(store.readmissions.summary.rate30Day * 100, 1) }} •
                Quality events trending {{ store.qualityEvents.summary.trend }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="HCAHPS"
          :value="store.patientSatisfaction.overall.hcahpsScore"
          subtitle="vs benchmark 85"
          icon="mdi-emoticon-happy-outline"
          :status="overallStatus"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="30-Day Readmissions"
          :value="formatPercent(store.readmissions.summary.rate30Day * 100, 1)"
          :subtitle="`Benchmark ${formatPercent(store.readmissions.summary.benchmark * 100, 1)}`"
          icon="mdi-restart"
          :status="readmissionStatus"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="Hospital ALOS"
          :value="`${hospitalAlos} d`"
          subtitle="Last 7-day rolling"
          icon="mdi-calendar-clock"
          status="green"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="Quality Events"
          :value="store.qualityEvents.summary.totalEventsThisMonth"
          :subtitle="`Last month: ${store.qualityEvents.summary.totalEventsLastMonth}`"
          icon="mdi-shield-check"
          :status="eventsTrend === 'down' ? 'green' : eventsTrend === 'up' ? 'red' : 'amber'"
          :trend="eventsTrend"
          :trendLabel="store.qualityEvents.summary.trend"
        />
      </v-col>
    </v-row>

    <v-row dense class="mt-4">
      <v-col cols="12" md="7">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            HCAHPS by Domain
          </div>
          <div style="height: 320px; position: relative;">
            <Bar :data="hcahpsBarData" :options="hcahpsBarOptions" />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Quadruple Aim Performance
          </div>
          <div style="height: 320px; position: relative;">
            <Radar :data="radarData" :options="radarOptions" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="role !== 'chargeNurse'" dense class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Readmissions by Diagnosis
          </div>
          <v-data-table
            :items="store.readmissions.byDiagnosis"
            :headers="[
              { title: 'Diagnosis', key: 'diagnosis' },
              { title: 'Rate', key: 'rate', align: 'end' },
              { title: 'Benchmark', key: 'benchmark', align: 'end' },
              { title: 'Status', key: 'status', align: 'center' },
            ]"
            :items-per-page="-1"
            density="compact"
            hide-default-footer
          >
            <template #[`item.rate`]="{ item }">{{ formatPercent(item.rate * 100, 1) }}</template>
            <template #[`item.benchmark`]="{ item }">{{ formatPercent(item.benchmark * 100, 1) }}</template>
            <template #[`item.status`]="{ item }">
              <v-chip :color="getRAGColor(item.status)" size="x-small" variant="tonal">
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Readmission Rate Trend (6 months)
          </div>
          <TrendLineChart
            :labels="readmissionTrendLabels"
            :datasets="readmissionTrendDatasets"
            :height="260"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Core Measure Compliance
          </div>
          <v-data-table
            :items="store.qualityEvents.coreMeasures"
            :headers="[
              { title: 'Measure', key: 'measure' },
              { title: 'Compliance', key: 'compliancePercent' },
              { title: 'Target', key: 'target', align: 'end' },
              { title: 'Status', key: 'status', align: 'center' },
            ]"
            :items-per-page="-1"
            density="compact"
            hide-default-footer
          >
            <template #[`item.compliancePercent`]="{ item }">
              <div class="d-flex align-center">
                <v-progress-linear
                  :model-value="item.compliancePercent"
                  :color="getRAGColor(item.status)"
                  height="14"
                  rounded
                  class="mr-2"
                  style="flex: 1;"
                />
                <span class="text-caption font-weight-medium">{{ item.compliancePercent }}%</span>
              </div>
            </template>
            <template #[`item.target`]="{ item }">{{ item.target }}%</template>
            <template #[`item.status`]="{ item }">
              <v-chip :color="getRAGColor(item.status)" size="x-small" variant="tonal">
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Quality Events by Type
          </div>
          <v-data-table
            :items="store.qualityEvents.byType"
            :headers="[
              { title: 'Event Type', key: 'eventType' },
              { title: 'Count', key: 'count', align: 'end' },
              { title: 'Benchmark', key: 'benchmark', align: 'end' },
              { title: 'Status', key: 'status', align: 'center' },
            ]"
            :items-per-page="-1"
            density="compact"
            hide-default-footer
          >
            <template #[`item.status`]="{ item }">
              <v-chip :color="getRAGColor(item.status)" size="x-small" variant="tonal">
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="role !== 'chargeNurse'" dense class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Clinician Burnout Indicators
          </div>
          <v-data-table
            :items="store.workforceHealth.byUnit"
            :headers="[
              { title: 'Unit', key: 'unitName' },
              { title: 'OT %', key: 'overtimePercent', align: 'end' },
              { title: 'Turnover %', key: 'turnoverRate', align: 'end' },
              { title: 'Vacancy %', key: 'vacancyRate', align: 'end' },
              { title: 'Risk', key: 'burnoutRisk', align: 'center' },
            ]"
            :items-per-page="-1"
            density="compact"
            hide-default-footer
          >
            <template #[`item.burnoutRisk`]="{ item }">
              <v-chip
                :color="item.burnoutRisk === 'high' ? 'error' : item.burnoutRisk === 'medium' ? 'warning' : 'success'"
                size="x-small"
                variant="tonal"
              >
                {{ item.burnoutRisk }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Recent Quality Events
          </div>
          <v-list density="compact">
            <v-list-item
              v-for="evt in store.qualityEvents.recentEvents"
              :key="evt.id"
              :title="`${evt.type} — ${evt.unit}`"
              :subtitle="`${evt.date} • ${evt.severity} severity`"
            >
              <template #append>
                <v-chip
                  :color="evt.status === 'Open' ? 'error' : evt.status === 'Under Review' ? 'warning' : 'success'"
                  size="x-small"
                  variant="tonal"
                >
                  {{ evt.status }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
