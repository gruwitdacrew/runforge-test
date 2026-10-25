import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchRuns } from '../api/mockRuns'
import type { Run } from '../types'

export type RunsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; runs: Run[] }

/**
 * Owns the loading lifecycle of the runs list.
 * `load(fail)` is called by the page on mount, on retry and on refresh;
 * `fail` is only used by the demo switch that shows the error state.
 */
export function useRuns() {
  const [state, setState] = useState<RunsState>({ status: 'loading' })
  const controllerRef = useRef<AbortController | null>(null)

  const load = useCallback((fail = false) => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setState({ status: 'loading' })

    fetchRuns({ signal: controller.signal, fail })
      .then((runs) => {
        if (!controller.signal.aborted) setState({ status: 'ready', runs })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Unexpected error while loading runs.',
        })
      })
  }, [])

  useEffect(() => () => controllerRef.current?.abort(), [])

  return { state, load }
}
