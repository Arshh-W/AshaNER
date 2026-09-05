import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Logo from "../components/common/Logo";
import "../assets/styles/role-login.css";

export default function RoleLoginPage() {
    const { role } = useParams();
    const navigate = useNavigate();

    const {
        login,
        authError,
        isLoggingIn
    } = useAuth();

    const { t } = useLanguage();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isPatient = role === "patient";
    const isCaregiver = role === "caregiver";

    if (!isPatient && !isCaregiver) {
        return (
            <main className="role-login-page">
                <div className="role-login-card">
                    <h1>
                        {t(
                            "login.invalidLoginType",
                            "Invalid login type"
                        )}
                    </h1>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        {t(
                            "login.backToLogin",
                            "Back to login"
                        )}
                    </button>
                </div>
            </main>
        );
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email.trim() || !password) {
            return;
        }

        const success = await login(
            email.trim(),
            password,
            role
        );

        if (!success) {
            return;
        }

        navigate(
            isCaregiver
                ? "/caregiver"
                : "/patient",
            {
                replace: true
            }
        );
    };

    return (
        <main className="role-login-page">

            <div className="role-login-wrapper">

                {/* Back */}
                <button
                    type="button"
                    className="login-back"
                    onClick={() => navigate("/login")}
                >
                    <span aria-hidden="true">←</span>

                    {t(
                        "login.back",
                        "Back"
                    )}
                </button>

                {/* Card */}
                <div className="role-login-card">

                    {/* Logo */}
                    <div className="role-login-logo">
                        <Logo />
                    </div>

                    {/* Heading */}
                    <div className="role-login-heading">

                        <span
                            className={
                                isPatient
                                    ? "role-login-label patient-label"
                                    : "role-login-label caregiver-label"
                            }
                        >
                            {isPatient
                                ? t(
                                    "login.patientView",
                                    "PATIENT VIEW"
                                )
                                : t(
                                    "login.caregiverView",
                                    "CAREGIVER VIEW"
                                )}
                        </span>

                        <h1>
                            {t(
                                "login.welcome",
                                "Welcome back."
                            )}
                        </h1>

                        <p>
                            {isPatient
                                ? t(
                                    "login.patientLoginDescription",
                                    "Sign in to continue to your personal care space."
                                )
                                : t(
                                    "login.caregiverLoginDescription",
                                    "Sign in to continue managing connected care."
                                )}
                        </p>

                    </div>

                    {/* Form */}
                    <form
                        className="role-login-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Email */}
                        <div className="form-field">

                            <label htmlFor="email">
                                {t(
                                    "login.email",
                                    "Email address"
                                )}
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder={t(
                                    "login.emailPlaceholder",
                                    "you@example.com"
                                )}
                                autoComplete="email"
                                required
                                disabled={isLoggingIn}
                            />

                        </div>

                        {/* Password */}
                        <div className="form-field">

                            <label htmlFor="password">
                                {t(
                                    "login.password",
                                    "Password"
                                )}
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder={t(
                                    "login.passwordPlaceholder",
                                    "Enter your password"
                                )}
                                autoComplete="current-password"
                                required
                                disabled={isLoggingIn}
                            />

                        </div>

                        {/* Error */}
                        {authError && (
                            <div
                                className="role-login-error"
                                role="alert"
                            >
                                {authError}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className={
                                isPatient
                                    ? "login-submit patient-submit"
                                    : "login-submit caregiver-submit"
                            }
                            disabled={
                                isLoggingIn ||
                                !email.trim() ||
                                !password
                            }
                        >
                            {isLoggingIn
                                ? t(
                                    "login.signingIn",
                                    "Signing in..."
                                )
                                : isPatient
                                    ? t(
                                        "login.continueAsPatient",
                                        "Continue as Patient"
                                    )
                                    : t(
                                        "login.continueAsCaregiver",
                                        "Continue as Caregiver"
                                    )}

                            {!isLoggingIn && (
                                <span aria-hidden="true">
                                    →
                                </span>
                            )}
                        </button>

                    </form>

                    {/* Footer */}
                    <div className="role-login-footer">

                        <p>
                            {t(
                                "login.dontHaveAccount",
                                "Don't have an account?"
                            )}{" "}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/register/${role}`
                                    )
                                }
                            >
                                {t(
                                    "login.createOne",
                                    "Create one"
                                )}
                            </button>
                        </p>

                        <span>
                            {t(
                                "login.privateSecure",
                                "Your information is kept private and secure."
                            )}
                        </span>

                    </div>

                </div>

            </div>

        </main>
    );
}