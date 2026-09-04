import { useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import "../assets/styles/login-page.css";

export default function LoginPage() {
    const navigate = useNavigate();

    return (
        <main className="login-page">
            <div className="login-container">

                {/* Logo */}
                <div className="login-top">
                    <div className="login-logo-wrap">
                        <Logo className="login-logo" />
                    </div>
                </div>

                {/* Intro */}
                <section className="login-intro">
                    <div className="login-eyebrow">
                        <span className="login-eyebrow-dot" />
                        YOUR CARE SPACE
                    </div>

                    <h1>
                        Welcome back
                        <br />
                        <span>to AshaNER.</span>
                    </h1>

                    <p>
                        Choose the view that fits how you care,
                        connect, and spend time with AshaNER.
                    </p>
                </section>

                {/* Role Cards */}
                <section className="role-cards">

                    {/* Patient */}
                    <button
                        type="button"
                        className="role-card role-card-patient"
                        onClick={() => navigate("/login/patient")}
                    >
                        <div className="role-card-top">

                            <div className="role-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="12"
                                        cy="8"
                                        r="3.2"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />

                                    <path
                                        d="M5.5 20C5.9 15.9 8.2 13.7 12 13.7C15.8 13.7 18.1 15.9 18.5 20"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <div className="role-arrow">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M6 12H18"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M13 7L18 12L13 17"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                        </div>

                        <div className="role-card-content">
                            <span className="role-label">
                                PATIENT VIEW
                            </span>

                            <h2>
                                Continue as Patient
                            </h2>

                            <p>
                                Gentle activities, routines,
                                and memory support.
                            </p>
                        </div>
                    </button>


                    {/* Caregiver */}
                    <button
                        type="button"
                        className="role-card role-card-caregiver"
                        onClick={() =>
                            navigate("/login/caregiver")
                        }
                    >
                        <div className="role-card-top">

                            <div className="role-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="9"
                                        cy="8"
                                        r="3"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />

                                    <circle
                                        cx="16.5"
                                        cy="9"
                                        r="2.3"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />

                                    <path
                                        d="M3.8 20C4.2 16 6.2 13.8 9 13.8C11.8 13.8 13.8 16 14.2 20"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M14.2 14.5C15 13.7 16 13.3 17 13.3C19.2 13.3 20.7 15 21 18"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <div className="role-arrow">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M6 12H18"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M13 7L18 12L13 17"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                        </div>

                        <div className="role-card-content">
                            <span className="role-label">
                                CAREGIVER VIEW
                            </span>

                            <h2>
                                Continue as Caregiver
                            </h2>

                            <p>
                                Support, progress, routines,
                                and connected care.
                            </p>
                        </div>
                    </button>

                </section>

            </div>
        </main>
    );
}