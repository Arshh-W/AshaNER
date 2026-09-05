import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
    const { t } = useLanguage();
    const { user } = useAuth();

    return (
        <section className="simple-page">
            <h1>
                {t("profile.title", "Profile")}
            </h1>

            <div className="card">
                <h2>
                    {user?.patientName || user?.name || t("profile.name", "Profile")}
                </h2>

                <p>
                    {t(
                        "profile.details",
                        `${user?.role || ""}${user?.id ? ` • ID ${user.id}` : ""}`
                    )}
                </p>
            </div>
        </section>
    );
}