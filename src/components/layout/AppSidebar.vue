<script setup>
import { computed, inject } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'

const store = useDashboardStore()
const activeTab = inject('activeTab')

const navItems = [
  { id: 'overview', label: 'Real-Time Overview', icon: 'mdi-monitor-dashboard' },
  { id: 'forecast', label: 'Capacity Forecast', icon: 'mdi-chart-timeline-variant' },
  { id: 'staffing', label: 'Staffing & Resources', icon: 'mdi-account-group' },
  { id: 'ancillary', label: 'Ancillary Services', icon: 'mdi-medical-bag' },
  { id: 'quality', label: 'Quality & Outcomes', icon: 'mdi-clipboard-pulse' },
]

const overviewHasRed = computed(() =>
  store.census.some((u) => u.status === 'red') ||
  store.edVolume.current.surgeStatus === 'surge'
)

const forecastHasRed = computed(() =>
  store.forecast.next72Hours.some((d) => d.surgeRisk === 'high') ||
  store.forecast.byUnit.some((u) => u.predictedOccupancy24h >= 90)
)

const staffingHasRed = computed(() =>
  store.staffing.some((s) => s.nurseToPatientRatio.status === 'red')
)

const ancillaryHasRed = computed(() =>
  store.ancillaryLab.summary.status === 'red' ||
  store.ancillaryRadiology.summary.status === 'red' ||
  store.ancillaryPharmacy.summary.status === 'red' ||
  store.ancillaryEvs.summary.status === 'red'
)

const qualityHasRed = computed(() =>
  store.readmissions.byDiagnosis.some((d) => d.status === 'red') ||
  store.qualityEvents.byType.some((e) => e.status === 'red') ||
  store.workforceHealth.byUnit.some((u) => u.burnoutRisk === 'high')
)

const redFlags = {
  overview: overviewHasRed,
  forecast: forecastHasRed,
  staffing: staffingHasRed,
  ancillary: ancillaryHasRed,
  quality: qualityHasRed,
}

function selectTab(id) {
  activeTab.value = id
}
</script>

<template>
  <v-navigation-drawer permanent width="240" color="surface">
    <div class="pa-4 d-flex align-center">
      <v-icon icon="mdi-hospital-building" size="32" color="primary" class="mr-2" />
      <div>
        <div class="text-subtitle-1 font-weight-bold">PVM Dashboard</div>
        <div class="text-caption text-grey-darken-1">Patient Volume Mgmt</div>
      </div>
    </div>

    <v-divider />

    <v-list nav density="comfortable">
      <v-list-item
        v-for="item in navItems"
        :key="item.id"
        :prepend-icon="item.icon"
        :title="item.label"
        :active="activeTab === item.id"
        :color="activeTab === item.id ? 'primary' : undefined"
        @click="selectTab(item.id)"
      >
        <template #append>
          <span
            v-if="redFlags[item.id].value"
            class="rag-dot rag-dot--red"
            title="Critical alerts in this section"
          />
        </template>
      </v-list-item>
    </v-list>

    <template #append>
      <v-divider />
      <div class="pa-4">
        <v-switch
          :model-value="store.simulatorActive"
          color="success"
          density="compact"
          hide-details
          label="Live simulator"
          @update:model-value="store.toggleSimulator()"
        />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.rag-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.rag-dot--red {
  background-color: #C62828;
  animation: dot-pulse 1.5s infinite;
}

@keyframes dot-pulse {
  0% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(198, 40, 40, 0); }
  100% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0); }
}
</style>
