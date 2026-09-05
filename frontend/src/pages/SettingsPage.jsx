import { useLanguage } from "../context/LanguageContext";

export default function SettingsPage() {
    const { t } = useLanguage();

    return (
        <section className="simple-page">
            <h1>
                {t("settings.title", "Settings")}
            </h1>

            <div className="card setting-row">
                <span>
                    {t("settings.largeText", "Large text")}
                </span>

                <button
                    type="button"
                    className="toggle"
                    onClick={(event) =>
                        event.currentTarget.classList.toggle("on")
                    }
                    aria-label={t(
                        "settings.largeText",
                        "Large text"
                    )}
                >
                    <span />
                </button>
            </div>

            <div className="card setting-row">
                <span>
                    {t(
                        "settings.voiceAssistance",
                        "Voice assistance"
                    )}
                </span>

                <button
                    type="button"
                    className="toggle on"
                    aria-label={t(
                        "settings.voiceAssistance",
                        "Voice assistance"
                    )}
                >
                    <span />
                </button>
            </div>
        </section>
    );
}