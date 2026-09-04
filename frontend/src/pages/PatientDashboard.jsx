import { useState } from "react";

import {
    CheckCircle2,
    Droplets,
    PhoneCall,
    Brain,
    Sun
} from "lucide-react";

import mockRoutines from "../data/mockRoutines";
import useWebSpeech from "../hooks/useWebSpeech";

import VoiceHelp from "../components/common/VoiceHelp";
import AudioPrompt from "../components/common/AudioPrompt";

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";


export default function PatientDashboard() {

    const { t } = useLanguage();
    const navigate = useNavigate();

    useWebSpeech();


    /* =====================================================
       TRANSLATION HELPER

       If a translation key does not exist yet,
       show the English fallback instead of:

       dashboard.someKey
       ===================================================== */

    const translate = (key, fallback) => {
        const translated = t(key);

        if (!translated || translated === key) {
            return fallback;
        }

        return translated;
    };


    /* =====================================================
       ROUTINE DATA
       ===================================================== */

    const [items, setItems] = useState(
        mockRoutines.map((routine) => ({
            ...routine,
            status: "pending",
            time:
                routine.id === "routine-001"
                    ? "10:30 AM"
                    : routine.id === "routine-002"
                        ? "11:00 AM"
                        : "8:30 PM",
            detail: routine.description
        }))
    );


    /* =====================================================
       WATER TRACKER
       ===================================================== */

    const [water, setWater] = useState(3);


    /* =====================================================
       MARK ROUTINE AS TAKEN
       ===================================================== */

    const take = (id) => {

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status: "done"
                    }
                    : item
            )
        );

    };


    return (
        <div className="patient">

            {/* =================================================
                MORNING ORIENTATION
               ================================================= */}

            <section className="orientation card">

                <div>

                    <span className="eyebrow">

                        <Sun size={15} />

                        {translate(
                            "dashboard.weather",
                            "Sunny in Jorhat, 24°C • Pleasant day for tea"
                        )}

                    </span>


                    <h1>

                        {translate(
                            "dashboard.goodMorning",
                            "Good Morning, Kangkan!"
                        )}

                        <em>

                            {translate(
                                "dashboard.assameseGreeting",
                                "(শুভ বাতিপুৱা)"
                            )}

                        </em>

                    </h1>


                    <div className="time-line">

                        <strong>
                            10:15 AM
                        </strong>

                        <span>

                            {translate(
                                "dashboard.date",
                                "Wednesday, 4 October"
                            )}

                        </span>

                    </div>

                </div>


                <AudioPrompt>

                    {translate(
                        "dashboard.morningBriefing",
                        "Listen to Morning Briefing"
                    )}

                </AudioPrompt>

            </section>


            {/* =================================================
                CARE SCHEDULE
               ================================================= */}

            <div className="section-heading">

                <h2>

                    {translate(
                        "dashboard.careSchedule",
                        "Today's Care Schedule"
                    )}

                </h2>


                <span className="count-chip">

                    {
                        items.filter(
                            (item) =>
                                item.status !== "done"
                        ).length
                    }

                    {" "}

                    {translate(
                        "dashboard.actionsPending",
                        "Actions Pending"
                    )}

                </span>

            </div>


            <section className="routine-grid">

                {/* =============================================
                    MORNING ROUTINE
                   ============================================= */}

                <RoutineCard
                    item={items[0]}
                    onTake={() =>
                        take(items[0]?.id)
                    }
                    translate={translate}
                />


                {/* =============================================
                    WATER TRACKER
                   ============================================= */}

                <WaterCard
                    value={water}
                    onAdd={() =>
                        setWater(
                            (value) =>
                                Math.min(
                                    6,
                                    value + 1
                                )
                        )
                    }
                    translate={translate}
                />


                {/* =============================================
                    FAMILY VISIT
                   ============================================= */}

                <FamilyCard
                    translate={translate}
                />

            </section>


            {/* =================================================
                BRAIN GAME
               ================================================= */}

            <section className="brain-hero card">

                <div>

                    <span className="streak">

                        ✦{" "}

                        {translate(
                            "dashboard.streak",
                            "Streak: 4 Days Active"
                        )}

                    </span>


                    <small>

                        {translate(
                            "dashboard.dailyGentleRecall",
                            "Daily Gentle Recall"
                        )}

                    </small>


                    <h2>

                        {translate(
                            "dashboard.brainPuzzle",
                            "Today's Brain Puzzle:"
                        )}

                        {" "}

                        {translate(
                            "dashboard.kazirangaTea",
                            "Kaziranga & Tea Garden"
                        )}

                        {" "}

                        {translate(
                            "dashboard.patternMatch",
                            "Pattern Match"
                        )}

                    </h2>


                    <p>

                        {translate(
                            "dashboard.brainDescription",
                            "Gentle 5-minute memory exercise to stimulate recall. Match serene regional flora, birds, and tea plantation memories. No rush, take all the time you need."
                        )}

                    </p>


                    <div className="meta">

                        <span>

                            ◷{" "}

                            {translate(
                                "dashboard.fiveMinutes",
                                "5 Minutes"
                            )}

                        </span>


                        <span>

                            ◉{" "}

                            {translate(
                                "dashboard.relaxedPace",
                                "Relaxed Pace"
                            )}

                        </span>


                        <span>

                            {translate(
                                "dashboard.assameseSupport",
                                "অসমীয়া সহজ সহায়ক"
                            )}

                        </span>

                    </div>

                </div>


                <div className="puzzle-art">

                    <div className="tea-land">

                        🌿

                        <br />

                        {translate(
                            "dashboard.teaGarden",
                            "Tea Garden"
                        )}

                    </div>


                    <button
                        type="button"
                        className="gold-btn"
                        onClick={() =>
                            navigate(
                                "/patient/games"
                            )
                        }
                    >

                        <Brain />

                        {translate(
                            "dashboard.playBrainGame",
                            "Play Brain Game"
                        )}

                    </button>

                </div>

            </section>


            {/* =================================================
                HELP
               ================================================= */}

            <section className="help-card card">

                <div className="sos-dot">
                    SOS
                </div>


                <div>

                    <b>

                        {translate(
                            "dashboard.needHelp",
                            "Need help right away?"
                        )}

                    </b>


                    <p>

                        {translate(
                            "dashboard.helpDescription",
                            "One tap connects directly to Daughter Ananya or a local ASHA Health Worker Bina Gogoi."
                        )}

                    </p>

                </div>


                <AudioPrompt>

                    {translate(
                        "dashboard.sayHeyAsha",
                        "Say “Hey Asha”"
                    )}

                </AudioPrompt>


                <button
                    type="button"
                    className="coral-btn"
                    onClick={() =>
                        alert(
                            translate(
                                "dashboard.callingAnanya",
                                "Calling Ananya Barua…"
                            )
                        )
                    }
                >

                    <PhoneCall />

                    {translate(
                        "dashboard.callAsha",
                        "Call ASHA Bina"
                    )}

                </button>

            </section>


            {/* =================================================
                VOICE HELP
               ================================================= */}

            <VoiceHelp
                text={translate(
                    "dashboard.voiceHelp",
                    "Would you like to search for the Bamboo Jaapi hat, Biren?"
                )}
            />

        </div>
    );
}


/* =========================================================
   ROUTINE CARD
   ========================================================= */

function RoutineCard({
    item,
    onTake,
    translate
}) {

    if (!item) {
        return null;
    }


    return (
        <article className="routine-card card">

            <div className="routine-top">

                <span className="tag coral-tag">

                    ↓{" "}

                    {translate(
                        "dashboard.dueRightNow",
                        "Due Right Now"
                    )}

                </span>


                <b>
                    {item.time}
                </b>

            </div>


            <div className="photo-placeholder tea-table">

                🫖🌿

            </div>


            <h3>
                {item.title}
            </h3>


            <p>
                {item.detail}
            </p>


            <button
                type="button"
                className={
                    item.status === "done"
                        ? "done-btn"
                        : "dark-btn"
                }
                onClick={onTake}
            >

                <CheckCircle2 />


                {item.status === "done"
                    ? translate(
                        "dashboard.taken",
                        "Taken"
                    )
                    : translate(
                        "dashboard.markTaken",
                        "Mark Taken"
                    )}

            </button>

        </article>
    );
}


/* =========================================================
   WATER CARD
   ========================================================= */

function WaterCard({
    value,
    onAdd,
    translate
}) {

    return (
        <article className="routine-card card">

            <div className="routine-top">

                <span className="tag gold-tag">

                    ●{" "}

                    {translate(
                        "dashboard.routineHydration",
                        "Routine Hydration"
                    )}

                </span>


                <b>
                    11:00 AM
                </b>

            </div>


            <h3>

                {translate(
                    "dashboard.warmWaterGlass",
                    "Warm Water Glass"
                )}

            </h3>


            <p>

                {translate(
                    "dashboard.hydrationDescription",
                    "Stay hydrated for healthy blood flow. Aim for 6 glasses today."
                )}

            </p>


            <div className="progress-label">

                <span>

                    {translate(
                        "dashboard.hydrationTracker",
                        "Hydration Tracker"
                    )}

                </span>


                <b>

                    {value}{" "}

                    {translate(
                        "dashboard.of",
                        "of"
                    )}

                    {" "}6

                    <br />

                    {translate(
                        "dashboard.glasses",
                        "Glasses"
                    )}

                </b>

            </div>


            <div className="progress">

                <span
                    style={{
                        width: `${(value / 6) * 100}%`
                    }}
                />

            </div>


            <small>

                ♧{" "}

                {translate(
                    "dashboard.morningGardenWalk",
                    "Morning Garden Walk"
                )}

                <br />

                {translate(
                    "dashboard.gardenWalkDescription",
                    "30 mins with daughter in veranda (8:30 AM)"
                )}

            </small>


            <button
                type="button"
                className="light-btn"
                onClick={onAdd}
            >

                <Droplets />

                +{" "}

                {translate(
                    "dashboard.logWater",
                    "Log 1 Glass Water"
                )}

            </button>

        </article>
    );
}


/* =========================================================
   FAMILY CARD
   ========================================================= */

function FamilyCard({
    translate
}) {

    return (
        <article className="routine-card card">

            <div className="routine-top">

                <span className="tag green-tag">

                    ♡{" "}

                    {translate(
                        "dashboard.familyVisit",
                        "Family Visit"
                    )}

                </span>


                <b>
                    4:30 PM
                </b>

            </div>


            <div className="person-row">

                <div className="avatar">
                    👩🏽
                </div>


                <div>

                    <small>

                        {translate(
                            "dashboard.daughter",
                            "DAUGHTER"
                        )}

                    </small>


                    <h3>
                        Ananya Barua
                    </h3>


                    <p>

                        {translate(
                            "dashboard.familyVisitDescription",
                            "Visiting home today with fresh Assam pitha snacks"
                        )}

                    </p>

                </div>

            </div>


            <div className="note">

                ◷{" "}

                {translate(
                    "dashboard.familyVisitNote",
                    "Expected at 4:30 PM. She called at 9:00 AM to confirm she is bringing your favorite tea leaves."
                )}

            </div>


            <button
                type="button"
                className="coral-btn"
                onClick={() =>
                    alert(
                        translate(
                            "dashboard.callingAnanya",
                            "Calling Ananya Barua…"
                        )
                    )
                }
            >

                <PhoneCall />

                {translate(
                    "dashboard.callAnanya",
                    "Call Ananya (One-Touch)"
                )}

            </button>

        </article>
    );
}