// One-shot generator for hourlyByUnit forecast block.
// Reads src/data/forecast.json, computes a 73-hour per-unit forecast that
// follows the narrative in plan.md Phase 11.1.2, and writes it back.
import { readFileSync, writeFileSync } from 'node:fs'

const PATH = new URL('../src/data/forecast.json', import.meta.url)

const SCALE = 3
const units = [
  { unitId: 'ED',    unitName: 'Emergency Department', totalBeds: 40 * SCALE, start: 34 * SCALE },
  { unitId: 'ICU',   unitName: 'Intensive Care Unit',  totalBeds: 20 * SCALE, start: 19 * SCALE },
  { unitId: 'MED1',  unitName: 'Medical Unit 1',       totalBeds: 32 * SCALE, start: 30 * SCALE },
  { unitId: 'MED2',  unitName: 'Medical Unit 2',       totalBeds: 32 * SCALE, start: 24 * SCALE },
  { unitId: 'SURG1', unitName: 'Surgical Unit 1',      totalBeds: 28 * SCALE, start: 22 * SCALE },
  { unitId: 'SURG2', unitName: 'Surgical Unit 2',      totalBeds: 28 * SCALE, start: 24 * SCALE },
  { unitId: 'PEDS',  unitName: 'Pediatrics',           totalBeds: 24 * SCALE, start: 14 * SCALE },
  { unitId: 'OB',    unitName: 'Obstetrics',           totalBeds: 20 * SCALE, start: 13 * SCALE },
]

function clampBeds(n, total) {
  return Math.max(0, Math.min(total, Math.round(n)))
}

function statusFor(pct) {
  if (pct >= 90) return 'red'
  if (pct >= 80) return 'amber'
  return 'green'
}

// Per-unit occupancy curves. Each returns occupied bed count for hour h (0..72).
// Surge/dip magnitudes scale with SCALE so curve shape matches the 1x baseline.
const curves = {
  ED: (h, total, start) => {
    // Daytime surges: 8–14 and 32–38; eases overnight 18–28 and 42–54
    const daySurge = 6 * SCALE * Math.exp(-Math.pow((h - 11) / 3.5, 2))
    const day2Surge = 5 * SCALE * Math.exp(-Math.pow((h - 35) / 3.5, 2))
    const overnightDip = -3 * SCALE * Math.exp(-Math.pow((h - 23) / 4, 2))
    const overnight2Dip = -3 * SCALE * Math.exp(-Math.pow((h - 47) / 4, 2))
    const drift = 0.02 * SCALE * h
    const beds = start + daySurge + day2Surge + overnightDip + overnight2Dip + drift
    return clampBeds(beds, total)
  },
  ICU: (h, total, start) => {
    // Stays red ~95% through 48, eases to amber by 72
    if (h <= 48) return clampBeds(start + Math.sin(h / 6) * 0.4 * SCALE, total)
    const t = (h - 48) / 24
    return clampBeds(start - 2 * SCALE * t, total)
  },
  MED1: (h, total, start) => {
    // From red toward critical (>95%) by hr 24, stays red
    if (h <= 24) {
      const t = h / 24
      return clampBeds(start + 1.5 * SCALE * t, total)
    }
    return clampBeds(start + 1.5 * SCALE + 0.5 * SCALE * Math.sin(h / 8), total)
  },
  MED2: (h, total, start) => {
    // Gradually increases from amber toward red by hr 48
    const target = 29 * SCALE
    if (h <= 48) {
      const t = h / 48
      return clampBeds(start + (target - start) * t, total)
    }
    return clampBeds(target + 0.5 * SCALE * Math.sin(h / 10), total)
  },
  SURG1: (h, total, start) => {
    // Drop to green overnight (hrs 12–20), rise again after
    const overnight1 = -5 * SCALE * Math.exp(-Math.pow((h - 16) / 3, 2))
    const overnight2 = -5 * SCALE * Math.exp(-Math.pow((h - 40) / 3, 2))
    const overnight3 = -5 * SCALE * Math.exp(-Math.pow((h - 64) / 3, 2))
    const daytime = 1.5 * SCALE * Math.sin((h - 4) / 4)
    return clampBeds(start + overnight1 + overnight2 + overnight3 + daytime, total)
  },
  SURG2: (h, total, start) => {
    const overnight1 = -6 * SCALE * Math.exp(-Math.pow((h - 16) / 3, 2))
    const overnight2 = -6 * SCALE * Math.exp(-Math.pow((h - 40) / 3, 2))
    const overnight3 = -6 * SCALE * Math.exp(-Math.pow((h - 64) / 3, 2))
    const daytime = 1.5 * SCALE * Math.sin((h - 4) / 4)
    return clampBeds(start + overnight1 + overnight2 + overnight3 + daytime, total)
  },
  PEDS: (h, total, start) => {
    // Stable green-to-amber
    const drift = 2 * SCALE * Math.sin(h / 10)
    const upward = h * 0.04 * SCALE
    return clampBeds(start + drift + upward, total)
  },
  OB: (h, total, start) => {
    const drift = 1.5 * SCALE * Math.sin(h / 9)
    const upward = h * 0.03 * SCALE
    return clampBeds(start + drift + upward, total)
  },
}

const hourlyByUnit = units.map((u) => {
  const hours = []
  for (let h = 0; h <= 72; h++) {
    const beds = h === 0 ? u.start : curves[u.unitId](h, u.totalBeds, u.start)
    const pct = Number(((beds / u.totalBeds) * 100).toFixed(1))
    hours.push({
      hoursFromNow: h,
      predictedOccupiedBeds: beds,
      predictedOccupancyPercent: pct,
      predictedStatus: statusFor(pct),
    })
  }
  return { unitId: u.unitId, unitName: u.unitName, hours }
})

const forecast = JSON.parse(readFileSync(PATH, 'utf8'))
forecast.hourlyByUnit = hourlyByUnit
writeFileSync(PATH, JSON.stringify(forecast, null, 2) + '\n')

console.log('hourlyByUnit written for', hourlyByUnit.length, 'units')
for (const u of hourlyByUnit) {
  const hr0 = u.hours[0]
  const hr24 = u.hours[24]
  const hr48 = u.hours[48]
  const hr72 = u.hours[72]
  console.log(
    `${u.unitId.padEnd(6)} now=${hr0.predictedOccupancyPercent}%(${hr0.predictedStatus})` +
      ` 24h=${hr24.predictedOccupancyPercent}%(${hr24.predictedStatus})` +
      ` 48h=${hr48.predictedOccupancyPercent}%(${hr48.predictedStatus})` +
      ` 72h=${hr72.predictedOccupancyPercent}%(${hr72.predictedStatus})`
  )
}
