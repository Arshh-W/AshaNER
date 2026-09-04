import { useNavigate } from "react-router-dom";
import "./GamesPage.css";

const games = [
  {
    id: "memory-detective",
    number: "01",
    icon: "🔎",
    title: "Memory Detective",
    description:
      "Look carefully, remember the clues, and discover what changed.",
    category: "Memory",
    duration: "5 min",
    difficulty: "Gentle",
    accent: "green",
  },
  {
    id: "memory-mosaic",
    number: "02",
    icon: "🧩",
    title: "Memory Mosaic",
    description: "Piece together familiar patterns and colourful memories.",
    category: "Pattern",
    duration: "5 min",
    difficulty: "Gentle",
    accent: "gold",
  },
  {
    id: "memory-village",
    number: "03",
    icon: "🏡",
    title: "Memory Village",
    description:
      "Explore a familiar village and reconnect with everyday memories.",
    category: "Reminiscence",
    duration: "7 min",
    difficulty: "Easy",
    accent: "terracotta",
  },
  {
    id: "routine-rescue",
    number: "04",
    icon: "🌿",
    title: "Routine Rescue",
    description:
      "Put everyday activities in the right order and build confidence.",
    category: "Daily Life",
    duration: "5 min",
    difficulty: "Gentle",
    accent: "green",
  },
  {
    id: "sound-object-match",
    number: "05",
    icon: "🔊",
    title: "Sound & Object Match",
    description:
      "Listen closely and connect familiar sounds with the right object.",
    category: "Listening",
    duration: "5 min",
    difficulty: "Easy",
    accent: "gold",
  },
];

export default function GamesPage() {
  const navigate = useNavigate();

  return (
    <main className="games-hub">
      <div className="games-hub__ambient games-hub__ambient--one" />
      <div className="games-hub__ambient games-hub__ambient--two" />

      <section className="games-hero">
        <div className="games-hero__content">
          <div className="games-hero__eyebrow">
            <span>✦</span>
            TODAY'S BRAIN TIME
          </div>

          <h1>
            A little play,
            <br />
            <em>a little memory.</em>
          </h1>

          <p>
            Choose a gentle activity and take your time. There is no rush here.
          </p>

          <div className="games-hero__welcome">
            <div className="games-hero__avatar">K</div>

            <div>
              <strong>Good morning, Kangkan</strong>
              <span>Your 5-minute brain activity is ready.</span>
            </div>

            <div className="games-hero__status">
              <span />
              Saved offline
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
            <strong>Take your time</strong>
          </div>
        </div>
      </section>

      <section className="games-section">
        <div className="games-section__heading">
          <div>
            <span className="section-kicker">YOUR ACTIVITIES</span>
            <h2>Choose a game</h2>
          </div>

          <div className="game-count">
            <strong>{games.length}</strong>
            <span>gentle activities</span>
          </div>
        </div>

        <div className="games-grid">
          {games.map((game, index) => (
            <button
              key={game.id}
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
                <span className="game-card__category">{game.category}</span>

                <h3>{game.title}</h3>

                <p>{game.description}</p>
              </div>

              <div className="game-card__meta">
                <span>◷ {game.duration}</span>
                <span>♡ {game.difficulty}</span>
              </div>

              <div className="game-card__play">
                <span>Play activity</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="games-support">
        <div className="games-support__icon">🔊</div>

        <div className="games-support__content">
          <span>NEED A LITTLE HELP?</span>
          <h3>Listen to the instructions</h3>
          <p>
            Asha can explain each activity in your preferred regional language.
          </p>
        </div>

        <button
          className="games-support__button"
          onClick={() => {
            if (!window.speechSynthesis) return;

            const speech = new SpeechSynthesisUtterance(
              "Choose an activity. Take your time. Asha is here to help you.",
            );

            speech.rate = 0.8;
            speech.pitch = 1;

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(speech);
          }}
        >
          <span>▶</span>
          Listen
        </button>
      </section>

      <section className="games-gentle-note">
        <span>🌱</span>
        <p>
          <strong>Remember:</strong> there are no wrong answers. Every little
          effort is a good one.
        </p>
      </section>
    </main>
  );
}
