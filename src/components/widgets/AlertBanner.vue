<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  alerts: { type: Array, default: () => [] },
})

const dismissed = ref(new Set())

watch(
  () => props.alerts.length,
  () => {
    dismissed.value = new Set()
  }
)

function keyOf(alert, idx) {
  return `${alert.source || ''}|${alert.unit || ''}|${alert.message || ''}|${idx}`
}

function dismiss(key) {
  const next = new Set(dismissed.value)
  next.add(key)
  dismissed.value = next
}

function visibleAlerts() {
  return props.alerts
    .map((a, idx) => ({ ...a, _key: keyOf(a, idx) }))
    .filter((a) => !dismissed.value.has(a._key))
}
</script>

<template>
  <div v-if="visibleAlerts().length > 0" class="alert-stack">
    <v-alert
      v-for="alert in visibleAlerts()"
      :key="alert._key"
      :type="alert.severity || 'warning'"
      variant="tonal"
      density="compact"
      closable
      class="mb-2"
      @click:close="dismiss(alert._key)"
    >
      <div class="d-flex align-center">
        <strong v-if="alert.source" class="mr-2">{{ alert.source }}:</strong>
        <span>{{ alert.message }}</span>
        <v-chip
          v-if="alert.unit && alert.unit !== 'Hospital-Wide'"
          size="x-small"
          variant="outlined"
          class="ml-2"
        >
          {{ alert.unit }}
        </v-chip>
      </div>
    </v-alert>
  </div>
</template>
