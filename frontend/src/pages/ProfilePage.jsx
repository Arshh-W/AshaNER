import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";

const GAME_NAMES = {
    memory_village: "Memory Village",
    memory_detective: "Memory Detective",
    routine_rescue: "Routine Rescue",
    sound_object: "Sound & Object Match",
    memory_mosaic: "Memory Mosaic"
};

const GAME_ICONS = {
    memory_village: "🏡",
    memory_detective: "🔎",
    routine_rescue: "☕",
    sound_object: "🔊",
    memory_mosaic: "🧩"
};

const formatGameName = (gameType) => {
    if (GAME_NAMES[gameType]) {
        return GAME_NAMES[gameType];
    }

    return String(gameType || "")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDuration = (seconds) => {
    const value = Number(seconds);

    if (!Number.isFinite(value) || value <= 0) {
        return "0 min";
    }

    const minutes = Math.floor(value / 60);
    const remainingSeconds = Math.round(value % 60);

    if (minutes === 0) {
        return `${remainingSeconds}s`;
    }

    if (remainingSeconds === 0) {
        return `${minutes} min`;
    }

    return `${minutes}m ${remainingSeconds}s`;
};

const formatDate = (value) => {
    if (!value) {
        return "Unknown date";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

const formatDateShort = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short"
    });
};

function EmptyState({ children }) {
    return (
        <div className="profile-empty">
            <div className="profile-empty__icon">🌱</div>
            <p>{children}</p>
        </div>
    );
}

function ScoreTrendChart({ history }) {
    const chronologicalHistory = useMemo(() => {
        return [...history]
            .filter((session) => session?.created_at)
            .sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            );
    }, [history]);

    if (!chronologicalHistory.length) {
        return (
            <EmptyState>
                Complete a game to start building your performance graph.
            </EmptyState>
        );
    }

    const width = 720;
    const height = 300;
    const paddingLeft = 48;
    const paddingRight = 24;
    const paddingTop = 24;
    const paddingBottom = 52;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const scores = chronologicalHistory.map((item) =>
        Number.isFinite(Number(item.score)) ? Number(item.score) : 0
    );

    const maxScore = Math.max(...scores, 1);
    const minScore = Math.min(...scores, 0);

    const range =
        maxScore === minScore
            ? 1
            : maxScore - minScore;

    const points = chronologicalHistory.map((session, index) => {
        const score = Number(session.score) || 0;

        const x =
            chronologicalHistory.length === 1
                ? paddingLeft + chartWidth / 2
                : paddingLeft +
                  (index / (chronologicalHistory.length - 1)) *
                      chartWidth;

        const y =
            paddingTop +
            chartHeight -
            ((score - minScore) / range) * chartHeight;

        return {
            x,
            y,
            score,
            session
        };
    });

    const path = points
        .map((point, index) =>
            `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
        )
        .join(" ");

    const gridValues = [
        maxScore,
        minScore + range * 0.5,
        minScore
    ];

    return (
        <div className="score-chart">
            <svg
                className="score-chart__svg"
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label="Game score performance over time"
            >
                {gridValues.map((value, index) => {
                    const y =
                        paddingTop +
                        chartHeight -
                        ((value - minScore) / range) * chartHeight;

                    return (
                        <g key={`grid-${index}`}>
                            <line
                                x1={paddingLeft}
                                x2={width - paddingRight}
                                y1={y}
                                y2={y}
                                className="chart-grid-line"
                            />

                            <text
                                x={paddingLeft - 10}
                                y={y + 4}
                                textAnchor="end"
                                className="chart-axis-text"
                            >
                                {Math.round(value)}
                            </text>
                        </g>
                    );
                })}

                <path
                    d={path}
                    className="score-chart__line"
                    fill="none"
                />

                {points.map((point, index) => (
                    <g key={`point-${index}`}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            className="score-chart__point"
                        />

                        {(
                            index === 0 ||
                            index === Math.floor(
                                points.length / 2
                            ) ||
                            index === points.length - 1
                        ) && (
                            <text
                                x={point.x}
                                y={height - 20}
                                textAnchor="middle"
                                className="chart-date-text"
                            >
                                {formatDateShort(
                                    point.session.created_at
                                )}
                            </text>
                        )}
                    </g>
                ))}
            </svg>

            <div className="chart-footer">
                <span>
                    <i className="chart-dot" />
                    Score
                </span>

                <span>
                    {chronologicalHistory.length} completed games
                </span>
            </div>
        </div>
    );
}

function GamePerformanceChart({ games }) {
    const sortedGames = useMemo(() => {
        return [...games]
            .filter((game) => Number(game.sessions) > 0)
            .sort(
                (a, b) =>
                    Number(b.average_score || 0) -
                    Number(a.average_score || 0)
            );
    }, [games]);

    if (!sortedGames.length) {
        return (
            <EmptyState>
                Complete games to see performance by activity.
            </EmptyState>
        );
    }

    const maxScore = Math.max(
        ...sortedGames.map((game) =>
            Number(game.average_score) || 0
        ),
        1
    );

    return (
        <div className="game-performance-chart">
            {sortedGames.map((game) => {
                const score =
                    Number(game.average_score) || 0;

                const percentage =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            (score / maxScore) * 100
                        )
                    );

                return (
                    <div
                        className="game-performance-row"
                        key={game.game_type}
                    >
                        <div className="game-performance-row__header">
                            <span>
                                <span className="game-performance-icon">
                                    {GAME_ICONS[game.game_type] || "🎯"}
                                </span>

                                {formatGameName(game.game_type)}
                            </span>

                            <strong>
                                {score.toFixed(1)}
                            </strong>
                        </div>

                        <div className="game-performance-track">
                            <div
                                className="game-performance-fill"
                                style={{
                                    width: `${percentage}%`
                                }}
                            />
                        </div>

                        <div className="game-performance-meta">
                            <span>
                                {game.sessions}{" "}
                                {Number(game.sessions) === 1
                                    ? "game"
                                    : "games"}
                            </span>

                            <span>
                                {Number(
                                    game.average_errors || 0
                                ).toFixed(1)}{" "}
                                avg errors
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function HistoryView({
    history,
    onBack
}) {
    return (
        <section className="profile-history">
            <div className="profile-history__header">
                <div>
                    <span className="profile-eyebrow">
                        GAME HISTORY
                    </span>

                    <h2>All completed games</h2>

                    <p>
                        Your activities are shown from the
                        most recent to the oldest.
                    </p>
                </div>

                <button
                    type="button"
                    className="history-back-button"
                    onClick={onBack}
                >
                    ← Back to profile
                </button>
            </div>

            {!history.length ? (
                <EmptyState>
                    No completed games yet.
                </EmptyState>
            ) : (
                <div className="history-list">
                    {history.map((session, index) => (
                        <article
                            className="history-item"
                            key={
                                session.local_session_id ||
                                `${session.game_type}-${session.created_at}-${index}`
                            }
                        >
                            <div className="history-item__icon">
                                {GAME_ICONS[session.game_type] ||
                                    "🎯"}
                            </div>

                            <div className="history-item__main">
                                <div className="history-item__title">
                                    <h3>
                                        {formatGameName(
                                            session.game_type
                                        )}
                                    </h3>

                                    <span>
                                        {formatDate(
                                            session.created_at
                                        )}
                                    </span>
                                </div>

                                <div className="history-item__stats">
                                    <div>
                                        <small>Score</small>
                                        <strong>
                                            {session.score ?? 0}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>Errors</small>
                                        <strong>
                                            {session.total_errors ?? 0}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>Level</small>
                                        <strong>
                                            {session.level_achieved ??
                                                1}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>Duration</small>
                                        <strong>
                                            {formatDuration(
                                                session.duration_seconds
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>Reaction</small>
                                        <strong>
                                            {Number(
                                                session.average_reaction_time_ms ||
                                                    0
                                            ) > 0
                                                ? `${Math.round(
                                                      Number(
                                                          session.average_reaction_time_ms
                                                      )
                                                  )} ms`
                                                : "—"}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default function ProfilePage() {
    const { t } = useLanguage();
    const { user } = useAuth();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadStats = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await api.get(
                    "/patients/me/game-stats"
                );

                if (!mounted) {
                    return;
                }

                setStats(data);
            } catch (requestError) {
                console.error(
                    "Unable to load patient game statistics:",
                    requestError
                );

                if (!mounted) {
                    return;
                }

                setError(
                    requestError?.message ||
                        "Unable to load your game statistics."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadStats();

        return () => {
            mounted = false;
        };
    }, []);

    const games = stats?.games || [];
    const history = stats?.history || stats?.recent_sessions || [];

    const patientName =
        stats?.patient_name ||
        user?.patientName ||
        user?.name ||
        "Patient";

    if (showHistory) {
        return (
            <>
                <style>{PROFILE_STYLES}</style>

                <HistoryView
                    history={history}
                    onBack={() => setShowHistory(false)}
                />
            </>
        );
    }

    return (
        <>
            <style>{PROFILE_STYLES}</style>

            <section className="profile-page">
                {/* HEADER */}
                <header className="profile-header">
                    <div className="profile-header__identity">
                        <div className="profile-avatar">
                            {patientName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <span className="profile-eyebrow">
                                {t(
                                    "profile.title",
                                    "YOUR PROFILE"
                                )}
                            </span>

                            <h1>{patientName}</h1>

                            <p>
                                {stats?.email ||
                                    user?.email ||
                                    "Your personal activity overview"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="history-button"
                        onClick={() => setShowHistory(true)}
                    >
                        <span>◷</span>
                        View history
                    </button>
                </header>

                {loading ? (
                    <div className="profile-loading">
                        <div className="profile-loading__spinner" />
                        <p>
                            Loading your activity...
                        </p>
                    </div>
                ) : error ? (
                    <div className="profile-error">
                        <span>!</span>

                        <div>
                            <strong>
                                Unable to load activity
                            </strong>

                            <p>{error}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* SUMMARY */}
                        <section className="profile-summary">
                            <div className="profile-stat-card">
                                <span className="profile-stat-card__icon">
                                    🎮
                                </span>

                                <div>
                                    <small>
                                        Games completed
                                    </small>

                                    <strong>
                                        {stats?.total_sessions_completed ??
                                            0}
                                    </strong>
                                </div>
                            </div>

                            <div className="profile-stat-card">
                                <span className="profile-stat-card__icon">
                                    ⭐
                                </span>

                                <div>
                                    <small>
                                        Average score
                                    </small>

                                    <strong>
                                        {Number(
                                            stats?.metrics
                                                ?.average_score || 0
                                        ).toFixed(1)}
                                    </strong>
                                </div>
                            </div>

                            <div className="profile-stat-card">
                                <span className="profile-stat-card__icon">
                                    🎯
                                </span>

                                <div>
                                    <small>
                                        Average errors
                                    </small>

                                    <strong>
                                        {Number(
                                            stats?.metrics
                                                ?.average_errors_per_session ||
                                                0
                                        ).toFixed(1)}
                                    </strong>
                                </div>
                            </div>

                            <div className="profile-stat-card">
                                <span className="profile-stat-card__icon">
                                    🏆
                                </span>

                                <div>
                                    <small>
                                        Best level
                                    </small>

                                    <strong>
                                        {stats?.metrics
                                            ?.best_level || 1}
                                    </strong>
                                </div>
                            </div>
                        </section>

                        {/* GRAPHS */}
                        <section className="profile-analytics">
                            <div className="profile-section-heading">
                                <div>
                                    <span className="profile-eyebrow">
                                        YOUR PROGRESS
                                    </span>

                                    <h2>
                                        How you are doing
                                    </h2>

                                    <p>
                                        Your completed activities
                                        turned into simple visual
                                        progress.
                                    </p>
                                </div>
                            </div>

                            <div className="profile-charts">
                                <article className="profile-chart-card profile-chart-card--large">
                                    <div className="profile-chart-card__header">
                                        <div>
                                            <h3>
                                                Score over time
                                            </h3>

                                            <p>
                                                Your game scores
                                                from oldest to
                                                newest.
                                            </p>
                                        </div>

                                        <span className="chart-badge">
                                            {history.length} sessions
                                        </span>
                                    </div>

                                    <ScoreTrendChart
                                        history={history}
                                    />
                                </article>

                                <article className="profile-chart-card">
                                    <div className="profile-chart-card__header">
                                        <div>
                                            <h3>
                                                Activity performance
                                            </h3>

                                            <p>
                                                Average score for
                                                each game.
                                            </p>
                                        </div>
                                    </div>

                                    <GamePerformanceChart
                                        games={games}
                                    />
                                </article>
                            </div>
                        </section>

                        {/* ACTIVITY OVERVIEW */}
                        <section className="profile-overview">
                            <div className="profile-overview__text">
                                <span className="profile-eyebrow">
                                    ACTIVITY OVERVIEW
                                </span>

                                <h2>
                                    Keep going at your own pace
                                </h2>

                                <p>
                                    Every completed activity
                                    helps build a clearer picture
                                    of your progress. There is no
                                    pressure to be perfect.
                                </p>
                            </div>

                            <div className="profile-overview__metrics">
                                <div>
                                    <span>Average session</span>

                                    <strong>
                                        {formatDuration(
                                            stats?.metrics
                                                ?.average_duration_seconds
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Activities played</span>

                                    <strong>
                                        {games.length}
                                    </strong>
                                </div>

                                <div>
                                    <span>History available</span>

                                    <strong>
                                        {history.length}
                                    </strong>
                                </div>
                            </div>
                        </section>

                        {/* HISTORY CTA */}
                        <section className="profile-history-cta">
                            <div>
                                <span className="profile-history-cta__icon">
                                    📖
                                </span>

                                <div>
                                    <h3>
                                        Want to see every game?
                                    </h3>

                                    <p>
                                        Open your complete
                                        activity history, from
                                        your latest game back to
                                        your very first one.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowHistory(true)
                                }
                            >
                                View all history →
                            </button>
                        </section>
                    </>
                )}
            </section>
        </>
    );
}

const PROFILE_STYLES = `
.profile-page,
.profile-history {
    max-width: 1200px;
    margin: 0 auto;
    padding: 28px 24px 50px;
    color: #1e3a2b;
}

.profile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 30px;
}

.profile-header__identity {
    display: flex;
    align-items: center;
    gap: 18px;
}

.profile-avatar {
    width: 70px;
    height: 70px;
    flex: 0 0 70px;
    display: grid;
    place-items: center;
    border-radius: 22px;
    background: #1e3a2b;
    color: #fffaf6;
    font-family: "Lexend", sans-serif;
    font-size: 27px;
    font-weight: 700;
    box-shadow:
        8px 8px 18px rgba(30, 58, 43, 0.13),
        -8px -8px 18px rgba(255, 255, 255, 0.9);
}

.profile-eyebrow {
    display: block;
    margin-bottom: 5px;
    color: #b38b21;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.16em;
}

.profile-header h1 {
    margin: 0;
    color: #072417;
    font-family: "Lexend", sans-serif;
    font-size: 34px;
    line-height: 1.1;
}

.profile-header p {
    margin: 7px 0 0;
    color: #727973;
    font-size: 14px;
}

.history-button,
.history-back-button {
    border: 0;
    border-radius: 15px;
    padding: 13px 18px;
    background: #1e3a2b;
    color: white;
    font-weight: 700;
    cursor: pointer;
    transition:
        transform 160ms ease,
        box-shadow 160ms ease;
    box-shadow: 6px 7px 15px rgba(30, 58, 43, 0.13);
}

.history-button {
    display: flex;
    align-items: center;
    gap: 8px;
}

.history-button:hover,
.history-back-button:hover {
    transform: translateY(-2px);
}

.profile-summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 34px;
}

.profile-stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 105px;
    padding: 18px;
    border-radius: 21px;
    background: #f7f1ed;
    box-shadow:
        7px 7px 18px rgba(30, 58, 43, 0.07),
        -7px -7px 18px rgba(255, 255, 255, 0.95);
}

.profile-stat-card__icon {
    width: 47px;
    height: 47px;
    display: grid;
    place-items: center;
    flex: 0 0 47px;
    border-radius: 15px;
    background: #fffaf6;
    font-size: 21px;
}

.profile-stat-card small {
    display: block;
    margin-bottom: 5px;
    color: #727973;
    font-size: 12px;
}

.profile-stat-card strong {
    color: #072417;
    font-family: "Lexend", sans-serif;
    font-size: 27px;
}

.profile-section-heading {
    margin-bottom: 20px;
}

.profile-section-heading h2,
.profile-history__header h2 {
    margin: 5px 0 5px;
    color: #072417;
    font-family: "Lexend", sans-serif;
    font-size: 28px;
}

.profile-section-heading p,
.profile-history__header p {
    margin: 0;
    color: #727973;
    font-size: 14px;
}

.profile-charts {
    display: grid;
    grid-template-columns: 1.45fr 1fr;
    gap: 20px;
}

.profile-chart-card {
    min-width: 0;
    padding: 23px;
    border-radius: 23px;
    background: #f7f1ed;
    box-shadow:
        8px 8px 20px rgba(30, 58, 43, 0.07),
        -8px -8px 20px rgba(255, 255, 255, 0.95);
}

.profile-chart-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 16px;
}

.profile-chart-card h3 {
    margin: 0;
    color: #072417;
    font-family: "Lexend", sans-serif;
    font-size: 18px;
}

.profile-chart-card p {
    margin: 5px 0 0;
    color: #727973;
    font-size: 13px;
}

.chart-badge {
    flex-shrink: 0;
    padding: 7px 10px;
    border-radius: 10px;
    background: #fffaf6;
    color: #727973;
    font-size: 11px;
    font-weight: 700;
}

.score-chart {
    width: 100%;
}

.score-chart__svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
}

.chart-grid-line {
    stroke: rgba(30, 58, 43, 0.09);
    stroke-width: 1;
}

.chart-axis-text,
.chart-date-text {
    fill: #8a918c;
    font-family: Arial, sans-serif;
    font-size: 11px;
}

.score-chart__line {
    stroke: #1e3a2b;
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.score-chart__point {
    fill: #cca830;
    stroke: #fffaf6;
    stroke-width: 3;
}

.chart-footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: #727973;
    font-size: 12px;
}

.chart-footer > span:first-child {
    display: flex;
    align-items: center;
    gap: 6px;
}

.chart-dot {
    width: 8px;
    height: 8px;
    display: inline-block;
    border-radius: 50%;
    background: #cca830;
}

.game-performance-chart {
    display: flex;
    flex-direction: column;
    gap: 19px;
}

.game-performance-row__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    color: #354039;
    font-size: 13px;
    font-weight: 700;
}

.game-performance-row__header > span {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 7px;
}

.game-performance-icon {
    flex-shrink: 0;
}

.game-performance-row__header strong {
    color: #1e3a2b;
    font-family: "Lexend", sans-serif;
}

.game-performance-track {
    height: 10px;
    overflow: hidden;
    border-radius: 99px;
    background: #e7dfd9;
}

.game-performance-fill {
    height: 100%;
    border-radius: inherit;
    background: #1e3a2b;
    transition: width 500ms ease;
}

.game-performance-meta {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 5px;
    color: #909691;
    font-size: 10px;
}

.profile-overview {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 24px;
    margin-top: 25px;
    padding: 25px;
    border-radius: 23px;
    background: #1e3a2b;
    color: white;
}

.profile-overview__text h2 {
    margin: 5px 0 9px;
    font-family: "Lexend", sans-serif;
    font-size: 23px;
}

.profile-overview__text p {
    max-width: 580px;
    margin: 0;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.6;
    font-size: 14px;
}

.profile-overview .profile-eyebrow {
    color: #e0bd59;
}

.profile-overview__metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    align-items: center;
}

.profile-overview__metrics div {
    padding: 13px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.08);
}

.profile-overview__metrics span {
    display: block;
    margin-bottom: 7px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 10px;
}

.profile-overview__metrics strong {
    font-family: "Lexend", sans-serif;
    font-size: 18px;
}

.profile-history-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;
    padding: 21px;
    border-radius: 21px;
    background: #f7f1ed;
    box-shadow:
        7px 7px 18px rgba(30, 58, 43, 0.06),
        -7px -7px 18px rgba(255, 255, 255, 0.95);
}

.profile-history-cta > div {
    display: flex;
    align-items: center;
    gap: 14px;
}

.profile-history-cta__icon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    flex: 0 0 48px;
    border-radius: 15px;
    background: #fffaf6;
    font-size: 22px;
}

.profile-history-cta h3 {
    margin: 0;
    color: #072417;
    font-family: "Lexend", sans-serif;
    font-size: 16px;
}

.profile-history-cta p {
    margin: 4px 0 0;
    color: #727973;
    font-size: 12px;
}

.profile-history-cta button {
    border: 0;
    border-radius: 13px;
    padding: 12px 16px;
    background: #cca830;
    color: #1e3a2b;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
}

.profile-loading {
    min-height: 300px;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 12px;
    color: #727973;
}

.profile-loading__spinner {
    width: 34px;
    height: 34px;
    border: 4px solid #e5ded9;
    border-top-color: #1e3a2b;
    border-radius: 50%;
    animation: profile-spin 800ms linear infinite;
}

@keyframes profile-spin {
    to {
        transform: rotate(360deg);
    }
}

.profile-error {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px;
    border-radius: 18px;
    background: #fff2ed;
    color: #7a3e2e;
}

.profile-error > span {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    border-radius: 50%;
    background: #f5d8ce;
    font-weight: 900;
}

.profile-error strong {
    display: block;
}

.profile-error p {
    margin: 4px 0 0;
    font-size: 13px;
}

.profile-empty {
    min-height: 190px;
    display: grid;
    place-items: center;
    align-content: center;
    text-align: center;
    color: #727973;
}

.profile-empty__icon {
    margin-bottom: 8px;
    font-size: 30px;
}

.profile-empty p {
    max-width: 300px;
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
}

/* HISTORY */

.profile-history__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 25px;
}

.history-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.history-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 17px;
    border-radius: 19px;
    background: #f7f1ed;
    box-shadow:
        6px 6px 15px rgba(30, 58, 43, 0.05),
        -6px -6px 15px rgba(255, 255, 255, 0.9);
}

.history-item__icon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    flex: 0 0 48px;
    border-radius: 15px;
    background: #fffaf6;
    font-size: 21px;
}

.history-item__main {
    min-width: 0;
    flex: 1;
}

.history-item__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 12px;
}

.history-item__title h3 {
    margin: 0;
    color: #072417;
    font-family: "Lexend", sans-serif;
    font-size: 15px;
}

.history-item__title span {
    color: #8a918c;
    font-size: 11px;
    white-space: nowrap;
}

.history-item__stats {
    display: grid;
    grid-template-columns: repeat(5, minmax(70px, 1fr));
    gap: 10px;
}

.history-item__stats div {
    padding: 8px 10px;
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.55);
}

.history-item__stats small {
    display: block;
    margin-bottom: 3px;
    color: #8a918c;
    font-size: 9px;
}

.history-item__stats strong {
    color: #1e3a2b;
    font-size: 12px;
}

/* RESPONSIVE */

@media (max-width: 950px) {
    .profile-summary {
        grid-template-columns: repeat(2, 1fr);
    }

    .profile-charts {
        grid-template-columns: 1fr;
    }

    .profile-overview {
        grid-template-columns: 1fr;
    }

    .history-item__stats {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 650px) {
    .profile-page,
    .profile-history {
        padding: 20px 15px 35px;
    }

    .profile-header,
    .profile-history__header {
        align-items: flex-start;
        flex-direction: column;
    }

    .history-button,
    .history-back-button {
        width: 100%;
        justify-content: center;
    }

    .profile-header h1 {
        font-size: 27px;
    }

    .profile-avatar {
        width: 58px;
        height: 58px;
        flex-basis: 58px;
    }

    .profile-summary {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .profile-stat-card {
        min-height: 90px;
        padding: 13px;
    }

    .profile-stat-card__icon {
        width: 38px;
        height: 38px;
        flex-basis: 38px;
        font-size: 17px;
    }

    .profile-stat-card strong {
        font-size: 22px;
    }

    .profile-chart-card {
        padding: 16px;
    }

    .profile-overview {
        padding: 19px;
    }

    .profile-overview__metrics {
        grid-template-columns: 1fr;
    }

    .profile-history-cta {
        align-items: flex-start;
        flex-direction: column;
    }

    .profile-history-cta button {
        width: 100%;
    }

    .history-item {
        align-items: flex-start;
    }

    .history-item__title {
        align-items: flex-start;
        flex-direction: column;
        gap: 3px;
    }

    .history-item__stats {
        grid-template-columns: repeat(2, 1fr);
    }
}
`;