import { formatDate, formatDuration, formatRelative } from '../lib/format'
import type { Run } from '../types'
import { RunStatusBadge } from './RunStatusBadge'
import { BranchIcon, ChevronRightIcon } from './icons'

interface RunRowProps {
  run: Run
  isSelected: boolean
  onSelect: (run: Run) => void
}

export function RunRow({ run, isSelected, onSelect }: RunRowProps) {
  const relativeCreatedAt = formatRelative(run.createdAt)

  return (
    <li className="run-list__item">
      <button
        type="button"
        className="run-row"
        aria-label={`Open run ${run.name}`}
        aria-current={isSelected ? 'true' : undefined}
        onClick={() => onSelect(run)}
      >
        <span className="run-row__main">
          <span className="run-row__name">{run.name}</span>
          <span className="run-row__repo">{run.repository}</span>
        </span>

        <span className="run-row__branch">
          <span className="branch-chip">
            <BranchIcon className="branch-chip__icon" />
            {run.branch}
          </span>
        </span>

        <span className="run-row__status">
          <RunStatusBadge status={run.status} />
        </span>

        <span className="run-row__created">
          <span className="cell-label">Created</span>
          <time dateTime={run.createdAt}>{formatDate(run.createdAt)}</time>
          {relativeCreatedAt ? <span className="run-row__relative">{relativeCreatedAt}</span> : null}
        </span>

        <span className="run-row__duration">
          <span className="cell-label">Duration</span>
          <span className="run-row__duration-value">{formatDuration(run.durationSeconds)}</span>
        </span>

        <span className="run-row__chevron">
          <ChevronRightIcon />
        </span>
      </button>
    </li>
  )
}
