import { useState } from "react";
import {
    CheckCircle2,
    Droplets,
    Heart,
    PhoneCall,
    Brain,
    Sun
} from "lucide-react";

import mockRoutines from "../data/mockRoutines";
import useWebSpeech from "../hooks/useWebSpeech";

import VoiceHelp from "../components/common/VoiceHelp";
import AudioPrompt from "../components/common/AudioPrompt";

import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
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

    const [water, setWater] = useState(3);

    const navigate = useNavigate();

    const { speak } = useWebSpeech();

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

            {/* MORNING ORIENTATION */}
            <section className="orientation card">
                <div>
                    <span className="eyebrow">
                        <Sun size={15} />
                        Sunny in Jorhat, 24°C • Pleasant day for tea
                    </span>

                    <h1>
                        Good Morning, Kangkan!
                        <em>
                            (শুভ বাতিপুৱা)
                        </em>
                    </h1>

                    <div className="time-line">
                        <strong>
                            10:15 AM
                        </strong>

                        <span>
                            Wednesday, 4 October
                        </span>
                    </div>
                </div>

                <AudioPrompt>
                    Listen to Morning Briefing
                </AudioPrompt>
            </section>

            {/* CARE SCHEDULE */}
            <div className="section-heading">
                <h2>
                    Today's Care Schedule
                </h2>

                <span className="count-chip">
                    {
                        items.filter(
                            (item) =>
                                item.status !== "done"
                        ).length
                    }{" "}
                    Actions Pending
                </span>
            </div>

            <section className="routine-grid">

                <RoutineCard
                    item={items[0]}
                    onTake={() =>
                        take(items[0]?.id)
                    }
                />

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
                />

                <FamilyCard />

            </section>

            {/* BRAIN GAME */}
            <section className="brain-hero card">

                <div>
                    <span className="streak">
                        ✦ Streak: 4 Days Active
                    </span>

                    <small>
                        Daily Gentle Recall
                    </small>

                    <h2>
                        Today's Brain Puzzle:
                        Kaziranga & Tea Garden
                        Pattern Match
                    </h2>

                    <p>
                        Gentle 5-minute memory
                        exercise to stimulate recall.
                        Match serene regional flora,
                        birds, and tea plantation
                        memories. No rush, take all
                        the time you need.
                    </p>

                    <div className="meta">
                        <span>
                            ◷ 5 Minutes
                        </span>

                        <span>
                            ◉ Relaxed Pace
                        </span>

                        <span>
                            অসমীয়া সহজ সহায়ক
                        </span>
                    </div>
                </div>

                <div className="puzzle-art">

                    <div className="tea-land">
                        🌿
                        <br />
                        Tea Garden
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
                        Play Brain Game
                    </button>

                </div>

            </section>

            {/* HELP */}
            <section className="help-card card">

                <div className="sos-dot">
                    SOS
                </div>

                <div>
                    <b>
                        Need help right away?
                    </b>

                    <p>
                        One tap connects directly
                        to Daughter Ananya or a
                        local ASHA Health Worker
                        Bina Gogoi.
                    </p>
                </div>

                <AudioPrompt>
                    Say “Hey Asha”
                </AudioPrompt>

                <button
                    type="button"
                    className="coral-btn"
                    onClick={() =>
                        alert(
                            "Calling Ananya Barua…"
                        )
                    }
                >
                    <PhoneCall />
                    Call ASHA Bina
                </button>

            </section>

            {/* VOICE HELP */}
            <VoiceHelp
                text="Would you like to search for the Bamboo Jaapi hat, Biren?"
            />

        </div>
    );
}


/* ============================= */
/* ROUTINE CARD                   */
/* ============================= */

function RoutineCard({
    item,
    onTake
}) {
    if (!item) {
        return null;
    }

    return (
        <article className="routine-card card">

            <div className="routine-top">

                <span className="tag coral-tag">
                    ↓ Due Right Now
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
                    ? "Taken"
                    : "Mark Taken (নিশ্চিত)"}
            </button>

        </article>
    );
}


/* ============================= */
/* WATER CARD                     */
/* ============================= */

function WaterCard({
    value,
    onAdd
}) {
    return (
        <article className="routine-card card">

            <div className="routine-top">

                <span className="tag gold-tag">
                    ● Routine Hydration
                </span>

                <b>
                    11:00 AM
                </b>

            </div>

            <h3>
                Warm Water Glass
            </h3>

            <p>
                Stay hydrated for healthy
                blood flow. Aim for 6 glasses
                today.
            </p>

            <div className="progress-label">

                <span>
                    Hydration Tracker
                </span>

                <b>
                    {value} of 6
                    <br />
                    Glasses
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
                ♧ Morning Garden Walk
                <br />
                30 mins with daughter in
                veranda (8:30 AM)
            </small>

            <button
                type="button"
                className="light-btn"
                onClick={onAdd}
            >
                <Droplets />
                + Log 1 Glass Water
            </button>

        </article>
    );
}


/* ============================= */
/* FAMILY CARD                    */
/* ============================= */

function FamilyCard() {
    return (
        <article className="routine-card card">

            <div className="routine-top">

                <span className="tag green-tag">
                    ♡ Family Visit
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
                        DAUGHTER
                    </small>

                    <h3>
                        Ananya Barua
                    </h3>

                    <p>
                        Visiting home today with
                        fresh Assam pitha snacks
                    </p>

                </div>

            </div>

            <div className="note">
                ◷ Expected at 4:30 PM. She
                called at 9:00 AM to confirm
                she is bringing your favorite
                tea leaves.
            </div>

            <button
                type="button"
                className="coral-btn"
                onClick={() =>
                    alert(
                        "Calling Ananya Barua…"
                    )
                }
            >
                <PhoneCall />
                Call Ananya (One-Touch)
            </button>

        </article>
    );
}