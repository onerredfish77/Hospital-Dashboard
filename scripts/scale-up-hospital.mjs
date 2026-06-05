// One-shot script: scales count-based dataset values by SCALE to represent
// a much larger hospital. Leaves percentages, minutes, ratios, scores,
// dates, IDs, names, status, and SVG coords untouched.
//
// Run: node scripts/scale-up-hospital.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const SCALE = 3
const DATA = (name) => new URL(`../src/data/${name}.json`, import.meta.url)

const read = (n) => JSON.parse(readFileSync(DATA(n), 'utf8'))
const write = (n, obj) => writeFileSync(DATA(n), JSON.stringify(obj, null, 2) + '\n')
const x = (v) => Math.round(v * SCALE)

// ---------- census ----------
{
  const census = read('census')
  for (const u of census) {
    u.totalBeds = x(u.totalBeds)
    u.occupiedBeds = x(u.occupiedBeds)
    u.availableBeds = u.totalBeds - u.occupiedBeds
    u.pendingDischarges = x(u.pendingDischarges)
    u.pendingAdmissions = x(u.pendingAdmissions)
    u.occupancyPercent = Number(((u.occupiedBeds / u.totalBeds) * 100).toFixed(2))
  }
  write('census', census)
}

// ---------- admissions ----------
{
  const a = read('admissions')
  a.todaysSummary.totalAdmissions = x(a.todaysSummary.totalAdmissions)
  a.todaysSummary.totalDischarges = x(a.todaysSummary.totalDischarges)
  a.todaysSummary.netChange = a.todaysSummary.totalAdmissions - a.todaysSummary.totalDischarges
  for (const h of a.hourlyTrend) {
    h.admissions = x(h.admissions)
    h.discharges = x(h.discharges)
  }
  for (const d of a.last30Days) {
    d.admissions = x(d.admissions)
    d.discharges = x(d.discharges)
    d.census = x(d.census)
  }
  write('admissions', a)
}

// ---------- ed_volume ----------
{
  const e = read('ed_volume')
  e.current.patientsInED = x(e.current.patientsInED)
  e.current.waitingToBeSeenCount = x(e.current.waitingToBeSeenCount)
  e.current.boardingCount = x(e.current.boardingCount)
  for (const h of e.hourlyVolume) {
    h.arrivals = x(h.arrivals)
    h.departures = x(h.departures)
    h.totalInDept = x(h.totalInDept)
  }
  write('ed_volume', e)
}

// ---------- staffing ----------
{
  const s = read('staffing')
  for (const u of s) {
    const cs = u.currentShift
    cs.scheduledRNs = x(cs.scheduledRNs)
    cs.actualRNs = x(cs.actualRNs)
    cs.scheduledAides = x(cs.scheduledAides)
    cs.actualAides = x(cs.actualAides)
    cs.openRNSlots = x(cs.openRNSlots)
    cs.openAideSlots = x(cs.openAideSlots)
    const ns = u.nextShiftCoverage
    ns.scheduledRNs = x(ns.scheduledRNs)
    ns.confirmedRNs = x(ns.confirmedRNs)
    ns.gapCount = x(ns.gapCount)
  }
  write('staffing', s)
}

// ---------- ancillary_lab ----------
{
  const l = read('ancillary_lab')
  l.summary.pendingOrders = x(l.summary.pendingOrders)
  l.summary.criticalResultsPending = x(l.summary.criticalResultsPending)
  for (const t of l.byTestType) t.volume = x(t.volume)
  write('ancillary_lab', l)
}

// ---------- ancillary_pharmacy ----------
{
  const p = read('ancillary_pharmacy')
  p.summary.pendingOrders = x(p.summary.pendingOrders)
  p.summary.urgentPending = x(p.summary.urgentPending)
  for (const o of p.byOrderType) o.pendingCount = x(o.pendingCount)
  write('ancillary_pharmacy', p)
}

// ---------- ancillary_radiology ----------
{
  const r = read('ancillary_radiology')
  r.summary.pendingOrders = x(r.summary.pendingOrders)
  r.summary.criticalFindingsPending = x(r.summary.criticalFindingsPending)
  for (const m of r.byModality) m.pendingCount = x(m.pendingCount)
  write('ancillary_radiology', r)
}

// ---------- ancillary_evs ----------
{
  const e = read('ancillary_evs')
  e.summary.pendingCleans = x(e.summary.pendingCleans)
  e.summary.bedsReadyToday = x(e.summary.bedsReadyToday)
  e.summary.bedsCleanedToday = x(e.summary.bedsCleanedToday)
  for (const u of e.byUnit) u.pendingCleans = x(u.pendingCleans)
  write('ancillary_evs', e)
}

// ---------- discharge_disposition ----------
{
  const d = read('discharge_disposition')
  d.summary.totalPendingDischarges = x(d.summary.totalPendingDischarges)
  d.summary.targetDischargesByNoon = x(d.summary.targetDischargesByNoon)
  d.summary.dischargedToday = x(d.summary.dischargedToday)
  for (const item of d.byDisposition) item.count = x(item.count)
  for (const b of d.barriers) b.affectedPatients = x(b.affectedPatients)
  for (const u of d.byUnit) {
    u.pendingDischarges = x(u.pendingDischarges)
    u.ordersPlaced = x(u.ordersPlaced)
    u.notYetExecuted = x(u.notYetExecuted)
  }
  write('discharge_disposition', d)
}

// ---------- transport ----------
{
  const t = read('transport')
  t.summary.patientsWaiting = x(t.summary.patientsWaiting)
  t.summary.completedToday = x(t.summary.completedToday)
  write('transport', t)
}

// ---------- workforce_health ----------
{
  const w = read('workforce_health')
  w.openPositions.totalOpen = x(w.openPositions.totalOpen)
  for (const r of w.openPositions.byRole) r.openCount = x(r.openCount)
  write('workforce_health', w)
}

// ---------- float_pool ----------
{
  const f = read('float_pool')
  f.summary.totalAvailable = x(f.summary.totalAvailable)
  f.summary.totalDeployed = x(f.summary.totalDeployed)
  f.summary.rnAvailable = x(f.summary.rnAvailable)
  f.summary.lpnAvailable = x(f.summary.lpnAvailable)
  f.summary.cnaAvailable = x(f.summary.cnaAvailable)
  write('float_pool', f)
}

// ---------- quality_events ----------
{
  const q = read('quality_events')
  q.summary.totalEventsThisMonth = x(q.summary.totalEventsThisMonth)
  q.summary.totalEventsLastMonth = x(q.summary.totalEventsLastMonth)
  for (const t of q.byType) {
    t.count = x(t.count)
    t.benchmark = x(t.benchmark)
  }
  write('quality_events', q)
}

// ---------- readmissions ----------
{
  const r = read('readmissions')
  r.summary.totalReadmissions30Days = x(r.summary.totalReadmissions30Days)
  r.summary.totalDischarges30Days = x(r.summary.totalDischarges30Days)
  for (const d of r.byDiagnosis) d.readmissionCount = x(d.readmissionCount)
  r.highRiskPatients.count = x(r.highRiskPatients.count)
  r.highRiskPatients.flaggedForFollowUp = x(r.highRiskPatients.flaggedForFollowUp)
  write('readmissions', r)
}

// ---------- forecast (non-per-unit; per-unit re-generated by other script) ----------
{
  const f = read('forecast')
  for (const h of f.next24Hours) {
    h.predictedAdmissions = x(h.predictedAdmissions)
    h.predictedDischarges = x(h.predictedDischarges)
    h.predictedCensus = x(h.predictedCensus)
  }
  for (const d of f.next72Hours) {
    d.predictedAdmissions = x(d.predictedAdmissions)
    d.predictedDischarges = x(d.predictedDischarges)
    d.predictedPeakCensus = x(d.predictedPeakCensus)
  }
  for (const s of f.scheduledAdmissions) s.count = x(s.count)
  write('forecast', f)
}

// ---------- map_layout ----------
{
  const m = read('map_layout')
  m.mapMeta.totalBeds = x(m.mapMeta.totalBeds)
  write('map_layout', m)
}

console.log(`Scaled all count-based fields by ${SCALE}x.`)
