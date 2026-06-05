<script setup>
import { onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useDashboardStore } from '@/stores/dashboardStore'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import DashboardView from '@/views/DashboardView.vue'

const store = useDashboardStore()
const { mdAndUp } = useDisplay()

const activeTab = ref('overview')
provide('activeTab', activeTab)

const sidebarOpen = ref(mdAndUp.value)
provide('sidebarOpen', sidebarOpen)

watch(mdAndUp, (isDesktop) => {
  sidebarOpen.value = isDesktop
})

onMounted(() => {
  store.startSimulator()
})

onUnmounted(() => {
  store.stopSimulator()
})
</script>

<template>
  <v-app theme="hospitalTheme">
    <AppSidebar />
    <AppHeader />
    <v-main>
      <DashboardView />
    </v-main>
  </v-app>
</template>
