import { STATUS_LABELS } from '../lib/runs'
import type { StatusFilter } from '../types'
import { EmptyListIcon } from './icons'

interface EmptyStateProps {
  search: string
  status: StatusFilter
  onReset: () => void
}

export function EmptyState({ search, status, onReset }: EmptyStateProps) {
  const hasSearch = search.trim().length > 0
  const hasStatus = status !== 'all'

  const description = (() => {
    if (hasSearch && hasStatus) {
      return `No runs match “${search.trim()}” with the status ${STATUS_LABELS[status]}.`
    }
    if (hasSearch) return `No run name or repository contains “${search.trim()}”.`
    if (hasStatus) return `There are no ${STATUS_LABELS[status].toLowerCase()} runs right now.`
    return 'No runs have been recorded yet.'
  })()

  return (
    <div className="panel state" role="status">
      <span className="state__icon" aria-hidden="true">
        <EmptyListIcon />
      </span>
      <h2 className="state__title">No runs found</h2>
      <p className="state__text">{description}</p>
      {hasSearch || hasStatus ? (
        <button type="button" className="button button--primary" onClick={onReset}>
          Reset search and filters
        </button>
      ) : (
        <p className="state__hint">Once an agent run starts, it will appear here.</p>
      )}
    </div>
  )
}
