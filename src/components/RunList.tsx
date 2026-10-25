import type { Run } from '../types'
import { RunRow } from './RunRow'

interface RunListProps {
  runs: Run[]
  selectedRunId: string | null
  onSelect: (run: Run) => void
}

export function RunList({ runs, selectedRunId, onSelect }: RunListProps) {
  return (
    <section className="panel run-list" aria-label="Runs">
      <div className="run-list__head" aria-hidden="true">
        <span>Run</span>
        <span>Branch</span>
        <span>Status</span>
        <span>Created</span>
        <span>Duration</span>
        <span />
      </div>

      <ul className="run-list__items">
        {runs.map((run) => (
          <RunRow key={run.id} run={run} isSelected={run.id === selectedRunId} onSelect={onSelect} />
        ))}
      </ul>
    </section>
  )
}
