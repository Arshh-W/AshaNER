export default function LoadingScreen({
    message = "Loading..."
}) {
    return (
        <div
            className="loading-screen"
            role="status"
            aria-live="polite"
        >
            <div className="loading-spinner" />

            <p>{message}</p>
        </div>
    );
}