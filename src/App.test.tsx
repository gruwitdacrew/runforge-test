import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

// The mock service answers in 520–800 ms, so assertions get a wider window than the 1 s default.
const LOAD_TIMEOUT = 4000

async function renderRunsPage() {
  render(<App />)
  const page = await screen.findByRole('region', { name: 'Runs' }, { timeout: LOAD_TIMEOUT })
  return { page }
}

function getRunsRegion() {
  return screen.getByRole('region', { name: 'Runs' })
}

function getStatusFilters() {
  return screen.getByRole('group', { name: 'Filter by status' })
}

describe('Runs page', () => {
  it('filters the list by status', async () => {
    const user = userEvent.setup()
    const { page } = await renderRunsPage()

    expect(within(page).getAllByRole('listitem')).toHaveLength(8)

    const failedFilter = within(getStatusFilters()).getByRole('button', { name: /^Failed/ })
    await user.click(failedFilter)

    const rows = within(getRunsRegion()).getAllByRole('listitem')
    expect(rows).toHaveLength(2)
    rows.forEach((row) => {
      expect(within(row).getByText('Failed', { selector: '.status__label' })).toBeInTheDocument()
    })
    expect(within(getRunsRegion()).queryByText('Nightly dependency audit')).not.toBeInTheDocument()
    expect(failedFilter).toHaveAttribute('aria-pressed', 'true')
    // The active filter is mirrored in the URL, so the view can be shared.
    expect(window.location.search).toBe('?status=failed')
  })

  it('searches by name and repository and combines the search with the status filter', async () => {
    const user = userEvent.setup()
    await renderRunsPage()

    const search = screen.getByRole('searchbox', { name: 'Search runs' })
    await user.type(search, 'payments')

    await waitFor(() => expect(within(getRunsRegion()).getAllByRole('listitem')).toHaveLength(1))
    expect(within(getRunsRegion()).getByText('Payments service regression')).toBeInTheDocument()
    expect(window.location.search).toBe('?q=payments')

    await user.clear(search)
    await user.type(search, 'forge/infra')

    await waitFor(() => expect(within(getRunsRegion()).getAllByRole('listitem')).toHaveLength(1))
    expect(within(getRunsRegion()).getByText('Security scan — nightly')).toBeInTheDocument()

    // A search that matches nothing together with a status filter shows the empty state.
    await user.click(within(getStatusFilters()).getByRole('button', { name: /^Succeeded/ }))
    expect(await screen.findByText('No runs found')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset search and filters' }))
    await waitFor(() => expect(getRunsRegion()).toBeInTheDocument())
    expect(screen.getByRole('searchbox', { name: 'Search runs' })).toHaveValue('')
    expect(within(getStatusFilters()).getByRole('button', { name: /^All/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('opens the run details with logs and result, then returns to the list', async () => {
    const user = userEvent.setup()
    await renderRunsPage()

    await user.click(screen.getByRole('button', { name: 'Open run Nightly dependency audit' }))

    const dialog = await screen.findByRole('dialog', { name: 'Nightly dependency audit' })
    expect(window.location.search).toContain('run=run_9f2c1a')
    expect(within(dialog).getAllByText('forge/runforge-web').length).toBeGreaterThan(0)
    expect(within(dialog).getByText(/Audit passed/)).toBeInTheDocument()

    const logs = within(dialog).getByRole('list', { name: 'Run logs' })
    expect(within(logs).getAllByRole('listitem')).toHaveLength(7)

    await user.click(within(dialog).getByRole('button', { name: 'Back to runs' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(window.location.search).not.toContain('run=')
    expect(getRunsRegion()).toBeInTheDocument()
  })

  it('shows the error state and recovers on retry', async () => {
    window.history.replaceState(null, '', '/?fail=1')
    const user = userEvent.setup()
    render(<App />)

    const alert = await screen.findByRole('alert', undefined, { timeout: LOAD_TIMEOUT })
    expect(within(alert).getByText('Couldn’t load runs')).toBeInTheDocument()

    await user.click(within(alert).getByRole('button', { name: 'Retry' }))

    const page = await screen.findByRole('region', { name: 'Runs' }, { timeout: LOAD_TIMEOUT })
    expect(within(page).getAllByRole('listitem')).toHaveLength(8)
    expect(window.location.search).toBe('')
  })
})
