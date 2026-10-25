import { AlertIcon } from './icons'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="panel state" role="alert">
      <span className="state__icon state__icon--error" aria-hidden="true">
        <AlertIcon />
      </span>
      <h2 className="state__title">Couldn’t load runs</h2>
      <p className="state__text">The mock service did not respond. Your data is safe — try again.</p>
      <p className="state__detail">{message}</p>
      <button type="button" className="button button--primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
