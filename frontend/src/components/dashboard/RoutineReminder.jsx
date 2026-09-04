import React, { useState } from "react";

const RoutineReminder = () => {
    const [medicineTaken, setMedicineTaken] = useState(false);
    const [waterCount, setWaterCount] = useState(3);

    const markMedicineTaken = () => {
        setMedicineTaken(true);

        if ("vibrate" in navigator) {
            navigator.vibrate(40);
        }
    };

    const addWater = () => {
        setWaterCount((count) => Math.min(count + 1, 6));

        if ("vibrate" in navigator) {
            navigator.vibrate(20);
        }
    };

    return (
        <section className="routine-section">
            <div className="section-heading">
                <div>
                    <span className="section-marker"></span>
                    <h2>Today's Care Schedule</h2>
                </div>

                <span className="pending-badge">
                    3 Actions Pending
                </span>
            </div>

            <div className="routine-grid">

                {/* Medicine */}
                <article className="routine-card medicine-card">
                    <div className="routine-card-top">
                        <span className="status-badge due">
                            ! Due Right Now
                        </span>

                        <strong>10:00 AM</strong>
                    </div>

                    <div className="medicine-image">
                        <span>Pill Box 1</span>
                        <div className="medicine-placeholder">
                            💊
                        </div>
                    </div>

                    <h3>BP Medicine</h3>

                    <p>
                        Telmisartan 40mg • 1 tablet after
                        light breakfast with warm water
                    </p>

                    <button
                        className={`action-button green ${
                            medicineTaken ? "completed" : ""
                        }`}
                        onClick={markMedicineTaken}
                    >
                        {medicineTaken
                            ? "✓ Taken"
                            : "✓ Mark Taken"}
                    </button>
                </article>


                {/* Hydration */}
                <article className="routine-card hydration-card">
                    <div className="routine-card-top">
                        <span className="status-badge hydration">
                            ◉ Routine Hydration
                        </span>

                        <strong>11:00 AM</strong>
                    </div>

                    <h3>Warm Water Glass</h3>

                    <p>
                        Stay hydrated for healthy blood flow.
                        Aim for 6 glasses today.
                    </p>

                    <div className="hydration-tracker">
                        <div>
                            <span>Hydration<br />Tracker</span>

                            <strong>
                                {waterCount} of 6<br />
                                <small>Glasses</small>
                            </strong>
                        </div>

                        <div className="water-progress">
                            <span
                                style={{
                                    width: `${(waterCount / 6) * 100}%`,
                                }}
                            ></span>
                        </div>
                    </div>

                    <button
                        className="action-button gold"
                        onClick={addWater}
                    >
                        ♧ + Log 1 Glass Water
                    </button>
                </article>


                {/* Family */}
                <article className="routine-card family-card">
                    <div className="routine-card-top">
                        <span className="status-badge family">
                            ♡ Family Visit
                        </span>

                        <strong>4:30 PM</strong>
                    </div>

                    <div className="family-person">
                        <div className="family-avatar">
                            A
                        </div>

                        <div>
                            <small>DAUGHTER</small>
                            <h3>Ananya Barua</h3>
                            <p>
                                Visiting home today with
                                fresh Assam pitha snacks
                            </p>
                        </div>
                    </div>

                    <div className="visit-note">
                        <strong>◷ Expected at 4:30 PM.</strong>

                        <p>
                            She called at 9:00 AM to confirm
                            she is bringing your favorite tea leaves.
                        </p>
                    </div>

                    <button className="action-button terracotta">
                        ☎ Call Ananya (One-Touch)
                    </button>
                </article>

            </div>
        </section>
    );
};

export default RoutineReminder;