interface AppFooterProps {
  demoError: boolean
  onToggleDemoError: () => void
}

export function AppFooter({ demoError, onToggleDemoError }: AppFooterProps) {
  return (
    <footer className="app-footer">
      <p className="app-footer__note">
        Runforge · Runs dashboard · all data is served by a local mock service
      </p>
      <button type="button" className="link-button" onClick={onToggleDemoError}>
        {demoError ? 'Turn off the error demo' : 'Demo: simulate a loading error'}
      </button>
    </footer>
  )
}
