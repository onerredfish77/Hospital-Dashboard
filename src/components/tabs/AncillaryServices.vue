<script setup>
import { computed, ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useDashboardStore } from '@/stores/dashboardStore'
import { formatTime, getRAGColor } from '@/utils/formatters'
import KPITile from '@/components/widgets/KPITile.vue'
import RAGIndicator from '@/components/widgets/RAGIndicator.vue'
import TrendLineChart from '@/components/widgets/TrendLineChart.vue'

const store = useDashboardStore()

const detailTab = ref('lab')

function trendDatasetsFor(trendArr, valueKey, color) {
  return [
    {
      label: 'Avg minutes',
      data: trendArr.map((d) => d[valueKey]),
      borderColor: color,
      backgroundColor: `${color}33`,
      fill: true,
    },
  ]
}

const labLabels = computed(() => store.ancillaryLab.trend.map((d) => d.date.slice(5)))
const labDatasets = computed(() =>
  trendDatasetsFor(store.ancillaryLab.trend, 'avgTurnaroundMins', '#42A5F5')
)

const radLabels = computed(() => store.ancillaryRadiology.trend.map((d) => d.date.slice(5)))
const radDatasets = computed(() =>
  trendDatasetsFor(store.ancillaryRadiology.trend, 'avgReadTimeMins', '#26C6DA')
)

const pharmLabels = computed(() => store.ancillaryPharmacy.trend.map((d) => d.date.slice(5)))
const pharmDatasets = computed(() =>
  trendDatasetsFor(store.ancillaryPharmacy.trend, 'avgDispenseTimeMins', '#AB47BC')
)

const evsLabels = computed(() => store.ancillaryEvs.trend.map((d) => d.date.slice(5)))
const evsDatasets = computed(() =>
  trendDatasetsFor(store.ancillaryEvs.trend, 'avgTurnaroundMins', '#EF5350')
)

const dispositionChartData = computed(() => ({
  labels: store.dischargeDisposition.byDisposition.map((d) => d.disposition),
  datasets: [
    {
      data: store.dischargeDisposition.byDisposition.map((d) => d.count),
      backgroundColor: ['#42A5F5', '#26C6DA', '#FFB74D', '#AB47BC', '#66BB6A', '#EF5350'],
      borderColor: '#1A2236',
      borderWidth: 2,
    },
  ],
}))

const dispositionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'right' } },
}

const barriers = computed(() =>
  [...store.dischargeDisposition.barriers].sort(
    (a, b) => b.affectedPatients - a.affectedPatients
  )
)

const services = computed(() => [
  {
    key: 'lab',
    name: 'Lab',
    metric: store.ancillaryLab.summary.avgTurnaroundMins,
    target: store.ancillaryLab.summary.target,
    pending: store.ancillaryLab.summary.pendingOrders,
    status: store.ancillaryLab.summary.status,
    icon: 'mdi-flask',
  },
  {
    key: 'rad',
    name: 'Radiology',
    metric: store.ancillaryRadiology.summary.avgReadTimeMins,
    target: store.ancillaryRadiology.summary.target,
    pending: store.ancillaryRadiology.summary.pendingOrders,
    status: store.ancillaryRadiology.summary.status,
    icon: 'mdi-radiology-box',
  },
  {
    key: 'pharm',
    name: 'Pharmacy',
    metric: store.ancillaryPharmacy.summary.avgDispenseTimeMins,
    target: store.ancillaryPharmacy.summary.target,
    pending: store.ancillaryPharmacy.summary.pendingOrders,
    status: store.ancillaryPharmacy.summary.status,
    icon: 'mdi-pill',
  },
  {
    key: 'evs',
    name: 'EVS',
    metric: store.ancillaryEvs.summary.avgTurnaroundMins,
    target: store.ancillaryEvs.summary.target,
    pending: store.ancillaryEvs.summary.pendingCleans,
    status: store.ancillaryEvs.summary.status,
    icon: 'mdi-broom',
  },
])
</script>

<template>
  <div>
    <v-row dense>
      <v-col v-for="svc in services" :key="svc.key" cols="12" sm="6" md="3">
        <KPITile
          :title="`${svc.name} Avg Time`"
          :value="formatTime(svc.metric)"
          :subtitle="`Target ${svc.target}m • ${svc.pending} pending`"
          :icon="svc.icon"
          :status="svc.status"
        />
      </v-col>
    </v-row>

    <v-row dense class="mt-4">
      <v-col v-for="svc in services" :key="`card-${svc.key}`" cols="12" sm="6" md="3">
        <v-card class="pa-4 h-100" border variant="flat">
          <div class="d-flex align-center justify-space-between">
            <div class="text-subtitle-2 font-weight-medium">{{ svc.name }}</div>
            <RAGIndicator :status="svc.status" />
          </div>
          <div class="text-h5 font-weight-bold mt-1">{{ formatTime(svc.metric) }}</div>
          <div class="text-caption text-grey-darken-1">
            {{ svc.pending }} pending • target {{ svc.target }}m
          </div>
          <TrendLineChart
            v-if="svc.key === 'lab'"
            :labels="labLabels"
            :datasets="labDatasets"
            :height="80"
            :show-legend="false"
          />
          <TrendLineChart
            v-else-if="svc.key === 'rad'"
            :labels="radLabels"
            :datasets="radDatasets"
            :height="80"
            :show-legend="false"
          />
          <TrendLineChart
            v-else-if="svc.key === 'pharm'"
            :labels="pharmLabels"
            :datasets="pharmDatasets"
            :height="80"
            :show-legend="false"
          />
          <TrendLineChart
            v-else
            :labels="evsLabels"
            :datasets="evsDatasets"
            :height="80"
            :show-legend="false"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt-4">
      <v-col cols="12">
        <v-card class="pa-4">
          <v-tabs v-model="detailTab" color="primary" density="comfortable">
            <v-tab value="lab">Lab</v-tab>
            <v-tab value="rad">Radiology</v-tab>
            <v-tab value="pharm">Pharmacy</v-tab>
            <v-tab value="evs">EVS</v-tab>
          </v-tabs>
          <v-window v-model="detailTab" class="mt-3">
            <v-window-item value="lab">
              <v-data-table
                :items="store.ancillaryLab.byTestType"
                :headers="[
                  { title: 'Test', key: 'testName' },
                  { title: 'Avg TAT', key: 'avgTurnaroundMins', align: 'end' },
                  { title: 'Target', key: 'target', align: 'end' },
                  { title: 'Volume', key: 'volume', align: 'end' },
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
              <div class="mt-3">
                <TrendLineChart
                  :labels="labLabels"
                  :datasets="labDatasets"
                  title="Lab Turnaround — Last 7 Days"
                  :height="180"
                />
              </div>
            </v-window-item>

            <v-window-item value="rad">
              <v-data-table
                :items="store.ancillaryRadiology.byModality"
                :headers="[
                  { title: 'Modality', key: 'modality' },
                  { title: 'Pending', key: 'pendingCount', align: 'end' },
                  { title: 'Avg Read', key: 'avgReadTimeMins', align: 'end' },
                  { title: 'Target', key: 'target', align: 'end' },
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
              <div class="mt-3">
                <TrendLineChart
                  :labels="radLabels"
                  :datasets="radDatasets"
                  title="Radiology Read Time — Last 7 Days"
                  :height="180"
                />
              </div>
            </v-window-item>

            <v-window-item value="pharm">
              <v-data-table
                :items="store.ancillaryPharmacy.byOrderType"
                :headers="[
                  { title: 'Order Type', key: 'orderType' },
                  { title: 'Pending', key: 'pendingCount', align: 'end' },
                  { title: 'Avg Dispense', key: 'avgDispenseTimeMins', align: 'end' },
                  { title: 'Target', key: 'target', align: 'end' },
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
              <div class="mt-3">
                <TrendLineChart
                  :labels="pharmLabels"
                  :datasets="pharmDatasets"
                  title="Pharmacy Dispense Time — Last 7 Days"
                  :height="180"
                />
              </div>
            </v-window-item>

            <v-window-item value="evs">
              <v-data-table
                :items="store.ancillaryEvs.byUnit"
                :headers="[
                  { title: 'Unit', key: 'unitName' },
                  { title: 'Pending', key: 'pendingCleans', align: 'end' },
                  { title: 'Avg TAT', key: 'avgTurnaroundMins', align: 'end' },
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
              <div class="mt-3">
                <TrendLineChart
                  :labels="evsLabels"
                  :datasets="evsDatasets"
                  title="EVS Turnaround — Last 7 Days"
                  :height="180"
                />
              </div>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Discharge Disposition
          </div>
          <div style="height: 280px; position: relative;">
            <Doughnut :data="dispositionChartData" :options="dispositionOptions" />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Discharge Barriers
          </div>
          <v-data-table
            :items="barriers"
            :headers="[
              { title: 'Barrier', key: 'barrierType' },
              { title: 'Affected', key: 'affectedPatients', align: 'end' },
              { title: 'Avg Delay', key: 'avgDelayHours', align: 'end' },
            ]"
            :items-per-page="-1"
            density="compact"
            hide-default-footer
          >
            <template #[`item.avgDelayHours`]="{ item }">
              {{ item.avgDelayHours }}h
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
