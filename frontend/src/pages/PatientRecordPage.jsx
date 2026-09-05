import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    User,
    CalendarDays,
    Phone,
    MapPin,
    Languages,
    Users,
    Activity,
    Brain,
    Clock,
    Target,
    AlertCircle,
    RefreshCw,
    FileText,
} from "lucide-react";

import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";

import "../assets/styles/patient-record.css";

export default function PatientRecordPage() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [patient, setPatient] = useState(null);
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPatientRecord = async () => {
        setLoading(true);
        setError("");

        try {
            const [patientData, statsData, historyData] = await Promise.all([
                api.get(`/caregiver/patients/${patientId}`),
                api.get(`/caregiver/patients/${patientId}/stats`),
                api.get(`/caregiver/patients/${patientId}/history`),
            ]);

            setPatient(patientData);
            setStats(statsData);
            setHistory(
                Array.isArray(historyData)
                    ? historyData
                    : historyData?.history || []
            );
        } catch (err) {
            console.error("Failed to load patient record:", err);
            setError(
                err?.message ||
                    "Unable to load this patient's record."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) {
            loadPatientRecord();
        }
    }, [patientId]);

    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getMetric = (key, fallback = 0) => {
        if (!stats?.metrics) return fallback;

        const value = stats.metrics[key];

        return value === undefined || value === null
            ? fallback
            : value;
    };

    const totalSessions =
        stats?.total_sessions_completed ??
        stats?.metrics?.total_sessions ??
        0;

    const averageScore =
        getMetric("average_score",
            getMetric("avg_score", 0)
        );

    const averageDuration =
        getMetric("average_duration_seconds",
            getMetric("avg_duration_seconds", 0)
        );

    const averageErrors =
        getMetric("average_errors",
            getMetric("avg_errors", 0)
        );

    if (loading) {
        return (
            <section className="patient-record-page">
                <div className="patient-record-loading">
                    <div className="loading-spinner">
                        <RefreshCw size={28} />
                    </div>

                    <h2>Loading patient record...</h2>
                    <p>
                        Please wait while we retrieve the patient's
                        information and activity history.
                    </p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="patient-record-page">
                <div className="patient-record-error">
                    <AlertCircle size={42} />

                    <h2>Unable to load patient</h2>

                    <p>{error}</p>

                    <div className="patient-record-error-actions">
                        <button
                            type="button"
                            className="record-secondary-button"
                            onClick={() =>
                                navigate("/caregiver/patients")
                            }
                        >
                            <ArrowLeft size={18} />
                            Back to Patients
                        </button>

                        <button
                            type="button"
                            className="record-primary-button"
                            onClick={loadPatientRecord}
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (!patient) {
        return (
            <section className="patient-record-page">
                <div className="patient-record-error">
                    <User size={42} />

                    <h2>Patient not found</h2>

                    <p>
                        The requested patient record could not be found.
                    </p>

                    <button
                        type="button"
                        className="record-primary-button"
                        onClick={() =>
                            navigate("/caregiver/patients")
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Patients
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="patient-record-page">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="patient-record-header">

                <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                        navigate("/caregiver/patients")
                    }
                >
                    <ArrowLeft size={19} />
                    Back to Patients
                </button>

                <div className="record-header-content">

                    <div className="patient-avatar">
                        <User size={34} />
                    </div>

                    <div className="patient-header-info">
                        <span className="record-eyebrow">
                            PATIENT RECORD
                        </span>

                        <h1>
                            {patient.full_name || "Patient"}
                        </h1>

                        <p>
                            Patient ID:{" "}
                            <strong>
                                {patient.patient_code || patient.id}
                            </strong>
                        </p>
                    </div>

                    <div className="record-header-actions">
                        <button
                            type="button"
                            className="record-refresh-button"
                            onClick={loadPatientRecord}
                            title="Refresh record"
                        >
                            <RefreshCw size={19} />
                        </button>

                        <button
                            type="button"
                            className="record-report-button"
                            onClick={() =>
                                navigate(
                                    `/caregiver/patients/${patientId}/report`
                                )
                            }
                        >
                            <FileText size={18} />
                            Generate Report
                        </button>
                    </div>

                </div>
            </div>


            {/* =====================================================
                PERSONAL DETAILS
            ===================================================== */}

            <div className="record-section">

                <div className="record-section-title">
                    <div className="section-icon">
                        <User size={20} />
                    </div>

                    <div>
                        <h2>Personal Information</h2>
                        <p>Patient details and caregiver connection</p>
                    </div>
                </div>

                <div className="personal-details-grid">

                    <div className="detail-item">
                        <CalendarDays size={19} />

                        <div>
                            <span>Date of Birth</span>
                            <strong>
                                {formatDate(patient.date_of_birth)}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-item">
                        <User size={19} />

                        <div>
                            <span>Age</span>
                            <strong>
                                {patient.age
                                    ? `${patient.age} years`
                                    : "—"}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-item">
                        <Users size={19} />

                        <div>
                            <span>Gender</span>
                            <strong>
                                {patient.gender || "—"}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-item">
                        <Phone size={19} />

                        <div>
                            <span>Phone</span>
                            <strong>
                                {patient.phone || "—"}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-item">
                        <MapPin size={19} />

                        <div>
                            <span>Location</span>
                            <strong>
                                {[
                                    patient.city,
                                    patient.district,
                                    patient.state,
                                ]
                                    .filter(Boolean)
                                    .join(", ") || "—"}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-item">
                        <Languages size={19} />

                        <div>
                            <span>Preferred Language</span>
                            <strong>
                                {patient.preferred_language || "—"}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-item">
                        <Users size={19} />

                        <div>
                            <span>Relationship</span>
                            <strong>
                                {patient.caregiver_relationship || "—"}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-item">
                        <MapPin size={19} />

                        <div>
                            <span>Address</span>
                            <strong>
                                {patient.address || "—"}
                            </strong>
                        </div>
                    </div>

                </div>
            </div>


            {/* =====================================================
                PERFORMANCE SUMMARY
            ===================================================== */}

            <div className="record-section">

                <div className="record-section-title">
                    <div className="section-icon">
                        <Activity size={20} />
                    </div>

                    <div>
                        <h2>Performance Overview</h2>
                        <p>
                            Summary of the patient's cognitive activity
                        </p>
                    </div>
                </div>

                <div className="performance-grid">

                    <div className="performance-card">
                        <div className="performance-icon">
                            <Brain size={22} />
                        </div>

                        <div>
                            <span>Sessions Completed</span>
                            <strong>{totalSessions}</strong>
                        </div>
                    </div>

                    <div className="performance-card">
                        <div className="performance-icon">
                            <Target size={22} />
                        </div>

                        <div>
                            <span>Average Score</span>
                            <strong>
                                {Number.isFinite(Number(averageScore))
                                    ? Number(averageScore).toFixed(1)
                                    : "—"}
                            </strong>
                        </div>
                    </div>

                    <div className="performance-card">
                        <div className="performance-icon">
                            <Clock size={22} />
                        </div>

                        <div>
                            <span>Average Duration</span>
                            <strong>
                                {averageDuration
                                    ? `${Math.round(
                                          Number(averageDuration)
                                      )} sec`
                                    : "—"}
                            </strong>
                        </div>
                    </div>

                    <div className="performance-card">
                        <div className="performance-icon">
                            <AlertCircle size={22} />
                        </div>

                        <div>
                            <span>Average Errors</span>
                            <strong>
                                {Number.isFinite(Number(averageErrors))
                                    ? Number(averageErrors).toFixed(1)
                                    : "—"}
                            </strong>
                        </div>
                    </div>

                </div>
            </div>


            {/* =====================================================
                GAME BREAKDOWN
            ===================================================== */}

            <div className="record-section">

                <div className="record-section-title">
                    <div className="section-icon">
                        <Brain size={20} />
                    </div>

                    <div>
                        <h2>Game Performance</h2>
                        <p>
                            Performance across different cognitive activities
                        </p>
                    </div>
                </div>

                {Array.isArray(stats?.games) &&
                stats.games.length > 0 ? (
                    <div className="game-performance-list">
                        {stats.games.map((game, index) => (
                            <div
                                className="game-performance-row"
                                key={
                                    game.game_type ||
                                    game.game_id ||
                                    index
                                }
                            >
                                <div className="game-name">
                                    <Brain size={19} />

                                    <div>
                                        <strong>
                                            {game.game_type ||
                                                game.name ||
                                                "Cognitive Game"}
                                        </strong>

                                        <span>
                                            {game.sessions ??
                                                game.total_sessions ??
                                                0}{" "}
                                            sessions
                                        </span>
                                    </div>
                                </div>

                                <div className="game-stat">
                                    <span>Score</span>
                                    <strong>
                                        {game.average_score ??
                                            game.avg_score ??
                                            "—"}
                                    </strong>
                                </div>

                                <div className="game-stat">
                                    <span>Errors</span>
                                    <strong>
                                        {game.average_errors ??
                                            game.avg_errors ??
                                            "—"}
                                    </strong>
                                </div>

                                <div className="game-stat">
                                    <span>Best</span>
                                    <strong>
                                        {game.best_score ?? "—"}
                                    </strong>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="record-empty">
                        <Brain size={30} />

                        <h3>No game performance yet</h3>

                        <p>
                            Game results will appear here after the
                            patient completes activities.
                        </p>
                    </div>
                )}
            </div>


            {/* =====================================================
                COMPLETE HISTORY
            ===================================================== */}

            <div className="record-section">

                <div className="record-section-title">
                    <div className="section-icon">
                        <CalendarDays size={20} />
                    </div>

                    <div>
                        <h2>Game History</h2>
                        <p>
                            Complete history of recorded cognitive sessions
                        </p>
                    </div>
                </div>

                {history.length > 0 ? (
                    <div className="history-table-wrapper">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Game</th>
                                    <th>Score</th>
                                    <th>Level</th>
                                    <th>Errors</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>

                            <tbody>
                                {history.map((session, index) => (
                                    <tr key={session.id || index}>
                                        <td>
                                            {formatDate(
                                                session.created_at ||
                                                    session.created_at_offline ||
                                                    session.date
                                            )}
                                        </td>

                                        <td>
                                            {session.game_type ||
                                                session.game ||
                                                "—"}
                                        </td>

                                        <td>
                                            <strong>
                                                {session.score ?? "—"}
                                            </strong>
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
                                            {session.duration_seconds
                                                ? `${Math.round(
                                                      Number(
                                                          session.duration_seconds
                                                      )
                                                  )} sec`
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="record-empty">
                        <CalendarDays size={30} />

                        <h3>No session history</h3>

                        <p>
                            There are no recorded game sessions for
                            this patient yet.
                        </p>
                    </div>
                )}
            </div>

        </section>
    );
}