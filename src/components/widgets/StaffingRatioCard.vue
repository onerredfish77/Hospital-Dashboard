<script setup>
import { computed } from 'vue'
import { getRAGColor } from '@/utils/formatters'

const props = defineProps({
  unitName: { type: String, required: true },
  currentRatio: { type: String, required: true },
  targetRatio: { type: String, required: true },
  status: { type: String, default: 'green' },
  openSlots: { type: Number, default: 0 },
  nextShiftGap: { type: Number, default: 0 },
})

const ratioColor = computed(() => getRAGColor(props.status))
</script>

<template>
  <v-card variant="flat" border class="pa-3 h-100">
    <div class="text-subtitle-2 font-weight-medium">{{ unitName }}</div>
    <div class="d-flex align-center mt-2">
      <v-chip :color="ratioColor" size="large" variant="elevated" class="font-weight-bold">
        {{ currentRatio }}
      </v-chip>
      <span class="ml-3 text-caption text-grey-darken-1">
        Target {{ targetRatio }}
      </span>
    </div>
    <div class="mt-3 d-flex flex-wrap" style="gap: 6px;">
      <v-chip
        v-if="openSlots > 0"
        size="x-small"
        color="error"
        variant="tonal"
      >
        <v-icon start size="14" icon="mdi-alert-circle" />
        {{ openSlots }} open
      </v-chip>
      <v-chip
        v-if="nextShiftGap > 0"
        size="x-small"
        color="warning"
        variant="tonal"
      >
        <v-icon start size="14" icon="mdi-clock-alert-outline" />
        Next shift: -{{ nextShiftGap }}
      </v-chip>
      <v-chip
        v-if="openSlots === 0 && nextShiftGap === 0"
        size="x-small"
        color="success"
        variant="tonal"
      >
        <v-icon start size="14" icon="mdi-check-circle" />
        Covered
      </v-chip>
    </div>
  </v-card>
</template>
