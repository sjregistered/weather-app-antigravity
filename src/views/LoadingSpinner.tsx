/**
 * LoadingSpinner - Loading state indicator
 * Stateless component
 */

interface LoadingSpinnerProps {
    message?: string;
}

export function LoadingSpinner({ message = 'Loading weather data...' }: LoadingSpinnerProps) {
    return (
        <div className="loading">
            <div className="loading__spinner" aria-hidden="true" />
            <div className="loading__text">{message}</div>
        </div>
    );
}
