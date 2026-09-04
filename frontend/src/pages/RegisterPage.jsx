import { useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Logo from "../components/common/Logo";

import "../assets/styles/register-page.css";


export default function RegisterPage() {

    const { role } = useParams();

    const navigate = useNavigate();

    const auth = useAuth();


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
                                Authentication unavailable.
                            </h1>

                            <p>
                                The authentication provider is not
                                available. Please refresh the page.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="register-submit patient-submit"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Refresh
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
                                Invalid registration type.
                            </h1>

                            <p>
                                Please choose whether you want
                                to register as a patient or caregiver.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="register-submit patient-submit"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Back to registration
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
                "Please fill in all fields."
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        if (password.length < 8) {

            setError(
                "Password must be at least 8 characters."
            );

            return;
        }


        if (typeof register !== "function") {

            setError(
                "Registration service is unavailable. Please refresh the page."
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
                    <span>←</span>
                    Back
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
                                ? "PATIENT VIEW"
                                : "CAREGIVER VIEW"}
                        </span>


                        <h1>
                            Create your account.
                        </h1>


                        <p>
                            {isPatient
                                ? "Set up your personal AshaNER care space."
                                : "Set up your connected caregiver account."
                            }
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
                                Full name
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
                                placeholder="Your name"
                                autoComplete="name"
                                required
                                disabled={isRegistering}
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-field">

                            <label htmlFor="email">
                                Email address
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
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                disabled={isRegistering}
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-field">

                            <label htmlFor="password">
                                Password
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
                                placeholder="Create a password"
                                autoComplete="new-password"
                                required
                                disabled={isRegistering}
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="form-field">

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
                                placeholder="Repeat your password"
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
                                ? "Creating account..."
                                : isPatient
                                    ? "Create Patient Account"
                                    : "Create Caregiver Account"
                            }

                            {!isRegistering && (
                                <span>→</span>
                            )}

                        </button>

                    </form>


                    {/* FOOTER */}

                    <div className="register-footer">

                        <p>
                            Already have an account?{" "}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/login/${role}`
                                    )
                                }
                                disabled={isRegistering}
                            >
                                Log in
                            </button>
                        </p>

                        <span>
                            Your information is kept private and secure.
                        </span>

                    </div>

                </div>

            </div>

        </main>
    );
}