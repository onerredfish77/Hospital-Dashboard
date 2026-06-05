<script setup>
import { inject, ref, watch } from 'vue'

const props = defineProps({
  alerts: { type: Array, default: () => [] },
})

const activeTab = inject('activeTab', null)
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

function handleCta(alert) {
  if (!alert.cta?.tab || !activeTab) return
  activeTab.value = alert.cta.tab
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
      class="mb-2 alert-with-cta"
      @click:close="dismiss(alert._key)"
    >
      <div class="d-flex align-center" style="gap: 8px;">
        <strong v-if="alert.source">{{ alert.source }}:</strong>
        <span>{{ alert.message }}</span>
        <v-chip
          v-if="alert.unit && alert.unit !== 'Hospital-Wide'"
          size="x-small"
          variant="outlined"
        >
          {{ alert.unit }}
        </v-chip>
      </div>

      <template v-if="alert.cta" #append>
        <v-btn
          size="small"
          variant="tonal"
          density="comfortable"
          append-icon="mdi-arrow-right"
          class="mr-2 alert-cta-btn"
          @click="handleCta(alert)"
        >
          {{ alert.cta.label }}
        </v-btn>
      </template>
    </v-alert>
  </div>
</template>
