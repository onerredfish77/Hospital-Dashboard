<script setup>
import { inject, ref, onMounted } from 'vue'
import RealTimeOverview from '@/components/tabs/RealTimeOverview.vue'
import CapacityForecast from '@/components/tabs/CapacityForecast.vue'
import StaffingAlignment from '@/components/tabs/StaffingAlignment.vue'
import AncillaryServices from '@/components/tabs/AncillaryServices.vue'
import QualityOutcomes from '@/components/tabs/QualityOutcomes.vue'

const activeTab = inject('activeTab')

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 600)
})
</script>

<template>
  <v-container fluid class="pa-4">
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

