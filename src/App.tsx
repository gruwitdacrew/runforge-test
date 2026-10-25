import { useCallback, useEffect, useMemo } from 'react'
import { AppFooter } from './components/AppFooter'
import { AppHeader } from './components/AppHeader'
import { EmptyState } from './components/EmptyState'
import { ErrorState } from './components/ErrorState'
import { RunDetailsDrawer } from './components/RunDetailsDrawer'
import { RunList } from './components/RunList'
import { RunsSkeleton } from './components/RunsSkeleton'
import { RunsToolbar } from './components/RunsToolbar'
import { useQueryState } from './hooks/useQueryState'
import { useRuns } from './hooks/useRuns'
import { countRunsByStatus, selectRuns } from './lib/runs'
import type { Run, SortKey, StatusFilter } from './types'

function isDrawerHistoryEntry(): boolean {
  const state: unknown = window.history.state
  return typeof state === 'object' && state !== null && (state as { runDetails?: unknown }).runDetails === true
}

export default function App() {
  const [query, updateQuery] = useQueryState()
  const { state, load } = useRuns()

  // Initial load, and a reload whenever the demo error switch changes.
  useEffect(() => {
    load(query.demoError)
  }, [load, query.demoError])

  const runs = state.status === 'ready' ? state.runs : []
  const counts = useMemo(
    () => (state.status === 'ready' ? countRunsByStatus(state.runs) : null),
    [state],
  )
  const visibleRuns = useMemo(
    () => selectRuns(runs, { status: query.status, q: query.q, sort: query.sort }),
    [runs, query.status, query.q, query.sort],
  )
  const selectedRun = query.runId ? (runs.find((run) => run.id === query.runId) ?? null) : null
  const isLoading = state.status === 'loading'

  // A shared link can point to a run that does not exist (any more): clean it up.
  useEffect(() => {
    if (state.status === 'ready' && query.runId && !selectedRun) {
      updateQuery({ runId: null }, { replace: true })
    }
  }, [state, query.runId, selectedRun, updateQuery])

  const handleStatusChange = useCallback(
    (status: StatusFilter) => updateQuery({ status }, { replace: true }),
    [updateQuery],
  )

  const handleSearchChange = useCallback(
    (q: string) => updateQuery({ q }, { replace: true }),
    [updateQuery],
  )

  const handleSortChange = useCallback(
    (sort: SortKey) => updateQuery({ sort }, { replace: true }),
    [updateQuery],
  )

  const handleResetFilters = useCallback(
    () => updateQuery({ status: 'all', q: '' }, { replace: true }),
    [updateQuery],
  )

  const handleSelectRun = useCallback(
    (run: Run) => updateQuery({ runId: run.id }, { historyState: { runDetails: true } }),
    [updateQuery],
  )

  const handleCloseRun = useCallback(() => {
    // Closing goes back in history, so the browser Back button behaves the same way.
    if (isDrawerHistoryEntry()) {
      window.history.back()
      return
    }
    updateQuery({ runId: null }, { replace: true })
  }, [updateQuery])

  const handleRetry = useCallback(() => {
    if (query.demoError) updateQuery({ demoError: false }, { replace: true })
    else load(false)
  }, [query.demoError, updateQuery, load])

  const handleRefresh = useCallback(() => load(false), [load])

  const handleToggleDemoError = useCallback(
    () => updateQuery({ demoError: !query.demoError }, { replace: true }),
    [query.demoError, updateQuery],
  )

  const countLabel =
    state.status === 'ready'
      ? visibleRuns.length === runs.length
        ? `${runs.length} runs`
        : `${visibleRuns.length} of ${runs.length} runs`
      : ''

  return (
    <div className="app">
      <a className="skip-link" href="#runs-content">
        Skip to runs
      </a>

      <AppHeader />

      <main className="page" id="runs-content">
        <div className="page-head">
          <div>
            <p className="page-head__eyebrow">Agent activity</p>
            <h1 className="page-head__title">Runs</h1>
            <p className="page-head__subtitle">
              Follow every agent run across your repositories, from queue to result.
            </p>
          </div>
          {countLabel ? <span className="count-chip">{countLabel}</span> : null}
        </div>

        <RunsToolbar
          status={query.status}
          search={query.q}
          sort={query.sort}
          counts={counts}
          onStatusChange={handleStatusChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onRefresh={handleRefresh}
          isRefreshing={isLoading}
        />

        <p className="sr-only" role="status">
          {state.status === 'ready' ? `Showing ${visibleRuns.length} of ${runs.length} runs` : ''}
        </p>

        <div className="page__content">
          {isLoading ? <RunsSkeleton /> : null}

          {state.status === 'error' ? <ErrorState message={state.message} onRetry={handleRetry} /> : null}

          {state.status === 'ready' && visibleRuns.length === 0 ? (
            <EmptyState search={query.q} status={query.status} onReset={handleResetFilters} />
          ) : null}

          {state.status === 'ready' && visibleRuns.length > 0 ? (
            <RunList runs={visibleRuns} selectedRunId={query.runId} onSelect={handleSelectRun} />
          ) : null}
        </div>

        <AppFooter demoError={query.demoError} onToggleDemoError={handleToggleDemoError} />
      </main>

      {selectedRun ? <RunDetailsDrawer run={selectedRun} onClose={handleCloseRun} /> : null}
    </div>
  )
}
