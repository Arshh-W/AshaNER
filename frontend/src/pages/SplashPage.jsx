import {
    Brain,
    HeartHandshake,
    Users,
    ArrowRight
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function SplashPage() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/login");
    };

    return (
        <main className="landing-page">

            {/* HERO */}
            <section className="landing-hero">

                <div className="landing-logo-area">
                    {/* Reserved for the final SVG + GSAP logo animation */}
                    <div className="logo-animation-placeholder">
                        <div className="brand-mark">
                            🌿
                        </div>

                        <span>
                            AshaNER
                        </span>
                    </div>
                </div>

                <div className="landing-content">

                    <p className="landing-eyebrow">
                        Cognitive Care & Memory Assistance
                    </p>

                    <h1>
                        Helping memories stay
                        <span> connected.</span>
                    </h1>

                    <p className="landing-description">
                        AshaNER brings gentle cognitive
                        activities, familiar routines,
                        meaningful memories, and caregiver
                        support together in one simple,
                        accessible experience.
                    </p>

                    <div className="landing-actions">

                        <button
                            type="button"
                            className="landing-primary-btn"
                            onClick={handleGetStarted}
                        >
                            Get Started
                            <ArrowRight size={20} />
                        </button>

                        <button
                            type="button"
                            className="landing-secondary-btn"
                            onClick={handleGetStarted}
                        >
                            Log In
                        </button>

                    </div>

                </div>
            </section>

            {/* FEATURES */}
            <section className="landing-features">

                <div className="feature-card">

                    <div className="feature-icon">
                        <Brain size={26} />
                    </div>

                    <h2>
                        Gentle Memory Activities
                    </h2>

                    <p>
                        Enjoy simple games and recall
                        exercises designed to encourage
                        cognitive engagement without
                        pressure.
                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">
                        <HeartHandshake size={26} />
                    </div>

                    <h2>
                        Everyday Care Support
                    </h2>

                    <p>
                        Keep familiar routines, daily
                        activities, and helpful reminders
                        together in one place.
                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">
                        <Users size={26} />
                    </div>

                    <h2>
                        Connected Caregivers
                    </h2>

                    <p>
                        Help caregivers stay connected
                        with the people and routines that
                        matter most.
                    </p>

                </div>

            </section>

            {/* CLOSING CTA */}
            <section className="landing-cta">

                <div>

                    <p className="landing-eyebrow">
                        A calmer approach to cognitive care
                    </p>

                    <h2>
                        Care that feels familiar.
                    </h2>

                    <p>
                        Start your AshaNER journey today.
                    </p>

                </div>

                <button
                    type="button"
                    className="landing-primary-btn"
                    onClick={handleGetStarted}
                >
                    Get Started
                    <ArrowRight size={20} />
                </button>

            </section>

        </main>
    );
}