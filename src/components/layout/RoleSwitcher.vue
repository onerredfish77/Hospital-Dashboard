<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'

const store = useDashboardStore()

const role = computed({
  get: () => store.activeRole,
  set: (val) => store.setRole(val),
})

const roles = [
  { value: 'director', label: 'Director', icon: 'mdi-account-tie' },
  { value: 'chargeNurse', label: 'Charge Nurse', icon: 'mdi-stethoscope' },
  { value: 'cmo', label: 'CMO', icon: 'mdi-hospital-building' },
]
</script>

<template>
  <v-btn-toggle
    v-model="role"
    mandatory
    density="comfortable"
    color="info"
    variant="elevated"
    divided
  >
    <v-btn
      v-for="r in roles"
      :key="r.value"
      :value="r.value"
      :prepend-icon="r.icon"
      size="small"
    >
      {{ r.label }}
    </v-btn>
  </v-btn-toggle>
</template>
