export function lerp(a, b, t) {
  return a + (b - a) * t
}

export function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return { r, g, b }
}

export function rgbToHex(r, g, b) {
  const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const STOP_GREEN = hexToRgb('#2E7D32')
const STOP_AMBER = hexToRgb('#F57F17')
const STOP_RED = hexToRgb('#C62828')

export function occupancyToColor(percent) {
  const p = Math.max(0, Math.min(100, percent))
  if (p <= 80) {
    const t = p / 80
    return rgbToHex(
      lerp(STOP_GREEN.r, STOP_AMBER.r, t),
      lerp(STOP_GREEN.g, STOP_AMBER.g, t),
      lerp(STOP_GREEN.b, STOP_AMBER.b, t)
    )
  }
  const t = (p - 80) / 20
  return rgbToHex(
    lerp(STOP_AMBER.r, STOP_RED.r, t),
    lerp(STOP_AMBER.g, STOP_RED.g, t),
    lerp(STOP_AMBER.b, STOP_RED.b, t)
  )
}

export const HEATMAP_GRADIENT = [
  { percent: 0, hex: occupancyToColor(0) },
  { percent: 40, hex: occupancyToColor(40) },
  { percent: 80, hex: occupancyToColor(80) },
  { percent: 90, hex: occupancyToColor(90) },
  { percent: 100, hex: occupancyToColor(100) },
]
