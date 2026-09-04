import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { login, authError, isLoggingIn } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (role) => {
        if (await login(role)) {
            navigate(role === "caregiver" ? "/caregiver" : "/patient");
        }
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
                    onClick={() => handleLogin("patient")}
                    disabled={isLoggingIn}
                >
                    Patient View
                </button>

                <button
                    type="button"
                    className="large-btn coral"
                    onClick={() => handleLogin("caregiver")}
                    disabled={isLoggingIn}
                >
                    Caregiver View
                </button>
                {authError && <p role="alert">{authError}</p>}
            </div>
        </div>
    );
}