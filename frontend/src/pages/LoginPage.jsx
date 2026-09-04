import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handlePatientLogin = () => {
        login("patient");
        navigate("/patient");
    };

    const handleCaregiverLogin = () => {
        login("caregiver");
        navigate("/caregiver");
    };

    return (
        <div className="center-page">
            <div className="login-card">
                <div className="brand-mark" aria-hidden="true">
                    🌿
                </div>

                <h1>Welcome to AshaNER</h1>

                <p>
                    Choose how you would like to use AshaNER.
                </p>

                <button
                    type="button"
                    className="large-btn green"
                    onClick={handlePatientLogin}
                >
                    Patient View
                </button>

                <button
                    type="button"
                    className="large-btn coral"
                    onClick={handleCaregiverLogin}
                >
                    Caregiver View
                </button>
            </div>
        </div>
    );
}