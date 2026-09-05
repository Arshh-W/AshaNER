import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    RefreshCw,
    User,
    Brain,
    CalendarDays,
    Activity,
    Download,
} from "lucide-react";

import api from "../services/api";
import "../assets/styles/patient-report.css";

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
        if (patientId) {
            loadReport();
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

    const statistics = report?.statistics || report || {};
    const metrics = statistics?.metrics || {};

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

    if (loading) {
        return (
            <section className="patient-report-page">
                <div className="report-state">
                    <div className="report-loading-icon">
                        <RefreshCw size={28} />
                    </div>

                    <h2>Generating patient report...</h2>

                    <p>
                        Please wait while the patient's activity
                        and performance data are collected.
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

    if (!report) {
        return null;
    }

    return (
        <section className="patient-report-page">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="report-page-header">

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

                <div className="report-title-row">

                    <div className="report-title-icon">
                        <FileText size={28} />
                    </div>

                    <div>
                        <span>CAREGIVER REPORT</span>

                        <h1>
                            {patient.full_name ||
                                report.patient_name ||
                                "Patient Report"}
                        </h1>

                        <p>
                            Generated on{" "}
                            {formatDate(
                                report.generated_at ||
                                    new Date().toISOString()
                            )}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="download-report-button"
                        onClick={() =>
                            window.print()
                        }
                    >
                        <Download size={18} />
                        Print / Save
                    </button>

                </div>
            </div>


            {/* =====================================================
                PATIENT INFORMATION
            ===================================================== */}

            <div className="report-card">

                <div className="report-card-heading">
                    <User size={20} />

                    <div>
                        <h2>Patient Information</h2>
                        <p>Basic patient details</p>
                    </div>
                </div>

                <div className="report-info-grid">

                    <div>
                        <span>Name</span>
                        <strong>
                            {patient.full_name ||
                                report.patient_name ||
                                "—"}
                        </strong>
                    </div>

                    <div>
                        <span>Patient Code</span>
                        <strong>
                            {patient.patient_code ||
                                report.patient_code ||
                                patient.id ||
                                patientId}
                        </strong>
                    </div>

                    <div>
                        <span>Age</span>
                        <strong>
                            {patient.age
                                ? `${patient.age} years`
                                : "—"}
                        </strong>
                    </div>

                    <div>
                        <span>Gender</span>
                        <strong>
                            {patient.gender || "—"}
                        </strong>
                    </div>

                    <div>
                        <span>Phone</span>
                        <strong>
                            {patient.phone || "—"}
                        </strong>
                    </div>

                    <div>
                        <span>Preferred Language</span>
                        <strong>
                            {patient.preferred_language || "—"}
                        </strong>
                    </div>

                </div>
            </div>


            {/* =====================================================
                SUMMARY
            ===================================================== */}

            <div className="report-card">

                <div className="report-card-heading">
                    <Activity size={20} />

                    <div>
                        <h2>Activity Summary</h2>
                        <p>
                            Overall cognitive activity recorded
                        </p>
                    </div>
                </div>

                <div className="report-summary-grid">

                    <div className="report-summary-item">
                        <Brain size={21} />

                        <span>Sessions Completed</span>

                        <strong>
                            {totalSessions}
                        </strong>
                    </div>

                    <div className="report-summary-item">
                        <Activity size={21} />

                        <span>Average Score</span>

                        <strong>
                            {typeof averageScore === "number"
                                ? averageScore.toFixed(1)
                                : averageScore}
                        </strong>
                    </div>

                    <div className="report-summary-item">
                        <CalendarDays size={21} />

                        <span>Average Duration</span>

                        <strong>
                            {averageDuration !== null
                                ? `${Math.round(
                                      Number(
                                          averageDuration
                                      )
                                  )} sec`
                                : "—"}
                        </strong>
                    </div>

                    <div className="report-summary-item">
                        <Activity size={21} />

                        <span>Average Errors</span>

                        <strong>
                            {typeof averageErrors === "number"
                                ? averageErrors.toFixed(1)
                                : averageErrors}
                        </strong>
                    </div>

                </div>
            </div>


            {/* =====================================================
                GAME PERFORMANCE
            ===================================================== */}

            <div className="report-card">

                <div className="report-card-heading">
                    <Brain size={20} />

                    <div>
                        <h2>Game Performance</h2>
                        <p>
                            Performance by cognitive activity
                        </p>
                    </div>
                </div>

                {games.length > 0 ? (
                    <div className="report-game-list">

                        {games.map((game, index) => (
                            <div
                                className="report-game-row"
                                key={
                                    game.game_type ||
                                    game.game_id ||
                                    index
                                }
                            >

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

                                <div>
                                    <span>Average Score</span>
                                    <strong>
                                        {game.average_score ??
                                            game.avg_score ??
                                            "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Average Errors</span>
                                    <strong>
                                        {game.average_errors ??
                                            game.avg_errors ??
                                            "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Best Score</span>
                                    <strong>
                                        {game.best_score ?? "—"}
                                    </strong>
                                </div>

                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="report-empty">
                        No game performance data available yet.
                    </div>
                )}
            </div>


            {/* =====================================================
                HISTORY
            ===================================================== */}

            <div className="report-card">

                <div className="report-card-heading">
                    <CalendarDays size={20} />

                    <div>
                        <h2>Session History</h2>
                        <p>
                            Recorded cognitive game sessions
                        </p>
                    </div>
                </div>

                {history.length > 0 ? (
                    <div className="report-history-wrapper">

                        <table className="report-history-table">

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

                                {history.map(
                                    (session, index) => (
                                        <tr
                                            key={
                                                session.id ||
                                                index
                                            }
                                        >
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
                                                {session.duration_seconds
                                                    ? `${Math.round(
                                                          Number(
                                                              session.duration_seconds
                                                          )
                                                      )} sec`
                                                    : "—"}
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
            </div>


            {/* =====================================================
                REPORT FOOTER
            ===================================================== */}

            <div className="report-footer">

                <FileText size={18} />

                <p>
                    This report summarizes recorded activity
                    data from AshaNER. It is intended to support
                    caregiver review and does not constitute a
                    medical diagnosis.
                </p>

            </div>

        </section>
    );
}