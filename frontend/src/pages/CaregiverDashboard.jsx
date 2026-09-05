import {
    PhoneCall,
    FileText,
    CalendarDays,
    Share2,
    Download,
    CheckCircle2
} from "lucide-react";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";


export default function CaregiverDashboard() {
    const [sent, setSent] = useState(false);
    const { t } = useLanguage();

    return (
        <div className="caregiver-page">

            {/* PATIENT PROFILE */}

            <section className="patient-profile card">

                <div className="avatar large">
                    👴🏽
                </div>

                <div className="profile-main">

                    <span className="eyebrow green-text">
                        {t(
                            "caregiverDashboard.ashaConnected",
                            "ASHA Connected"
                        )}
                    </span>

                    <h1>
                        Grandfather Biren{" "}
                        <small>(82 yrs)</small>
                    </h1>

                    <p className="coral-text">
                        ●{" "}
                        {t(
                            "caregiverDashboard.mildCognitiveImpairment",
                            "Mild Cognitive Impairment (Early Stage)"
                        )}
                    </p>

                    <p>
                        ●{" "}
                        {t(
                            "caregiverDashboard.primaryDoctor",
                            "Primary Dr. Ananya B. (Daughter)"
                        )}
                    </p>

                </div>

                <div className="profile-actions">

                    <button
                        type="button"
                        className="icon-action"
                    >
                        <FileText size={18} />

                        <small>
                            {t(
                                "caregiverDashboard.viewASHAData",
                                "View ASHA Data"
                            )}
                        </small>
                    </button>

                    <button
                        type="button"
                        className="icon-action"
                    >
                        <CalendarDays size={18} />

                        <small>
                            {t(
                                "caregiverDashboard.logNote",
                                "Log Note"
                            )}
                        </small>
                    </button>

                    <button
                        type="button"
                        className="coral-btn"
                        onClick={() =>
                            alert(
                                t(
                                    "caregiverDashboard.emergencyCall",
                                    "Emergency call to caregiver team."
                                )
                            )
                        }
                    >
                        <PhoneCall />

                        {t(
                            "caregiverDashboard.emergencyCallButton",
                            "Emergency Call"
                        )}
                    </button>

                </div>

            </section>


            {/* STATUS */}

            <div className="status-strip">

                <b>
                    ●{" "}
                    {t(
                        "caregiverDashboard.status",
                        "Status"
                    )}
                    :
                </b>{" "}

                {t(
                    "caregiverDashboard.restingComfortably",
                    "Resting comfortably at home"
                )}

                &nbsp;•&nbsp;

                {t(
                    "caregiverDashboard.allMorningVitalsNormal",
                    "All Morning Vitals Normal"
                )}

                {" ("}

                {t(
                    "caregiverDashboard.assessedAt",
                    "Assessed"
                )}

                {" 08:39 AM)"}

                <span>
                    ↗{" "}
                    {t(
                        "caregiverDashboard.jorhatResidence",
                        "Jorhat Residence"
                    )}{" "}
                    (Ward 4)

                    &nbsp; ◷ &nbsp;

                    {t(
                        "caregiverDashboard.pending",
                        "Pending"
                    )}{" "}
                    94%
                </span>

            </div>


            {/* CARE GRID */}

            <section className="care-grid">

                <CognitiveCard />

                <RoutineProtocol />

            </section>


            {/* MOOD */}

            <MoodCard />


            {/* BOTTOM CARE GRID */}

            <section className="bottom-care-grid">

                <Appointment
                    sent={sent}
                    setSent={setSent}
                />

                <Safety />

            </section>

        </div>
    );
}


/* =========================================================
   COGNITIVE CARD
========================================================= */

function CognitiveCard() {
    const { t } = useLanguage();

    return (
        <article className="card metric-card">

            <span className="eyebrow">
                {t(
                    "caregiverDashboard.longitudinalMetric",
                    "LONGITUDINAL METRIC"
                )}
            </span>

            <h2>
                {t(
                    "caregiverDashboard.cognitiveHealthIndex",
                    "Cognitive Health Index"
                )}
            </h2>

            <div className="score-row">

                <div className="ring">
                    <b>78</b>
                    <small>/100</small>
                </div>

                <div>

                    <b>
                        →{" "}
                        {t(
                            "caregiverDashboard.stablePast36Days",
                            "Stable past 36 days"
                        )}
                    </b>

                    <p>
                        {t(
                            "caregiverDashboard.zeroClinicalDecline",
                            "Zero clinical decline flagged across last 14 verbal orientation & image recall sessions."
                        )}
                    </p>

                </div>

            </div>

            <Metric
                label={t(
                    "caregiverDashboard.visualMemory",
                    "Visual Memory (Tea Leaf & Loom Patterns)"
                )}
                value="82%"
            />

            <Metric
                label={t(
                    "caregiverDashboard.spatialRecognition",
                    "Spatial Recognition (Courtyard & House Map)"
                )}
                value="74%"
            />

            <Metric
                label={t(
                    "caregiverDashboard.voiceLatency",
                    "Voice Latency Response"
                )}
                value="4.2s (Gentle)"
            />

        </article>
    );
}


/* =========================================================
   METRIC
========================================================= */

function Metric({ label, value }) {
    return (
        <div className="metric">

            <span>
                {label}
            </span>

            <b>
                {value}
            </b>

            <div className="progress">

                <span
                    style={{
                        width: value.includes("%")
                            ? value
                            : "68%"
                    }}
                />

            </div>

        </div>
    );
}


/* =========================================================
   ROUTINE & CARE PROTOCOL
========================================================= */

function RoutineProtocol() {
    const { t } = useLanguage();

    const protocolItems = [
        {
            title: t(
                "caregiverDashboard.morningBloodPressure",
                "Morning Blood Pressure & Pulse"
            ),
            detail: t(
                "caregiverDashboard.morningBloodPressureDetail",
                "Recorded: 124/82 mmHg • Pulse 71 bpm"
            ),
            icon: "☷"
        },
        {
            title: t(
                "caregiverDashboard.warmWaterHydration",
                "Warm Water Hydration Target"
            ),
            detail: t(
                "caregiverDashboard.warmWaterHydrationDetail",
                "4 of 6 Grass Bottles Logged (1.4L of 2.0L goal)"
            ),
            icon: "◉"
        },
        {
            title: t(
                "caregiverDashboard.brahmaputraRecall",
                "Afternoon Brahmaputra River Fauna Recall"
            ),
            detail: t(
                "caregiverDashboard.brahmaputraRecallDetail",
                "Assisted Brain Game module completed with grandchild"
            ),
            icon: "♧"
        },
        {
            title: t(
                "caregiverDashboard.eveningDonepezil",
                "Evening Donepezil (5mg)"
            ),
            detail: t(
                "caregiverDashboard.eveningDonepezilDetail",
                "Scheduled with warm milk"
            ),
            icon: "□"
        }
    ];

    return (
        <article className="card protocol">

            <div className="card-head">

                <div>

                    <span className="eyebrow">
                        {t(
                            "caregiverDashboard.dailyTracker",
                            "DAILY TRACKER"
                        )}
                    </span>

                    <h2>
                        {t(
                            "caregiverDashboard.routineAndCareProtocol",
                            "Routine & Care Protocol"
                        )}
                    </h2>

                </div>

                <span className="success-chip">

                    ✓{" "}

                    {t(
                        "caregiverDashboard.completedToday",
                        "85% Completed Today"
                    )}

                </span>

            </div>


            {protocolItems.map((item, index) => (

                <div
                    className="protocol-row"
                    key={item.title}
                >

                    <span
                        className={`protocol-icon i${index}`}
                    >
                        {item.icon}
                    </span>

                    <div>

                        <b>
                            {item.title}
                        </b>

                        <small>
                            {item.detail}
                        </small>

                    </div>

                    <span>

                        {index === 1 ? (

                            <button
                                type="button"
                                className="mini-add"
                            >
                                +
                                {" "}
                                {t(
                                    "caregiverDashboard.addOneCup",
                                    "Add 1 Cup"
                                )}
                            </button>

                        ) : index === 3 ? (

                            t(
                                "caregiverDashboard.scheduled",
                                "Scheduled"
                            )

                        ) : (

                            <CheckCircle2 className="ok" />

                        )}

                    </span>

                </div>

            ))}

        </article>
    );
}


/* =========================================================
   MOOD CARD
========================================================= */

function MoodCard() {
    const { t } = useLanguage();

    const moodDays = [
        {
            day: t(
                "caregiverDashboard.sun",
                "Sun"
            ),
            mood: t(
                "caregiverDashboard.serene",
                "Serene"
            ),
            icon: "☻"
        },
        {
            day: t(
                "caregiverDashboard.mon",
                "Mon"
            ),
            mood: t(
                "caregiverDashboard.engaged",
                "Engaged"
            ),
            icon: "☺"
        },
        {
            day: t(
                "caregiverDashboard.tue",
                "Tue"
            ),
            mood: t(
                "caregiverDashboard.mildFog",
                "Mild Fog"
            ),
            icon: "◌"
        },
        {
            day: t(
                "caregiverDashboard.wed",
                "Wed"
            ),
            mood: t(
                "caregiverDashboard.vibrant",
                "Vibrant"
            ),
            icon: "☻"
        },
        {
            day: t(
                "caregiverDashboard.thu",
                "Thu"
            ),
            mood: t(
                "caregiverDashboard.restless",
                "Restless"
            ),
            icon: "◒"
        },
        {
            day: t(
                "caregiverDashboard.fri",
                "Fri"
            ),
            mood: t(
                "caregiverDashboard.peaceful",
                "Peaceful"
            ),
            icon: "☺"
        },
        {
            day: t(
                "caregiverDashboard.today",
                "Today"
            ),
            mood: t(
                "caregiverDashboard.joyful",
                "Joyful"
            ),
            icon: "☻"
        }
    ];

    return (
        <section className="card mood-card">

            <div className="card-head">

                <div>

                    <span className="eyebrow">
                        {t(
                            "caregiverDashboard.affectiveWellbeing",
                            "AFFECTIVE WELLBEING"
                        )}
                    </span>

                    <h2>
                        {t(
                            "caregiverDashboard.sevenDayMood",
                            "7-Day Emotional Stability & Mood Spectrum"
                        )}
                    </h2>

                </div>

                <div className="legend">

                    ●{" "}
                    {t(
                        "caregiverDashboard.joyfulCalm",
                        "Joyful / Calm"
                    )}

                    &nbsp;&nbsp;

                    ●{" "}
                    {t(
                        "caregiverDashboard.confused",
                        "Confused"
                    )}

                    &nbsp;&nbsp;

                    ●{" "}
                    {t(
                        "caregiverDashboard.agitated",
                        "Agitated"
                    )}

                </div>

            </div>


            <div className="mood-grid">

                {moodDays.map((item, index) => (

                    <div
                        className={
                            "mood-day " +
                            (index === 6 ? "today" : "")
                        }
                        key={item.day}
                    >

                        <small>
                            {item.day}
                        </small>

                        <span>
                            {item.icon}
                        </span>

                        <b>
                            {item.mood}
                        </b>

                        <em>
                            {index === 6
                                ? t(
                                    "caregiverDashboard.activeSpeech",
                                    "Active speech"
                                )
                                : t(
                                    "caregiverDashboard.voiceCheck",
                                    "Voice check"
                                )}
                        </em>

                    </div>

                ))}

            </div>


            <div className="observation">

                <b>

                    ✦{" "}

                    {t(
                        "caregiverDashboard.ashaObservation",
                        "Asha Cognitive Pattern Observation:"
                    )}

                </b>

                <span>

                    {t(
                        "caregiverDashboard.observationText",
                        "Positive emotional engagement spikes reliably during afternoon tea-garden pattern games and scheduled voice calls with his granddaughter in Guwahati. Sundowning restlessness is minimized when porch lighting is activated by 5:15 PM."
                    )}

                </span>


                <button
                    type="button"
                    onClick={() =>
                        navigator.clipboard?.writeText(
                            t(
                                "caregiverDashboard.observationText",
                                "Asha Cognitive Pattern Observation"
                            )
                        )
                    }
                >

                    <Share2 />

                    {t(
                        "caregiverDashboard.shareWithCareTeam",
                        "Share with Care Team"
                    )}

                </button>

            </div>

        </section>
    );
}


/* =========================================================
   APPOINTMENT
========================================================= */

function Appointment({
    sent,
    setSent
}) {
    const { t } = useLanguage();

    return (
        <article className="card appointment">

            <span className="eyebrow">
                {t(
                    "caregiverDashboard.clinicalAppointment",
                    "CLINICAL APPOINTMENT"
                )}
            </span>


            <span className="count-chip coral-count">

                {t(
                    "caregiverDashboard.inFourDays",
                    "In 4 Days"
                )}

            </span>


            <h2>
                {t(
                    "caregiverDashboard.specialistConsultation",
                    "Specialist Consultation"
                )}
            </h2>


            <div className="doctor-row">

                <div className="doctor-icon">
                    ▣
                </div>

                <div>

                    <b>
                        Dr. H. K. Sarma, MD (Neurology)
                    </b>

                    <small>

                        Gauhati Medical College & Hospital (GMCH)

                        <br />

                        Sept 12, 2024 • 11:30 AM

                        <br />

                        {t(
                            "caregiverDashboard.hybridAppointment",
                            "Hybrid (Video Tele-Clinic or In-person)"
                        )}

                    </small>

                </div>

            </div>


            <div className="appointment-actions">

                <button
                    type="button"
                    className="dark-btn"
                    onClick={() =>
                        alert(
                            t(
                                "caregiverDashboard.reportPrepared",
                                "Clinical report prepared for export."
                            )
                        )
                    }
                >

                    <Download />

                    {t(
                        "caregiverDashboard.exportClinicalPDF",
                        "Export Clinical PDF (ICD-10)"
                    )}

                </button>


                <button
                    type="button"
                    className="light-btn"
                    onClick={() => setSent(true)}
                >

                    <Share2 />

                    {sent
                        ? t(
                            "caregiverDashboard.sentToBina",
                            "Sent to Bina"
                        )
                        : t(
                            "caregiverDashboard.shareAccessWithBina",
                            "Share Access with Bina (ASHA)"
                        )}

                </button>

            </div>

        </article>
    );
}


/* =========================================================
   SAFETY
========================================================= */

function Safety() {
    const { t } = useLanguage();

    return (
        <article className="card safety">

            <span className="eyebrow">

                {t(
                    "caregiverDashboard.defensiveCareTelemetry",
                    "DEFENSIVE CARE TELEMETRY"
                )}

            </span>


            <h2>

                {t(
                    "caregiverDashboard.safetyThresholds",
                    "Safety Thresholds"
                )}

            </h2>


            <div className="safety-box">

                <span>
                    DRIVE_FILE_
                </span>

                <b>

                    {t(
                        "caregiverDashboard.geoFenceActive",
                        "Geo-fence Active"
                    )}

                </b>

                <small>

                    {t(
                        "caregiverDashboard.jorhatFamilyCompound",
                        "Jorhat Family Compound (360m)"
                    )}

                </small>

                <CheckCircle2 />

            </div>


            <div className="safety-row">

                ⚠{" "}

                {t(
                    "caregiverDashboard.missedDoseAlert",
                    "Missed Dose Alert"
                )}

                <small>

                    {t(
                        "caregiverDashboard.notifyDaughterASHA",
                        "Notify Daughter & ASHA after +45 min"
                    )}

                </small>

                <span>
                    ✓
                </span>

            </div>


            <div className="safety-row">

                ▣{" "}

                {t(
                    "caregiverDashboard.encryptedNDHM",
                    "Encrypted NDHM Health ID Linked"
                )}

                <small>

                    {t(
                        "caregiverDashboard.configureLimits",
                        "Configure Limits"
                    )}

                </small>

            </div>

        </article>
    );
}