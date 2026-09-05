import { useLanguage } from "../context/LanguageContext";

export default function OfflinePage() {
    const { t } = useLanguage();

    const handleContinue = () => {
        window.location.href = "/patient";
    };

    return (
        <div className="center-page">
            <div className="login-card">
                <h1>
                    {t("offline.title", "You’re offline")}
                </h1>

                <p>
                    {t(
                        "offline.description",
                        "Your saved routines and games remain available on this device."
                    )}
                </p>

                <button
                    type="button"
                    className="large-btn green"
                    onClick={handleContinue}
                >
                    {t(
                        "offline.continue",
                        "Continue Offline"
                    )}
                </button>
            </div>
        </div>
    );
}