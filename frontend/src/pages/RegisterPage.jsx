import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../components/common/Logo";
import api from "../services/api";
import "../assets/styles/register.css";

export default function RegisterPage() {
    const { role } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const isPatient = role === "patient";
    const isCaregiver = role === "caregiver";

    if (!isPatient && !isCaregiver) {
        return (
            <main className="register-page">
                <div className="register-card">
                    <h1>Invalid registration type</h1>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Back to login
                    </button>
                </div>
            </main>
        );
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters long."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setIsRegistering(true);

            await api.post("/auth/register", {
                email: email.trim(),
                password,
                role
            });

            /*
             * Registration succeeded.
             * Send the user to the appropriate login page.
             */
            navigate(`/login/${role}`, {
                replace: true,
                state: {
                    registered: true
                }
            });
        } catch (err) {
            console.error(
                "AshaNER registration failed:",
                err
            );

            setError(
                err?.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <main className="register-page">

            <div className="register-wrapper">

                {/* Back */}
                <button
                    type="button"
                    className="register-back"
                    onClick={() =>
                        navigate(`/login/${role}`)
                    }
                >
                    <span>←</span>
                    Back to sign in
                </button>

                {/* Card */}
                <div className="register-card">

                    {/* Logo */}
                    <div className="register-logo">
                        <Logo />
                    </div>

                    {/* Heading */}
                    <div className="register-heading">

                        <span
                            className={
                                isPatient
                                    ? "register-label patient-register-label"
                                    : "register-label caregiver-register-label"
                            }
                        >
                            {isPatient
                                ? "PATIENT ACCOUNT"
                                : "CAREGIVER ACCOUNT"}
                        </span>

                        <h1>
                            Create your account.
                        </h1>

                        <p>
                            {isPatient
                                ? "Create your personal AshaNER care space."
                                : "Create your caregiver account to stay connected and support care."}
                        </p>

                    </div>

                    {/* Form */}
                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Email */}
                        <div className="register-field">

                            <label htmlFor="register-email">
                                Email address
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                disabled={isRegistering}
                            />

                        </div>


                        {/* Password */}
                        <div className="register-field">

                            <label htmlFor="register-password">
                                Password
                            </label>

                            <input
                                id="register-password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Create a password"
                                autoComplete="new-password"
                                required
                                disabled={isRegistering}
                            />

                            <span className="register-hint">
                                Use at least 6 characters.
                            </span>

                        </div>


                        {/* Confirm password */}
                        <div className="register-field">

                            <label htmlFor="confirm-password">
                                Confirm password
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
                                placeholder="Enter your password again"
                                autoComplete="new-password"
                                required
                                disabled={isRegistering}
                            />

                        </div>


                        {/* Error */}
                        {error && (
                            <div
                                className="register-error"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}


                        {/* Submit */}
                        <button
                            type="submit"
                            className={
                                isPatient
                                    ? "register-submit patient-register-submit"
                                    : "register-submit caregiver-register-submit"
                            }
                            disabled={isRegistering}
                        >
                            {isRegistering
                                ? "Creating account..."
                                : "Create account"}

                            {!isRegistering && (
                                <span>→</span>
                            )}
                        </button>

                    </form>

                    {/* Existing account */}
                    <p className="register-footer">
                        Already have an account?{" "}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/login/${role}`)
                            }
                        >
                            Sign in
                        </button>
                    </p>

                </div>

            </div>

        </main>
    );
}