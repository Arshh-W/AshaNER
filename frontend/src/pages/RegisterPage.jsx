import { useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Logo from "../components/common/Logo";

import "../assets/styles/register-page.css";


export default function RegisterPage() {

    const { role } = useParams();

    const navigate = useNavigate();

    const auth = useAuth();

    const { t } = useLanguage();


    /* =====================================================
       SAFETY
       ===================================================== */

    if (!auth) {
        return (
            <main className="register-page-form">

                <div className="register-wrapper">

                    <div className="register-card">

                        <div className="register-logo">
                            <Logo />
                        </div>

                        <div className="register-heading">

                            <h1>
                                {t(
                                    "register.authenticationUnavailable",
                                    "Authentication unavailable."
                                )}
                            </h1>

                            <p>
                                {t(
                                    "register.authenticationUnavailableDescription",
                                    "The authentication provider is not available. Please refresh the page."
                                )}
                            </p>

                        </div>

                        <button
                            type="button"
                            className="register-submit patient-submit"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            {t(
                                "register.refresh",
                                "Refresh"
                            )}
                        </button>

                    </div>

                </div>

            </main>
        );
    }


    const {
        register,
        authError,
        isRegistering
    } = auth;


    /* =====================================================
       FORM STATE
       ===================================================== */

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] =
        useState("");


    /* =====================================================
       ROLE
       ===================================================== */

    const isPatient =
        role === "patient";

    const isCaregiver =
        role === "caregiver";


    /* =====================================================
       INVALID ROLE
       ===================================================== */

    if (!isPatient && !isCaregiver) {

        return (
            <main className="register-page-form">

                <div className="register-wrapper">

                    <div className="register-card">

                        <div className="register-logo">
                            <Logo />
                        </div>

                        <div className="register-heading">

                            <h1>
                                {t(
                                    "register.invalidRegistrationType",
                                    "Invalid registration type."
                                )}
                            </h1>

                            <p>
                                {t(
                                    "register.invalidRegistrationDescription",
                                    "Please choose whether you want to register as a patient or caregiver."
                                )}
                            </p>

                        </div>

                        <button
                            type="button"
                            className="register-submit patient-submit"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            {t(
                                "register.backToRegistration",
                                "Back to registration"
                            )}
                        </button>

                    </div>

                </div>

            </main>
        );
    }


    /* =====================================================
       SUBMIT
       ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        if (
            !name.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {

            setError(
                t(
                    "register.fillAllFields",
                    "Please fill in all fields."
                )
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                t(
                    "register.passwordMismatch",
                    "Passwords do not match."
                )
            );

            return;
        }


        if (password.length < 8) {

            setError(
                t(
                    "register.passwordTooShort",
                    "Password must be at least 8 characters."
                )
            );

            return;
        }


        if (typeof register !== "function") {

            setError(
                t(
                    "register.registrationUnavailable",
                    "Registration service is unavailable. Please refresh the page."
                )
            );

            return;
        }


        const success =
            await register(
                name.trim(),
                email.trim(),
                password,
                role
            );


        if (!success) {
            return;
        }


        navigate(
            `/login/${role}`,
            {
                replace: true
            }
        );
    };


    /* =====================================================
       PAGE
       ===================================================== */

    return (
        <main
            className={
                `register-page-form ${
                    isPatient
                        ? "patient-register-page"
                        : "caregiver-register-page"
                }`
            }
        >

            <div className="register-wrapper">

                {/* BACK */}

                <button
                    type="button"
                    className="register-back"
                    onClick={() =>
                        navigate("/register")
                    }
                    disabled={isRegistering}
                >
                    <span aria-hidden="true">
                        ←
                    </span>

                    {t(
                        "register.back",
                        "Back"
                    )}
                </button>


                {/* CARD */}

                <div className="register-card">

                    {/* LOGO */}

                    <div className="register-logo">
                        <Logo />
                    </div>


                    {/* HEADING */}

                    <div className="register-heading">

                        <span
                            className={
                                `register-role-label ${
                                    isPatient
                                        ? "patient-label"
                                        : "caregiver-label"
                                }`
                            }
                        >
                            {isPatient
                                ? t(
                                    "register.patientView",
                                    "PATIENT VIEW"
                                )
                                : t(
                                    "register.caregiverView",
                                    "CAREGIVER VIEW"
                                )}
                        </span>


                        <h1>
                            {t(
                                "register.createAccount",
                                "Create your account."
                            )}
                        </h1>


                        <p>
                            {isPatient
                                ? t(
                                    "register.patientDescription",
                                    "Set up your personal AshaNER care space."
                                )
                                : t(
                                    "register.caregiverDescription",
                                    "Set up your connected caregiver account."
                                )}
                        </p>

                    </div>


                    {/* FORM */}

                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >

                        {/* NAME */}

                        <div className="form-field">

                            <label htmlFor="name">
                                {t(
                                    "register.fullName",
                                    "Full name"
                                )}
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder={t(
                                    "register.namePlaceholder",
                                    "Your name"
                                )}
                                autoComplete="name"
                                required
                                disabled={isRegistering}
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-field">

                            <label htmlFor="email">
                                {t(
                                    "register.email",
                                    "Email address"
                                )}
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder={t(
                                    "register.emailPlaceholder",
                                    "you@example.com"
                                )}
                                autoComplete="email"
                                required
                                disabled={isRegistering}
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-field">

                            <label htmlFor="password">
                                {t(
                                    "register.password",
                                    "Password"
                                )}
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder={t(
                                    "register.passwordPlaceholder",
                                    "Create a password"
                                )}
                                autoComplete="new-password"
                                required
                                disabled={isRegistering}
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="form-field">

                            <label htmlFor="confirm-password">
                                {t(
                                    "register.confirmPassword",
                                    "Confirm password"
                                )}
                            </label>

                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                placeholder={t(
                                    "register.confirmPasswordPlaceholder",
                                    "Repeat your password"
                                )}
                                autoComplete="new-password"
                                required
                                disabled={isRegistering}
                            />

                        </div>


                        {/* ERROR */}

                        {(error || authError) && (

                            <div
                                className="register-error"
                                role="alert"
                            >
                                {error || authError}
                            </div>

                        )}


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className={
                                `register-submit ${
                                    isPatient
                                        ? "patient-submit"
                                        : "caregiver-submit"
                                }`
                            }
                            disabled={isRegistering}
                        >

                            {isRegistering
                                ? t(
                                    "register.creatingAccount",
                                    "Creating account..."
                                )
                                : isPatient
                                    ? t(
                                        "register.createPatientAccount",
                                        "Create Patient Account"
                                    )
                                    : t(
                                        "register.createCaregiverAccount",
                                        "Create Caregiver Account"
                                    )}

                            {!isRegistering && (
                                <span aria-hidden="true">
                                    →
                                </span>
                            )}

                        </button>

                    </form>


                    {/* FOOTER */}

                    <div className="register-footer">

                        <p>

                            {t(
                                "register.alreadyHaveAccount",
                                "Already have an account?"
                            )}{" "}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/login/${role}`
                                    )
                                }
                                disabled={isRegistering}
                            >
                                {t(
                                    "register.logIn",
                                    "Log in"
                                )}
                            </button>

                        </p>


                        <span>
                            {t(
                                "register.privateSecure",
                                "Your information is kept private and secure."
                            )}
                        </span>

                    </div>

                </div>

            </div>

        </main>
    );
}