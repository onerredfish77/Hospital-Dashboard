<script setup>
import { inject, ref, onMounted } from 'vue'
import RealTimeOverview from '@/components/tabs/RealTimeOverview.vue'
import CapacityForecast from '@/components/tabs/CapacityForecast.vue'
import StaffingAlignment from '@/components/tabs/StaffingAlignment.vue'
import AncillaryServices from '@/components/tabs/AncillaryServices.vue'
import QualityOutcomes from '@/components/tabs/QualityOutcomes.vue'

const activeTab = inject('activeTab')

const tabs = [
  { id: 'overview', label: 'Real-Time Overview', icon: 'mdi-monitor-dashboard' },
  { id: 'forecast', label: 'Capacity Forecast', icon: 'mdi-chart-timeline-variant' },
  { id: 'staffing', label: 'Staffing & Resources', icon: 'mdi-account-group' },
  { id: 'ancillary', label: 'Ancillary Services', icon: 'mdi-medical-bag' },
  { id: 'quality', label: 'Quality & Outcomes', icon: 'mdi-clipboard-pulse' },
]

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 600)
})
</script>

<template>
  <v-container fluid class="pa-4">
    <v-tabs
      v-model="activeTab"
      color="primary"
      density="comfortable"
      class="mb-3 sticky-tabs"
      grow
    >
      <v-tab
        v-for="t in tabs"
        :key="t.id"
        :value="t.id"
        :prepend-icon="t.icon"
      >
        <span class="d-none d-md-inline">{{ t.label }}</span>
      </v-tab>
    </v-tabs>

    <v-skeleton-loader
      v-if="loading"
      type="card-avatar, article, actions"
      class="mt-2"
    />

    <v-window v-else v-model="activeTab">
      <v-window-item value="overview"><RealTimeOverview /></v-window-item>
      <v-window-item value="forecast"><CapacityForecast /></v-window-item>
      <v-window-item value="staffing"><StaffingAlignment /></v-window-item>
      <v-window-item value="ancillary"><AncillaryServices /></v-window-item>
      <v-window-item value="quality"><QualityOutcomes /></v-window-item>
    </v-window>
  </v-container>
</template>

<style scoped>
.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 4;
  background-color: #0F1626;
}
</style>
