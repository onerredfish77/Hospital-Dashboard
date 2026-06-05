export const THRESHOLDS = {
  occupancy: { green: 80, amber: 90 },
  nurseRatio: { green: 4, amber: 5 },
  labTurnaround: { green: 60, amber: 90 },
  radReadTime: { green: 45, amber: 75 },
  pharmDispense: { green: 30, amber: 45 },
  evsTurnaround: { green: 35, amber: 55 },
  transportWait: { green: 20, amber: 35 },
  readmissionRate: { green: 0.12, amber: 0.18 },
  hcahps: { green: 85, amber: 75 },
  coreMeasure: { green: 95, amber: 85 },
}

export function statusForLowerIsBetter(value, key) {
  const t = THRESHOLDS[key]
  if (!t) return 'green'
  if (value <= t.green) return 'green'
  if (value <= t.amber) return 'amber'
  return 'red'
}

export function statusForHigherIsBetter(value, key) {
  const t = THRESHOLDS[key]
  if (!t) return 'green'
  if (value >= t.green) return 'green'
  if (value >= t.amber) return 'amber'
  return 'red'
}

export function statusForOccupancy(percent) {
  return statusForLowerIsBetter(percent, 'occupancy')
}
