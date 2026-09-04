import { UserRound, UsersRound } from "lucide-react";

export default function Login({
    onPatientLogin,
    onCaregiverLogin
}) {
    return (
        <div className="login-component">
            <div className="brand-mark">
                🌿
            </div>

            <h1>
                Welcome to AshaNER
            </h1>

            <p>
                Choose your care view to continue.
            </p>

            <div className="login-options">
                <button
                    type="button"
                    className="large-btn green"
                    onClick={
                        onPatientLogin
                    }
                >
                    <UserRound size={24} />
                    <span>
                        Patient View
                    </span>
                </button>

                <button
                    type="button"
                    className="large-btn coral"
                    onClick={
                        onCaregiverLogin
                    }
                >
                    <UsersRound size={24} />
                    <span>
                        Caregiver View
                    </span>
                </button>
            </div>
        </div>
    );
}