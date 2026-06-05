<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { getRAGColor } from '@/utils/formatters'
import KPITile from '@/components/widgets/KPITile.vue'
import StaffingRatioCard from '@/components/widgets/StaffingRatioCard.vue'

const store = useDashboardStore()
const role = computed(() => store.activeRole)

const totalOpenRN = computed(() =>
  store.staffing.reduce((sum, s) => sum + s.currentShift.openRNSlots, 0)
)

const approachingOT = computed(() =>
  store.staffing.reduce((sum, s) => sum + s.overtimeAlerts.length, 0)
)

const unsafeRatioCount = computed(
  () => store.staffing.filter((s) => s.nurseToPatientRatio.status === 'red').length
)

const visibleStaffing = computed(() => {
  if (role.value === 'chargeNurse') {
    return store.staffing.filter((s) => s.unitId === 'MED1')
  }
  return store.staffing
})

const shiftCoverageHeaders = [
  { title: 'Unit', key: 'unitName' },
  { title: 'Shift', key: 'currentShift.shiftName' },
  { title: 'Scheduled RN', key: 'currentShift.scheduledRNs', align: 'end' },
  { title: 'Actual RN', key: 'currentShift.actualRNs', align: 'end' },
  { title: 'Open Slots', key: 'currentShift.openRNSlots', align: 'end' },
]

function rowClass(item) {
  if (item.currentShift.openRNSlots >= 2) return 'row-red'
  if (item.currentShift.openRNSlots === 1) return 'row-amber'
  return ''
}
</script>

<template>
  <div>
    <v-row v-if="role !== 'chargeNurse'" dense>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="Open RN Slots"
          :value="totalOpenRN"
          subtitle="Current shift, all units"
          icon="mdi-account-alert"
          :status="totalOpenRN >= 4 ? 'red' : totalOpenRN >= 2 ? 'amber' : 'green'"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="Float Pool Available"
          :value="store.floatPool.summary.totalAvailable"
          :subtitle="`RN ${store.floatPool.summary.rnAvailable} • LPN ${store.floatPool.summary.lpnAvailable} • CNA ${store.floatPool.summary.cnaAvailable}`"
          icon="mdi-account-multiple-plus"
          status="green"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="Approaching OT"
          :value="approachingOT"
          subtitle="Staff near 40h threshold"
          icon="mdi-clock-alert"
          :status="approachingOT >= 4 ? 'red' : approachingOT >= 2 ? 'amber' : 'green'"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KPITile
          title="Unsafe Ratios"
          :value="unsafeRatioCount"
          subtitle="Units at red status"
          icon="mdi-alert-octagon"
          :status="unsafeRatioCount > 0 ? 'red' : 'green'"
        />
      </v-col>
    </v-row>

    <v-row v-if="role !== 'cmo'" dense class="mt-4">
      <v-col cols="12">
        <v-card class="pa-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div class="text-subtitle-1 font-weight-medium">
              Nurse-to-Patient Ratios
            </div>
            <v-chip size="small" variant="tonal">
              Current shift: {{ store.staffing[0]?.currentShift?.shiftName || 'Day' }}
            </v-chip>
          </div>
          <v-row dense>
            <v-col
              v-for="unit in visibleStaffing"
              :key="unit.unitId"
              cols="6"
              md="3"
            >
              <StaffingRatioCard
                :unit-name="unit.unitName"
                :current-ratio="unit.nurseToPatientRatio.current"
                :target-ratio="unit.nurseToPatientRatio.target"
                :status="unit.nurseToPatientRatio.status"
                :open-slots="unit.currentShift.openRNSlots"
                :next-shift-gap="unit.nextShiftCoverage.gapCount"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="role !== 'chargeNurse'" dense class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Shift Coverage Gap
          </div>
          <v-data-table
            :items="store.staffing"
            :headers="shiftCoverageHeaders"
            :items-per-page="-1"
            density="compact"
            hide-default-footer
            :row-props="(props) => ({ class: rowClass(props.item) })"
          />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">Float Pool</div>
          <div class="d-flex flex-wrap mb-3" style="gap: 6px;">
            <v-chip size="small" color="primary" variant="tonal">
              RN: {{ store.floatPool.summary.rnAvailable }} avail
            </v-chip>
            <v-chip size="small" color="info" variant="tonal">
              LPN: {{ store.floatPool.summary.lpnAvailable }} avail
            </v-chip>
            <v-chip size="small" color="secondary" variant="tonal">
              CNA: {{ store.floatPool.summary.cnaAvailable }} avail
            </v-chip>
          </div>
          <v-list density="compact">
            <v-list-item
              v-for="staff in store.floatPool.available"
              :key="staff.id"
              :title="`${staff.name} (${staff.role})`"
              :subtitle="`${staff.shiftAvailable} • ${staff.availableForUnits.join(', ')}`"
            >
              <template #prepend>
                <v-avatar color="grey-lighten-3" size="32">
                  <v-icon icon="mdi-account" size="20" />
                </v-avatar>
              </template>
            </v-list-item>
            <v-list-item
              v-for="staff in store.floatPool.deployed"
              :key="staff.id"
              :title="`${staff.name} (${staff.role}) → ${staff.deployedTo}`"
              subtitle="Deployed"
            >
              <template #prepend>
                <v-icon icon="mdi-check-circle" color="success" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="role !== 'cmo'" dense class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Overtime Alerts
          </div>
          <div v-if="approachingOT === 0" class="text-body-2 text-grey-darken-1">
            No staff approaching the OT threshold.
          </div>
          <template v-else>
            <v-alert
              v-for="unit in store.staffing.filter((s) => s.overtimeAlerts.length > 0)"
              :key="unit.unitId"
              type="warning"
              variant="tonal"
              density="compact"
              class="mb-2"
            >
              <div class="font-weight-medium">{{ unit.unitName }}</div>
              <div
                v-for="alert in unit.overtimeAlerts"
                :key="alert.name"
                class="text-caption"
              >
                {{ alert.name }}: {{ alert.hoursWorked }}h / {{ alert.otThreshold }}h
              </div>
            </v-alert>
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Next Shift Coverage
          </div>
          <v-data-table
            :items="store.staffing"
            :headers="[
              { title: 'Unit', key: 'unitName' },
              { title: 'Scheduled RN', key: 'nextShiftCoverage.scheduledRNs', align: 'end' },
              { title: 'Confirmed', key: 'nextShiftCoverage.confirmedRNs', align: 'end' },
              { title: 'Gap', key: 'nextShiftCoverage.gapCount', align: 'end' },
            ]"
            :items-per-page="-1"
            density="compact"
            hide-default-footer
          >
            <template #[`item.nextShiftCoverage.gapCount`]="{ item }">
              <v-chip
                :color="item.nextShiftCoverage.gapCount > 0 ? 'error' : 'success'"
                size="x-small"
                variant="tonal"
              >
                {{ item.nextShiftCoverage.gapCount }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
:deep(.row-red) {
  background-color: rgba(239, 83, 80, 0.12);
}
:deep(.row-amber) {
  background-color: rgba(255, 183, 77, 0.12);
}
</style>
