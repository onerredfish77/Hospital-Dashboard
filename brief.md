# 📋 Patient Volume Management Dashboard — Project Brief

---

## 1. Project Overview

The **Patient Volume Management Dashboard** is a web-based operational tool designed for **Hospital Clinician Operations Leads and Department Directors**. It provides a unified, real-time and predictive view of patient volume, capacity, flow, staffing alignment, and ancillary service performance across hospital units and departments.

The tool is purpose-built to reduce the cognitive load on clinical operations leaders by surfacing the right data, at the right time, in a format that drives immediate, informed decision-making — replacing fragmented spreadsheets, siloed reports, and reactive huddle-based communication with a single, always-on operational command center.

> **Important:** This application is entirely **self-contained**. All data is generated and stored locally within the project. There are no external API calls, no third-party data services, no cloud platform dependencies, and no live EHR integrations. All datasets are authored and maintained as local files within the project directory.

---

## 2. Problem Statement

Hospital clinician operations leads and department directors face a daily challenge of managing unpredictable, high-stakes environments with limited real-time visibility. Key pain points include:

- **Fragmented data sources** — Patient flow, staffing, ancillary performance, and bed status data live in separate systems with no unified view
- **Reactive decision-making** — Leaders are often responding to problems (a full ED, a staffing gap, a lab backlog) after they have already impacted patient care
- **No predictive capability** — Current tools show what *has happened*, not what *is about to happen*
- **Alert fatigue** — Too many disconnected notifications with no prioritization or context
- **Time-consuming reporting** — Shift huddles and status checks consume time that could be spent on patient care and team leadership
- **Lack of role-appropriate views** — The same data needs to be presented differently for a charge nurse vs. a department director vs. a CMO

---

## 3. Goals & Objectives

### 🎯 Primary Goals
- Provide **real-time visibility** into patient volume, bed occupancy, and department capacity
- Enable **proactive, predictive planning** for the next 4, 8, 24, and 72 hours
- Surface **staffing alignment gaps** before they become patient safety or experience issues
- Identify **ancillary service bottlenecks** that slow throughput and extend length of stay
- Deliver a **role-layered experience** so each user sees what is most relevant to their scope of responsibility

### 📈 Success Metrics
| **Metric** | **Target Outcome** |
|---|---|
| Reduction in ED boarding time | Decrease average boarding wait by identifying bed availability faster |
| Improved bed turnover time | Reduce time from discharge to bed-ready through EVS visibility |
| Staffing gap response time | Reduce time to fill open shifts by surfacing gaps earlier |
| Discharge planning efficiency | Increase same-day discharge execution through pending discharge tracking |
| User adoption | Primary operations leads using the dashboard daily within 60 days of launch |
| Decision speed | Reduce time-to-decision in morning huddles and shift handoffs |

---

## 4. Target Users

### 👤 Primary Users

#### 1. Department Director / Clinician Operations Lead
- **Role:** Oversees day-to-day operations of one or more clinical departments or units
- **Responsibilities:** Staffing decisions, capacity planning, quality oversight, cross-department coordination
- **Needs:** High-level operational status, trend visibility, forecast data, escalation signals
- **Frustrations:** Spending time chasing data from multiple systems; finding out about problems too late

#### 2. Charge Nurse / Unit Supervisor
- **Role:** Manages real-time patient flow and staff assignments at the unit level
- **Responsibilities:** Bed assignments, patient handoffs, immediate staffing adjustments, ancillary coordination
- **Needs:** Live census, pending discharges, transport queues, nurse-to-patient ratios
- **Frustrations:** No single view of unit status; relying on phone calls and verbal updates

### 👥 Secondary Users

#### 3. Bed Management / Capacity Coordinator
- **Role:** Manages hospital-wide bed availability and patient placement
- **Needs:** Cross-unit occupancy, incoming admissions, discharge readiness, EVS turnaround
- **Frustrations:** Manually tracking bed status across units; delayed EVS notifications

#### 4. CMO / VP of Clinical Operations
- **Role:** Executive oversight of clinical performance and operational efficiency
- **Needs:** Summary KPIs, trend data, quality indicators, Quadruple Aim alignment
- **Frustrations:** Reports are retrospective and not actionable in the moment

#### 5. Nursing Supervisor / Float Pool Coordinator
- **Role:** Manages cross-unit staffing coverage and float pool deployment
- **Needs:** Shift coverage gaps, overtime alerts, float pool availability, volume-to-staffing alignment
- **Frustrations:** Reactive staffing decisions; no visibility into upcoming demand

---

## 5. Key Use Cases & Scenarios

### 🔵 Scenario 1: Morning Huddle Preparation
**User:** Department Director
**Situation:** It is 6:45 AM. The director is preparing for the 7:00 AM shift huddle and needs a rapid status update before the team arrives.
**How they use the tool:**
- Opens the **Real-Time Operations Overview** tab to check current census vs. capacity
- Reviews **pending discharges** to understand how many beds will free up in the next few hours
- Checks the **staffing alignment panel** to confirm shift coverage before the day begins
- Scans **ancillary service alerts** for any overnight lab or pharmacy delays that need follow-up

**Outcome:** Director walks into the huddle with a full situational picture and a prioritized action list — in under 5 minutes

---

### 🔵 Scenario 2: ED Surge Response
**User:** Clinician Operations Lead / Charge Nurse
**Situation:** The ED is reporting a surge in patient volume at 2:00 PM on a Tuesday. The operations lead needs to understand downstream inpatient impact immediately.
**How they use the tool:**
- The **ED Surge Indicator** on the forecast tab has already triggered a yellow alert
- They review **projected occupancy by unit** to identify which floors have capacity
- They check **pending discharges** and **transport queue** to accelerate bed turnover
- They pull up the **staffing alignment panel** to assess whether current staffing can absorb additional admissions
- They trigger a float pool redeployment based on the gap analysis

**Outcome:** Operations lead proactively redirects resources 45–60 minutes before the surge hits inpatient units, reducing boarding time

---

### 🔵 Scenario 3: Discharge Bottleneck Investigation
**User:** Department Director / Bed Management Coordinator
**Situation:** Occupancy is at 94% and the director notices that discharges are not moving despite multiple discharge orders being placed.
**How they use the tool:**
- Opens the **Ancillary Services Performance** tab
- Identifies that **EVS bed turnover time** is averaging 68 minutes vs. the 35-minute target (red status)
- Cross-references the **patient transport queue** and sees 12 patients waiting for transport
- Checks **discharge disposition status** and finds 8 patients are pending SNF placement
- Escalates EVS staffing and contacts the case management team for SNF placement support

**Outcome:** Director identifies three separate discharge bottlenecks in a single view and takes targeted action rather than a broad, unfocused response

---

### 🔵 Scenario 4: Staffing Gap Mitigation
**User:** Nursing Supervisor / Float Pool Coordinator
**Situation:** It is 10:00 PM and the overnight supervisor is reviewing coverage for the 11:00 PM shift. Two nurses have called out sick.
**How they use the tool:**
- Opens the **Staffing & Resource Alignment** tab
- The **shift coverage gap panel** shows two open RN slots on Med-Surg Unit 4B
- They check **float pool availability** and identify one qualified RN available
- They review the **nurse-to-patient ratio panel** to determine which unit is most at risk
- They use the **overtime tracker** to identify staff approaching but not yet at OT thresholds who could extend their shift

**Outcome:** Supervisor fills one slot from float pool and one via a voluntary extension, maintaining safe ratios before the shift begins

---

### 🔵 Scenario 5: Weekly Performance Review
**User:** Department Director / CMO
**Situation:** The director is preparing for a weekly operations review with the CMO and needs to present department performance trends.
**How they use the tool:**
- Opens the **Quality, Outcomes & Experience** tab
- Reviews **ALOS trends** by unit compared to benchmark
- Pulls **30-day readmission rates** by diagnosis group to identify high-risk cohorts
- Reviews **HCAHPS scores** trending over the past 4 weeks
- Checks **clinician burnout indicators** — overtime percentage and turnover rate are both trending up on one unit

**Outcome:** Director presents a data-driven narrative with specific areas of concern and proposed interventions, replacing a manually assembled report with a live dashboard view

---

### 🔵 Scenario 6: Predictive Capacity Planning
**User:** Department Director / Bed Management Coordinator
**Situation:** It is Wednesday afternoon and the director wants to plan ahead for the weekend, which historically sees higher medical admissions.
**How they use the tool:**
- Opens the **Capacity & Flow Forecast** tab
- Reviews the **72-hour predicted admissions forecast** which shows a projected 18% increase in medical admissions Saturday night
- Checks **scheduled admissions** for elective procedures already on the books
- Reviews **projected occupancy heatmap** showing ICU trending toward red by Saturday evening
- Proactively requests additional float pool coverage and aligns on overflow protocols

**Outcome:** Director avoids a weekend capacity crisis through mid-week proactive planning rather than Saturday night reactive scrambling

---

## 6. Dashboard Feature Summary

| **Feature / Tab** | **Primary User** | **Data Refresh** | **Core Value** |
|---|---|---|---|
| Real-Time Operations Overview | Charge Nurse, Ops Lead | Simulated live refresh | Live situational awareness |
| Capacity & Flow Forecast | Director, Bed Mgmt | Simulated hourly / 24–72 hr | Predictive planning |
| Staffing & Resource Alignment | Nursing Supervisor, Director | Simulated per shift / daily | Safe staffing assurance |
| Ancillary Services Performance | Ops Lead, Director | Simulated hourly / daily | Bottleneck identification |
| Quality, Outcomes & Experience | Director, CMO | Simulated daily / weekly | Performance accountability |

---

## 7. Local Data Architecture

All data powering this application is **authored, stored, and served entirely within the local project directory**. There are no calls to external APIs, cloud services, databases, or third-party platforms of any kind.

### 📁 Local Data Strategy

| **Data Domain** | **Local File** | **Format** |
|---|---|---|
| Patient census & bed occupancy | `src/data/census.json` | JSON |
| Admissions & discharges | `src/data/admissions.json` | JSON |
| ED volume & wait times | `src/data/ed_volume.json` | JSON |
| Staffing & shift coverage | `src/data/staffing.json` | JSON |
| Float pool availability | `src/data/float_pool.json` | JSON |
| Lab turnaround times | `src/data/ancillary_lab.json` | JSON |
| Radiology queue & read times | `src/data/ancillary_radiology.json` | JSON |
| Pharmacy dispensing times | `src/data/ancillary_pharmacy.json` | JSON |
| EVS bed turnover times | `src/data/ancillary_evs.json` | JSON |
| Patient transport queue | `src/data/transport.json` | JSON |
| Discharge disposition status | `src/data/discharge_disposition.json` | JSON |
| Forecast / predicted volume | `src/data/forecast.json` | JSON |
| HCAHPS / satisfaction scores | `src/data/patient_satisfaction.json` | JSON |
| Readmission rates | `src/data/readmissions.json` | JSON |
| Quality & safety events | `src/data/quality_events.json` | JSON |
| Clinician burnout indicators | `src/data/workforce_health.json` | JSON |

### 🔄 Simulated Data Refresh
- A **local data simulation utility** (`src/utils/dataSimulator.js`) will introduce realistic variability into key metrics on a configurable interval (e.g., every 30 seconds) to mimic the behavior of a live data feed
- No network calls are made — all simulation runs in-memory within the browser using the local dataset as a seed
- Simulated changes will include minor fluctuations in census counts, wait times, queue lengths, and staffing numbers to demonstrate the real-time nature of the dashboard
- The simulator is driven by **Vue's reactivity system**, ensuring all components that consume simulated data automatically re-render when values change

### 📊 Data Design Principles
- All datasets are **realistic but entirely synthetic** — no real patient, staff, or facility data is used at any point
- Data is structured to represent a **mid-sized regional hospital** with 8 inpatient units, an ED, ICU, and standard ancillary departments
- Datasets are designed to tell a **coherent operational story** — values across files are cross-referenced and consistent (e.g., discharge counts in `admissions.json` align with bed availability in `census.json`)
- Each dataset includes **historical trend data** (past 30 days) to support trend charts and weekly review scenarios
- Forecast data in `forecast.json` is **pre-authored** to represent plausible 24–72 hour projections based on the current simulated state

---

## 8. Technical Scope

- **Platform:** Web-based application built and run entirely in VS Code
- **Frontend Framework:** Vue.js 3 (Composition API, component-based architecture)
- **UI Component Library:** Vuetify 3 (Material Design component library — locally installed via npm)
- **Design System:** Material Design 3 via Vuetify — providing cards, navigation drawers, tabs, data tables, chips, alerts, and all layout primitives
- **Data Layer:** 100% local JSON files — no database, no backend server, no API calls
- **Data Simulation:** In-browser JavaScript utility leveraging Vue's reactivity system to introduce realistic variability to local data on a timed interval
- **Charting — Standard Charts:** Vue-Chartjs (Chart.js wrapper for Vue 3) — used for line charts, bar charts, doughnut charts, and KPI trend visualizations
- **Charting — Advanced Visuals:** Vue-ECharts (Apache ECharts wrapper for Vue 3) — used for heatmaps, gauge charts, complex multi-series forecasts, and occupancy visualizations
- **Build Tool:** Vite (fast local dev server with native Vue 3 support — no cloud build pipeline needed)
- **Package Management:** npm with all dependencies installed locally — no CDN links or remote script imports
- **Alerting:** In-app RAG (Red / Amber / Green) status indicators and Vuetify alert banners driven by local data thresholds defined in `src/utils/thresholds.js`
- **Role Simulation:** Vuetify-based role switcher component (Department Director, Charge Nurse, CMO) that filters and adjusts the dashboard view — no authentication required
- **Responsiveness:** Desktop-first layout using Vuetify's grid system with tablet-friendly breakpoints
- **State Management:** Vue's Composition API with `provide/inject` or Pinia (lightweight local store) for sharing dashboard state across components

### 📦 Key Dependencies (All Locally Installed via npm)

| **Package** | **Purpose** |
|---|---|
| `vue` | Core UI framework (v3, Composition API) |
| `vuetify` | Material Design component library (cards, tabs, nav, alerts, tables, grids) |
| `@mdi/font` | Material Design Icons — used throughout Vuetify components |
| `vue-chartjs` | Chart.js wrapper for Vue 3 — line, bar, doughnut, and radar charts |
| `chart.js` | Peer dependency for vue-chartjs |
| `vue-echarts` | Apache ECharts wrapper for Vue 3 — heatmaps, gauges, advanced forecasting visuals |
| `echarts` | Peer dependency for vue-echarts |
| `pinia` | Lightweight local state management for Vue 3 |
| `vite` | Local development server and build tool |
| `@vitejs/plugin-vue` | Vite plugin for Vue 3 single-file component support |
| `date-fns` | Local date/time formatting and manipulation |

---

## 9. Visualization Library Usage Guide

To maintain consistency across the dashboard, the following guidance defines which charting library to use for each visual type:

### Vue-Chartjs — Use For:
- **Line charts** — Trend lines for census, wait times, ALOS, satisfaction scores over time
- **Bar charts** — Admissions vs. discharges by day, staffing levels by unit, ancillary TAT comparisons
- **Doughnut / Pie charts** — Bed occupancy breakdown, discharge disposition split, float pool utilization
- **Radar charts** — Quadruple Aim performance overview

### Vue-ECharts — Use For:
- **Gauge charts** — Live census percentage, ED occupancy level, current nurse-to-patient ratio
- **Heatmaps** — Unit-by-unit occupancy heatmap across the 72-hour forecast window
- **Multi-series area charts** — Forecast overlays showing predicted vs. actual admissions
- **Sankey / flow diagrams** — Patient flow from ED → inpatient units (if included in future iterations)
- **Calendar heatmaps** — 30-day historical volume and readmission patterns

---

## 10. Project File Structure (Proposed)

```
patient-volume-dashboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── RoleSwitcher.vue
│   │   ├── tabs/
│   │   │   ├── RealTimeOverview.vue
│   │   │   ├── CapacityForecast.vue
│   │   │   ├── StaffingAlignment.vue
│   │   │   ├── AncillaryServices.vue
│   │   │   └── QualityOutcomes.vue
│   │   ├── widgets/
│   │   │   ├── KPITile.vue
│   │   │   ├── RAGIndicator.vue
│   │   │   ├── AlertBanner.vue
│   │   │   ├── CensusGauge.vue
│   │   │   ├── TrendLineChart.vue
│   │   │   ├── OccupancyHeatmap.vue
│   │   │   ├── StaffingRatioCard.vue
│   │   │   └── ForecastChart.vue
│   ├── data/
│   │   ├── census.json
│   │   ├── admissions.json
│   │   ├── ed_volume.json
│   │   ├── staffing.json
│   │   ├── float_pool.json
│   │   ├── ancillary_lab.json
│   │   ├── ancillary_radiology.json
│   │   ├── ancillary_pharmacy.json
│   │   ├── ancillary_evs.json
│   │   ├── transport.json
│   │   ├── discharge_disposition.json
│   │   ├── forecast.json
│   │   ├── patient_satisfaction.json
│   │   ├── readmissions.json
│   │   ├── quality_events.json
│   │   └── workforce_health.json
│   ├── plugins/
│   │   ├── vuetify.js
│   │   └── echarts.js
│   ├── stores/
│   │   └── dashboardStore.js
│   ├── utils/
│   │   ├── dataSimulator.js
│   │   ├── thresholds.js
│   │   └── formatters.js
│   ├── views/
│   │   └── DashboardView.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 11. Out of Scope (for MVP)

- Any external API calls or network requests of any kind
- Live EHR / Epic integration
- Authentication, SSO, or user login
- HIPAA-compliant data handling (synthetic data only)
- Native mobile application
- Multi-hospital / health system rollup views
- Real AI/ML model training or inference
- Write-back, order entry, or any data mutation capabilities
- Cloud deployment or hosting

---

## 12. Assumptions & Constraints

- All data used during development is **100% synthetic** — no real patient, staff, or facility data is used at any point
- The application is a **self-contained prototype / proof of concept** to demonstrate the dashboard concept and user experience
- The build prioritizes **visual fidelity and UX realism** over backend complexity
- Role-based access control is **simulated via a Vuetify UI toggle** — no real authentication system
- Forecast and predictive panels use **pre-authored local data** to represent what a model-driven feed would look like in production
- All npm packages are **installed locally** — the application runs fully offline once dependencies are installed
- The simulated data refresh runs **in-browser** using JavaScript intervals tied to Vue's reactivity system — no server-side processes required
- Vuetify's **Material Design theming** will be configured with a clean, clinical color palette appropriate for a healthcare operations context — avoiding overly consumer-oriented styling

---

## 13. Glossary

| **Term** | **Definition** |
|---|---|
| **ADT** | Admission, Discharge, Transfer — the core patient movement data type modeled in local JSON files |
| **ALOS** | Average Length of Stay — average number of days a patient remains admitted |
| **Census** | The current count of admitted patients in a unit or facility |
| **Composition API** | Vue 3's modern approach to component logic using `setup()`, `ref()`, and `computed()` |
| **ED Boarding** | When ED patients are waiting for an inpatient bed while still occupying ED space |
| **EVS** | Environmental Services — the team responsible for cleaning and turning over beds |
| **Float Pool** | A group of cross-trained staff who can be deployed to any unit based on need |
| **HCAHPS** | Hospital Consumer Assessment of Healthcare Providers and Systems — patient satisfaction survey |
| **LOS** | Length of Stay |
| **Material Design** | Google's open-source design system implemented in this project via Vuetify 3 |
| **Pinia** | Vue 3's recommended lightweight state management library — used to share reactive dashboard data across components |
| **Quadruple Aim** | Framework measuring health outcomes, patient experience, care team experience, and cost of care |
| **RAG Status** | Red / Amber / Green — a traffic light system for at-a-glance status indicators |
| **SNF** | Skilled Nursing Facility — a post-acute care destination for patients not ready to go home |
| **Data Simulator** | A local JavaScript utility (`dataSimulator.js`) that introduces realistic variability into the local JSON datasets on a timed interval using Vue's reactivity system |
| **Local Data Layer** | The collection of JSON files stored within `src/data/` that serve as the sole data source for the entire application |
| **Vue-Chartjs** | A Vue 3 wrapper for Chart.js used for standard chart types (line, bar, doughnut) |
| **Vue-ECharts** | A Vue 3 wrapper for Apache ECharts used for advanced visuals (gauges, heatmaps, forecast charts) |
| **Vuetify** | A Vue 3 UI component library built on Material Design, providing all layout, navigation, and UI primitives |

---

Sure! Here are two clean, complete, ready-to-paste sections — one for each file.

---

# 📋 PASTE INTO PROJECT BRIEF
*Add everything below as a single block at the end of your existing Project Brief, before the closing italicized note.*

---

## 6b. Hospital Map Feature Detail

The **Hospital Map** is a spatial, interactive visualization of the hospital's physical layout rendered as a schematic SVG diagram. It provides a bird's-eye view of capacity conditions across all units simultaneously, with the ability to project those conditions forward in time using a time slider.

#### 🗺️ Map Rendering Approach
The map is built as an **inline SVG within a Vue component**. Each hospital unit is represented as a labeled rectangular zone positioned to reflect a realistic schematic layout of the facility. The SVG is hand-authored using coordinates defined in `map_layout.json` — no external mapping libraries are required. The map operates in two layers:

- **Layer 1 — Static Structure:** Corridors, unit boundary rectangles, room labels, floor labels, and navigation landmarks. These never change.
- **Layer 2 — Reactive Heatmap Overlay:** The fill color of each unit zone is Vue-bound to a computed color function driven by occupancy data. As occupancy changes — either through the live simulator or the time slider — fill colors transition smoothly via CSS animation.

#### ⏱️ Time Slider & Forecast Mode
A **Vuetify `<v-slider>`** below the map header allows the user to scrub forward in time from **Now (0)** through **+72 hours** in 1-hour increments. As the slider moves:

- The heatmap colors update to reflect **forecasted occupancy** from `forecast.json` hourly data
- A timestamp label updates in real time showing the projected date and time being viewed
- A visual **"NOW" marker** on the slider distinguishes current state from forecast state
- Units trending toward capacity show progressively deeper red as the slider advances
- A **Play/Pause button** auto-advances the slider hour by hour at 800ms intervals, creating a time-lapse animation of how capacity is expected to evolve

#### 🎨 Color & Animation System
Occupancy percentage is mapped to a **smooth color gradient** using linear interpolation across three color stops:

| **Occupancy** | **Color** | **Meaning** |
|---|---|---|
| 0 – 79% | Green → Yellow-Green | Healthy capacity |
| 80 – 89% | Amber | Approaching capacity |
| 90 – 100% | Red | At or over capacity |

Color transitions between states are animated via **CSS `transition: fill 0.6s ease`** on each SVG unit zone — no animation library required. The result is a fluid, professional heatmap that visually communicates urgency through color intensity.

#### 💬 Unit Detail Panel
Clicking any unit zone on the map opens a **side detail panel** (right 4/12 columns) showing:
- Unit name, type, and current RAG status chip
- Live or projected occupancy (beds occupied / total beds)
- Nurse-to-patient ratio at the selected time
- Pending discharges and pending admissions at the selected time
- A **Vue-ECharts mini sparkline** showing the unit's occupancy trajectory across the full 72-hour forecast window
- Alert indicators if the unit is projected to hit red status within the forecast window

#### 🚨 Alert Pulse Indicators
Units currently at red status display a **pulsing alert circle** overlaid on their zone in the SVG. This uses a CSS keyframe animation and is independent of the time slider — it always reflects the current live state, not the forecast state.

#### ▶️ Play Mode
A Play button auto-advances the time slider from the current position through 72 hours, allowing the user to watch the heatmap evolve as a time-lapse. The interval clears automatically at hour 72 or when the user clicks Pause.

#### 🔁 Role Behavior
- **All roles** see the full map
- **Charge Nurse** role highlights their assigned unit with a blue selection border on load
- **Director / CMO** roles see the map in full with no pre-selection

---

## Updated Section 6 — Dashboard Feature Summary

| **Feature / Tab** | **Primary User** | **Data Refresh** | **Core Value** |
|---|---|---|---|
| Real-Time Operations Overview | Charge Nurse, Ops Lead | Simulated live refresh | Live situational awareness |
| Capacity & Flow Forecast | Director, Bed Mgmt | Simulated hourly / 24–72 hr | Predictive planning |
| Staffing & Resource Alignment | Nursing Supervisor, Director | Simulated per shift / daily | Safe staffing assurance |
| Ancillary Services Performance | Ops Lead, Director | Simulated hourly / daily | Bottleneck identification |
| Quality, Outcomes & Experience | Director, CMO | Simulated daily / weekly | Performance accountability |
| 🗺️ Hospital Map | All roles | Simulated live + 72hr forecast | Spatial capacity awareness |

---

## Updated Section 7 — Additional Local Data Files

Add these two rows to the existing Local Data Architecture table:

| **Data Domain** | **Local File** | **Format** |
|---|---|---|
| Hospital map layout & SVG coordinates | `src/data/map_layout.json` | JSON |
| Hourly unit forecast (72hr, per unit) | `src/data/forecast.json` — extended with `hourlyByUnit` key | JSON |

---

## Updated Section 9 — Additional Project Files

Add these entries to the existing file structure tree:

```
src/
├── components/
│   ├── tabs/
│   │   └── HospitalMap.vue              ← NEW
│   ├── widgets/
│   │   ├── UnitDetailPanel.vue          ← NEW
│   │   └── HeatmapLegend.vue            ← NEW
├── data/
│   └── map_layout.json                  ← NEW
├── utils/
│   └── colorInterpolator.js             ← NEW
```

---

## Updated Section 13 — Additional Glossary Terms

Add these rows to the existing glossary table:

| **Term** | **Definition** |
|---|---|
| **Schematic SVG Map** | A simplified, diagrammatic floor plan rendered as inline SVG — not an architectural drawing, but a purpose-built spatial layout for data visualization |
| **Color Interpolation** | The mathematical process of smoothly calculating a color between two or more color stops based on a value — used to create the green → amber → red heatmap gradient |
| **Time Slider** | A Vuetify `<v-slider>` component that controls which hour of forecast data (0–72) is used to color the hospital map heatmap |
| **Play Mode** | An auto-advance feature that increments the time slider every 800ms, animating the heatmap as a time-lapse of projected capacity |
| **map_layout.json** | A local JSON file defining the SVG coordinates, dimensions, and metadata for each hospital unit zone on the schematic map |
| **colorInterpolator.js** | A local utility that calculates smooth hex color values between green, amber, and red based on an occupancy percentage input |

---



*This project brief serves as the foundational reference document for all subsequent planning, design, and development work on the Patient Volume Management Dashboard. The application is fully self-contained — no external services, APIs, or live data connections are required at any stage. The next artifact to be produced is the **Build Plan**, which will translate this brief into a structured, step-by-step technical implementation guide for Vue.js, Vuetify, Vue-Chartjs, Vue-ECharts, and Vite.*