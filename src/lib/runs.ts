import type { Run, RunStatus, SortKey, StatusFilter } from '../types'

export const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'queued', label: 'Queued' },
  { value: 'running', label: 'Running' },
  { value: 'succeeded', label: 'Succeeded' },
  { value: 'failed', label: 'Failed' },
]

export const STATUS_LABELS: Record<RunStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'longest', label: 'Longest duration' },
  { value: 'shortest', label: 'Shortest duration' },
]

export type RunsQuery = {
  status: StatusFilter
  q: string
  sort: SortKey
}

export function isStatusFilter(value: string | null): value is StatusFilter {
  return value !== null && STATUS_FILTERS.some((option) => option.value === value)
}

export function isSortKey(value: string | null): value is SortKey {
  return value !== null && SORT_OPTIONS.some((option) => option.value === value)
}

export function countRunsByStatus(runs: Run[]): Record<StatusFilter, number> {
  const counts: Record<StatusFilter, number> = {
    all: runs.length,
    queued: 0,
    running: 0,
    succeeded: 0,
    failed: 0,
  }

  for (const run of runs) counts[run.status] += 1
  return counts
}

function matchesSearch(run: Run, search: string): boolean {
  if (!search) return true
  const needle = search.trim().toLowerCase()
  if (!needle) return true
  return run.name.toLowerCase().includes(needle) || run.repository.toLowerCase().includes(needle)
}

function compareByCreatedAt(a: Run, b: Run): number {
  return Date.parse(b.createdAt) - Date.parse(a.createdAt)
}

function compareByDuration(a: Run, b: Run, direction: 'longest' | 'shortest'): number {
  const left = a.durationSeconds
  const right = b.durationSeconds

  // Runs without a duration always sit at the end, whatever the direction is.
  if (left === undefined && right === undefined) return compareByCreatedAt(a, b)
  if (left === undefined) return 1
  if (right === undefined) return -1

  const diff = direction === 'longest' ? right - left : left - right
  return diff === 0 ? compareByCreatedAt(a, b) : diff
}

/**
 * Single place where the visible list is derived:
 * status filter and search are combined with AND, then the result is sorted.
 */
export function selectRuns(runs: Run[], query: RunsQuery): Run[] {
  const filtered = runs.filter(
    (run) => (query.status === 'all' || run.status === query.status) && matchesSearch(run, query.q),
  )

  switch (query.sort) {
    case 'oldest':
      return filtered.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    case 'longest':
      return filtered.sort((a, b) => compareByDuration(a, b, 'longest'))
    case 'shortest':
      return filtered.sort((a, b) => compareByDuration(a, b, 'shortest'))
    case 'newest':
    default:
      return filtered.sort(compareByCreatedAt)
  }
}
