import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "./GamesPage.css";

const games = [
    {
        id: "memory-detective",
        number: "01",
        icon: "🔎",
        titleKey: "memoryDetective",
        descriptionKey: "memoryDetectiveDescription",
        categoryKey: "memory",
        durationKey: "minutes5",
        difficultyKey: "gentle",
        accent: "green"
    },
    {
        id: "memory-mosaic",
        number: "02",
        icon: "🧩",
        titleKey: "memoryMosaic",
        descriptionKey: "memoryMosaicDescription",
        categoryKey: "pattern",
        durationKey: "minutes5",
        difficultyKey: "gentle",
        accent: "gold"
    },
    {
        id: "memory-village",
        number: "03",
        icon: "🏡",
        titleKey: "memoryVillage",
        descriptionKey: "memoryVillageDescription",
        categoryKey: "reminiscence",
        durationKey: "minutes7",
        difficultyKey: "easy",
        accent: "terracotta"
    },
    {
        id: "routine-rescue",
        number: "04",
        icon: "🌿",
        titleKey: "routineRescue",
        descriptionKey: "routineRescueDescription",
        categoryKey: "dailyLife",
        durationKey: "minutes5",
        difficultyKey: "gentle",
        accent: "green"
    },
    {
        id: "sound-object-match",
        number: "05",
        icon: "🔊",
        titleKey: "soundObjectMatch",
        descriptionKey: "soundObjectMatchDescription",
        categoryKey: "listening",
        durationKey: "minutes5",
        difficultyKey: "easy",
        accent: "gold"
    }
];

export default function GamesPage() {
    const { user } = useAuth();
    const patientName = user?.patientName || user?.name || user?.fullName || user?.displayName || user?.username || "there";
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleListen = () => {
        if (!window.speechSynthesis) {
            return;
        }

        const speechText = t(
            "games.listenSpeech",
            "Choose an activity. Take your time. Asha is here to help you."
        );

        const speech = new SpeechSynthesisUtterance(speechText);
        speech.rate = 0.8;
        speech.pitch = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
    };

    return (
        <main className="games-hub">
            <div className="games-hub__ambient games-hub__ambient--one" />
            <div className="games-hub__ambient games-hub__ambient--two" />

            {/* HERO */}
            <section className="games-hero">
                <div className="games-hero__content">
                    <div className="games-hero__eyebrow">
                        <span>✦</span>
                        {t("games.eyebrow", "TODAY'S BRAIN TIME")}
                    </div>

                    <h1>
                        {t("games.titleLine1", "A little play,")}
                        <br />
                        <em>{t("games.titleLine2", "a little memory.")}</em>
                    </h1>

                    <p>
                        {t(
                            "games.description",
                            "Choose a gentle activity and take your time. There is no rush here."
                        )}
                    </p>

                    <div className="games-hero__welcome">
                        <div className="games-hero__avatar">
                            {patientName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {t(
                                    "games.greeting",
                                    `Good morning, ${patientName}`
                                ).replace(/\{name\}/g, patientName)}
                            </strong>

                            <span>
                                {t(
                                    "games.activityReady",
                                    "Your 5-minute brain activity is ready."
                                )}
                            </span>
                        </div>

                        <div className="games-hero__status">
                            <span />
                            {t("games.savedOffline", "Saved offline")}
                        </div>
                    </div>
                </div>

                <div className="games-hero__illustration">
                    <div className="hero-circle hero-circle--outer" />
                    <div className="hero-circle hero-circle--middle" />
                    <div className="hero-circle hero-circle--inner">
                        <span>🧠</span>
                    </div>

                    <div className="floating-leaf floating-leaf--one">🍃</div>
                    <div className="floating-leaf floating-leaf--two">🌿</div>

                    <div className="floating-card">
                        <span>✦</span>
                        <strong>{t("games.takeYourTime", "Take your time")}</strong>
                    </div>
                </div>
            </section>

            {/* ACTIVITIES */}
            <section className="games-section">
                <div className="games-section__heading">
                    <div>
                        <span className="section-kicker">
                            {t("games.activitiesEyebrow", "YOUR ACTIVITIES")}
                        </span>
                        <h2>{t("games.chooseGame", "Choose a game")}</h2>
                    </div>

                    <div className="game-count">
                        <strong>{games.length}</strong>
                        <span>{t("games.gentleActivities", "gentle activities")}</span>
                    </div>
                </div>

                <div className="games-grid">
                    {games.map((game, index) => (
                        <button
                            key={game.id}
                            type="button"
                            className={`game-card game-card--${game.accent} ${
                                index === 0 ? "game-card--featured" : ""
                            }`}
                            onClick={() => navigate(`/patient/games/${game.id}`)}
                        >
                            <div className="game-card__top">
                                <span className="game-card__number">{game.number}</span>
                                <span className="game-card__arrow">↗</span>
                            </div>

                            <div className="game-card__icon">{game.icon}</div>

                            <div className="game-card__body">
                                <span className="game-card__category">
                                    {t(`games.${game.categoryKey}`, game.categoryKey)}
                                </span>
                                <h3>{t(`games.${game.titleKey}`, game.titleKey)}</h3>
                                <p>{t(`games.${game.descriptionKey}`, game.descriptionKey)}</p>
                            </div>

                            <div className="game-card__meta">
                                <span>
                                    ◷ {t(`games.${game.durationKey}`, game.durationKey)}
                                </span>
                                <span>
                                    ♡ {t(`games.${game.difficultyKey}`, game.difficultyKey)}
                                </span>
                            </div>

                            <div className="game-card__play">
                                <span>{t("games.playActivity", "Play activity")}</span>
                                <span>→</span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* HELP / LISTEN */}
            <section className="games-support">
                <div className="games-support__icon">🔊</div>

                <div className="games-support__content">
                    <span>{t("games.needHelp", "NEED A LITTLE HELP?")}</span>
                    <h3>{t("games.listenInstructions", "Listen to the instructions")}</h3>
                    <p>
                        {t(
                            "games.helpDescription",
                            "Asha can explain each activity in your preferred regional language."
                        )}
                    </p>
                </div>

                <button
                    type="button"
                    className="games-support__button"
                    onClick={handleListen}
                >
                    <span>▶</span>
                    {t("games.listen", "Listen")}
                </button>
            </section>

            {/* GENTLE NOTE */}
            <section className="games-gentle-note">
                <span>🌱</span>
                <p>
                    <strong>{t("games.remember", "Remember:")}</strong>{" "}
                    {t(
                        "games.noWrongAnswers",
                        "there are no wrong answers. Every little effort is a good one."
                    )}
                </p>
            </section>
        </main>
    );
}