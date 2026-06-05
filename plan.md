# 🏗️ Patient Volume Management Dashboard — Build Plan
*Instructions for GitHub Copilot in VS Code*

---

## Overview

This document is the step-by-step build plan for the **Patient Volume Management Dashboard**. It is intended to be used as a Copilot instruction reference inside VS Code. Follow each phase in order. Do not skip ahead — later phases depend on the foundation established in earlier ones.

The application is a **fully self-contained Vue 3 web application** using Vuetify 3, Vue-Chartjs, Vue-ECharts, Pinia, and Vite. All data is local JSON. There are no external API calls of any kind.

---

## Tech Stack Reference

| **Layer** | **Technology** |
|---|---|
| Framework | Vue 3 (Composition API) |
| UI Library | Vuetify 3 |
| Design System | Material Design 3 |
| Standard Charts | Vue-Chartjs + Chart.js |
| Advanced Charts | Vue-ECharts + Apache ECharts |
| State Management | Pinia |
| Build Tool | Vite |
| Icons | @mdi/font (Material Design Icons) |
| Date Utility | date-fns |
| Data | Local JSON files only |

---

## Phase 1: Project Scaffolding & Configuration

### 1.1 Initialize the Project

```bash
npm create vite@latest patient-volume-dashboard -- --template vue
cd patient-volume-dashboard
npm install
```

### 1.2 Install All Dependencies

```bash
npm install vuetify@^3 @mdi/font
npm install vue-chartjs chart.js
npm install vue-echarts echarts
npm install pinia
npm install date-fns
npm install @vitejs/plugin-vue
```

### 1.3 Configure Vite

Update `vite.config.js` to support Vue and Vuetify:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### 1.4 Configure Vuetify Plugin

Create `src/plugins/vuetify.js`:

- Import `createVuetify` from `vuetify`
- Import `aliases` and `mdi` from `vuetify/iconsets/mdi`
- Import `@mdi/font/css/materialdesignicons.css`
- Import all Vuetify component styles: `vuetify/styles`
- Define a **custom Material Design theme** called `hospitalTheme` with the following color palette:
  - `primary`: `#1565C0` (deep blue — clinical, trustworthy)
  - `secondary`: `#00838F` (teal — healthcare accent)
  - `success`: `#2E7D32` (green — RAG green)
  - `warning`: `#F57F17` (amber — RAG amber)
  - `error`: `#C62828` (red — RAG red)
  - `background`: `#F5F7FA` (light grey — clean clinical background)
  - `surface`: `#FFFFFF`
  - `info`: `#0277BD`
- Export the configured Vuetify instance

### 1.5 Configure ECharts Plugin

Create `src/plugins/echarts.js`:

- Import the specific ECharts components needed (tree-shakeable imports):
  - `CanvasRenderer`
  - `LineChart`, `BarChart`, `GaugeChart`, `HeatmapChart`, `PieChart`
  - `GridComponent`, `TooltipComponent`, `LegendComponent`, `VisualMapComponent`, `TitleComponent`, `DataZoomComponent`
- Use `use()` from `echarts/core` to register all components
- Export the configured ECharts instance for use in Vue-ECharts components

### 1.6 Configure Main Entry Point

Update `src/main.js`:

- Import and create the Vue app
- Import and register the Vuetify plugin
- Import and register Pinia (`createPinia()`)
- Import `VChart` from `vue-echarts` and register it globally as `'VChart'`
- Mount the app to `#app`

### 1.7 Configure Global Styles

Update `src/assets/styles/main.css`:

- Set `body` background to match the theme background color `#F5F7FA`
- Set base font to `Roboto, sans-serif` (Material Design standard)
- Add a utility class `.rag-green`, `.rag-amber`, `.rag-red` with appropriate background and text colors matching the theme
- Add a `.kpi-tile` class for consistent card padding and typography
- Ensure no margin/padding resets conflict with Vuetify's built-in normalization

### 1.8 Update index.html

- Set the page `<title>` to `Patient Volume Dashboard`
- Ensure the `#app` div is present
- Do not add any CDN links — all assets are local

---

## Phase 2: Local Data Files

> All files go in `src/data/`. All values are synthetic. Data must be internally consistent across files — e.g., bed counts in `census.json` must align with unit names used in `staffing.json`, `forecast.json`, etc.

### Hospital Reference Model

All data files should reflect the following hospital structure:

**Units:**
| **Unit ID** | **Unit Name** | **Type** | **Total Beds** |
|---|---|---|---|
| `ED` | Emergency Department | Emergency | 40 |
| `ICU` | Intensive Care Unit | Critical Care | 20 |
| `MED1` | Medical Unit 1 | Medical/Surgical | 32 |
| `MED2` | Medical Unit 2 | Medical/Surgical | 32 |
| `SURG1` | Surgical Unit 1 | Surgical | 28 |
| `SURG2` | Surgical Unit 2 | Surgical | 28 |
| `PEDS` | Pediatrics | Pediatric | 24 |
| `OB` | Obstetrics | OB/GYN | 20 |

**Total Hospital Beds: 224**

---

### 2.1 `census.json`

Structure: Array of unit objects, each containing:
- `unitId`, `unitName`, `type`, `totalBeds`
- `occupiedBeds`, `availableBeds`, `pendingDischarges`, `pendingAdmissions`
- `occupancyPercent` (calculated: occupiedBeds / totalBeds)
- `status`: `"green"` | `"amber"` | `"red"` based on occupancy thresholds:
  - Green: < 80%
  - Amber: 80–89%
  - Red: ≥ 90%
- `lastUpdated`: ISO timestamp

Make the data interesting — have ICU at red (~95%), ED at amber (~85%), MED1 at red (~92%), others varied.

---

### 2.2 `admissions.json`

Structure:
- `todaysSummary`: object with `totalAdmissions`, `totalDischarges`, `netChange`, `date`
- `hourlyTrend`: array of 24 objects (one per hour, 12AM–11PM) each with `hour`, `admissions`, `discharges`
- `last30Days`: array of 30 objects each with `date`, `admissions`, `discharges`, `census`

Make the hourly trend show a realistic pattern — low overnight, rising from 7AM, peak around 10AM–2PM, tapering in the evening.

---

### 2.3 `ed_volume.json`

Structure:
- `current`: object with `patientsInED`, `waitingToBeSeenCount`, `boardingCount` (waiting for inpatient bed), `avgDoorToProviderMins`, `avgDoorToBedMins`, `avgDoorToDispositionMins`, `surgeStatus`: `"normal"` | `"elevated"` | `"surge"`
- `hourlyVolume`: array of 24 objects with `hour`, `arrivals`, `departures`, `totalInDept`
- `waitTimeTrend`: array of last 7 days, each with `date`, `avgWaitMins`

Set current state to `surgeStatus: "elevated"` to make the scenario interesting.

---

### 2.4 `staffing.json`

Structure: Array of unit objects, each containing:
- `unitId`, `unitName`
- `currentShift`: object with `shiftName` (`"Day"` | `"Evening"` | `"Night"`), `scheduledRNs`, `actualRNs`, `scheduledAides`, `actualAides`, `openRNSlots`, `openAideSlots`
- `nurseToPatientRatio`: object with `current` (e.g., `1:5`), `target` (e.g., `1:4`), `status`: `"green"` | `"amber"` | `"red"`
- `overtimeAlerts`: array of staff objects with `name`, `hoursWorked`, `otThreshold` (40), `approaching`: boolean
- `nextShiftCoverage`: object with `scheduledRNs`, `confirmedRNs`, `gapCount`

Include at least 2 units with open RN slots and 1 unit with a ratio at red status.

---

### 2.5 `float_pool.json`

Structure:
- `available`: array of staff objects each with `id`, `name`, `role` (`"RN"` | `"LPN"` | `"CNA"`), `certifications` (array), `availableForUnits` (array of unitIds), `shiftAvailable` (`"Day"` | `"Evening"` | `"Night"` | `"Any"`)
- `deployed`: array of staff objects with same structure plus `deployedTo` unitId and `deployedAt` timestamp
- `summary`: object with `totalAvailable`, `totalDeployed`, `rnAvailable`, `lpnAvailable`, `cnaAvailable`

---

### 2.6 `ancillary_lab.json`

Structure:
- `summary`: object with `avgTurnaroundMins`, `target`: 60, `status`: `"green"` | `"amber"` | `"red"`, `pendingOrders`, `criticalResultsPending`
- `byTestType`: array of objects with `testName`, `avgTurnaroundMins`, `target`, `volume`, `status`
  - Include: CBC, BMP, Troponin, Blood Culture, PT/INR, Urinalysis
- `trend`: array of last 7 days with `date`, `avgTurnaroundMins`

Set Troponin and Blood Culture to amber/red to create realistic tension.

---

### 2.7 `ancillary_radiology.json`

Structure:
- `summary`: object with `pendingOrders`, `avgReadTimeMins`, `target`: 45, `status`, `criticalFindingsPending`
- `byModality`: array of objects with `modality` (X-Ray, CT, MRI, Ultrasound), `pendingCount`, `avgReadTimeMins`, `target`, `status`
- `trend`: array of last 7 days with `date`, `avgReadTimeMins`

Set MRI to red (long wait) and CT to amber.

---

### 2.8 `ancillary_pharmacy.json`

Structure:
- `summary`: object with `pendingOrders`, `avgDispenseTimeMins`, `target`: 30, `status`, `urgentPending`
- `byOrderType`: array with `orderType` (Routine, Urgent, Stat, IV Admixture), `pendingCount`, `avgDispenseTimeMins`, `target`, `status`
- `trend`: array of last 7 days with `date`, `avgDispenseTimeMins`

---

### 2.9 `ancillary_evs.json`

Structure:
- `summary`: object with `pendingCleans`, `avgTurnaroundMins`, `target`: 35, `status`, `bedsReadyToday`, `bedsCleanedToday`
- `byUnit`: array of unit objects with `unitId`, `unitName`, `pendingCleans`, `avgTurnaroundMins`, `status`
- `trend`: array of last 7 days with `date`, `avgTurnaroundMins`

Set overall status to red (68 min avg vs 35 min target) to match Scenario 3 in the brief.

---

### 2.10 `transport.json`

Structure:
- `summary`: object with `patientsWaiting`, `avgWaitTimeMins`, `target`: 20, `status`, `completedToday`
- `queue`: array of patient transport requests with `id`, `patientId` (anonymized e.g. `"PT-0042"`), `fromUnit`, `toUnit` (or `"Discharge"`), `priority` (`"Routine"` | `"Urgent"`), `waitTimeMins`, `status` (`"Waiting"` | `"InProgress"`)
- `trend`: array of last 7 days with `date`, `avgWaitTimeMins`

Include 12 patients in the queue to match Scenario 3.

---

### 2.11 `discharge_disposition.json`

Structure:
- `summary`: object with `totalPendingDischarges`, `targetDischargesByNoon`, `dischargedToday`
- `byDisposition`: array with `disposition` (Home, Home Health, SNF, Rehab, Transfer, AMA), `count`, `avgDelayHours`
- `barriers`: array of barrier objects with `barrierType` (e.g., `"SNF Placement"`, `"Transportation"`, `"Medication Reconciliation"`, `"Family Meeting Pending"`), `affectedPatients`, `avgDelayHours`
- `byUnit`: array of unit objects with `unitId`, `unitName`, `pendingDischarges`, `ordersPlaced`, `notYetExecuted`

Include 8 patients pending SNF placement to match Scenario 3.

---

### 2.12 `forecast.json`

Structure:
- `next24Hours`: array of 24 hourly objects with `hour`, `predictedAdmissions`, `predictedDischarges`, `predictedCensus`, `confidenceLevel` (`"high"` | `"medium"` | `"low"`)
- `next72Hours`: array of 3 daily objects (today, tomorrow, day after) with `date`, `dayLabel`, `predictedAdmissions`, `predictedDischarges`, `predictedPeakCensus`, `predictedPeakTime`, `surgeRisk` (`"low"` | `"medium"` | `"high"`)
- `byUnit`: array of unit forecast objects with `unitId`, `unitName`, `currentOccupancy`, `predictedOccupancy24h`, `predictedOccupancy48h`, `predictedOccupancy72h`, `trend` (`"stable"` | `"increasing"` | `"decreasing"`)
- `scheduledAdmissions`: array with `date`, `type` (Elective Surgery, Planned Transfer, Scheduled Procedure), `count`

Make Saturday show `surgeRisk: "high"` and ICU show `trend: "increasing"` to support Scenario 6.

---

### 2.13 `patient_satisfaction.json`

Structure:
- `overall`: object with `hcahpsScore`, `pressGaneyScore`, `trend` (`"improving"` | `"stable"` | `"declining"`)
- `byDomain`: array with `domain` (Communication with Nurses, Communication with Doctors, Responsiveness, Pain Management, Discharge Information, Overall Rating), `score`, `benchmark`, `status`
- `last4Weeks`: array of 4 weekly objects with `weekLabel`, `score`
- `byUnit`: array of unit objects with `unitId`, `unitName`, `score`, `benchmark`, `status`

---

### 2.14 `readmissions.json`

Structure:
- `summary`: object with `rate30Day`, `benchmark`, `status`, `totalReadmissions30Days`, `totalDischarges30Days`
- `byDiagnosis`: array with `diagnosis`, `readmissionCount`, `rate`, `benchmark`, `status`
  - Include: CHF, COPD, Pneumonia, Sepsis, Hip/Knee Replacement, Diabetes
- `byUnit`: array of unit objects with `unitId`, `unitName`, `rate`, `benchmark`, `status`
- `trend`: array of last 6 months with `month`, `rate`
- `highRiskPatients`: object with `count`, `flaggedForFollowUp`

---

### 2.15 `quality_events.json`

Structure:
- `summary`: object with `totalEventsThisMonth`, `totalEventsLastMonth`, `trend`
- `byType`: array with `eventType` (Patient Fall, HAI, Medication Error, Near Miss, Pressure Injury), `count`, `benchmark`, `status`
- `recentEvents`: array of last 10 events with `id`, `date`, `type`, `unit`, `severity` (`"Low"` | `"Medium"` | `"High"`), `status` (`"Open"` | `"Under Review"` | `"Closed"`)
- `coreMeasures`: array with `measure` (Sepsis Bundle, VTE Prophylaxis, Hand Hygiene, Glycemic Control), `compliancePercent`, `target`, `status`

---

### 2.16 `workforce_health.json`

Structure:
- `summary`: object with `overtimePercent`, `turnoverRate`, `vacancyRate`, `engagementScore`, `burnoutRiskLevel` (`"low"` | `"medium"` | `"high"`)
- `byUnit`: array of unit objects with `unitId`, `unitName`, `overtimePercent`, `turnoverRate`, `vacancyRate`, `burnoutRisk`
- `trend`: object with `overtimeTrend` (array of last 6 months), `turnoverTrend` (array of last 6 months)
- `openPositions`: object with `totalOpen`, `byRole` (array with `role`, `openCount`, `avgDaysOpen`)

Set at least one unit to `burnoutRisk: "high"` and show overtime trending upward over 6 months.

---

## Phase 3: Pinia Store

### 3.1 Create `src/stores/dashboardStore.js`

This is the central state store for the entire application. It:

- Imports all 16 JSON data files statically (e.g., `import censusData from '@/data/census.json'`)
- Uses `defineStore('dashboard', () => { ... })` (Composition API style)
- Exposes the following **reactive state**:
  - `census` — ref initialized from `censusData`
  - `admissions` — ref initialized from `admissionsData`
  - `edVolume` — ref initialized from `edVolumeData`
  - `staffing` — ref initialized from `staffingData`
  - `floatPool` — ref initialized from `floatPoolData`
  - `ancillaryLab` — ref initialized from `ancillaryLabData`
  - `ancillaryRadiology` — ref initialized from `ancillaryRadiologyData`
  - `ancillaryPharmacy` — ref initialized from `ancillaryPharmacyData`
  - `ancillaryEvs` — ref initialized from `ancillaryEvsData`
  - `transport` — ref initialized from `transportData`
  - `dischargeDisposition` — ref initialized from `dischargeDispositionData`
  - `forecast` — ref initialized from `forecastData`
  - `patientSatisfaction` — ref initialized from `patientSatisfactionData`
  - `readmissions` — ref initialized from `readmissionsData`
  - `qualityEvents` — ref initialized from `qualityEventsData`
  - `workforceHealth` — ref initialized from `workforceHealthData`
  - `activeRole` — ref initialized to `'director'` (options: `'director'` | `'chargeNurse'` | `'cmo'`)
  - `lastSimulated` — ref with current timestamp
  - `simulatorActive` — ref boolean, default `true`

- Exposes the following **computed values**:
  - `hospitalOccupancyPercent` — total occupied beds / total beds across all units
  - `totalPendingDischarges` — sum of pendingDischarges across all units
  - `criticalAlerts` — array of any unit or service currently at `status: "red"`
  - `activeAlertCount` — count of red status items across all data domains

- Exposes the following **actions**:
  - `setRole(role)` — updates `activeRole`
  - `runSimulatorTick()` — applies small random deltas to key metrics (see Phase 4)
  - `startSimulator()` — starts a `setInterval` calling `runSimulatorTick()` every 30 seconds
  - `stopSimulator()` — clears the interval

---

## Phase 4: Data Simulator

### 4.1 Create `src/utils/dataSimulator.js`

This utility is called by the Pinia store's `runSimulatorTick()` action. It accepts the current store state and returns mutated copies of key data objects with small realistic changes applied.

**Rules for simulation:**
- Changes should be **small and realistic** — census counts should shift by ±1 or ±2, wait times by ±2–5 minutes, never jumping dramatically
- Values should **respect logical boundaries** — occupiedBeds cannot exceed totalBeds, cannot go below 0
- `occupancyPercent` and `status` fields must be **recalculated** after any bed count change
- RAG `status` fields must be **re-evaluated** against thresholds after any value change
- `lastUpdated` timestamps should be updated to current time on each tick

**Fields to simulate on each tick:**
- `census`: ±1–2 occupiedBeds per unit (recalculate occupancyPercent and status)
- `edVolume.current`: ±1–3 patientsInED, ±2–5 mins on avgDoorToProviderMins
- `transport.summary`: ±1 patientsWaiting, ±2 mins avgWaitTimeMins
- `ancillary_lab.summary`: ±2–3 mins avgTurnaroundMins
- `ancillary_evs.summary`: ±2–5 mins avgTurnaroundMins (recalculate status)
- `staffing`: no change on tick (staffing is shift-based, not real-time)

### 4.2 Create `src/utils/thresholds.js`

Export a constant object defining all RAG thresholds used across the app:

```js
export const THRESHOLDS = {
  occupancy: { green: 80, amber: 90 },         // % — below green is green, between is amber, above amber is red
  nurseRatio: { green: 4, amber: 5 },           // patients per nurse
  labTurnaround: { green: 60, amber: 90 },      // minutes
  radReadTime: { green: 45, amber: 75 },        // minutes
  pharmDispense: { green: 30, amber: 45 },      // minutes
  evsTurnaround: { green: 35, amber: 55 },      // minutes
  transportWait: { green: 20, amber: 35 },      // minutes
  readmissionRate: { green: 0.12, amber: 0.18 },// decimal
  hcahps: { green: 85, amber: 75 },             // score out of 100
  coreMeasure: { green: 95, amber: 85 },        // % compliance
}
```

### 4.3 Create `src/utils/formatters.js`

Export utility functions:
- `formatPercent(value)` — returns `"92%"`
- `formatTime(mins)` — returns `"1h 32m"` or `"45m"`
- `formatRatio(current, target)` — returns `"1:5"`
- `formatDate(dateString)` — returns `"Jun 5"` using date-fns
- `formatDateTime(isoString)` — returns `"Jun 5, 6:42 AM"` using date-fns
- `getRAGColor(status)` — returns Vuetify color string: `'success'` | `'warning'` | `'error'`
- `getRAGHex(status)` — returns hex: `'#2E7D32'` | `'#F57F17'` | `'#C62828'`

---

## Phase 5: Layout & Shell Components

### 5.1 `src/App.vue`

- Use `<v-app>` as root with `:theme="'hospitalTheme'"`
- Include `<AppSidebar />` and `<AppHeader />`
- Use `<v-main>` to wrap `<RouterView />` or directly render `<DashboardView />`
- Import and use the dashboard store — call `store.startSimulator()` on `onMounted`
- Call `store.stopSimulator()` on `onUnmounted`

### 5.2 `src/components/layout/AppHeader.vue`

Build using Vuetify components:
- `<v-app-bar>` with `color="primary"` and `elevation="2"`
- Left side: Hospital name `"Regional Medical Center"` and subtitle `"Operations Dashboard"`
- Center: Display `hospitalOccupancyPercent` as a live KPI chip — color driven by RAG status
- Right side:
  - `<RoleSwitcher />` component
  - A live clock displaying current time (updated every second using `setInterval`)
  - A bell icon (`mdi-bell`) with a badge showing `activeAlertCount` from the store — use `color="error"` if > 0
  - A green/grey pulsing dot indicator showing simulator is active/inactive

### 5.3 `src/components/layout/AppSidebar.vue`

Build using:
- `<v-navigation-drawer>` permanent, `width="220"`
- Logo / app name at top
- `<v-list>` with navigation items for each of the 5 tabs:
  - 🏥 Real-Time Overview (`mdi-monitor-dashboard`)
  - 📈 Capacity Forecast (`mdi-chart-timeline-variant`)
  - 👩‍⚕️ Staffing & Resources (`mdi-account-group`)
  - 🔗 Ancillary Services (`mdi-medical-bag`)
  - ⭐ Quality & Outcomes (`mdi-clipboard-pulse`)
- Each nav item should show a RAG status dot if that section has any red alerts
- Active item highlighted with `color="primary"`
- Bottom of sidebar: simulator toggle switch (on/off)

### 5.4 `src/components/layout/RoleSwitcher.vue`

- `<v-btn-toggle>` with 3 options: `Director`, `Charge Nurse`, `CMO`
- Bound to `store.activeRole` via `setRole()`
- Each role has a distinct icon:
  - Director: `mdi-account-tie`
  - Charge Nurse: `mdi-stethoscope`
  - CMO: `mdi-hospital-building`
- Changing role updates the store and causes role-filtered views to reactively update

---

## Phase 6: Shared Widget Components

Build these reusable components before building the tab views. Each should accept props and emit no events unless noted.

### 6.1 `src/components/widgets/KPITile.vue`

Props: `title`, `value`, `subtitle`, `icon`, `status` (`'green'`|`'amber'`|`'red'`|`'neutral'`), `trend` (optional: `'up'`|`'down'`|`'stable'`)

- Render as a `<v-card>` with consistent padding
- Left side: large value text + title + subtitle
- Right side: icon in a colored circle matching status
- Bottom: optional trend arrow with small trend label
- Left border accent color driven by `status`

### 6.2 `src/components/widgets/RAGIndicator.vue`

Props: `status`, `label`, `size` (`'sm'`|`'md'`|`'lg'`)

- Renders a colored dot + label
- Colors: green `#2E7D32`, amber `#F57F17`, red `#C62828`
- Pulses (CSS animation) when status is `'red'`

### 6.3 `src/components/widgets/AlertBanner.vue`

Props: `alerts` (array of `{ message, severity, unit }`)

- Renders as a `<v-alert>` stack
- `severity` maps to Vuetify `type`: `'error'`|`'warning'`|`'info'`
- Dismissible per alert
- Only renders if `alerts.length > 0`
- Positioned at the top of whichever tab it appears in

### 6.4 `src/components/widgets/CensusGauge.vue`

Props: `unitName`, `occupancyPercent`, `occupiedBeds`, `totalBeds`, `status`

- Uses **Vue-ECharts** gauge chart
- Arc goes from 0–100%
- Color zones: 0–79 green, 80–89 amber, 90–100 red
- Center label shows percentage
- Below gauge: `occupiedBeds / totalBeds` beds label

### 6.5 `src/components/widgets/TrendLineChart.vue`

Props: `chartData` (Chart.js dataset format), `labels`, `title`, `height`, `showLegend`

- Uses **Vue-Chartjs** `<Line>` component
- Clean minimal styling — no gridlines on Y axis, subtle X axis
- Supports dual datasets (e.g., admissions + discharges on same chart)
- Responsive: `maintainAspectRatio: false`

### 6.6 `src/components/widgets/OccupancyHeatmap.vue`

Props: `forecastData` (array of unit × time period occupancy values)

- Uses **Vue-ECharts** heatmap
- X-axis: time periods (Now, +24h, +48h, +72h)
- Y-axis: unit names
- Color scale: green → amber → red mapped to occupancy %
- Cell labels show occupancy percentage
- Tooltip shows unit name, time, predicted occupancy

### 6.7 `src/components/widgets/StaffingRatioCard.vue`

Props: `unitName`, `currentRatio`, `targetRatio`, `status`, `openSlots`, `nextShiftGap`

- `<v-card>` with unit name header
- Large ratio display (e.g., `1:5`) colored by status
- Target ratio shown below in muted text
- Open slots shown as `<v-chip color="error">` if > 0
- Next shift gap indicator

### 6.8 `src/components/widgets/ForecastChart.vue`

Props: `forecastData`, `title`, `showConfidence`

- Uses **Vue-ECharts** line chart with area fill
- Shows predicted census line for next 24 hours
- If `showConfidence` is true, render a shaded confidence band around the line
- X-axis: hours, Y-axis: patient count
- Threshold line at 90% capacity shown as dashed red line

---

## Phase 7: Tab Views

### 7.1 `src/components/tabs/RealTimeOverview.vue`

**Purpose:** Live situational awareness — the first screen users see.

**Layout (use Vuetify grid `<v-row>` / `<v-col>`):**

**Row 1 — Alert Banner (full width)**
- `<AlertBanner>` populated with any `criticalAlerts` from the store

**Row 2 — Hospital-Wide KPI Tiles (4 across)**
- Total Census: `occupiedBeds / totalBeds` with RAG status
- ED Wait Time: `avgDoorToProviderMins` with RAG status
- Pending Discharges: count with trend
- Active Alerts: `activeAlertCount` with error color if > 0

**Row 3 — Unit Census Gauges (4 across, 2 rows = all 8 units)**
- One `<CensusGauge>` per unit
- Show `pendingDischarges` and `pendingAdmissions` as chips below each gauge

**Row 4 — Two columns:**
- Left (7/12): Admissions vs Discharges today — `<TrendLineChart>` using `admissions.hourlyTrend`
- Right (5/12): ED Volume panel — current ED stats as KPI tiles (patients in ED, boarding count, surge status chip)

**Row 5 — Two columns:**
- Left (6/12): Pending Discharges by Unit — `<v-data-table>` with unitName, pendingDischarges, ordersPlaced, notYetExecuted
- Right (6/12): Transport Queue summary — patientsWaiting, avgWaitTime, top 5 queue items as a list

**Role filtering:**
- `chargeNurse` role: hide hospital-wide KPI row, show only their unit's gauge prominently
- `cmo` role: show only the KPI tiles and trend chart, hide granular unit details

---

### 7.2 `src/components/tabs/CapacityForecast.vue`

**Purpose:** Predictive planning for the next 24–72 hours.

**Row 1 — Forecast KPI Tiles (3 across)**
- Predicted Peak Census (next 24h)
- Weekend Surge Risk (from `forecast.next72Hours`)
- Scheduled Admissions (next 24h count)

**Row 2 — Full width: 24-Hour Forecast Chart**
- `<ForecastChart>` using `forecast.next24Hours`
- Show predicted census with confidence band
- Overlay dashed line at 90% capacity threshold
- Overlay markers for scheduled admission blocks

**Row 3 — Two columns:**
- Left (7/12): 72-Hour Occupancy Heatmap — `<OccupancyHeatmap>` using `forecast.byUnit`
- Right (5/12): 72-Hour Summary cards — one `<v-card>` per day (Today, Tomorrow, Day After) showing predictedPeakCensus, surgeRisk chip, predictedPeakTime

**Row 4 — Two columns:**
- Left (6/12): Scheduled Admissions table — date, type, count using `forecast.scheduledAdmissions`
- Right (6/12): Unit Forecast Trend — `<v-data-table>` showing each unit's current vs predicted occupancy at 24h/48h/72h with trend arrows

---

### 7.3 `src/components/tabs/StaffingAlignment.vue`

**Purpose:** Staffing coverage visibility and gap management.

**Row 1 — Staffing KPI Tiles (4 across)**
- Total Open RN Slots (across all units)
- Float Pool Available
- Staff Approaching OT
- Units at Unsafe Ratio (red status count)

**Row 2 — Full width: Nurse-to-Patient Ratio Cards**
- Grid of `<StaffingRatioCard>` for each unit (2 rows of 4)
- Show current shift name above the grid

**Row 3 — Two columns:**
- Left (6/12): Shift Coverage Gap Table — `<v-data-table>` with unitName, currentShift, scheduledRNs, actualRNs, openRNSlots — highlight rows with open slots in amber/red
- Right (6/12): Float Pool Panel
  - Summary chips: RNs available, LPNs available, CNAs available
  - List of available float staff with name, role, certifications, and available units as chips
  - Deployed staff shown with a `mdi-check-circle` green icon

**Row 4 — Two columns:**
- Left (6/12): Overtime Alert List — staff approaching OT threshold shown as `<v-alert type="warning">` cards with name, hours worked, threshold
- Right (6/12): Next Shift Coverage — for each unit, show scheduled vs confirmed RNs with gap count highlighted

**Role filtering:**
- `chargeNurse`: show only their unit's staffing data
- `cmo`: show only summary KPI tiles and ratio overview

---

### 7.4 `src/components/tabs/AncillaryServices.vue`

**Purpose:** Identify bottlenecks in support services that slow throughput.

**Row 1 — Ancillary Summary KPI Tiles (4 across)**
- Lab Avg TAT vs target with RAG
- Radiology Avg Read Time vs target with RAG
- Pharmacy Avg Dispense Time vs target with RAG
- EVS Avg Turnaround vs target with RAG

**Row 2 — Four equal columns (one per service): Summary Cards**
Each card (`<v-card>`) shows:
- Service name + status RAG dot
- Key metric (avg time) prominently
- Pending count
- Mini sparkline trend (last 7 days) using Vue-Chartjs `<Line>`

**Row 3 — Tabbed detail section using `<v-tabs>` with 4 tabs: Lab | Radiology | Pharmacy | EVS**

Each tab contains:
- **Lab tab:** `<v-data-table>` of byTestType with testName, avgTurnaroundMins, target, volume, status RAG chip + 7-day trend line chart
- **Radiology tab:** `<v-data-table>` of byModality with modality, pendingCount, avgReadTimeMins, target, status RAG chip + 7-day trend line chart
- **Pharmacy tab:** `<v-data-table>` of byOrderType with orderType, pendingCount, avgDispenseTimeMins, target, status RAG chip + 7-day trend line chart
- **EVS tab:** `<v-data-table>` of byUnit with unitName, pendingCleans, avgTurnaroundMins, status RAG chip + 7-day trend line chart

**Row 4 — Two columns:**
- Left (6/12): Discharge Disposition Breakdown — doughnut chart (Vue-Chartjs) of `dischargeDisposition.byDisposition`
- Right (6/12): Discharge Barriers Table — `<v-data-table>` with barrierType, affectedPatients, avgDelayHours — sorted by affectedPatients descending

---

### 7.5 `src/components/tabs/QualityOutcomes.vue`

**Purpose:** Performance accountability — trends, outcomes, and quality metrics.

**Row 1 — Quality KPI Tiles (4 across)**
- Overall HCAHPS Score vs benchmark with RAG
- 30-Day Readmission Rate vs benchmark with RAG
- Hospital-Wide ALOS (calculate from census/admissions data)
- Quality Events This Month vs last month with trend

**Row 2 — Two columns:**
- Left (7/12): HCAHPS Domain Scores — horizontal bar chart (Vue-Chartjs `<Bar>` horizontal) showing each domain score vs benchmark
- Right (5/12): Quadruple Aim Radar Chart — Vue-Chartjs `<Radar>` with 4 axes: Health Outcomes, Patient Experience, Care Team Experience, Cost of Care — scored 0–100

**Row 3 — Two columns:**
- Left (6/12): 30-Day Readmission Rate by Diagnosis — `<v-data-table>` with diagnosis, rate, benchmark, status RAG chip
- Right (6/12): Readmission Rate Trend — `<TrendLineChart>` using `readmissions.trend` (last 6 months)

**Row 4 — Two columns:**
- Left (6/12): Core Measure Compliance — `<v-data-table>` with measure, compliancePercent, target, status — use `<v-progress-linear>` in each row to visualize compliance
- Right (6/12): Quality Events by Type — `<v-data-table>` with eventType, count, benchmark, status RAG chip

**Row 5 — Two columns:**
- Left (6/12): Clinician Burnout Indicators — unit-level table with overtimePercent, turnoverRate, vacancyRate, burnoutRisk chip
- Right (6/12): Recent Quality Events — last 10 events list with date, type, unit, severity chip, status chip

**Role filtering:**
- `chargeNurse`: hide readmission and burnout sections, show only quality events for their unit
- `cmo`: show all sections, add a summary callout card at the top with overall system health score

---

## Phase 8: Dashboard View & Navigation

### 8.1 `src/views/DashboardView.vue`

- Use `<v-container fluid>` as wrapper
- Implement tab navigation using `<v-tabs>` + `<v-window>` pattern
- Each `<v-window-item>` renders one of the 5 tab components
- Tab bar should be sticky below the app header
- Active tab stored as local `ref` — not in the store
- Tab icons match the sidebar navigation icons
- On mobile/tablet breakpoints, tabs collapse to icon-only display

---

## Phase 9: Final Wiring & Polish

### 9.1 Connect Simulator to UI

- In `App.vue`, confirm `store.startSimulator()` is called on `onMounted`
- Verify that components consuming `store.census`, `store.edVolume`, `store.transport`, and `store.ancillaryEvs` reactively update when the simulator ticks
- The live clock in `AppHeader` should update every second independently of the simulator

### 9.2 Role-Based View Filtering

- In each tab component, use `computed(() => store.activeRole)` to conditionally render sections
- Use `v-if` directives to show/hide sections based on role
- Role changes should be instant with no page reload

### 9.3 RAG Status Consistency

- All RAG status values displayed in the UI must be derived from `thresholds.js` constants — no hardcoded color strings in templates
- Use `getRAGColor(status)` from `formatters.js` to map status to Vuetify color props
- Ensure `RAGIndicator` pulse animation only fires on `'red'` status

### 9.4 Responsive Layout

- Use Vuetify's grid breakpoints throughout:
  - `cols="12"` on xs (mobile)
  - `cols="6"` on sm (tablet)
  - `cols="3"` or `cols="4"` on md+ (desktop) for KPI tiles
- Charts should use `height` props that scale appropriately
- Navigation drawer should collapse to icons-only on tablet

### 9.5 Loading States

- Wrap each tab's content in a `<v-skeleton-loader>` that shows briefly on first mount (simulate a 600ms load using `setTimeout` in `onMounted`)
- This adds realism to the prototype experience

### 9.6 Empty States

- If any data array is empty (e.g., no alerts, no float pool staff available), render a friendly `<v-empty-state>` with an appropriate icon and message

### 9.7 Tooltips & Contextual Help

- Add `<v-tooltip>` to all RAG indicators explaining what the threshold is (e.g., "Red: > 90% occupancy")
- Add `<v-tooltip>` to all KPI tile icons explaining what the metric measures
- This supports usability for new users unfamiliar with clinical terminology

---

## Phase 10: README

### 10.1 Create `README.md`

Include:
- Project name and description
- Screenshot placeholder note
- Tech stack list
- Setup instructions:
  ```bash
  npm install
  npm run dev
  ```
- Description of the 5 dashboard tabs
- Description of the role switcher and what each role sees
- Description of the data simulator and how to toggle it
- Note that all data is synthetic and locally generated
- File structure overview referencing the `src/data/` directory
- Note on how to modify thresholds in `src/utils/thresholds.js`

---

## Build Order Summary

Follow this sequence strictly:

```
Phase 1  → Project setup, Vite config, plugin configuration
Phase 2  → All 16 local JSON data files
Phase 3  → Pinia store (dashboardStore.js)
Phase 4  → Utility files (dataSimulator.js, thresholds.js, formatters.js)
Phase 5  → Layout shell (App.vue, AppHeader, AppSidebar, RoleSwitcher)
Phase 6  → Shared widget components (KPITile, RAGIndicator, AlertBanner, etc.)
Phase 7  → Tab view components (all 5 tabs)
Phase 8  → DashboardView wiring and tab navigation
Phase 9  → Final wiring, role filtering, polish, responsive, loading states
Phase 10 → README
```

---

## Key Constraints — Copilot Must Respect These at All Times

1. **No external API calls** — ever. All data comes from `src/data/*.json`
2. **No CDN links** — all packages installed via npm and imported in JS/Vue files
3. **Vue 3 Composition API only** — do not use Options API
4. **Vuetify components for all layout and UI** — do not introduce custom CSS frameworks
5. **Vue-Chartjs for standard charts, Vue-ECharts for advanced visuals** — do not mix in other charting libraries
6. **All RAG thresholds must reference `thresholds.js`** — no hardcoded threshold values in components
7. **All date/time formatting must use `date-fns`** — no `moment.js`, no raw `Date.toLocaleString()`
8. **Pinia store is the single source of truth** — components do not maintain their own copies of data
9. **Data files must remain internally consistent** — unit IDs, bed counts, and names must match across all JSON files
10. **Simulator must never fetch data** — it only mutates in-memory reactive state already loaded from local JSON

---


## Updated Tech Stack Reference

Add this row to the existing Tech Stack table:

| **Layer** | **Technology** |
|---|---|
| Hospital Map | Inline SVG + Vue reactive bindings + CSS transitions |

---

## Phase 11: Hospital Map

### 11.1 New Data Files

#### 11.1.1 `src/data/map_layout.json`

Structure:
- `mapWidth`: `900`
- `mapHeight`: `580`
- `units`: array of unit zone objects, each with:
  - `id` — must exactly match unitId values used across all other data files (`ED`, `ICU`, `MED1`, `MED2`, `SURG1`, `SURG2`, `PEDS`, `OB`)
  - `label` — display name
  - `sublabel` — unit type (e.g., `"Emergency"`, `"Critical Care"`)
  - `x`, `y`, `width`, `height` — SVG rectangle coordinates
  - `labelX`, `labelY` — coordinates for the unit name text label centered inside the zone
  - `sublabelX`, `sublabelY` — coordinates for the sublabel text
  - `floor`: `1`
- `corridors`: array of corridor rectangles with `x`, `y`, `width`, `height`
- `structuralElements`: array of nurse stations and landmarks with `type`, `x`, `y`, `width`, `height`, `label`
- `mapMeta`: object with `facilityName`: `"Regional Medical Center"`, `floorLabel`: `"Floor 1 — Clinical Units"`, `totalBeds`: `224`

Use these coordinates for unit zones:

| **Unit** | **x** | **y** | **width** | **height** |
|---|---|---|---|---|
| ED | 20 | 380 | 220 | 160 |
| ICU | 260 | 380 | 160 | 160 |
| MED1 | 20 | 200 | 180 | 160 |
| MED2 | 220 | 200 | 180 | 160 |
| SURG1 | 440 | 200 | 160 | 160 |
| SURG2 | 620 | 200 | 160 | 160 |
| PEDS | 440 | 380 | 160 | 160 |
| OB | 620 | 380 | 160 | 160 |

Add horizontal corridor rectangles at `y: 360, height: 20` spanning full map width, and a vertical corridor at `x: 420, width: 20` spanning full map height. Add small `40x40` nurse station squares at logical corridor intersections.

#### 11.1.2 Extend `src/data/forecast.json`

Add a new top-level key `hourlyByUnit` — an array of objects, one per unit, each containing:
- `unitId` — matches unit IDs above
- `unitName`
- `hours`: array of **73 objects** (index 0 = now, index 72 = 72 hours from now), each with:
  - `hoursFromNow`: integer 0–72
  - `predictedOccupiedBeds`: integer
  - `predictedOccupancyPercent`: float
  - `predictedStatus`: `"green"` | `"amber"` | `"red"`

Author the data to tell a realistic story:
- **Hour 0** values must exactly match current `census.json` occupied bed counts
- **ICU**: stays red (~95%) through hour 48, eases slightly to amber by hour 72
- **ED**: surges to red at hours 8–14 (daytime), eases overnight, surges again hours 32–38
- **MED1**: trends from current red toward critical (>95%) by hour 24, stays red
- **MED2**: gradually increases from amber toward red by hour 48
- **SURG1/SURG2**: drop to green overnight (hours 12–20, no elective surgeries), rise again after
- **PEDS/OB**: remain stable in green-to-amber range throughout

---

### 11.2 New Utility: `src/utils/colorInterpolator.js`

Export the following — use only vanilla JavaScript arithmetic, no external color libraries:

- `lerp(a, b, t)` — returns `a + (b - a) * t`
- `hexToRgb(hex)` — converts hex string to `{ r, g, b }` object
- `rgbToHex(r, g, b)` — converts RGB integers to hex string
- `occupancyToColor(percent)` — accepts 0–100, returns a hex color using smooth RGB interpolation across three stops:
  - `0%` → `#2E7D32` (deep green)
  - `80%` → `#F57F17` (amber)
  - `100%` → `#C62828` (deep red)
  - Interpolate between stop 1→2 for values 0–80, between stop 2→3 for values 80–100. Use `lerp` on each RGB channel independently.
- `HEATMAP_GRADIENT` — exported constant array of `{ percent, hex }` objects at 0, 40, 80, 90, 100 for use in the legend component

---

### 11.3 New Widget: `src/components/widgets/HeatmapLegend.vue`

- Imports `HEATMAP_GRADIENT` from `colorInterpolator.js`
- Renders a horizontal SVG `<linearGradient>` bar using the gradient stops
- Below bar: percentage labels at `0%`, `40%`, `80%`, `90%`, `100%`
- Above bar: zone labels `"Available"`, `"Filling"`, `"Near Capacity"`, `"Critical"`
- Wrapped in a compact `<v-card>` with subtle border
- Designed to sit below the map without taking significant vertical space

---

### 11.4 New Widget: `src/components/widgets/UnitDetailPanel.vue`

Props: `unitId` (String | null), `selectedHour` (Number, 0–72)

- When `unitId` is null: render a `<v-empty-state>` with `mdi-map-marker` icon and text `"Select a unit on the map to view details"`
- When `unitId` is set, read data from the Pinia store:
  - **Header:** Unit name + type badge + RAG status chip colored by `predictedStatus` at `selectedHour`
  - **Occupancy display:** Large `occupiedBeds / totalBeds` + occupancy percent — sourced from `store.census` when `selectedHour === 0`, from `store.forecast.hourlyByUnit` when `selectedHour > 0`
  - **KPI chips:** Nurse ratio, pending discharges, pending admissions at the selected hour
  - **72-hour sparkline:** Vue-ECharts line chart of `predictedOccupancyPercent` across all 73 hours. Include a dashed red threshold line at 90%. Highlight the current `selectedHour` position with a vertical marker line.
  - **Forecast warning:** If any hour within the next 24hrs from `selectedHour` is predicted red, show `<v-alert type="warning">` with the projected time
  - **Footer label:** `"Live Data"` chip when `selectedHour === 0`, `"Forecast Data"` chip when `selectedHour > 0`

---

### 11.5 New Tab: `src/components/tabs/HospitalMap.vue`

#### Component State (`setup()`)
```js
const store = useDashboardStore()
const selectedUnitId = ref(null)
const hoveredUnitId = ref(null)
const selectedHour = ref(0)
const isPlaying = ref(false)
let playInterval = null
```

#### Key Computed Values & Methods
- `mapUnits`, `corridors`, `structuralElements` — imported statically from `map_layout.json`
- `getOccupancyAtHour(unitId, hour)` — when `hour === 0` return from `store.census`; when `hour > 0` return from `store.forecast.hourlyByUnit`
- `getUnitFill(unitId)` — calls `occupancyToColor(getOccupancyAtHour(unitId, selectedHour.value))`
- `getUnitStatus(unitId)` — returns RAG status string for the unit at selected hour
- `currentTimeLabel` — `"Now — [time]"` when `selectedHour === 0`; formatted date/time string using `date-fns` `addHours` + `format` when `selectedHour > 0`
- `alertUnits` — units at `status: "red"` in `store.census` (live only, not forecast-driven)
- Play mode methods:
```js
function startPlay() {
  isPlaying.value = true
  playInterval = setInterval(() => {
    if (selectedHour.value >= 72) { stopPlay(); return }
    selectedHour.value++
  }, 800)
}
function stopPlay() {
  isPlaying.value = false
  clearInterval(playInterval)
  playInterval = null
}
function resetSlider() {
  stopPlay()
  selectedHour.value = 0
}
onUnmounted(() => { if (playInterval) clearInterval(playInterval) })
```

#### Template — Build in This Order

**Section A — Page Header Row**
- Left: `"Hospital Capacity Map"` title + `"Regional Medical Center — Floor 1"` subtitle
- Right: `<v-chip color="success">LIVE</v-chip>` when `selectedHour === 0`; `<v-chip color="info">FORECAST</v-chip>` when `selectedHour > 0`

**Section B — Time Slider Row** (full-width `<v-card>`)
- `<v-slider>` with `v-model="selectedHour"`, `min="0"`, `max="72"`, `step="1"`, `color="primary"`, thumb label showing `currentTimeLabel`, tick marks at 0/12/24/36/48/60/72 with labels `"Now"` / `"+12h"` / `"+24h"` etc.
- Play button (`mdi-play` / `mdi-pause`) toggling `startPlay` / `stopPlay`
- Reset button (`mdi-skip-backward`) calling `resetSlider`
- `currentTimeLabel` displayed in `text-h6` below the slider

**Section C — Map + Detail Panel Row**

Left (`cols="8"`): `<v-card>` containing `<svg viewBox="0 0 900 580" width="100%">` built in these sub-layers in order:
1. Background `<rect>` — full SVG area, `fill="#ECEFF1"`
2. Corridors — `v-for` over `corridors`, `<rect fill="#B0BEC5">`
3. Structural elements — `v-for` over `structuralElements`, `<rect fill="#78909C">` + `<text>` label
4. Unit zones — `v-for` over `mapUnits`:
```vue
<rect
  :key="unit.id"
  :x="unit.x" :y="unit.y"
  :width="unit.width" :height="unit.height"
  :fill="getUnitFill(unit.id)"
  :stroke="selectedUnitId === unit.id ? '#1565C0' : hoveredUnitId === unit.id ? '#455A64' : '#37474F'"
  :stroke-width="selectedUnitId === unit.id ? 3 : 1.5"
  rx="8"
  class="unit-zone"
  @mouseenter="hoveredUnitId = unit.id"
  @mouseleave="hoveredUnitId = null"
  @click="selectedUnitId = unit.id"
/>
```
5. Unit name labels — `v-for` over `mapUnits`, `<text>` at `labelX/labelY`, `font-size="13"`, `font-weight="600"`, `fill="white"`, `text-anchor="middle"`
6. Unit sublabels — `v-for` over `mapUnits`, `<text>` at `sublabelX/sublabelY`, `font-size="10"`, `fill="rgba(255,255,255,0.85)"`, `text-anchor="middle"`
7. Occupancy percent labels — `v-for` over `mapUnits`, `<text>` at bottom-center of each zone showing `getOccupancyAtHour(unit.id, selectedHour)` as `"XX%"`, `font-size="11"`, `fill="white"`, `font-weight="700"`
8. Alert pulse indicators — `v-for` over `alertUnits`, two concentric `<circle>` elements at top-right corner of unit zone: inner `r="7" fill="#C62828"`, outer `r="7" fill="none" stroke="#C62828"` with class `alert-pulse`
9. Map footer — single `<text>` at bottom center with `mapMeta.facilityName` + `mapMeta.floorLabel`

Right (`cols="4"`): `<UnitDetailPanel :unitId="selectedUnitId" :selectedHour="selectedHour" />`

**Section D — Legend Row** (full width)
- `<HeatmapLegend />` on the left
- Summary stat chips on the right showing count of green / amber / red units at the selected hour, e.g. `<v-chip color="success">4 Green</v-chip>`

#### Scoped CSS
```css
<style scoped>
.unit-zone {
  transition: fill 0.6s ease, stroke 0.2s ease, opacity 0.2s ease;
  cursor: pointer;
}
.unit-zone:hover {
  opacity: 0.88;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25));
}
@keyframes alert-pulse {
  0% { r: 7; opacity: 1; }
  100% { r: 16; opacity: 0; }
}
.alert-pulse {
  animation: alert-pulse 1.5s ease-out infinite;
}
svg {
  border-radius: 8px;
  background: #ECEFF1;
}
</style>
```
> ⚠️ **Critical:** The `transition: fill 0.6s ease` on `.unit-zone` is what creates the animated heatmap effect when the slider moves. Do not remove this or replace it with JavaScript-based animation. Vue updates the `:fill` binding and CSS handles all color animation automatically.

---

### 11.6 Register the Map Tab

#### In `src/components/layout/AppSidebar.vue`
Add a new nav list item in the 5th position (between Ancillary Services and Quality & Outcomes):
- Label: `"Hospital Map"`
- Icon: `mdi-map`
- RAG dot: show if any unit in `store.census` is currently `status: "red"`

#### In `src/views/DashboardView.vue`
- Add `"Hospital Map"` as the 5th tab, shifting Quality & Outcomes to 6th
- Add `<v-window-item>` rendering `<HospitalMap />`
- Import `HospitalMap` from `@/components/tabs/HospitalMap.vue`
- Tab icon: `mdi-map`

---

### 11.7 Update Pinia Store

#### In `src/stores/dashboardStore.js`
- Import `mapLayoutData` from `@/data/map_layout.json`
- Add `mapLayout` as a `ref` initialized from `mapLayoutData`
- Update `criticalAlerts` computed to also include units where `forecast.hourlyByUnit` shows a unit hitting red within the next 6 hours — tag these with `type: "forecast"` so they can be styled differently from live alerts in `AlertBanner.vue`

---

### 11.8 Simulator & Performance Notes

- The data simulator must **not** modify `forecast.hourlyByUnit` — forecast data is static and pre-authored
- The simulator continues to update `store.census` as before — the map's live view (slider at hour 0) automatically reflects these changes since it reads from `store.census`
- Verify that sliding from hour 0 → hour 1 → back to hour 0 correctly returns to live census values, not forecast values
- `getUnitFill()` is called for every unit on every slider move — keep `colorInterpolator.js` to simple arithmetic only, no loops or array operations, to ensure smooth slider drag performance
- If slider drag feels sluggish, wrap the `selectedHour` update in a 50ms `setTimeout` debounce using native JavaScript — no lodash required

---

## Updated Build Order Summary

Replace the existing Build Order Summary with this complete version:

```
Phase 1  → Project setup, Vite config, plugin configuration
Phase 2  → All 16 local JSON data files
Phase 3  → Pinia store (dashboardStore.js)
Phase 4  → Utility files (dataSimulator.js, thresholds.js, formatters.js)
Phase 5  → Layout shell (App.vue, AppHeader, AppSidebar, RoleSwitcher)
Phase 6  → Shared widget components (KPITile, RAGIndicator, AlertBanner, etc.)
Phase 7  → Tab view components (all 5 original tabs)
Phase 8  → DashboardView wiring and tab navigation
Phase 9  → Final wiring, role filtering, polish, responsive, loading states
Phase 10 → README
Phase 11 → Hospital Map (map_layout.json, forecast.json extension,
            colorInterpolator.js, HeatmapLegend.vue, UnitDetailPanel.vue,
            HospitalMap.vue, sidebar + tab registration, store update)
```

---

## Updated Key Constraints

Add these two items to the existing constraints list:

```
11. SVG fill animation must use CSS transitions only — do not use JavaScript
    setInterval or requestAnimationFrame to animate colors. The
    transition: fill 0.6s ease CSS rule handles all color animation
    automatically as Vue updates the :fill binding.

12. colorInterpolator.js must use only vanilla JavaScript arithmetic —
    no external color libraries (no chroma.js, no d3-color, no tinycolor).
    All color math is self-contained.
```

*This build plan is the complete technical instruction set for constructing the Patient Volume Management Dashboard. Begin with Phase 1 and proceed in order. Each phase builds on the last.*