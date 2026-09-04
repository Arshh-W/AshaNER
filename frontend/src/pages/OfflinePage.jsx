export default function OfflinePage() {
    const handleContinue = () => {
        window.location.href = "/patient";
    };

    return (
        <div className="center-page">
            <div className="login-card">
                <h1>You’re offline</h1>

                <p>
                    Your saved routines and games remain
                    available on this device.
                </p>

                <button
                    type="button"
                    className="large-btn green"
                    onClick={handleContinue}
                >
                    Continue Offline
                </button>
            </div>
        </div>
    );
}