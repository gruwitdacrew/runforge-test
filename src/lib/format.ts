const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const dayFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function toDate(iso: string): Date | null {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Absolute local date, e.g. `25 Oct 2026, 14:05`. Never throws on bad input. */
export function formatDateTime(iso: string): string {
  const date = toDate(iso)
  return date ? dateTimeFormatter.format(date) : 'Unknown date'
}

/** Compact date for table rows: date plus time when it happened within a week. */
export function formatDate(iso: string, now: number = Date.now()): string {
  const date = toDate(iso)
  if (!date) return 'Unknown date'

  const isSameYear = date.getFullYear() === new Date(now).getFullYear()
  if (!isSameYear) return dayFormatter.format(date)

  const ageInDays = (now - date.getTime()) / 86_400_000
  return ageInDays < 7 ? `${dayFormatter.format(date)}, ${timeFormatter.format(date)}` : dayFormatter.format(date)
}

/** Muted secondary label such as `12m ago`. Empty when the date is far in the past. */
export function formatRelative(iso: string, now: number = Date.now()): string {
  const date = toDate(iso)
  if (!date) return ''

  const diffInMinutes = Math.round((now - date.getTime()) / 60_000)
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.round(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.round(diffInHours / 24)
  return diffInDays < 7 ? `${diffInDays}d ago` : ''
}

/** `42s`, `3m 34s`, `1h 05m`. Missing or invalid values render as an em dash. */
export function formatDuration(seconds?: number): string {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds < 0) return '—'

  const wholeSeconds = Math.round(seconds)
  if (wholeSeconds < 60) return `${wholeSeconds}s`

  const minutes = Math.floor(wholeSeconds / 60)
  const restSeconds = wholeSeconds % 60
  if (minutes < 60) return restSeconds === 0 ? `${minutes}m` : `${minutes}m ${restSeconds}s`

  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60
  return restMinutes === 0 ? `${hours}h` : `${hours}h ${String(restMinutes).padStart(2, '0')}m`
}
