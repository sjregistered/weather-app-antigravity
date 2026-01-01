/**
 * ErrorDisplay - Error state display
 * Stateless component
 */

interface ErrorDisplayProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export function ErrorDisplay({
    title = 'Something went wrong',
    message,
    onRetry
}: ErrorDisplayProps) {
    return (
        <div className="error">
            <div className="error__icon">⚠️</div>
            <h2 className="error__title">{title}</h2>
            <p className="error__message">{message}</p>
            {onRetry && (
                <button className="error__btn" onClick={onRetry}>
                    Try Again
                </button>
            )}
        </div>
    );
}
