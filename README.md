# Patient Volume Management Dashboard

A self-contained Vue 3 web application providing real-time and predictive operational visibility for hospital clinician operations leads, charge nurses, and CMOs.

> All data is **synthetic and stored locally** under `src/data/`. The app makes no external API calls and runs fully offline once dependencies are installed.

> _Screenshots: add to `docs/` and link here once captured._

## Tech Stack

- **Vue 3** (Composition API)
- **Vuetify 3** (Material Design 3)
- **Pinia** (state management)
- **Vue-Chartjs** + Chart.js — line, bar, doughnut, radar
- **Vue-ECharts** + Apache ECharts — gauges, heatmaps, forecasts
- **Vite** (dev server / build)
- **date-fns** (date utilities)
- **@mdi/font** (Material Design Icons)

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Dashboard Tabs

| Tab | Primary User | Purpose |
|---|---|---|
| **Real-Time Overview** | Charge Nurse, Ops Lead | Live census, ED status, pending discharges, transport queue |
| **Capacity Forecast** | Director, Bed Mgmt | 24h/72h predictions, weekend surge risk, scheduled admissions |
| **Staffing & Resources** | Nursing Supervisor | Ratios, open slots, float pool, overtime, next-shift coverage |
| **Ancillary Services** | Ops Lead, Director | Lab / Radiology / Pharmacy / EVS performance + discharge barriers |
| **Quality & Outcomes** | Director, CMO | HCAHPS, readmissions, core measures, quality events, burnout |

## Role Switcher

The header includes a role toggle that filters each tab's content:

- **Director** — full operational view (default)
- **Charge Nurse** — unit-focused view (defaults to MED1); hides hospital-wide rollups
- **CMO** — executive summary view; KPI tiles and trend rollups, hides granular operational detail

Switching roles updates the dashboard reactively with no reload.

## Data Simulator

`src/utils/dataSimulator.js` introduces small realistic deltas (±1–2 beds, ±2–5 minutes) to the live census, ED, transport, lab, and EVS state every 30 seconds. The simulator runs entirely in-browser, mutating Pinia store state via Vue's reactivity system — no network calls.

Toggle the simulator from the **Live simulator** switch at the bottom of the sidebar.

## Project Structure

```
src/
├── App.vue                        # App shell (v-app, sidebar, header, view)
├── main.js                        # Vue + Pinia + Vuetify + ECharts + ChartJS bootstrap
├── assets/styles/main.css         # Global styles, RAG utility classes
├── components/
│   ├── layout/                    # AppHeader, AppSidebar, RoleSwitcher
│   ├── tabs/                      # 5 dashboard tab views
│   └── widgets/                   # Reusable KPI tile, gauge, heatmap, etc.
├── data/                          # 16 synthetic JSON datasets (single source of truth)
├── plugins/                       # vuetify, echarts, chartjs setup
├── stores/dashboardStore.js       # Pinia store — state, computed alerts, simulator control
├── utils/
│   ├── dataSimulator.js           # Per-tick mutations
│   ├── thresholds.js              # All RAG threshold constants
│   └── formatters.js              # Date / time / percent / RAG color helpers
└── views/DashboardView.vue        # Tab navigation + window items
```

## Data Files

| File | Domain |
|---|---|
| `census.json` | Per-unit bed occupancy |
| `admissions.json` | Hourly + 30-day trend |
| `ed_volume.json` | ED current + hourly + wait time trend |
| `staffing.json` | Per-unit ratios, OT alerts, next-shift coverage |
| `float_pool.json` | Available + deployed flex staff |
| `ancillary_lab.json` / `ancillary_radiology.json` / `ancillary_pharmacy.json` / `ancillary_evs.json` | Service TAT |
| `transport.json` | Patient transport queue |
| `discharge_disposition.json` | Pending discharges, barriers, by unit |
| `forecast.json` | 24h hourly + 72h daily + by-unit predictions |
| `patient_satisfaction.json` | HCAHPS by domain + unit |
| `readmissions.json` | 30-day rates by diagnosis + unit + 6-month trend |
| `quality_events.json` | Events by type + recent log + core measures |
| `workforce_health.json` | Overtime, turnover, vacancy, burnout risk |

## Customising Thresholds

All RAG thresholds live in [`src/utils/thresholds.js`](src/utils/thresholds.js). Adjusting a value there updates every RAG indicator and color across the app — no template-level changes required.

```js
export const THRESHOLDS = {
  occupancy: { green: 80, amber: 90 },
  evsTurnaround: { green: 35, amber: 55 },
  // ...
}
```

## Constraints

- 100% local — no APIs, no CDN, no backend
- Synthetic data only
- Pinia is the single source of truth — components do not maintain their own data copies
