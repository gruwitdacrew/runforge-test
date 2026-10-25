import { useCallback, useEffect, useRef, useState } from 'react'
import { parseQuery, toSearch, type QueryState } from '../lib/urlQuery'

interface UpdateOptions {
  /** Replace the current history entry instead of pushing a new one. */
  replace?: boolean
  /** Arbitrary history state stored with a pushed entry. */
  historyState?: unknown
}

/**
 * Keeps the page state (filters, search, sorting, opened run) in the URL,
 * so a link can be shared and browser Back works as expected.
 */
export function useQueryState() {
  const [query, setQuery] = useState<QueryState>(() => parseQuery(window.location.search))
  const queryRef = useRef(query)

  useEffect(() => {
    const handlePopState = () => {
      const next = parseQuery(window.location.search)
      queryRef.current = next
      setQuery(next)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const updateQuery = useCallback((patch: Partial<QueryState>, options: UpdateOptions = {}) => {
    const next = { ...queryRef.current, ...patch }
    queryRef.current = next
    setQuery(next)

    const url = `${window.location.pathname}${toSearch(next)}${window.location.hash}`
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
    if (url === currentUrl) return

    if (options.replace) {
      window.history.replaceState(window.history.state, '', url)
    } else {
      window.history.pushState(options.historyState ?? null, '', url)
    }
  }, [])

  return [query, updateQuery] as const
}
