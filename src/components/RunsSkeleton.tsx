const SKELETON_ROWS = 6

/** Placeholder that mirrors the real row grid, so the layout does not jump. */
export function RunsSkeleton() {
  return (
    <section className="panel run-list" aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading runs…</p>

      <div className="run-list__head run-list__head--skeleton" aria-hidden="true">
        <span className="skeleton-block skeleton-block--label" />
        <span className="skeleton-block skeleton-block--label" />
        <span className="skeleton-block skeleton-block--label" />
        <span className="skeleton-block skeleton-block--label" />
        <span className="skeleton-block skeleton-block--label" />
        <span />
      </div>

      <div className="run-list__items" aria-hidden="true">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <div className="run-row run-row--skeleton" key={index}>
            <span className="run-row__main">
              <span className="skeleton-block skeleton-block--name" />
              <span className="skeleton-block skeleton-block--repo" />
            </span>
            <span className="run-row__branch">
              <span className="skeleton-block skeleton-block--chip" />
            </span>
            <span className="run-row__status">
              <span className="skeleton-block skeleton-block--badge" />
            </span>
            <span className="run-row__created">
              <span className="skeleton-block skeleton-block--date" />
            </span>
            <span className="run-row__duration">
              <span className="skeleton-block skeleton-block--duration" />
            </span>
            <span className="run-row__chevron" />
          </div>
        ))}
      </div>
    </section>
  )
}
