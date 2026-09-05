import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function NotFoundPage() {
    const { t } = useLanguage();

    return (
        <div className="center-page">
            <div className="login-card">
                <h1>
                    {t("notFound.title", "Page not found")}
                </h1>

                <p>
                    {t(
                        "notFound.description",
                        "The page you're looking for doesn't exist."
                    )}
                </p>

                <Link
                    className="large-btn green"
                    to="/"
                >
                    {t(
                        "notFound.returnHome",
                        "Return Home"
                    )}
                </Link>
            </div>
        </div>
    );
}