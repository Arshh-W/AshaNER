import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Activity,
    AlertCircle,
    ArrowLeft,
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
    Video,
} from "lucide-react";

import api from "../services/api";
import "../assets/styles/patient-report.css";

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const formatGameName = (value) => {
    if (!value) return "Cognitive Game";

    return String(value)
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatNumber = (value, decimals = 1) => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        Number.isNaN(Number(value))
    ) {
        return "—";
    }

    return Number(value).toFixed(decimals);
};

const formatDuration = (seconds) => {
    if (
        seconds === null ||
        seconds === undefined ||
        seconds === "" ||
        Number.isNaN(Number(seconds))
    ) {
        return "—";
    }

    const totalSeconds = Math.max(0, Math.round(Number(seconds)));

    if (totalSeconds < 60) return `${totalSeconds} sec`;

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return remainingSeconds
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes} min`;
};

const formatValence = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        Number.isNaN(Number(value))
    ) {
        return "—";
    }

    const number = Number(value);
    return `${number >= 0 ? "+" : ""}${number.toFixed(2)}`;
};

const formatArousal = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        Number.isNaN(Number(value))
    ) {
        return "—";
    }

    return Number(value).toFixed(2);
};

const getValenceLabel = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "No camera data";
    }

    const number = Number(value);

    if (number >= 0.25) return "Generally positive";
    if (number <= -0.25) return "Generally negative";
    return "Near neutral";
};

const getArousalLabel = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "No camera data";
    }

    const number = Number(value);

    if (number >= 0.65) return "Elevated";
    if (number >= 0.4) return "Moderate";
    return "Low";
};

const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, value));

export default function PatientReportPage() {
    const { patientId } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReport = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await api.get(
                `/caregiver/patients/${patientId}/report`
            );
            setReport(data);
        } catch (err) {
            console.error("Failed to load patient report:", err);
            setError(
                err?.message ||
                    "Unable to generate the patient report."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) loadReport();
    }, [patientId]);

    useEffect(() => {
        document.body.classList.add("patient-report-print-mode");

        return () => {
            document.body.classList.remove("patient-report-print-mode");
        };
    }, []);

    const statistics = report?.statistics || report || {};
    const metrics = statistics?.metrics || {};
    const affectInsights = statistics?.affect_insights || {};

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

    const averageValence =
        affectInsights?.average_valence ??
        metrics?.average_valence ??
        null;

    const averageArousal =
        affectInsights?.average_arousal ??
        metrics?.average_arousal ??
        null;

    const distressObservations =
        affectInsights?.distress_observations ??
        metrics?.distress_observations ??
        0;

    const affectSampleCount =
        affectInsights?.affect_sample_count ??
        metrics?.affect_sample_count ??
        0;

    const affectSessions =
        affectInsights?.sessions_with_affect_data ??
        metrics?.affect_sessions ??
        0;

    const sessionsWithAffect = useMemo(
        () =>
            history.filter(
                (session) =>
                    session.avg_valence !== null &&
                    session.avg_valence !== undefined
            ),
        [history]
    );

    const latestSessions = useMemo(
        () => [...history].slice(0, 12),
        [history]
    );

    const reportPeriod = useMemo(() => {
        const dates = history
            .map(
                (session) =>
                    session.created_at ||
                    session.created_at_offline ||
                    session.date
            )
            .filter(Boolean)
            .map((value) => new Date(value))
            .filter((date) => !Number.isNaN(date.getTime()))
            .sort((a, b) => a.getTime() - b.getTime());

        if (!dates.length) return null;

        return {
            from: dates[0],
            to: dates[dates.length - 1],
        };
    }, [history]);

    const bestGame = useMemo(() => {
        if (!games.length) return null;

        return [...games].sort(
            (a, b) =>
                Number(
                    b.average_score ??
                        b.best_score ??
                        0
                ) -
                Number(
                    a.average_score ??
                        a.best_score ??
                        0
                )
        )[0];
    }, [games]);

    const latestSession = latestSessions[0] || null;

    const affectCoverage =
        totalSessions > 0
            ? Math.round(
                  (Number(affectSessions) / Number(totalSessions)) * 100
              )
            : 0;

    const distressRate =
        affectSampleCount > 0
            ? (Number(distressObservations) / Number(affectSampleCount)) * 100
            : 0;

    const valencePosition =
        averageValence === null || averageValence === undefined
            ? 50
            : clamp(((Number(averageValence) + 1) / 2) * 100, 0, 100);

    const arousalPosition =
        averageArousal === null || averageArousal === undefined
            ? 0
            : clamp(Number(averageArousal) * 100, 0, 100);

    const observationText = useMemo(() => {
        if (!affectSampleCount) {
            return "No camera-based affect observations were stored for the selected sessions.";
        }

        if (Number(distressObservations) > 0) {
            return `The camera model recorded ${distressObservations} observation${
                Number(distressObservations) === 1 ? "" : "s"
            } matching the configured high-arousal / negative-valence rule. These are supportive observations, not a clinical diagnosis.`;
        }

        return `The camera model recorded ${affectSampleCount} affect sample${
            Number(affectSampleCount) === 1 ? "" : "s"
        } with no observations matching the configured distress rule.`;
    }, [affectSampleCount, distressObservations]);

    if (loading) {
        return (
            <section className="patient-report-page">
                <div className="report-state">
                    <div className="report-loading-icon">
                        <RefreshCw size={28} />
                    </div>
                    <h2>Generating patient report...</h2>
                    <p>
                        Please wait while the patient's activity and
                        performance data are collected.
                    </p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="patient-report-page">
                <div className="report-state">
                    <div className="report-error-icon">
                        <FileText size={30} />
                    </div>
                    <h2>Unable to generate report</h2>
                    <p>{error}</p>
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

    if (!report) return null;

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

    return (
        <section className="patient-report-page">
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

            <div className="report-document">
                <header className="report-document-header">
                    <div className="report-brand">
                        <div className="report-brand-mark">
                            <Brain size={22} />
                        </div>
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
                        <span>CAREGIVER REPORT</span>
                        <strong>{formatDate(generatedAt)}</strong>
                    </div>
                </header>

                <section className="report-hero">
                    <div className="report-hero-icon">
                        <FileText size={27} />
                    </div>
                    <div className="report-hero-content">
                        <span className="report-eyebrow">
                            Patient cognitive activity report
                        </span>
                        <h1>{patientName}</h1>
                        <p>
                            Overview of recorded cognitive game activity,
                            camera-based affect observations, and session
                            performance.
                        </p>
                    </div>
                    <div className="report-hero-details">
                        <div>
                            <span>Patient code</span>
                            <strong>{patientCode}</strong>
                        </div>
                        <div>
                            <span>Report period</span>
                            <strong>
                                {reportPeriod
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

                <section className="report-section">
                    <div className="report-section-heading">
                        <div className="report-section-icon">
                            <User size={19} />
                        </div>
                        <div>
                            <h2>Patient Information</h2>
                            <p>Basic patient details</p>
                        </div>
                    </div>

                    <div className="report-info-grid">
                        <div className="report-info-item">
                            <span>Full name</span>
                            <strong>{patientName}</strong>
                        </div>
                        <div className="report-info-item">
                            <span>Patient code</span>
                            <strong>{patientCode}</strong>
                        </div>
                        <div className="report-info-item">
                            <span>Age</span>
                            <strong>
                                {patient.age
                                    ? `${patient.age} years`
                                    : "—"}
                            </strong>
                        </div>
                        <div className="report-info-item">
                            <span>Gender</span>
                            <strong>{patient.gender || "—"}</strong>
                        </div>
                        <div className="report-info-item">
                            <span>Phone</span>
                            <strong>{patient.phone || "—"}</strong>
                        </div>
                        <div className="report-info-item">
                            <span>Preferred language</span>
                            <strong>
                                {patient.preferred_language || "—"}
                            </strong>
                        </div>
                    </div>
                </section>

                <section className="report-section">
                    <div className="report-section-heading">
                        <div className="report-section-icon">
                            <Activity size={19} />
                        </div>
                        <div>
                            <h2>Activity Overview</h2>
                            <p>Key indicators from recorded sessions</p>
                        </div>
                    </div>

                    <div className="report-metrics-grid">
                        <div className="report-metric-card">
                            <div className="report-metric-icon">
                                <Brain size={18} />
                            </div>
                            <div>
                                <span>Sessions completed</span>
                                <strong>{totalSessions}</strong>
                                <small>Recorded sessions</small>
                            </div>
                        </div>

                        <div className="report-metric-card">
                            <div className="report-metric-icon">
                                <Target size={18} />
                            </div>
                            <div>
                                <span>Average score</span>
                                <strong>{formatNumber(averageScore)}</strong>
                                <small>Across completed sessions</small>
                            </div>
                        </div>

                        <div className="report-metric-card">
                            <div className="report-metric-icon">
                                <Clock3 size={18} />
                            </div>
                            <div>
                                <span>Average duration</span>
                                <strong>{formatDuration(averageDuration)}</strong>
                                <small>Per completed session</small>
                            </div>
                        </div>

                        <div className="report-metric-card">
                            <div className="report-metric-icon">
                                <AlertCircle size={18} />
                            </div>
                            <div>
                                <span>Average errors</span>
                                <strong>{formatNumber(averageErrors)}</strong>
                                <small>Per completed session</small>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="report-section report-affect-section">
                    <div className="report-section-heading">
                        <div className="report-section-icon report-camera-icon">
                            <Video size={19} />
                        </div>
                        <div>
                            <h2>Camera-Based Affect Insights</h2>
                            <p>
                                ML-derived valence and arousal observations
                                captured during cognitive game sessions
                            </p>
                        </div>
                        <span className="report-ml-badge">
                            ML OBSERVATION
                        </span>
                    </div>

                    <div className="report-affect-grid">
                        <div className="report-affect-metric">
                            <span>Average valence</span>
                            <strong>{formatValence(averageValence)}</strong>
                            <b>{getValenceLabel(averageValence)}</b>
                            <small>
                                Emotional positivity scale: −1 to +1
                            </small>
                        </div>

                        <div className="report-affect-metric">
                            <span>Average arousal</span>
                            <strong>{formatArousal(averageArousal)}</strong>
                            <b>{getArousalLabel(averageArousal)}</b>
                            <small>
                                Activation level scale: 0 to 1
                            </small>
                        </div>

                        <div className="report-affect-metric">
                            <span>Distress-rule observations</span>
                            <strong>{distressObservations}</strong>
                            <b>
                                {affectSampleCount > 0
                                    ? `${formatNumber(
                                          distressRate
                                      )}% of affect samples`
                                    : "No camera samples"}
                            </b>
                            <small>
                                Configured rule: negative valence + high arousal
                            </small>
                        </div>
                    </div>

                    <div className="report-affect-coverage">
                        <div className="report-affect-coverage-copy">
                            <strong>Camera data coverage</strong>
                            <span>
                                {affectSessions} of {totalSessions} session
                                {totalSessions === 1 ? "" : "s"} contained
                                camera affect data
                            </span>
                        </div>
                        <div className="report-coverage-track">
                            <span
                                style={{
                                    width: `${clamp(
                                        affectCoverage,
                                        0,
                                        100
                                    )}%`,
                                }}
                            />
                        </div>
                        <strong>{affectCoverage}%</strong>
                    </div>

                    <div className="report-affect-visuals">
                        <div className="report-affect-scale-card">
                            <div className="report-affect-scale-header">
                                <span>Valence position</span>
                                <strong>
                                    {formatValence(averageValence)}
                                </strong>
                            </div>
                            <div className="report-valence-scale">
                                <span className="negative">Negative</span>
                                <div className="report-valence-track">
                                    <span
                                        style={{
                                            left: `${valencePosition}%`,
                                        }}
                                    />
                                </div>
                                <span className="positive">Positive</span>
                            </div>
                        </div>

                        <div className="report-affect-scale-card">
                            <div className="report-affect-scale-header">
                                <span>Arousal level</span>
                                <strong>
                                    {formatArousal(averageArousal)}
                                </strong>
                            </div>
                            <div className="report-arousal-track">
                                <span
                                    style={{
                                        width: `${arousalPosition}%`,
                                    }}
                                />
                            </div>
                            <div className="report-arousal-labels">
                                <span>Low</span>
                                <span>Moderate</span>
                                <span>Elevated</span>
                            </div>
                        </div>
                    </div>

                    <div className="report-affect-observation">
                        <div className="report-affect-observation-icon">
                            <CheckCircle2 size={17} />
                        </div>
                        <div>
                            <strong>Caregiver interpretation</strong>
                            <p>{observationText}</p>
                        </div>
                    </div>

                    {sessionsWithAffect.length > 0 && (
                        <div className="report-affect-session-list">
                            <div className="report-affect-session-title">
                                Recent camera observations
                            </div>
                            <div className="report-affect-session-grid">
                                {sessionsWithAffect.slice(0, 6).map(
                                    (session, index) => (
                                        <div
                                            className="report-affect-session-card"
                                            key={
                                                session.id ||
                                                session.local_session_id ||
                                                index
                                            }
                                        >
                                            <div>
                                                <strong>
                                                    {formatGameName(
                                                        session.game_type
                                                    )}
                                                </strong>
                                                <span>
                                                    {formatDate(
                                                        session.created_at
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <span>Valence</span>
                                                <b>
                                                    {formatValence(
                                                        session.avg_valence
                                                    )}
                                                </b>
                                            </div>
                                            <div>
                                                <span>Arousal</span>
                                                <b>
                                                    {formatArousal(
                                                        session.avg_arousal
                                                    )}
                                                </b>
                                            </div>
                                            <div>
                                                <span>Rule match</span>
                                                <b>
                                                    {session.distress_count > 0
                                                        ? "Observed"
                                                        : "None"}
                                                </b>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    <div className="report-ml-disclaimer">
                        <AlertCircle size={15} />
                        <span>
                            Camera-based values are supportive model outputs,
                            not medical diagnoses. Results may be unavailable
                            when camera access is denied, disconnected, or no
                            valid face frame is processed.
                        </span>
                    </div>
                </section>

                <section className="report-highlight-grid">
                    <div className="report-highlight-card">
                        <div className="report-highlight-icon">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <span>Best performing activity</span>
                            <strong>
                                {bestGame
                                    ? formatGameName(bestGame.game_type)
                                    : "No game data"}
                            </strong>
                            <p>
                                {bestGame
                                    ? `Average score: ${formatNumber(
                                          bestGame.average_score
                                      )}`
                                    : "Performance data will appear after completed sessions."}
                            </p>
                        </div>
                    </div>

                    <div className="report-highlight-card">
                        <div className="report-highlight-icon">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <span>Most recent session</span>
                            <strong>
                                {latestSession
                                    ? formatGameName(
                                          latestSession.game_type
                                      )
                                    : "No recent session"}
                            </strong>
                            <p>
                                {latestSession
                                    ? `${formatDate(
                                          latestSession.created_at
                                      )} · Score ${
                                          latestSession.score ?? "—"
                                      }`
                                    : "No completed session is available."}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="report-section report-game-section">
                    <div className="report-section-heading">
                        <div className="report-section-icon">
                            <Brain size={19} />
                        </div>
                        <div>
                            <h2>Game Performance</h2>
                            <p>
                                Performance grouped by cognitive activity
                            </p>
                        </div>
                    </div>

                    {games.length > 0 ? (
                        <div className="report-game-table">
                            <div className="report-game-header">
                                <span>Activity</span>
                                <span>Sessions</span>
                                <span>Avg. score</span>
                                <span>Avg. errors</span>
                                <span>Best level</span>
                                <span>Valence</span>
                                <span>Arousal</span>
                            </div>

                            {games.map((game, index) => (
                                <div
                                    className="report-game-row"
                                    key={game.game_type || index}
                                >
                                    <div className="report-game-name">
                                        <strong>
                                            {formatGameName(
                                                game.game_type
                                            )}
                                        </strong>
                                        <span>Cognitive activity</span>
                                    </div>
                                    <div>{game.sessions ?? 0}</div>
                                    <div>
                                        {formatNumber(
                                            game.average_score
                                        )}
                                    </div>
                                    <div>
                                        {formatNumber(
                                            game.average_errors
                                        )}
                                    </div>
                                    <div>
                                        {game.best_level ?? "—"}
                                    </div>
                                    <div>
                                        {formatValence(
                                            game.average_valence
                                        )}
                                    </div>
                                    <div>
                                        {formatArousal(
                                            game.average_arousal
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="report-empty">
                            No game performance data available yet.
                        </div>
                    )}
                </section>

                <section className="report-section report-history-section">
                    <div className="report-section-heading">
                        <div className="report-section-icon">
                            <CalendarDays size={19} />
                        </div>
                        <div>
                            <h2>Session History</h2>
                            <p>
                                Recent completed sessions and camera-derived
                                observations
                            </p>
                        </div>
                    </div>

                    {latestSessions.length > 0 ? (
                        <div className="report-history-wrapper">
                            <table className="report-history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Activity</th>
                                        <th>Score</th>
                                        <th>Level</th>
                                        <th>Errors</th>
                                        <th>Valence</th>
                                        <th>Arousal</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestSessions.map(
                                        (session, index) => (
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
                                                            session.created_at
                                                        )}
                                                    </strong>
                                                </td>
                                                <td>
                                                    {formatGameName(
                                                        session.game_type
                                                    )}
                                                </td>
                                                <td className="report-score-cell">
                                                    {session.score ?? "—"}
                                                </td>
                                                <td>
                                                    {session.level_achieved ??
                                                        "—"}
                                                </td>
                                                <td>
                                                    {session.total_errors ??
                                                        "—"}
                                                </td>
                                                <td>
                                                    {formatValence(
                                                        session.avg_valence
                                                    )}
                                                </td>
                                                <td>
                                                    {formatArousal(
                                                        session.avg_arousal
                                                    )}
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

                <section className="report-note">
                    <div className="report-note-icon">
                        <AlertCircle size={17} />
                    </div>
                    <div>
                        <strong>Important interpretation note</strong>
                        <p>
                            AshaNER's camera-based affect values describe
                            model-observed valence and arousal during recorded
                            activities. They should be used as supportive
                            context alongside caregiver observation and should
                            not be interpreted as a diagnosis.
                        </p>
                    </div>
                </section>

                <footer className="report-document-footer">
                    <span>AshaNER Cognitive Care</span>
                    <span>Patient: {patientName}</span>
                    <span>
                        Generated {formatDateTime(generatedAt)}
                    </span>
                </footer>
            </div>

            <div className="report-print-action">
                <button
                    type="button"
                    className="download-report-button"
                    onClick={() => window.print()}
                >
                    <Download size={18} />
                    Print / Save as PDF
                </button>
            </div>
        </section>
    );
}
