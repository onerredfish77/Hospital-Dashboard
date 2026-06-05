import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import censusData from '@/data/census.json'
import admissionsData from '@/data/admissions.json'
import edVolumeData from '@/data/ed_volume.json'
import staffingData from '@/data/staffing.json'
import floatPoolData from '@/data/float_pool.json'
import ancillaryLabData from '@/data/ancillary_lab.json'
import ancillaryRadiologyData from '@/data/ancillary_radiology.json'
import ancillaryPharmacyData from '@/data/ancillary_pharmacy.json'
import ancillaryEvsData from '@/data/ancillary_evs.json'
import transportData from '@/data/transport.json'
import dischargeDispositionData from '@/data/discharge_disposition.json'
import forecastData from '@/data/forecast.json'
import patientSatisfactionData from '@/data/patient_satisfaction.json'
import readmissionsData from '@/data/readmissions.json'
import qualityEventsData from '@/data/quality_events.json'
import workforceHealthData from '@/data/workforce_health.json'
import mapLayoutData from '@/data/map_layout.json'

import {
  tickCensus,
  tickEdVolume,
  tickTransport,
  tickAncillaryLab,
  tickAncillaryEvs,
  SIMULATOR_INTERVAL_MS,
} from '@/utils/dataSimulator'

function deepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

export const useDashboardStore = defineStore('dashboard', () => {
  const census = ref(deepClone(censusData))
  const admissions = ref(deepClone(admissionsData))
  const edVolume = ref(deepClone(edVolumeData))
  const staffing = ref(deepClone(staffingData))
  const floatPool = ref(deepClone(floatPoolData))
  const ancillaryLab = ref(deepClone(ancillaryLabData))
  const ancillaryRadiology = ref(deepClone(ancillaryRadiologyData))
  const ancillaryPharmacy = ref(deepClone(ancillaryPharmacyData))
  const ancillaryEvs = ref(deepClone(ancillaryEvsData))
  const transport = ref(deepClone(transportData))
  const dischargeDisposition = ref(deepClone(dischargeDispositionData))
  const forecast = ref(deepClone(forecastData))
  const patientSatisfaction = ref(deepClone(patientSatisfactionData))
  const readmissions = ref(deepClone(readmissionsData))
  const qualityEvents = ref(deepClone(qualityEventsData))
  const workforceHealth = ref(deepClone(workforceHealthData))
  const mapLayout = ref(deepClone(mapLayoutData))

  const activeRole = ref('director')
  const lastSimulated = ref(new Date().toISOString())
  const simulatorActive = ref(true)

  let intervalId = null

  const totalBeds = computed(() =>
    census.value.reduce((sum, u) => sum + u.totalBeds, 0)
  )

  const totalOccupied = computed(() =>
    census.value.reduce((sum, u) => sum + u.occupiedBeds, 0)
  )

  const hospitalOccupancyPercent = computed(() => {
    if (!totalBeds.value) return 0
    return Number(((totalOccupied.value / totalBeds.value) * 100).toFixed(1))
  })

  const totalPendingDischarges = computed(() =>
    census.value.reduce((sum, u) => sum + (u.pendingDischarges || 0), 0)
  )

  const totalPendingAdmissions = computed(() =>
    census.value.reduce((sum, u) => sum + (u.pendingAdmissions || 0), 0)
  )

  const criticalAlerts = computed(() => {
    const alerts = []
    census.value.forEach((u) => {
      if (u.status === 'red') {
        alerts.push({
          source: 'Census',
          unit: u.unitName,
          severity: 'error',
          message: `${u.unitName} occupancy at ${u.occupancyPercent}% — critical`,
        })
      }
    })
    if (ancillaryEvs.value.summary.status === 'red') {
      alerts.push({
        source: 'EVS',
        unit: 'Hospital-Wide',
        severity: 'error',
        message: `EVS turnaround averaging ${ancillaryEvs.value.summary.avgTurnaroundMins} min vs ${ancillaryEvs.value.summary.target} min target`,
      })
    }
    if (ancillaryRadiology.value.summary.status === 'red') {
      alerts.push({
        source: 'Radiology',
        unit: 'Hospital-Wide',
        severity: 'error',
        message: `Radiology read time averaging ${ancillaryRadiology.value.summary.avgReadTimeMins} min vs ${ancillaryRadiology.value.summary.target} min target`,
      })
    }
    if (ancillaryLab.value.summary.status === 'red') {
      alerts.push({
        source: 'Lab',
        unit: 'Hospital-Wide',
        severity: 'error',
        message: `Lab turnaround averaging ${ancillaryLab.value.summary.avgTurnaroundMins} min — exceeds target`,
      })
    }
    staffing.value.forEach((s) => {
      if (s.nurseToPatientRatio.status === 'red') {
        alerts.push({
          source: 'Staffing',
          unit: s.unitName,
          severity: 'error',
          message: `${s.unitName} nurse ratio at ${s.nurseToPatientRatio.current} (target ${s.nurseToPatientRatio.target})`,
        })
      }
    })
    if (edVolume.value.current.surgeStatus === 'surge') {
      alerts.push({
        source: 'ED',
        unit: 'Emergency Department',
        severity: 'error',
        message: `ED in surge — ${edVolume.value.current.patientsInED} patients in department`,
      })
    } else if (edVolume.value.current.surgeStatus === 'elevated') {
      alerts.push({
        source: 'ED',
        unit: 'Emergency Department',
        severity: 'warning',
        message: `ED volume elevated — ${edVolume.value.current.patientsInED} patients`,
      })
    }

    // Forecast-driven look-ahead: any unit projected red within next 6 hours
    const hourly = forecast.value?.hourlyByUnit
    if (Array.isArray(hourly)) {
      hourly.forEach((u) => {
        const liveStatus = census.value.find((c) => c.unitId === u.unitId)?.status
        if (liveStatus === 'red') return // already alerted live
        const upcoming = u.hours
          ?.slice(1, 7)
          .find((h) => h.predictedStatus === 'red')
        if (upcoming) {
          alerts.push({
            source: 'Forecast',
            unit: u.unitName,
            severity: 'warning',
            type: 'forecast',
            message: `${u.unitName} projected to hit ${upcoming.predictedOccupancyPercent}% in +${upcoming.hoursFromNow}h`,
          })
        }
      })
    }

    return alerts
  })

  const activeAlertCount = computed(
    () => criticalAlerts.value.filter((a) => a.severity === 'error').length
  )

  function setRole(role) {
    if (['director', 'chargeNurse', 'cmo'].includes(role)) {
      activeRole.value = role
    }
  }

  function runSimulatorTick() {
    census.value = tickCensus(census.value)
    edVolume.value = tickEdVolume(edVolume.value)
    transport.value = tickTransport(transport.value)
    ancillaryLab.value = tickAncillaryLab(ancillaryLab.value)
    ancillaryEvs.value = tickAncillaryEvs(ancillaryEvs.value)
    lastSimulated.value = new Date().toISOString()
  }

  function startSimulator() {
    if (intervalId) return
    simulatorActive.value = true
    intervalId = setInterval(runSimulatorTick, SIMULATOR_INTERVAL_MS)
  }

  function stopSimulator() {
    simulatorActive.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function toggleSimulator() {
    if (intervalId) stopSimulator()
    else startSimulator()
  }

  return {
    census,
    admissions,
    edVolume,
    staffing,
    floatPool,
    ancillaryLab,
    ancillaryRadiology,
    ancillaryPharmacy,
    ancillaryEvs,
    transport,
    dischargeDisposition,
    forecast,
    patientSatisfaction,
    readmissions,
    qualityEvents,
    workforceHealth,
    mapLayout,
    activeRole,
    lastSimulated,
    simulatorActive,
    totalBeds,
    totalOccupied,
    hospitalOccupancyPercent,
    totalPendingDischarges,
    totalPendingAdmissions,
    criticalAlerts,
    activeAlertCount,
    setRole,
    runSimulatorTick,
    startSimulator,
    stopSimulator,
    toggleSimulator,
  }
})
