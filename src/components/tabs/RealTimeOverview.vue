<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { formatTime } from '@/utils/formatters'
import KPITile from '@/components/widgets/KPITile.vue'
import AlertBanner from '@/components/widgets/AlertBanner.vue'
import CensusGauge from '@/components/widgets/CensusGauge.vue'
import TrendLineChart from '@/components/widgets/TrendLineChart.vue'

const store = useDashboardStore()

const role = computed(() => store.activeRole)

const todayHours = computed(() => {
  const trend = store.admissions.hourlyTrend
  const currentHour = new Date().getHours()
  return trend.slice(0, Math.max(currentHour + 1, 14))
})

const admissionsLabels = computed(() =>
  todayHours.value.map((h) => `${String(h.hour).padStart(2, '0')}:00`)
)

const admissionsDatasets = computed(() => [
  {
    label: 'Admissions',
    data: todayHours.value.map((h) => h.admissions),
    borderColor: '#42A5F5',
    backgroundColor: 'rgba(66, 165, 245, 0.20)',
    fill: true,
  },
  {
    label: 'Discharges',
    data: todayHours.value.map((h) => h.discharges),
    borderColor: '#66BB6A',
    backgroundColor: 'rgba(102, 187, 106, 0.20)',
    fill: true,
  },
])

const occupancyStatus = computed(() => {
  if (store.hospitalOccupancyPercent >= 90) return 'red'
  if (store.hospitalOccupancyPercent >= 80) return 'amber'
  return 'green'
})

const edWaitStatus = computed(() => {
  const v = store.edVolume.current.avgDoorToProviderMins
  if (v >= 60) return 'red'
  if (v >= 40) return 'amber'
  return 'green'
})

const dischargeByUnit = computed(() => store.dischargeDisposition.byUnit)

const transportTop5 = computed(() =>
  [...store.transport.queue]
    .sort((a, b) => b.waitTimeMins - a.waitTimeMins)
    .slice(0, 5)
)

const surgeColor = computed(() => {
  const s = store.edVolume.current.surgeStatus
  if (s === 'surge') return 'error'
  if (s === 'elevated') return 'warning'
  return 'success'
})

const visibleUnits = computed(() => {
  if (role.value === 'chargeNurse') {
    return store.census.filter((u) => u.unitId === 'MED1')
  }
  return store.census
})
</script>

<template>
  <div>
    <AlertBanner :alerts="store.criticalAlerts" />

    <!-- Hospital-wide KPIs (hidden for charge nurse) -->
    <v-row v-if="role !== 'chargeNurse'" dense>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="Total Census"
          :value="`${store.totalOccupied} / ${store.totalBeds}`"
          :subtitle="`${store.hospitalOccupancyPercent}% occupied`"
          icon="mdi-bed"
          :status="occupancyStatus"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="ED Wait Time"
          :value="formatTime(store.edVolume.current.avgDoorToProviderMins)"
          subtitle="Door to Provider"
          icon="mdi-clock-fast"
          :status="edWaitStatus"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="Pending Discharges"
          :value="store.totalPendingDischarges"
          subtitle="Across all units"
          icon="mdi-logout"
          status="green"
          trend="stable"
          trendLabel="Steady"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="Active Alerts"
          :value="store.activeAlertCount"
          subtitle="Critical issues now"
          icon="mdi-bell-alert"
          :status="store.activeAlertCount > 0 ? 'red' : 'green'"
        />
      </v-col>
    </v-row>

    <!-- Unit Census Gauges (hidden for CMO) -->
    <v-row v-if="role !== 'cmo'" dense class="mt-4">
      <v-col
        v-for="unit in visibleUnits"
        :key="unit.unitId"
        cols="6"
        sm="4"
        md="3"
      >
        <CensusGauge
          :unit-name="unit.unitName"
          :occupancy-percent="unit.occupancyPercent"
          :occupied-beds="unit.occupiedBeds"
          :total-beds="unit.totalBeds"
          :status="unit.status"
          :pending-discharges="unit.pendingDischarges"
          :pending-admissions="unit.pendingAdmissions"
        />
      </v-col>
    </v-row>

    <!-- Admissions trend + ED panel -->
    <v-row dense class="mt-4">
      <v-col cols="12" md="7">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Admissions vs Discharges — Today
          </div>
          <TrendLineChart
            :labels="admissionsLabels"
            :datasets="admissionsDatasets"
            :height="280"
          />
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card class="pa-4 h-100">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-subtitle-1 font-weight-medium">Emergency Dept</div>
            <v-chip :color="surgeColor" size="small" variant="elevated" class="text-uppercase">
              {{ store.edVolume.current.surgeStatus }}
            </v-chip>
          </div>
          <v-row dense>
            <v-col cols="6">
              <div class="kpi-title">Patients in ED</div>
              <div class="text-h5 font-weight-bold">{{ store.edVolume.current.patientsInED }}</div>
            </v-col>
            <v-col cols="6">
              <div class="kpi-title">Boarding</div>
              <div class="text-h5 font-weight-bold">{{ store.edVolume.current.boardingCount }}</div>
            </v-col>
            <v-col cols="6">
              <div class="kpi-title">Waiting to be Seen</div>
              <div class="text-h6 font-weight-bold">{{ store.edVolume.current.waitingToBeSeenCount }}</div>
            </v-col>
            <v-col cols="6">
              <div class="kpi-title">Door to Bed</div>
              <div class="text-h6 font-weight-bold">{{ formatTime(store.edVolume.current.avgDoorToBedMins) }}</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pending discharges + transport queue (hidden for CMO) -->
    <v-row v-if="role !== 'cmo'" dense class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Pending Discharges by Unit
          </div>
          <v-data-table
            :items="dischargeByUnit"
            :headers="[
              { title: 'Unit', key: 'unitName' },
              { title: 'Pending', key: 'pendingDischarges', align: 'end' },
              { title: 'Orders Placed', key: 'ordersPlaced', align: 'end' },
              { title: 'Not Yet Executed', key: 'notYetExecuted', align: 'end' },
            ]"
            :items-per-page="-1"
            density="compact"
            hide-default-footer
          />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-subtitle-1 font-weight-medium">Transport Queue</div>
            <v-chip size="small" variant="tonal">
              {{ store.transport.summary.patientsWaiting }} waiting •
              avg {{ formatTime(store.transport.summary.avgWaitTimeMins) }}
            </v-chip>
          </div>
          <v-list density="compact">
            <v-list-item
              v-for="t in transportTop5"
              :key="t.id"
              :title="`${t.patientId} — ${t.fromUnit} → ${t.toUnit}`"
              :subtitle="`${t.priority} • waiting ${t.waitTimeMins}m`"
            >
              <template #prepend>
                <v-icon
                  :icon="t.status === 'InProgress' ? 'mdi-truck-fast' : 'mdi-clock-outline'"
                  :color="t.priority === 'Urgent' ? 'error' : 'grey-darken-1'"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
