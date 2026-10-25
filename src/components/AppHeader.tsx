export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            R
          </span>
          <span className="brand__name">Runforge</span>
        </div>

        <nav className="app-nav" aria-label="Main">
          <span className="app-nav__item is-active" aria-current="page">
            Runs
          </span>
        </nav>

        <span className="env-chip">Mock environment</span>
      </div>
    </header>
  )
}
