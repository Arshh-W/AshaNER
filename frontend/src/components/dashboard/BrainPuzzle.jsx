import React from "react";
import { useNavigate } from "react-router-dom";

const BrainPuzzle = () => {
    const navigate = useNavigate();

    const startGame = () => {
        if ("vibrate" in navigator) {
            navigator.vibrate(30);
        }

        navigate("/patient/games");
    };

    return (
        <section className="brain-puzzle">
            <div className="brain-puzzle-content">

                <div className="streak-row">
                    <span className="streak-badge">
                        ♧ Streak: 4 Days Active
                    </span>

                    <span>Daily Gentle Recall</span>
                </div>

                <h2>
                    Today's Brain Puzzle:
                    <br />
                    Kaziranga & Tea Garden Pattern Match
                </h2>

                <p>
                    Gentle 5-minute memory exercise to stimulate
                    recall. Match serene regional flora, birds,
                    and tea plantation memories. No rush, take
                    all the time you need.
                </p>

                <div className="puzzle-meta">
                    <span>◷ 5 Minutes</span>
                    <span>☻ Relaxed Pace</span>
                    <span>文 অসমীয়া</span>
                </div>

            </div>

            <div className="brain-puzzle-action">

                <div className="puzzle-image">
                    <div>🌿</div>

                    <span>
                        Puzzle Level: Gentle River
                    </span>
                </div>

                <button
                    className="play-game-button"
                    onClick={startGame}
                >
                    ▶

                    <span>
                        Play Brain Game
                        <small>
                            খেল আৰম্ভ কৰক
                        </small>
                    </span>
                </button>

            </div>
        </section>
    );
};

export default BrainPuzzle;