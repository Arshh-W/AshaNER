import { useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useLanguage } from "../context/LanguageContext";
import "../assets/styles/role-register.css";

export default function RoleRegisterPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <main className="role-register-page">

            <div className="role-register-container">

                {/* Logo */}
                <div className="role-register-top">
                    <div className="role-register-logo">
                        <Logo />
                    </div>
                </div>


                {/* Intro */}
                <section className="role-register-intro">

                    <div className="role-register-eyebrow">
                        <span className="role-register-eyebrow-dot" />

                        {t(
                            "roleRegister.eyebrow",
                            "YOUR CARE SPACE"
                        )}
                    </div>


                    <h1>
                        {t(
                            "roleRegister.title",
                            "Create your AshaNER account."
                        )}
                    </h1>


                    <p>
                        {t(
                            "roleRegister.description",
                            "Choose how you'll use AshaNER."
                        )}
                    </p>

                </section>


                {/* Role Cards */}
                <section className="role-register-cards">


                    {/* Patient */}
                    <button
                        type="button"
                        className="role-register-card role-register-card-patient"
                        onClick={() =>
                            navigate("/register/patient")
                        }
                    >

                        <div className="role-register-card-top">

                            <div className="role-register-icon">

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
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


                            <div
                                className="role-register-arrow"
                                aria-hidden="true"
                            >
                                →
                            </div>

                        </div>


                        <div className="role-register-card-content">

                            <span className="role-register-label">
                                {t(
                                    "roleRegister.patientView",
                                    "PATIENT VIEW"
                                )}
                            </span>


                            <h2>
                                {t(
                                    "roleRegister.patientTitle",
                                    "Create a Patient Account"
                                )}
                            </h2>


                            <p>
                                {t(
                                    "roleRegister.patientDescription",
                                    "A gentle space for activities, routines, and memory support."
                                )}
                            </p>

                        </div>

                    </button>



                    {/* Caregiver */}
                    <button
                        type="button"
                        className="role-register-card role-register-card-caregiver"
                        onClick={() =>
                            navigate("/register/caregiver")
                        }
                    >

                        <div className="role-register-card-top">

                            <div className="role-register-icon">

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
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


                            <div
                                className="role-register-arrow"
                                aria-hidden="true"
                            >
                                →
                            </div>

                        </div>


                        <div className="role-register-card-content">

                            <span className="role-register-label">
                                {t(
                                    "roleRegister.caregiverView",
                                    "CAREGIVER VIEW"
                                )}
                            </span>


                            <h2>
                                {t(
                                    "roleRegister.caregiverTitle",
                                    "Create a Caregiver Account"
                                )}
                            </h2>


                            <p>
                                {t(
                                    "roleRegister.caregiverDescription",
                                    "Stay connected with routines, progress, and everyday care."
                                )}
                            </p>

                        </div>

                    </button>

                </section>


                {/* Footer */}
                <div className="role-register-footer">

                    <span>
                        {t(
                            "roleRegister.alreadyHaveAccount",
                            "Already have an account?"
                        )}
                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        {t(
                            "roleRegister.login",
                            "Log in"
                        )}
                    </button>

                </div>

            </div>

        </main>
    );
}