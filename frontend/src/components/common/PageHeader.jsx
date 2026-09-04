import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageHeader({
    title,
    subtitle,
    showBack = false,
    backTo,
    actions
}) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backTo) {
            navigate(backTo);
            return;
        }

        navigate(-1);
    };

    return (
        <header className="page-header">
            <div className="page-header-main">
                {showBack && (
                    <button
                        type="button"
                        className="page-header-back"
                        onClick={handleBack}
                        aria-label="Go back"
                    >
                        <ArrowLeft size={22} />
                    </button>
                )}

                <div>
                    <h1>{title}</h1>

                    {subtitle && (
                        <p>{subtitle}</p>
                    )}
                </div>
            </div>

            {actions && (
                <div className="page-header-actions">
                    {actions}
                </div>
            )}
        </header>
    );
}