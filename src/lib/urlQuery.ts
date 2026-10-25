import { isSortKey, isStatusFilter } from './runs'
import type { SortKey, StatusFilter } from '../types'

export interface QueryState {
  status: StatusFilter
  q: string
  sort: SortKey
  /** id of the run opened in the details drawer */
  runId: string | null
  /** demo switch that forces the mock service to fail, see README */
  demoError: boolean
}

export const DEFAULT_QUERY: QueryState = {
  status: 'all',
  q: '',
  sort: 'newest',
  runId: null,
  demoError: false,
}

export function parseQuery(search: string): QueryState {
  const params = new URLSearchParams(search)
  const status = params.get('status')
  const sort = params.get('sort')

  return {
    status: isStatusFilter(status) ? status : DEFAULT_QUERY.status,
    q: params.get('q')?.trim() ?? '',
    sort: isSortKey(sort) ? sort : DEFAULT_QUERY.sort,
    runId: params.get('run') || null,
    demoError: params.get('fail') === '1',
  }
}

export function toSearch(query: QueryState): string {
  const params = new URLSearchParams()

  if (query.status !== DEFAULT_QUERY.status) params.set('status', query.status)
  if (query.q.trim()) params.set('q', query.q.trim())
  if (query.sort !== DEFAULT_QUERY.sort) params.set('sort', query.sort)
  if (query.runId) params.set('run', query.runId)
  if (query.demoError) params.set('fail', '1')

  const search = params.toString()
  return search ? `?${search}` : ''
}
