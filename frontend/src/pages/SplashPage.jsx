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
import { useLanguage } from "../context/LanguageContext";

export default function SplashPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const goToLogin = () => {
        navigate("/login");
    };

    const goToRegister = () => {
        navigate("/register");
    };

    return (
        <main className="splash-page">

            {/* =========================================
                HERO
                Navbar is handled globally
            ========================================= */}

            <section className="splash-hero">

                <div className="splash-container splash-hero-grid">

                    <div className="splash-hero-copy">

                        <div className="splash-eyebrow">
                            <span className="splash-eyebrow-dot" />
                            {t(
                                "splash.cognitiveCare",
                                "COGNITIVE CARE & MEMORY ASSISTANCE"
                            )}
                        </div>

                        <h1 className="splash-hero-title">
                            {t(
                                "splash.helpingMemories",
                                "Helping memories"
                            )}

                            <br />

                            {t(
                                "splash.stay",
                                "stay"
                            )}{" "}

                            <span>
                                {t(
                                    "splash.connected",
                                    "connected."
                                )}
                            </span>
                        </h1>

                        <p className="splash-hero-description">
                            {t(
                                "splash.description",
                                "AshaNER brings gentle memory activities, familiar routines, meaningful moments, and caregiver support together in one calm and accessible place."
                            )}
                        </p>

                        <div className="splash-hero-actions">

                            <button
                                type="button"
                                className="splash-primary-btn splash-large-btn"
                                onClick={goToRegister}
                            >
                                {t(
                                    "splash.getStarted",
                                    "Get Started"
                                )}

                                <ArrowRight size={20} />
                            </button>

                            <button
                                type="button"
                                className="splash-secondary-btn"
                                onClick={goToLogin}
                            >
                                {t(
                                    "splash.welcomeBack",
                                    "Welcome Back"
                                )}
                            </button>

                        </div>

                        <div className="splash-trust-row">

                            <div>
                                <ShieldCheck size={17} />

                                <span>
                                    {t(
                                        "splash.designedForEverydayCare",
                                        "Designed for everyday care"
                                    )}
                                </span>
                            </div>

                            <div>
                                <HeartHandshake size={17} />

                                <span>
                                    {t(
                                        "splash.gentleByDesign",
                                        "Gentle by design"
                                    )}
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
                                        <strong>
                                            AshaNER
                                        </strong>

                                        <span>
                                            {t(
                                                "splash.cognitiveCare",
                                                "Cognitive Care"
                                            )}
                                        </span>
                                    </div>

                                </div>

                                <span className="splash-status">
                                    {t(
                                        "splash.careToday",
                                        "Care today"
                                    )}
                                </span>

                            </div>


                            <div className="splash-card-heading">

                                <span>
                                    {t(
                                        "splash.calmerDay",
                                        "A calmer day,"
                                    )}
                                </span>

                                <strong>
                                    {t(
                                        "splash.oneMomentAtATime",
                                        "one moment at a time."
                                    )}
                                </strong>

                            </div>


                            <div className="splash-mini-cards">

                                <div className="splash-mini-card memory">

                                    <div className="splash-mini-icon">
                                        <Brain size={21} />
                                    </div>

                                    <div>
                                        <strong>
                                            {t(
                                                "splash.gentleRecall",
                                                "Gentle Recall"
                                            )}
                                        </strong>

                                        <span>
                                            {t(
                                                "splash.memoryActivities",
                                                "Memory activities"
                                            )}
                                        </span>
                                    </div>

                                </div>


                                <div className="splash-mini-card routine">

                                    <div className="splash-mini-icon">
                                        <CalendarCheck2 size={21} />
                                    </div>

                                    <div>
                                        <strong>
                                            {t(
                                                "splash.dailyRoutine",
                                                "Daily Routine"
                                            )}
                                        </strong>

                                        <span>
                                            {t(
                                                "splash.familiarActivities",
                                                "Familiar activities"
                                            )}
                                        </span>
                                    </div>

                                </div>


                                <div className="splash-mini-card family">

                                    <div className="splash-mini-icon">
                                        <HeartHandshake size={21} />
                                    </div>

                                    <div>
                                        <strong>
                                            {t(
                                                "splash.connectedCare",
                                                "Connected Care"
                                            )}
                                        </strong>

                                        <span>
                                            {t(
                                                "splash.familySupport",
                                                "Family support"
                                            )}
                                        </span>
                                    </div>

                                </div>

                            </div>


                            <div className="splash-card-footer">

                                <span>
                                    {t(
                                        "splash.todayFeelsFamiliar",
                                        "Today feels familiar."
                                    )}
                                </span>

                                <div className="splash-progress">
                                    <span />
                                </div>

                            </div>

                        </div>


                        <div className="splash-floating-card splash-floating-top">

                            <Brain size={18} />

                            <div>
                                <strong>
                                    {t(
                                        "splash.memory",
                                        "Memory"
                                    )}
                                </strong>

                                <span>
                                    {t(
                                        "splash.gentleActivities",
                                        "Gentle activities"
                                    )}
                                </span>
                            </div>

                        </div>


                        <div className="splash-floating-card splash-floating-bottom">

                            <HeartHandshake size={18} />

                            <div>
                                <strong>
                                    {t(
                                        "splash.connectedCare",
                                        "Connected Care"
                                    )}
                                </strong>

                                <span>
                                    {t(
                                        "splash.familySupport",
                                        "Family support"
                                    )}
                                </span>
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

                            {t(
                                "splash.oneCalmerPlace",
                                "ONE CALMER PLACE FOR CARE"
                            )}
                        </div>

                        <h2>
                            {t(
                                "splash.builtAroundMoments",
                                "Built around the moments"
                            )}

                            <br />

                            {t(
                                "splash.thatMatter",
                                "that matter every day."
                            )}
                        </h2>

                        <p>
                            {t(
                                "splash.simpleTools",
                                "Simple tools that support memory, routines, connection, and independence."
                            )}
                        </p>

                    </div>


                    <div className="splash-feature-grid">

                        <article className="splash-feature-card">

                            <div className="splash-feature-icon green">
                                <Brain size={25} />
                            </div>

                            <span className="splash-feature-label">
                                {t(
                                    "splash.memory",
                                    "MEMORY"
                                )}
                            </span>

                            <h3>
                                {t(
                                    "splash.gentleMemoryActivities",
                                    "Gentle Memory Activities"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "splash.gentleMemoryDescription",
                                    "Play relaxed recall activities using familiar places, objects, sounds, patterns, and everyday memories."
                                )}
                            </p>

                        </article>


                        <article className="splash-feature-card">

                            <div className="splash-feature-icon coral">
                                <CalendarCheck2 size={25} />
                            </div>

                            <span className="splash-feature-label">
                                {t(
                                    "splash.routines",
                                    "ROUTINES"
                                )}
                            </span>

                            <h3>
                                {t(
                                    "splash.familiarDailyRoutines",
                                    "Familiar Daily Routines"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "splash.familiarDailyDescription",
                                    "Keep important activities, hydration, appointments, and everyday routines easy to follow."
                                )}
                            </p>

                        </article>


                        <article className="splash-feature-card">

                            <div className="splash-feature-icon gold">
                                <UsersRound size={25} />
                            </div>

                            <span className="splash-feature-label">
                                {t(
                                    "splash.family",
                                    "FAMILY"
                                )}
                            </span>

                            <h3>
                                {t(
                                    "splash.stayConnected",
                                    "Stay Connected"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "splash.stayConnectedDescription",
                                    "Give caregivers a clearer picture of daily progress while keeping family members connected."
                                )}
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

                            {t(
                                "splash.designedForBothSides",
                                "DESIGNED FOR BOTH SIDES OF CARE"
                            )}
                        </div>

                        <h2>
                            {t(
                                "splash.oneExperience",
                                "One experience."
                            )}

                            <br />

                            {t(
                                "splash.twoHelpfulViews",
                                "Two helpful views."
                            )}
                        </h2>

                        <p>
                            {t(
                                "splash.description",
                                "AshaNER keeps the patient experience simple while giving caregivers the information they need."
                            )}
                        </p>

                    </div>


                    <div className="splash-view-grid">

                        {/* PATIENT */}

                        <article className="splash-view-card patient">

                            <div className="splash-view-card-top">

                                <span className="splash-view-pill green-pill">
                                    {t(
                                        "splash.patientView",
                                        "PATIENT VIEW"
                                    )}
                                </span>

                                <Brain size={26} />

                            </div>

                            <h3>
                                {t(
                                    "splash.patientTitle",
                                    "A calm space for the person receiving care."
                                )}
                            </h3>

                            <p>
                                {t(
                                    "splash.patientDescription",
                                    "Large, simple actions help make everyday activities and cognitive exercises easier to understand."
                                )}
                            </p>


                            <div className="splash-check-grid">

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>

                                    {t(
                                        "splash.simpleDailySchedule",
                                        "Simple daily schedule"
                                    )}
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>

                                    {t(
                                        "splash.gentleBrainGames",
                                        "Gentle brain games"
                                    )}
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>

                                    {t(
                                        "splash.voiceAssistance",
                                        "Voice assistance"
                                    )}
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>

                                    {t(
                                        "splash.oneTouchFamilyContact",
                                        "One-touch family contact"
                                    )}
                                </div>

                            </div>

                        </article>


                        {/* CAREGIVER */}

                        <article className="splash-view-card caregiver">

                            <div className="splash-view-card-top">

                                <span className="splash-view-pill coral-pill">
                                    {t(
                                        "splash.caregiverView",
                                        "CAREGIVER VIEW"
                                    )}
                                </span>

                                <HeartHandshake size={26} />

                            </div>

                            <h3>
                                {t(
                                    "splash.caregiverTitle",
                                    "A clearer picture of everyday wellbeing."
                                )}
                            </h3>

                            <p>
                                {t(
                                    "splash.caregiverDescription",
                                    "Caregivers can stay informed about routines, activities, appointments, and meaningful changes."
                                )}
                            </p>


                            <div className="splash-check-grid">

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>

                                    {t(
                                        "splash.dailyCareOverview",
                                        "Daily care overview"
                                    )}
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>

                                    {t(
                                        "splash.cognitiveProgress",
                                        "Cognitive progress"
                                    )}
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>

                                    {t(
                                        "splash.routineTracking",
                                        "Routine tracking"
                                    )}
                                </div>

                                <div>
                                    <span>
                                        <Check size={13} />
                                    </span>

                                    {t(
                                        "splash.safetyInformation",
                                        "Safety information"
                                    )}
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

                            {t(
                                "splash.madeForRealWorld",
                                "MADE FOR REAL-WORLD USE"
                            )}

                        </div>

                        <h2>
                            {t(
                                "splash.simpleWhenThings",
                                "Simple when things"
                            )}

                            <br />

                            {t(
                                "splash.needToBeSimple",
                                "need to be simple."
                            )}
                        </h2>

                    </div>


                    <div className="splash-simple-grid">

                        <div className="splash-simple-card">

                            <div className="splash-simple-icon">
                                <Volume2 size={22} />
                            </div>

                            <div>

                                <h3>
                                    {t(
                                        "splash.voiceAssistance",
                                        "Voice Assistance"
                                    )}
                                </h3>

                                <p>
                                    {t(
                                        "splash.listenNaturally",
                                        "Listen and interact naturally"
                                    )}
                                </p>

                            </div>

                        </div>


                        <div className="splash-simple-card">

                            <div className="splash-simple-icon">
                                <Gamepad2 size={22} />
                            </div>

                            <div>

                                <h3>
                                    {t(
                                        "splash.gentleActivities",
                                        "Gentle Activities"
                                    )}
                                </h3>

                                <p>
                                    {t(
                                        "splash.noPressure",
                                        "No-pressure cognitive exercises"
                                    )}
                                </p>

                            </div>

                        </div>


                        <div className="splash-simple-card">

                            <div className="splash-simple-icon">
                                <WifiOff size={22} />
                            </div>

                            <div>

                                <h3>
                                    {t(
                                        "splash.offlineFriendly",
                                        "Offline Friendly"
                                    )}
                                </h3>

                                <p>
                                    {t(
                                        "splash.importantFeatures",
                                        "Important features remain available"
                                    )}
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

                                {t(
                                    "splash.calmerApproach",
                                    "A CALMER APPROACH TO COGNITIVE CARE"
                                )}

                            </div>

                            <h2>
                                {t(
                                    "splash.careThatFeels",
                                    "Care that feels"
                                )}{" "}

                                <span>
                                    {t(
                                        "splash.familiar",
                                        "familiar."
                                    )}
                                </span>
                            </h2>

                            <p>
                                {t(
                                    "splash.journey",
                                    "Begin your AshaNER journey and keep the important moments connected."
                                )}
                            </p>

                        </div>


                        <button
                            type="button"
                            className="splash-primary-btn splash-final-btn"
                            onClick={goToLogin}
                        >
                            {t(
                                "splash.getStarted",
                                "Get Started"
                            )}

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

                            <strong>
                                AshaNER
                            </strong>

                            <span>
                                {t(
                                    "splash.cognitiveCare",
                                    "Cognitive Care & Memory Assistance"
                                )}
                            </span>

                        </div>

                    </div>

                    <span className="splash-footer-copy">
                        {t(
                            "splash.builtWithCare",
                            "Built with care."
                        )}
                    </span>

                </div>

            </footer>

        </main>
    );
}