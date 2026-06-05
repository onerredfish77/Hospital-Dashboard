<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { format } from 'date-fns'
import { useDisplay } from 'vuetify'
import { useDashboardStore } from '@/stores/dashboardStore'
import { getRAGColor } from '@/utils/formatters'
import RoleSwitcher from '@/components/layout/RoleSwitcher.vue'

const store = useDashboardStore()
const sidebarOpen = inject('sidebarOpen')
const { mdAndUp, smAndUp } = useDisplay()

const clock = ref(new Date())
let clockInterval = null

onMounted(() => {
  clockInterval = setInterval(() => {
    clock.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})

const occupancyStatus = computed(() => {
  const pct = store.hospitalOccupancyPercent
  if (pct >= 90) return 'red'
  if (pct >= 80) return 'amber'
  return 'green'
})

const occupancyColor = computed(() => getRAGColor(occupancyStatus.value))

const formattedTime = computed(() => format(clock.value, 'h:mm:ss a'))
const formattedDate = computed(() => format(clock.value, 'EEEE, MMM d'))

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <v-app-bar color="surface-variant" elevation="2" density="comfortable">
    <template #prepend>
      <v-app-bar-nav-icon
        v-if="!mdAndUp"
        @click="toggleSidebar"
      />
      <div class="ml-2 header-title" style="white-space: nowrap; overflow: hidden;">
        <div class="text-h6 font-weight-bold text-grey-lighten-4 text-truncate">
          <span class="d-none d-sm-inline">Regional Medical Center</span>
          <span class="d-sm-none">RMC</span>
        </div>
        <div class="text-caption text-grey-lighten-1 d-none d-sm-block">Operations Dashboard</div>
      </div>
    </template>

    <v-spacer />

    <v-chip
      :color="occupancyColor"
      variant="elevated"
      :size="smAndUp ? 'default' : 'small'"
      class="mr-2 font-weight-bold"
      style="white-space: nowrap; flex: none;"
    >
      <v-icon start icon="mdi-bed" />
      <span class="d-none d-md-inline">Hospital Occupancy: </span>
      {{ store.hospitalOccupancyPercent }}%
      <span class="d-none d-sm-inline">
        ({{ store.totalOccupied }}/{{ store.totalBeds }})
      </span>
    </v-chip>

    <v-spacer />

    <template #append>
      <RoleSwitcher v-if="mdAndUp" class="mr-3" />

      <div
        v-if="smAndUp"
        class="d-flex flex-column align-end mr-3 text-grey-lighten-2"
        style="white-space: nowrap;"
      >
        <span class="text-body-2 font-weight-medium">{{ formattedTime }}</span>
        <span class="text-caption d-none d-md-block">{{ formattedDate }}</span>
      </div>

      <v-btn icon class="mr-2">
        <v-badge
          v-if="store.activeAlertCount > 0"
          :content="store.activeAlertCount"
          color="error"
        >
          <v-icon icon="mdi-bell" />
        </v-badge>
        <v-icon v-else icon="mdi-bell-outline" />
      </v-btn>

      <div class="d-flex align-center mr-4">
        <span
          class="sim-dot mr-2"
          :class="{ 'sim-dot--active': store.simulatorActive }"
        />
        <span class="text-caption text-grey-lighten-2 d-none d-sm-inline">
          {{ store.simulatorActive ? 'Live' : 'Paused' }}
        </span>
      </div>
    </template>
  </v-app-bar>
</template>

<style scoped>
.sim-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #9E9E9E;
  display: inline-block;
}

.sim-dot--active {
  background-color: #4CAF50;
  box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}
</style>
