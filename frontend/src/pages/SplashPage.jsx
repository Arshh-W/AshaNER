import {
    ArrowRight,
    Brain,
    CalendarCheck2,
    HeartHandshake,
    ShieldCheck,
    Gamepad2,
    Volume2,
    WifiOff,
    UsersRound,
    Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Logo from "../components/common/Logo";

export default function SplashPage() {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    const goToRegister = () => {
        navigate("/register");
    };

    return (
        <main className="splash-page">

            {/* =========================================
                NAVBAR
            ========================================= */}
            <header className="splash-nav">
                <div className="splash-container splash-nav-inner">

                    <button
                        className="splash-brand"
                        type="button"
                        onClick={() => navigate("/")}
                        aria-label="AshaNER home"
                    >
                        <Logo />
                        <span className="splash-brand-name">
                            AshaNER
                        </span>
                    </button>

                    <nav className="splash-nav-actions">
                        <button
                            type="button"
                            className="splash-login-btn"
                            onClick={goToLogin}
                        >
                            Log In
                        </button>

                        <button
                            type="button"
                            className="splash-primary-btn splash-nav-cta"
                            onClick={goToRegister}
                        >
                            Get Started
                            <ArrowRight size={18} />
                        </button>
                    </nav>

                </div>
            </header>


            {/* =========================================
                HERO
            ========================================= */}
            <section className="splash-hero">

                <div className="splash-container splash-hero-grid">

                    <div className="splash-hero-copy">

                        <div className="splash-eyebrow">
                            <span className="splash-eyebrow-dot" />
                            COGNITIVE CARE & MEMORY ASSISTANCE
                        </div>

                        <h1 className="splash-hero-title">
                            Helping memories
                            <br />
                            stay{" "}
                            <span>connected.</span>
                        </h1>

                        <p className="splash-hero-description">
                            AshaNER brings gentle memory activities,
                            familiar routines, meaningful moments,
                            and caregiver support together in one
                            calm and accessible place.
                        </p>

                        <div className="splash-hero-actions">

                            <button
                                type="button"
                                className="splash-primary-btn splash-large-btn"
                                onClick={goToLogin}
                            >
                                Get Started
                                <ArrowRight size={20} />
                            </button>

                            <button
                                type="button"
                                className="splash-secondary-btn"
                                onClick={goToLogin}
                            >
                                <UsersRound size={19} />
                                I'm a Caregiver
                            </button>

                        </div>

                        <div className="splash-trust-row">

                            <div>
                                <ShieldCheck size={17} />
                                <span>
                                    Designed for everyday care
                                </span>
                            </div>

                            <div>
                                <HeartHandshake size={17} />
                                <span>
                                    Gentle by design
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* HERO PRODUCT VISUAL */}
                    <div className="splash-hero-visual">

                        <div className="splash-glow splash-glow-one" />
                        <div className="splash-glow splash-glow-two" />

                        <div className="splash-care-card">

                            <div className="splash-card-top">

                                <div className="splash-card-brand">
                                    <div className="splash-static-logo">
                                        <Logo />
                                    </div>

                                    <div>
                                        <strong>AshaNER</strong>
                                        <span>
                                            Cognitive Care
                                        </span>
                                    </div>
                                </div>

                                <span className="splash-status">
                                    Care today
                                </span>

                            </div>


                            <div className="splash-card-heading">
                                <span>
                                    A calmer day,
                                </span>

                                <strong>
                                    one moment at a time.
                                </strong>
                            </div>


                            <div className="splash-mini-cards">

                                <div className="splash-mini-card memory">
                                    <div className="splash-mini-icon">
                                        <Brain size={21} />
                                    </div>

                                    <div>
                                        <strong>
                                            Gentle Recall
                                        </strong>

                                        <span>
                                            Memory activities
                                        </span>
                                    </div>
                                </div>


                                <div className="splash-mini-card routine">
                                    <div className="splash-mini-icon">
                                        <CalendarCheck2 size={21} />
                                    </div>

                                    <div>
                                        <strong>
                                            Daily Routine
                                        </strong>

                                        <span>
                                            Familiar activities
                                        </span>
                                    </div>
                                </div>


                                <div className="splash-mini-card family">
                                    <div className="splash-mini-icon">
                                        <HeartHandshake size={21} />
                                    </div>

                                    <div>
                                        <strong>
                                            Connected Care
                                        </strong>

                                        <span>
                                            Family support
                                        </span>
                                    </div>
                                </div>

                            </div>


                            <div className="splash-card-footer">
                                <span>
                                    Today feels familiar.
                                </span>

                                <div className="splash-progress">
                                    <span />
                                </div>
                            </div>

                        </div>

                        <div className="splash-floating-card splash-floating-top">
                            <Brain size={18} />
                            <div>
                                <strong>Memory</strong>
                                <span>Gentle activities</span>
                            </div>
                        </div>

                        <div className="splash-floating-card splash-floating-bottom">
                            <HeartHandshake size={18} />
                            <div>
                                <strong>Connected Care</strong>
                                <span>Family support</span>
                            </div>
                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                FEATURES
            ========================================= */}
            <section className="splash-section splash-features">

                <div className="splash-container">

                    <div className="splash-section-heading">

                        <div className="splash-eyebrow">
                            <span className="splash-eyebrow-dot" />
                            ONE CALMER PLACE FOR CARE
                        </div>

                        <h2>
                            Built around the moments
                            <br />
                            that matter every day.
                        </h2>

                        <p>
                            Simple tools that support memory,
                            routines, connection, and independence.
                        </p>

                    </div>


                    <div className="splash-feature-grid">

                        <article className="splash-feature-card">

                            <div className="splash-feature-icon green">
                                <Brain size={25} />
                            </div>

                            <span className="splash-feature-label">
                                MEMORY
                            </span>

                            <h3>
                                Gentle Memory Activities
                            </h3>

                            <p>
                                Play relaxed recall activities
                                using familiar places, objects,
                                sounds, patterns, and everyday
                                memories.
                            </p>

                        </article>


                        <article className="splash-feature-card">

                            <div className="splash-feature-icon coral">
                                <CalendarCheck2 size={25} />
                            </div>

                            <span className="splash-feature-label">
                                ROUTINES
                            </span>

                            <h3>
                                Familiar Daily Routines
                            </h3>

                            <p>
                                Keep important activities,
                                hydration, appointments, and
                                everyday routines easy to follow.
                            </p>

                        </article>


                        <article className="splash-feature-card">

                            <div className="splash-feature-icon gold">
                                <UsersRound size={25} />
                            </div>

                            <span className="splash-feature-label">
                                FAMILY
                            </span>

                            <h3>
                                Stay Connected
                            </h3>

                            <p>
                                Give caregivers a clearer picture
                                of daily progress while keeping
                                family members connected.
                            </p>

                        </article>

                    </div>

                </div>

            </section>


            {/* =========================================
                TWO VIEWS
            ========================================= */}
            <section className="splash-section splash-views">

                <div className="splash-container">

                    <div className="splash-section-heading">

                        <div className="splash-eyebrow">
                            <span className="splash-eyebrow-dot" />
                            DESIGNED FOR BOTH SIDES OF CARE
                        </div>

                        <h2>
                            One experience.
                            <br />
                            Two helpful views.
                        </h2>

                        <p>
                            AshaNER keeps the patient experience
                            simple while giving caregivers the
                            information they need.
                        </p>

                    </div>


                    <div className="splash-view-grid">

                        {/* PATIENT */}
                        <article className="splash-view-card patient">

                            <div className="splash-view-card-top">

                                <span className="splash-view-pill green-pill">
                                    PATIENT VIEW
                                </span>

                                <Brain size={26} />

                            </div>

                            <h3>
                                A calm space for the person
                                receiving care.
                            </h3>

                            <p>
                                Large, simple actions help make
                                everyday activities and cognitive
                                exercises easier to understand.
                            </p>

                            <div className="splash-check-grid">

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>
                                    Simple daily schedule
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>
                                    Gentle brain games
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>
                                    Voice assistance
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>
                                    One-touch family contact
                                </div>

                            </div>

                        </article>


                        {/* CAREGIVER */}
                        <article className="splash-view-card caregiver">

                            <div className="splash-view-card-top">

                                <span className="splash-view-pill coral-pill">
                                    CAREGIVER VIEW
                                </span>

                                <HeartHandshake size={26} />

                            </div>

                            <h3>
                                A clearer picture of everyday
                                wellbeing.
                            </h3>

                            <p>
                                Caregivers can stay informed about
                                routines, activities, appointments,
                                and meaningful changes.
                            </p>

                            <div className="splash-check-grid">

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>
                                    Daily care overview
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>
                                    Cognitive progress
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>
                                    Routine tracking
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>
                                    Safety information
                                </div>

                            </div>

                        </article>

                    </div>

                </div>

            </section>


            {/* =========================================
                ACCESSIBILITY
            ========================================= */}
            <section className="splash-section splash-simple">

                <div className="splash-container">

                    <div className="splash-section-heading">

                        <div className="splash-eyebrow">
                            <span className="splash-eyebrow-dot" />
                            MADE FOR REAL-WORLD USE
                        </div>

                        <h2>
                            Simple when things
                            <br />
                            need to be simple.
                        </h2>

                    </div>


                    <div className="splash-simple-grid">

                        <div className="splash-simple-card">

                            <div className="splash-simple-icon">
                                <Volume2 size={22} />
                            </div>

                            <div>
                                <h3>
                                    Voice Assistance
                                </h3>

                                <p>
                                    Listen and interact naturally
                                </p>
                            </div>

                        </div>


                        <div className="splash-simple-card">

                            <div className="splash-simple-icon">
                                <Gamepad2 size={22} />
                            </div>

                            <div>
                                <h3>
                                    Gentle Activities
                                </h3>

                                <p>
                                    No-pressure cognitive exercises
                                </p>
                            </div>

                        </div>


                        <div className="splash-simple-card">

                            <div className="splash-simple-icon">
                                <WifiOff size={22} />
                            </div>

                            <div>
                                <h3>
                                    Offline Friendly
                                </h3>

                                <p>
                                    Important features remain available
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                FINAL CTA
            ========================================= */}
            <section className="splash-final">

                <div className="splash-container">

                    <div className="splash-final-card">

                        <div>

                            <div className="splash-eyebrow">
                                <span className="splash-eyebrow-dot" />
                                A CALMER APPROACH TO COGNITIVE CARE
                            </div>

                            <h2>
                                Care that feels{" "}
                                <span>familiar.</span>
                            </h2>

                            <p>
                                Begin your AshaNER journey and keep
                                the important moments connected.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="splash-primary-btn splash-final-btn"
                            onClick={goToLogin}
                        >
                            Get Started
                            <ArrowRight size={20} />
                        </button>

                    </div>

                </div>

            </section>


            {/* =========================================
                FOOTER
            ========================================= */}
            <footer className="splash-footer">

                <div className="splash-container splash-footer-inner">

                    <div className="splash-footer-brand">

                        <div className="splash-footer-logo">
                            <Logo />
                        </div>

                        <div>
                            <strong>AshaNER</strong>
                            <span>
                                Cognitive Care & Memory Assistance
                            </span>
                        </div>

                    </div>

                    <span className="splash-footer-copy">
                        Built with care.
                    </span>

                </div>

            </footer>

        </main>
    );
}