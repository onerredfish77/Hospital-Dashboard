import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

let registered = false

export function ensureChartJs() {
  if (registered) return
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
  )

  ChartJS.defaults.color = '#E3E8F2'
  ChartJS.defaults.font.family = 'Roboto, Helvetica Neue, Arial, sans-serif'
  ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.08)'

  ChartJS.defaults.plugins.tooltip.backgroundColor = '#1A2236'
  ChartJS.defaults.plugins.tooltip.titleColor = '#E3E8F2'
  ChartJS.defaults.plugins.tooltip.bodyColor = '#E3E8F2'
  ChartJS.defaults.plugins.tooltip.borderColor = '#243049'
  ChartJS.defaults.plugins.tooltip.borderWidth = 1

  ChartJS.defaults.plugins.legend.labels.color = '#E3E8F2'

  if (ChartJS.defaults.scales) {
    if (ChartJS.defaults.scales.linear) {
      ChartJS.defaults.scales.linear.grid = {
        ...(ChartJS.defaults.scales.linear.grid || {}),
        color: 'rgba(255, 255, 255, 0.08)',
      }
      ChartJS.defaults.scales.linear.ticks = {
        ...(ChartJS.defaults.scales.linear.ticks || {}),
        color: '#E3E8F2',
      }
    }
    if (ChartJS.defaults.scales.category) {
      ChartJS.defaults.scales.category.grid = {
        ...(ChartJS.defaults.scales.category.grid || {}),
        color: 'rgba(255, 255, 255, 0.08)',
      }
      ChartJS.defaults.scales.category.ticks = {
        ...(ChartJS.defaults.scales.category.ticks || {}),
        color: '#E3E8F2',
      }
    }
    if (ChartJS.defaults.scales.radialLinear) {
      ChartJS.defaults.scales.radialLinear.grid = {
        ...(ChartJS.defaults.scales.radialLinear.grid || {}),
        color: 'rgba(255, 255, 255, 0.12)',
      }
      ChartJS.defaults.scales.radialLinear.angleLines = {
        ...(ChartJS.defaults.scales.radialLinear.angleLines || {}),
        color: 'rgba(255, 255, 255, 0.12)',
      }
      ChartJS.defaults.scales.radialLinear.pointLabels = {
        ...(ChartJS.defaults.scales.radialLinear.pointLabels || {}),
        color: '#E3E8F2',
      }
      ChartJS.defaults.scales.radialLinear.ticks = {
        ...(ChartJS.defaults.scales.radialLinear.ticks || {}),
        color: '#E3E8F2',
        backdropColor: 'transparent',
      }
    }
  }

  registered = true
}
