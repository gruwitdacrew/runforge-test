import { SORT_OPTIONS, STATUS_FILTERS } from '../lib/runs'
import type { SortKey, StatusFilter } from '../types'
import { CloseIcon, RefreshIcon, SearchIcon } from './icons'

interface RunsToolbarProps {
  status: StatusFilter
  search: string
  sort: SortKey
  counts: Record<StatusFilter, number> | null
  onStatusChange: (status: StatusFilter) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: SortKey) => void
  onRefresh: () => void
  isRefreshing: boolean
}

export function RunsToolbar({
  status,
  search,
  sort,
  counts,
  onStatusChange,
  onSearchChange,
  onSortChange,
  onRefresh,
  isRefreshing,
}: RunsToolbarProps) {
  return (
    <div className="toolbar panel">
      <div className="search">
        <SearchIcon className="search__icon" />
        <label className="sr-only" htmlFor="run-search">
          Search runs
        </label>
        <input
          id="run-search"
          type="search"
          className="search__input"
          placeholder="Search by run name or repository…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {search ? (
          <button
            type="button"
            className="search__clear"
            aria-label="Clear search"
            onClick={() => onSearchChange('')}
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>

      <div className="segmented" role="group" aria-label="Filter by status">
        {STATUS_FILTERS.map((option) => {
          const isActive = option.value === status
          const count = counts?.[option.value]

          return (
            <button
              key={option.value}
              type="button"
              className={`segmented__item${isActive ? ' is-active' : ''}`}
              aria-pressed={isActive}
              onClick={() => onStatusChange(option.value)}
            >
              {option.value === 'all' ? null : (
                <span className={`segmented__dot segmented__dot--${option.value}`} aria-hidden="true" />
              )}
              <span>{option.label}</span>
              {counts ? <span className="segmented__count">{count}</span> : null}
            </button>
          )
        })}
      </div>

      <div className="toolbar__controls">
        <label className="sort-control">
          <span className="sr-only">Sort runs</span>
          <select
            className="sort-control__select"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortKey)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="button button--quiet"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh runs"
        >
          <RefreshIcon className="button__icon" />
          <span className="button__text">Refresh</span>
        </button>
      </div>
    </div>
  )
}
