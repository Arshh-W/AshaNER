import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Activity,
    Brain,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Download,
    FileText,
    RefreshCw,
    Target,
    TrendingUp,
    User,
    AlertCircle,
} from "lucide-react";

import api from "../services/api";
import Logo from "../components/common/Logo";

import "../assets/styles/patient-report.css";


export default function PatientReportPage() {

    const { patientId } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =========================================================
       LOAD REPORT
       ========================================================= */

    const loadReport = async () => {

        setLoading(true);
        setError("");

        try {

            const data = await api.get(
                `/caregiver/patients/${patientId}/report`
            );

            setReport(data);

        } catch (err) {

            console.error(
                "Failed to load patient report:",
                err
            );

            setError(
                err?.message ||
                    "Unable to generate the patient report."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        if (patientId) {
            loadReport();
        }

    }, [patientId]);


    /* =========================================================
       PRINT MODE
       
       The global navbar and caregiver bottom navigation should
       remain visible during normal browsing, but not inside a
       printed caregiver report.
       ========================================================= */

    useEffect(() => {

        document.body.classList.add(
            "patient-report-print-mode"
        );

        return () => {

            document.body.classList.remove(
                "patient-report-print-mode"
            );

        };

    }, []);


    /* =========================================================
       HELPERS
       ========================================================= */

    const formatDate = (value) => {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };


    const formatDateTime = (value) => {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };


    const formatGameName = (value) => {

        if (!value) {
            return "Cognitive Game";
        }

        return String(value)
            .replaceAll("_", " ")
            .replaceAll("-", " ")
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase()
            );
    };


    const formatDuration = (seconds) => {

        if (
            seconds === null ||
            seconds === undefined ||
            seconds === "" ||
            Number.isNaN(
                Number(seconds)
            )
        ) {
            return "—";
        }

        const totalSeconds = Math.max(
            0,
            Math.round(
                Number(seconds)
            )
        );

        if (totalSeconds < 60) {
            return `${totalSeconds} sec`;
        }

        const minutes =
            Math.floor(
                totalSeconds / 60
            );

        const remainingSeconds =
            totalSeconds % 60;

        if (!remainingSeconds) {
            return `${minutes} min`;
        }

        return `${minutes}m ${remainingSeconds}s`;
    };


    const formatNumber = (
        value,
        decimals = 1
    ) => {

        if (
            value === null ||
            value === undefined ||
            value === "" ||
            Number.isNaN(
                Number(value)
            )
        ) {
            return "—";
        }

        return Number(value).toFixed(
            decimals
        );
    };


    /* =========================================================
       NORMALIZE API DATA
       ========================================================= */

    const statistics =
        report?.statistics ||
        report ||
        {};

    const metrics =
        statistics?.metrics ||
        {};


    const patient =
        report?.patient ||
        report?.patient_details ||
        {};


    const history =
        statistics?.history ||
        report?.history ||
        report?.game_history ||
        [];


    const games =
        statistics?.games ||
        report?.games ||
        report?.game_performance ||
        [];


    const totalSessions =
        statistics?.total_sessions_completed ??
        report?.total_sessions_completed ??
        metrics?.total_sessions ??
        0;


    const averageScore =
        metrics?.average_score ??
        metrics?.avg_score ??
        "—";


    const averageErrors =
        metrics?.average_errors ??
        metrics?.average_errors_per_session ??
        metrics?.avg_errors ??
        "—";


    const averageDuration =
        metrics?.average_duration_seconds ??
        metrics?.avg_duration_seconds ??
        null;


    /* =========================================================
       DERIVED REPORT DATA
       ========================================================= */

    const reportPeriod = useMemo(() => {

        if (!history.length) {
            return {
                from: null,
                to: null
            };
        }

        const dates = history
            .map(
                (session) =>
                    session.created_at ||
                    session.created_at_offline ||
                    session.date
            )
            .filter(Boolean)
            .map(
                (value) =>
                    new Date(value)
            )
            .filter(
                (date) =>
                    !Number.isNaN(
                        date.getTime()
                    )
            )
            .sort(
                (a, b) =>
                    a.getTime() -
                    b.getTime()
            );

        if (!dates.length) {
            return {
                from: null,
                to: null
            };
        }

        return {
            from: dates[0],
            to: dates[dates.length - 1]
        };

    }, [history]);


    const latestSessions = useMemo(() => {

        return [...history]
            .sort((a, b) => {

                const dateA =
                    new Date(
                        a.created_at ||
                            a.created_at_offline ||
                            a.date ||
                            0
                    ).getTime();

                const dateB =
                    new Date(
                        b.created_at ||
                            b.created_at_offline ||
                            b.date ||
                            0
                    ).getTime();

                return dateB - dateA;

            })
            .slice(0, 10);

    }, [history]);


    const bestGame = useMemo(() => {

        if (!games.length) {
            return null;
        }

        return [...games].sort(
            (a, b) =>
                Number(
                    b.best_score ??
                        b.average_score ??
                        b.avg_score ??
                        0
                ) -
                Number(
                    a.best_score ??
                        a.average_score ??
                        a.avg_score ??
                        0
                )
        )[0];

    }, [games]);


    const latestSession =
        latestSessions[0] || null;


    /* =========================================================
       LOADING STATE
       ========================================================= */

    if (loading) {

        return (
            <section className="patient-report-page">

                <div className="report-state">

                    <div className="report-loading-icon">
                        <RefreshCw size={28} />
                    </div>

                    <h2>
                        Generating patient report...
                    </h2>

                    <p>
                        Please wait while the patient's
                        activity and performance data are
                        collected.
                    </p>

                </div>

            </section>
        );
    }


    /* =========================================================
       ERROR STATE
       ========================================================= */

    if (error) {

        return (
            <section className="patient-report-page">

                <div className="report-state">

                    <div className="report-error-icon">
                        <FileText size={30} />
                    </div>

                    <h2>
                        Unable to generate report
                    </h2>

                    <p>
                        {error}
                    </p>

                    <div className="report-state-actions">

                        <button
                            type="button"
                            className="report-secondary-button"
                            onClick={() =>
                                navigate(
                                    `/caregiver/patients/${patientId}`
                                )
                            }
                        >
                            <ArrowLeft size={18} />
                            Back to Patient
                        </button>

                        <button
                            type="button"
                            className="report-primary-button"
                            onClick={loadReport}
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>

                    </div>

                </div>

            </section>
        );
    }


    if (!report) {
        return null;
    }


    /* =========================================================
       PATIENT DISPLAY VALUES
       ========================================================= */

    const patientName =
        patient.full_name ||
        report.patient_name ||
        "Patient Report";


    const patientCode =
        patient.patient_code ||
        report.patient_code ||
        patient.id ||
        patientId;


    const generatedAt =
        report.generated_at ||
        new Date().toISOString();


    /* =========================================================
       REPORT
       ========================================================= */

    return (
        <section className="patient-report-page">

            {/* =================================================
                SCREEN-ONLY BACK BUTTON
                ================================================= */}

            <div className="report-screen-actions">

                <button
                    type="button"
                    className="report-back-button"
                    onClick={() =>
                        navigate(
                            `/caregiver/patients/${patientId}`
                        )
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Patient Record
                </button>

            </div>


            {/* =================================================
                PRINTABLE REPORT
                ================================================= */}

            <div className="report-document">

                {/* =============================================
                    REPORT BRAND HEADER
                    ============================================= */}

                <header className="report-document-header">

                    <div className="report-brand">

                        <Logo
                            className="report-logo"
                        />

                        <div>

                            <div className="report-brand-name">
                                AshaNER
                            </div>

                            <div className="report-brand-subtitle">
                                Cognitive Care
                            </div>

                        </div>

                    </div>


                    <div className="report-document-meta">

                        <span>
                            CAREGIVER REPORT
                        </span>

                        <strong>
                            {formatDate(
                                generatedAt
                            )}
                        </strong>

                    </div>

                </header>


                {/* =============================================
                    REPORT HERO
                    ============================================= */}

                <section className="report-hero">

                    <div className="report-hero-icon">
                        <FileText size={28} />
                    </div>

                    <div className="report-hero-content">

                        <span className="report-eyebrow">
                            Patient cognitive activity report
                        </span>

                        <h1>
                            {patientName}
                        </h1>

                        <p>
                            A concise overview of recorded
                            cognitive game activity and
                            session performance.
                        </p>

                    </div>


                    <div className="report-hero-details">

                        <div>
                            <span>
                                Patient code
                            </span>

                            <strong>
                                {patientCode}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Report period
                            </span>

                            <strong>
                                {reportPeriod.from
                                    ? `${formatDate(
                                          reportPeriod.from
                                      )} – ${formatDate(
                                          reportPeriod.to
                                      )}`
                                    : "No history"}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* =============================================
                    PATIENT INFORMATION
                    ============================================= */}

                <section className="report-section">

                    <div className="report-section-heading">

                        <div className="report-section-icon">
                            <User size={19} />
                        </div>

                        <div>

                            <h2>
                                Patient Information
                            </h2>

                            <p>
                                Basic profile details
                            </p>

                        </div>

                    </div>


                    <div className="report-info-grid">

                        <div className="report-info-item">

                            <span>
                                Full name
                            </span>

                            <strong>
                                {patientName}
                            </strong>

                        </div>


                        <div className="report-info-item">

                            <span>
                                Patient code
                            </span>

                            <strong>
                                {patientCode}
                            </strong>

                        </div>


                        <div className="report-info-item">

                            <span>
                                Age
                            </span>

                            <strong>
                                {patient.age
                                    ? `${patient.age} years`
                                    : "—"}
                            </strong>

                        </div>


                        <div className="report-info-item">

                            <span>
                                Gender
                            </span>

                            <strong>
                                {patient.gender || "—"}
                            </strong>

                        </div>


                        <div className="report-info-item">

                            <span>
                                Phone
                            </span>

                            <strong>
                                {patient.phone || "—"}
                            </strong>

                        </div>


                        <div className="report-info-item">

                            <span>
                                Preferred language
                            </span>

                            <strong>
                                {patient.preferred_language || "—"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =============================================
                    KEY METRICS
                    ============================================= */}

                <section className="report-section">

                    <div className="report-section-heading">

                        <div className="report-section-icon">
                            <Activity size={19} />
                        </div>

                        <div>

                            <h2>
                                Activity Overview
                            </h2>

                            <p>
                                Key indicators from recorded sessions
                            </p>

                        </div>

                    </div>


                    <div className="report-metrics-grid">

                        <div className="report-metric-card">

                            <div className="report-metric-icon">
                                <Brain size={19} />
                            </div>

                            <div>

                                <span>
                                    Sessions completed
                                </span>

                                <strong>
                                    {totalSessions}
                                </strong>

                                <small>
                                    Recorded sessions
                                </small>

                            </div>

                        </div>


                        <div className="report-metric-card">

                            <div className="report-metric-icon">
                                <Target size={19} />
                            </div>

                            <div>

                                <span>
                                    Average score
                                </span>

                                <strong>
                                    {formatNumber(
                                        averageScore
                                    )}
                                </strong>

                                <small>
                                    Across completed sessions
                                </small>

                            </div>

                        </div>


                        <div className="report-metric-card">

                            <div className="report-metric-icon">
                                <Clock3 size={19} />
                            </div>

                            <div>

                                <span>
                                    Average duration
                                </span>

                                <strong>
                                    {formatDuration(
                                        averageDuration
                                    )}
                                </strong>

                                <small>
                                    Per completed session
                                </small>

                            </div>

                        </div>


                        <div className="report-metric-card">

                            <div className="report-metric-icon">
                                <AlertCircle size={19} />
                            </div>

                            <div>

                                <span>
                                    Average errors
                                </span>

                                <strong>
                                    {formatNumber(
                                        averageErrors
                                    )}
                                </strong>

                                <small>
                                    Per completed session
                                </small>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =============================================
                    RECENT ACTIVITY HIGHLIGHT
                    ============================================= */}

                <section className="report-highlight-grid">

                    <div className="report-highlight-card">

                        <div className="report-highlight-icon">
                            <TrendingUp size={19} />
                        </div>

                        <div>

                            <span>
                                Best performing activity
                            </span>

                            <strong>
                                {bestGame
                                    ? formatGameName(
                                          bestGame.game_type ||
                                              bestGame.name
                                      )
                                    : "No game data"}
                            </strong>

                            <p>
                                {bestGame
                                    ? `Best score: ${
                                          bestGame.best_score ??
                                          bestGame.average_score ??
                                          bestGame.avg_score ??
                                          "—"
                                      }`
                                    : "Performance data will appear after completed sessions."}
                            </p>

                        </div>

                    </div>


                    <div className="report-highlight-card">

                        <div className="report-highlight-icon">
                            <CheckCircle2 size={19} />
                        </div>

                        <div>

                            <span>
                                Most recent session
                            </span>

                            <strong>
                                {latestSession
                                    ? formatGameName(
                                          latestSession.game_type ||
                                              latestSession.game
                                      )
                                    : "No recent session"}
                            </strong>

                            <p>
                                {latestSession
                                    ? `${formatDate(
                                          latestSession.created_at ||
                                              latestSession.created_at_offline ||
                                              latestSession.date
                                      )} · Score ${
                                          latestSession.score ??
                                          "—"
                                      }`
                                    : "No completed session is available."}
                            </p>

                        </div>

                    </div>

                </section>


                {/* =============================================
                    GAME PERFORMANCE
                    ============================================= */}

                <section className="report-section report-game-section">

                    <div className="report-section-heading">

                        <div className="report-section-icon">
                            <Brain size={19} />
                        </div>

                        <div>

                            <h2>
                                Game Performance
                            </h2>

                            <p>
                                Performance grouped by cognitive activity
                            </p>

                        </div>

                    </div>


                    {games.length > 0 ? (

                        <div className="report-game-table">

                            <div className="report-game-header">

                                <span>
                                    Activity
                                </span>

                                <span>
                                    Sessions
                                </span>

                                <span>
                                    Avg. score
                                </span>

                                <span>
                                    Avg. errors
                                </span>

                                <span>
                                    Best score
                                </span>

                            </div>


                            {games.map(
                                (game, index) => {

                                    const gameName =
                                        formatGameName(
                                            game.game_type ||
                                                game.name
                                        );

                                    const sessions =
                                        game.sessions ??
                                        game.total_sessions ??
                                        0;

                                    const avgScore =
                                        game.average_score ??
                                        game.avg_score ??
                                        "—";

                                    const avgErrors =
                                        game.average_errors ??
                                        game.avg_errors ??
                                        "—";

                                    const bestScore =
                                        game.best_score ??
                                        "—";

                                    return (
                                        <div
                                            className="report-game-row"
                                            key={
                                                game.game_type ||
                                                game.game_id ||
                                                index
                                            }
                                        >

                                            <div className="report-game-name">

                                                <strong>
                                                    {gameName}
                                                </strong>

                                                <span>
                                                    Cognitive activity
                                                </span>

                                            </div>

                                            <div>
                                                {sessions}
                                            </div>

                                            <div>
                                                {formatNumber(
                                                    avgScore
                                                )}
                                            </div>

                                            <div>
                                                {formatNumber(
                                                    avgErrors
                                                )}
                                            </div>

                                            <div>
                                                <strong>
                                                    {bestScore}
                                                </strong>
                                            </div>

                                        </div>
                                    );

                                }
                            )}

                        </div>

                    ) : (

                        <div className="report-empty">
                            No game performance data available yet.
                        </div>

                    )}

                </section>


                {/* =============================================
                    SESSION HISTORY
                    ============================================= */}

                <section className="report-section report-history-section">

                    <div className="report-section-heading">

                        <div className="report-section-icon">
                            <CalendarDays size={19} />
                        </div>

                        <div>

                            <h2>
                                Session History
                            </h2>

                            <p>
                                Most recent completed cognitive sessions
                            </p>

                        </div>

                    </div>


                    {latestSessions.length > 0 ? (

                        <div className="report-history-wrapper">

                            <table className="report-history-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Activity
                                        </th>

                                        <th>
                                            Score
                                        </th>

                                        <th>
                                            Level
                                        </th>

                                        <th>
                                            Errors
                                        </th>

                                        <th>
                                            Duration
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {latestSessions.map(
                                        (
                                            session,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    session.id ||
                                                    session.local_session_id ||
                                                    index
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {formatDate(
                                                            session.created_at ||
                                                                session.created_at_offline ||
                                                                session.date
                                                        )}
                                                    </strong>
                                                </td>


                                                <td>
                                                    {formatGameName(
                                                        session.game_type ||
                                                            session.game
                                                    )}
                                                </td>


                                                <td className="report-score-cell">
                                                    {session.score ??
                                                        "—"}
                                                </td>


                                                <td>
                                                    {session.level_achieved ??
                                                        session.level ??
                                                        "—"}
                                                </td>


                                                <td>
                                                    {session.total_errors ??
                                                        session.errors ??
                                                        "—"}
                                                </td>


                                                <td>
                                                    {formatDuration(
                                                        session.duration_seconds
                                                    )}
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <div className="report-empty">
                            No session history available yet.
                        </div>

                    )}

                </section>


                {/* =============================================
                    REPORT NOTE
                    ============================================= */}

                <section className="report-note">

                    <div className="report-note-icon">
                        <FileText size={17} />
                    </div>

                    <div>

                        <strong>
                            Caregiver note
                        </strong>

                        <p>
                            This report summarizes recorded
                            activity and performance data from
                            AshaNER. It is intended to support
                            caregiver review and does not
                            constitute a medical diagnosis.
                        </p>

                    </div>

                </section>


                {/* =============================================
                    PRINT FOOTER
                    ============================================= */}

                <footer className="report-document-footer">

                    <span>
                        AshaNER Cognitive Care
                    </span>

                    <span>
                        Patient: {patientName}
                    </span>

                    <span>
                        Generated {formatDateTime(
                            generatedAt
                        )}
                    </span>

                </footer>

            </div>


            {/* =================================================
                SCREEN-ONLY PRINT ACTION
                ================================================= */}

            <div className="report-print-action">

                <button
                    type="button"
                    className="download-report-button"
                    onClick={() =>
                        window.print()
                    }
                >
                    <Download size={18} />
                    Print / Save as PDF
                </button>

            </div>

        </section>
    );
}