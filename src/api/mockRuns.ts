import type { Run } from '../types'

const MINUTE = 60_000

/** Latency range keeps the loading state visible without feeling broken. */
const MIN_LATENCY_MS = 520
const MAX_LATENCY_MS = 800

type LogLevel = 'info' | 'warn' | 'error' | 'wait'
type LogEntry = [offsetSeconds: number, level: LogLevel, message: string]

function minutesAgo(now: number, minutes: number): string {
  return new Date(now - minutes * MINUTE).toISOString()
}

function formatClock(date: Date): string {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
}

/** Log lines get real clock times derived from the run start, so the drawer stays consistent. */
function buildLogs(createdAt: string, entries: LogEntry[]): string[] {
  const start = Date.parse(createdAt)
  return entries.map(
    ([offsetSeconds, level, message]) =>
      `${formatClock(new Date(start + offsetSeconds * 1000))}  ${level.padEnd(5)}  ${message}`,
  )
}

function createMockRuns(now: number): Run[] {
  const auditCreatedAt = minutesAgo(now, 22)
  const docsCreatedAt = minutesAgo(now, 3)
  const smokeCreatedAt = minutesAgo(now, 6)
  const paymentsCreatedAt = minutesAgo(now, 71)
  const changelogCreatedAt = minutesAgo(now, 3 * 60 + 12)
  const securityCreatedAt = minutesAgo(now, 5 * 60 + 40)
  const translationCreatedAt = minutesAgo(now, 26 * 60 + 5)
  const triageCreatedAt = minutesAgo(now, 31 * 60 + 18)

  return [
    {
      id: 'run_9f2c1a',
      name: 'Nightly dependency audit',
      repository: 'forge/runforge-web',
      branch: 'main',
      status: 'succeeded',
      createdAt: auditCreatedAt,
      durationSeconds: 214,
      logs: buildLogs(auditCreatedAt, [
        [0, 'info', 'Run scheduled by cron "nightly-audit"'],
        [1, 'info', 'Cloning forge/runforge-web@main'],
        [12, 'info', 'Restored pnpm store from cache (1.2s)'],
        [34, 'info', 'Auditing 1 284 packages across 3 workspaces'],
        [175, 'info', 'No critical or high advisories found'],
        [190, 'info', 'Report published to artifacts/audit-latest.json'],
        [214, 'info', 'Run finished in 3m 34s'],
      ]),
      result:
        'Audit passed — 0 critical, 0 high, 2 low advisories. The report is available at artifacts/audit-latest.json.',
    },
    {
      id: 'run_4b77de',
      name: 'Docs build & deploy',
      repository: 'forge/docs-site',
      branch: 'release/2.4',
      status: 'running',
      createdAt: docsCreatedAt,
      logs: buildLogs(docsCreatedAt, [
        [0, 'info', 'Run started by @mira'],
        [2, 'info', 'Installing dependencies with pnpm 9.12'],
        [36, 'info', 'Building with Vite 6 (target: es2022)'],
        [67, 'info', 'Rendered 148 routes, 312 assets'],
        [70, 'wait', 'Uploading to edge storage — 68% complete'],
      ]),
    },
    {
      id: 'run_7c1e08',
      name: 'Onboarding agent smoke test',
      repository: 'forge/agent-sdk',
      branch: 'feat/smoke-suite',
      status: 'queued',
      createdAt: smokeCreatedAt,
      logs: buildLogs(smokeCreatedAt, [
        [0, 'info', 'Run queued — waiting for a free runner'],
        [0, 'info', 'Priority: normal, timeout: 15m'],
        [0, 'info', 'Pipeline: install → typecheck → smoke'],
      ]),
    },
    {
      id: 'run_1a9f53',
      name: 'Payments service regression',
      repository: 'forge/payments-api',
      branch: 'main',
      status: 'failed',
      createdAt: paymentsCreatedAt,
      durationSeconds: 341,
      logs: buildLogs(paymentsCreatedAt, [
        [0, 'info', 'Run started by @denis (manual trigger)'],
        [12, 'info', 'Test suite: payments-api / regression'],
        [87, 'info', '✔ checkout and tax calculation (44 checks)'],
        [202, 'info', '✔ refunds and partial captures'],
        [338, 'error', '✖ stripe-webhooks: expected 200, received 502'],
        [340, 'error', '3 of 6 webhook assertions failed'],
        [341, 'error', 'Run failed — contract with the stripe mock is broken'],
      ]),
      result: 'Failed at step "stripe-webhooks": 3 assertions failed (expected 200, received 502). 41 of 44 checks passed.',
    },
    {
      id: 'run_5de0b2',
      name: 'Changelog summarizer',
      repository: 'forge/runforge-web',
      branch: 'chore/changelog',
      status: 'succeeded',
      createdAt: changelogCreatedAt,
      durationSeconds: 96,
      logs: buildLogs(changelogCreatedAt, [
        [0, 'info', 'Run started by release-bot'],
        [6, 'info', 'Collected 34 commits since v2.3.0'],
        [68, 'info', 'Grouped changes into 6 categories'],
        [96, 'info', 'Draft pull request #812 opened'],
      ]),
      result: 'Drafted 12 bullet points from 34 commits and opened draft pull request #812.',
    },
    {
      id: 'run_2f61cc',
      name: 'Security scan — nightly',
      repository: 'forge/infra',
      branch: 'main',
      status: 'failed',
      createdAt: securityCreatedAt,
      durationSeconds: 128,
      logs: buildLogs(securityCreatedAt, [
        [0, 'info', 'Run scheduled by cron "nightly-security"'],
        [18, 'info', 'Scanning 12 container images'],
        [110, 'warn', 'CVE-2026-31881 (high) found in base image node:22-alpine'],
        [116, 'error', 'Policy gate: high severity vulnerabilities are not allowed'],
        [128, 'error', 'Run failed — 1 high, 4 medium findings'],
      ]),
    },
    {
      id: 'run_8cc340',
      name: 'Release notes translation',
      repository: 'forge/marketing-site',
      branch: 'release/2.4',
      status: 'succeeded',
      createdAt: translationCreatedAt,
      durationSeconds: 42,
      logs: buildLogs(translationCreatedAt, [
        [0, 'info', 'Run started by @lena'],
        [6, 'info', 'Loaded 18 source strings (en)'],
        [33, 'info', 'Translated into de, fr, es'],
        [42, 'info', 'Glossary check passed'],
      ]),
      result: 'Translated 18 strings into de, fr and es. Glossary check passed, no missing keys.',
    },
    {
      id: 'run_6ab9f7',
      name: 'Issue triage sweep',
      repository: 'forge/agent-sdk',
      branch: 'main',
      status: 'queued',
      createdAt: triageCreatedAt,
      logs: buildLogs(triageCreatedAt, [
        [0, 'info', 'Run queued — concurrency limit reached (4/4)'],
        [1, 'info', 'Queue position: 2'],
        [1, 'info', 'Will start after the current batch finishes'],
      ]),
    },
  ]
}

export interface FetchRunsOptions {
  signal?: AbortSignal
  /** Demo switch: rejects instead of resolving, so the error state can be reviewed. */
  fail?: boolean
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const abortError = () => new DOMException('The request was aborted.', 'AbortError')
    if (signal?.aborted) {
      reject(abortError())
      return
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, ms)

    function handleAbort() {
      clearTimeout(timer)
      reject(abortError())
    }

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

/**
 * Local mock "backend": resolves with a fresh copy of the runs
 * after an artificial delay of 520–800 ms.
 */
export async function fetchRuns({ signal, fail = false }: FetchRunsOptions = {}): Promise<Run[]> {
  const latency = MIN_LATENCY_MS + Math.round(Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS))
  await sleep(latency, signal)

  if (fail) {
    throw new Error('Runs service is unavailable (mock 503). Your history is safe — try again in a moment.')
  }

  return createMockRuns(Date.now())
}
