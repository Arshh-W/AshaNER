import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({
    label = "Back",
    fallback = "/"
}) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate(fallback);
    };
//pulled
    return (
        <button
            type="button"
            className="back-button"
            onClick={handleBack}
        >
            <ArrowLeft size={20} />
            <span>{label}</span>
        </button>
    );
}