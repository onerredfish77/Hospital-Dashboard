import { format, parseISO } from 'date-fns'

export function formatPercent(value, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${Number(value).toFixed(digits)}%`
}

export function formatTime(mins) {
  if (mins === null || mins === undefined || Number.isNaN(mins)) return '—'
  const m = Math.round(mins)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const r = m % 60
  return r === 0 ? `${h}h` : `${h}h ${r}m`
}

export function formatRatio(current, target) {
  if (!current && !target) return '—'
  if (!target) return current
  return `${current} (target ${target})`
}

export function formatDate(input) {
  if (!input) return '—'
  const d = typeof input === 'string' ? parseISO(input) : input
  return format(d, 'MMM d')
}

export function formatDateTime(input) {
  if (!input) return '—'
  const d = typeof input === 'string' ? parseISO(input) : input
  return format(d, 'MMM d, h:mm a')
}

export function formatClock(input = new Date()) {
  const d = typeof input === 'string' ? parseISO(input) : input
  return format(d, 'h:mm:ss a')
}

const RAG_TO_VUETIFY = {
  green: 'success',
  amber: 'warning',
  red: 'error',
  neutral: 'grey',
}

const RAG_TO_HEX = {
  green: '#66BB6A',
  amber: '#FFB74D',
  red: '#EF5350',
  neutral: '#9E9E9E',
}

export function getRAGColor(status) {
  return RAG_TO_VUETIFY[status] || 'grey'
}

export function getRAGHex(status) {
  return RAG_TO_HEX[status] || '#9E9E9E'
}

export function ragLabel(status) {
  if (status === 'green') return 'On Target'
  if (status === 'amber') return 'Watch'
  if (status === 'red') return 'Critical'
  return '—'
}
