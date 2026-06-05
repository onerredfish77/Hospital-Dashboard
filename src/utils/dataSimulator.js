import { THRESHOLDS, statusForLowerIsBetter, statusForOccupancy } from './thresholds'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function jitterInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function nowIso() {
  return new Date().toISOString()
}

export function tickCensus(census) {
  return census.map((unit) => {
    const delta = jitterInt(-2, 2)
    const occupiedBeds = clamp(unit.occupiedBeds + delta, 0, unit.totalBeds)
    const availableBeds = unit.totalBeds - occupiedBeds
    const occupancyPercent = Number(((occupiedBeds / unit.totalBeds) * 100).toFixed(2))
    const status = statusForOccupancy(occupancyPercent)
    return {
      ...unit,
      occupiedBeds,
      availableBeds,
      occupancyPercent,
      status,
      lastUpdated: nowIso(),
    }
  })
}

export function tickEdVolume(edVolume) {
  const current = edVolume.current
  const patientsInED = clamp(current.patientsInED + jitterInt(-3, 3), 0, 80)
  const avgDoorToProviderMins = clamp(current.avgDoorToProviderMins + jitterInt(-5, 5), 5, 240)
  let surgeStatus = current.surgeStatus
  if (patientsInED >= 38) surgeStatus = 'surge'
  else if (patientsInED >= 30) surgeStatus = 'elevated'
  else surgeStatus = 'normal'
  return {
    ...edVolume,
    current: {
      ...current,
      patientsInED,
      avgDoorToProviderMins,
      surgeStatus,
    },
  }
}

export function tickTransport(transport) {
  const summary = transport.summary
  const patientsWaiting = clamp(summary.patientsWaiting + jitterInt(-1, 1), 0, 50)
  const avgWaitTimeMins = clamp(summary.avgWaitTimeMins + jitterInt(-2, 2), 1, 180)
  const status = statusForLowerIsBetter(avgWaitTimeMins, 'transportWait')
  return {
    ...transport,
    summary: {
      ...summary,
      patientsWaiting,
      avgWaitTimeMins,
      status,
    },
  }
}

export function tickAncillaryLab(lab) {
  const summary = lab.summary
  const avgTurnaroundMins = clamp(summary.avgTurnaroundMins + jitterInt(-3, 3), 10, 240)
  const status = statusForLowerIsBetter(avgTurnaroundMins, 'labTurnaround')
  return {
    ...lab,
    summary: {
      ...summary,
      avgTurnaroundMins,
      status,
    },
  }
}

export function tickAncillaryEvs(evs) {
  const summary = evs.summary
  const avgTurnaroundMins = clamp(summary.avgTurnaroundMins + jitterInt(-5, 5), 15, 180)
  const status = statusForLowerIsBetter(avgTurnaroundMins, 'evsTurnaround')
  return {
    ...evs,
    summary: {
      ...summary,
      avgTurnaroundMins,
      status,
    },
  }
}

export const SIMULATOR_INTERVAL_MS = 30_000

export const __testing = { THRESHOLDS, jitterInt, clamp }
