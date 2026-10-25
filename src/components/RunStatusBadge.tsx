import type { ComponentType } from 'react'
import { STATUS_LABELS } from '../lib/runs'
import type { RunStatus } from '../types'
import { CheckIcon, ClockIcon, CrossIcon, RunningIcon } from './icons'

const ICONS: Record<RunStatus, ComponentType<{ className?: string }>> = {
  queued: ClockIcon,
  running: RunningIcon,
  succeeded: CheckIcon,
  failed: CrossIcon,
}

interface RunStatusBadgeProps {
  status: RunStatus
}

/**
 * Status is always communicated by text, not only by colour:
 * the label and the icon shape both change with the status.
 */
export function RunStatusBadge({ status }: RunStatusBadgeProps) {
  const Icon = ICONS[status]

  return (
    <span className={`status status--${status}`}>
      <Icon className="status__icon" />
      <span className="status__label">{STATUS_LABELS[status]}</span>
    </span>
  )
}
