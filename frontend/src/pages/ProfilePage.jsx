import { useLanguage } from "../context/LanguageContext";

export default function ProfilePage() {
    const { t } = useLanguage();

    return (
        <section className="simple-page">
            <h1>
                {t("profile.title", "Profile")}
            </h1>

            <div className="card">
                <h2>
                    {t("profile.name", "Grandfather Biren")}
                </h2>

                <p>
                    {t(
                        "profile.details",
                        "82 years • Grandfather • Guwahati, Assam"
                    )}
                </p>
            </div>
        </section>
    );
}