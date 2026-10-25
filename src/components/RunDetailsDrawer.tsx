import { useEffect, useRef } from 'react'
import { formatDateTime, formatDuration } from '../lib/format'
import { STATUS_LABELS } from '../lib/runs'
import type { Run } from '../types'
import { RunStatusBadge } from './RunStatusBadge'
import { ArrowLeftIcon, BranchIcon, CloseIcon } from './icons'

interface RunDetailsDrawerProps {
  run: Run
  onClose: () => void
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function logLineVariant(line: string): string {
  if (/\b(error|failed|failure)\b/i.test(line)) return 'log__line log__line--error'
  if (/\b(warn|warning|wait)\b/i.test(line)) return 'log__line log__line--warn'
  return 'log__line'
}

export function RunDetailsDrawer({ run, onClose }: RunDetailsDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      // Keep keyboard focus inside the drawer while it is open.
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div className="drawer-layer">
      <div className="drawer-backdrop" aria-hidden="true" onClick={onClose} />

      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-details-title"
        ref={panelRef}
      >
        <header className="drawer__head">
          <p className="drawer__eyebrow">Run details</p>
          <h2 className="drawer__title" id="run-details-title">
            {run.name}
          </h2>
          <div className="drawer__meta">
            <RunStatusBadge status={run.status} />
            <span className="drawer__meta-item">{run.repository}</span>
            <span className="branch-chip">
              <BranchIcon className="branch-chip__icon" />
              {run.branch}
            </span>
          </div>

          <button
            type="button"
            className="icon-button drawer__close"
            aria-label="Close run details"
            onClick={onClose}
            ref={closeButtonRef}
          >
            <CloseIcon />
          </button>
        </header>

        <div className="drawer__body">
          <dl className="meta-grid">
            <div className="meta-grid__item">
              <dt>Status</dt>
              <dd>{STATUS_LABELS[run.status]}</dd>
            </div>
            <div className="meta-grid__item">
              <dt>Run ID</dt>
              <dd className="mono">{run.id}</dd>
            </div>
            <div className="meta-grid__item">
              <dt>Repository</dt>
              <dd>{run.repository}</dd>
            </div>
            <div className="meta-grid__item">
              <dt>Branch</dt>
              <dd className="mono">{run.branch}</dd>
            </div>
            <div className="meta-grid__item">
              <dt>Created</dt>
              <dd>
                <time dateTime={run.createdAt}>{formatDateTime(run.createdAt)}</time>
              </dd>
            </div>
            <div className="meta-grid__item">
              <dt>Duration</dt>
              <dd className="mono">
                {run.durationSeconds === undefined ? 'Not reported' : formatDuration(run.durationSeconds)}
              </dd>
            </div>
          </dl>

          <section className="drawer__section" aria-labelledby="run-result-title">
            <h3 className="drawer__section-title" id="run-result-title">
              Result
            </h3>
            {run.result ? (
              <p className="callout">{run.result}</p>
            ) : (
              <p className="callout callout--muted">No result yet — this run has not produced a result.</p>
            )}
          </section>

          <section className="drawer__section" aria-labelledby="run-logs-title">
            <h3 className="drawer__section-title" id="run-logs-title">
              Logs
              <span className="count">{run.logs.length} lines</span>
            </h3>
            {run.logs.length > 0 ? (
              <ol className="log" aria-label="Run logs" tabIndex={0}>
                {run.logs.map((line, index) => (
                  <li className={logLineVariant(line)} key={`${index}-${line.slice(0, 24)}`}>
                    <span className="log__index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <code className="log__text">{line}</code>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="callout callout--muted">No log output was recorded for this run.</p>
            )}
          </section>
        </div>

        <footer className="drawer__foot">
          <button type="button" className="button button--secondary" onClick={onClose}>
            <ArrowLeftIcon className="button__icon" />
            Back to runs
          </button>
          <span className="drawer__hint">Press Esc to close</span>
        </footer>
      </div>
    </div>
  )
}
