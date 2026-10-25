export type RunStatus = 'queued' | 'running' | 'succeeded' | 'failed'

export interface Run {
  id: string
  name: string
  repository: string
  branch: string
  status: RunStatus
  createdAt: string
  durationSeconds?: number
  logs: string[]
  result?: string
}

/** `all` is a UI-only value: the API never knows about it. */
export type StatusFilter = 'all' | RunStatus

export type SortKey = 'newest' | 'oldest' | 'longest' | 'shortest'
