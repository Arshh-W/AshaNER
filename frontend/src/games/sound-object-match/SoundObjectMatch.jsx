import React, { useState } from "react";
import { useGameSession } from "../../context/GameSessionContext";
import { useLanguage } from "../../context/LanguageContext";
import { soundMatches } from "./soundObjectMatchData";
import "./soundObjectMatch.css";

const SoundObjectMatch = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState("");

    const { record } = useGameSession();
    const { t } = useLanguage();

    const question = soundMatches[questionIndex];

    const handleOptionClick = (option) => {
        if (option.id === question.id) {
            record({ correct: true });
            setFeedback("correct");

            setTimeout(() => {
                if (
                    questionIndex ===
                    soundMatches.length - 1
                ) {
                    setFeedback("complete");
                } else {
                    setQuestionIndex(
                        (previous) => previous + 1
                    );
                    setFeedback("");
                }
            }, 1000);
        } else {
            record({ correct: false });
            setFeedback("try-again");

            setTimeout(() => {
                setFeedback("");
            }, 1200);
        }
    };

    const playSound = () => {
        // Audio will be connected here when local audio
        // files are added.
        console.log(
            `Playing sound: ${question.soundName}`
        );
    };

    const restartGame = () => {
        setQuestionIndex(0);
        setFeedback("");
    };

    if (feedback === "complete") {
        return (
            <div className="sound-match">
                <div className="sound-complete">

                    <div className="sound-complete-icon">
                        🎵
                    </div>

                    <h2>
                        {t(
                            "games.wonderful",
                            "Wonderful!"
                        )}
                    </h2>

                    <p>
                        {t(
                            "games.matchedAllSounds",
                            "You matched all the sounds."
                        )}
                    </p>

                    <button
                        type="button"
                        className="sound-button"
                        onClick={restartGame}
                    >
                        {t(
                            "games.playAgain",
                            "Play Again"
                        )}
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="sound-match">

            <div className="sound-header">

                <p className="sound-label">
                    {t(
                        "games.soundObjectMatch",
                        "SOUND & OBJECT MATCH"
                    )}
                </p>

                <h2>
                    {t(
                        "games.listenCarefully",
                        "Listen carefully"
                    )}
                </h2>

                <p>
                    {t(
                        "games.whichPictureMatchesSound",
                        "Which picture matches the sound?"
                    )}
                </p>

                <div className="sound-progress">
                    {questionIndex + 1}{" "}
                    {t(
                        "common.of",
                        "of"
                    )}{" "}
                    {soundMatches.length}
                </div>

            </div>

            <div className="sound-player">

                <button
                    type="button"
                    className="sound-play-button"
                    onClick={playSound}
                    aria-label={t(
                        "games.playSound",
                        "Play sound"
                    )}
                >
                    🔊
                </button>

                <h3>
                    {question.soundName}
                </h3>

                <p>
                    {question.description}
                </p>

                <button
                    type="button"
                    className="sound-button"
                    onClick={playSound}
                >
                    {t(
                        "games.playSound",
                        "Play Sound"
                    )}
                </button>

            </div>

            <div className="sound-options">

                {question.options.map((option) => (
                    <button
                        type="button"
                        key={option.id}
                        className="sound-option"
                        onClick={() =>
                            handleOptionClick(option)
                        }
                    >
                        <span className="sound-option-emoji">
                            {option.emoji}
                        </span>

                        <span>
                            {option.name}
                        </span>
                    </button>
                ))}

            </div>

            {feedback === "correct" && (
                <div className="sound-feedback feedback-correct">
                    ✓{" "}
                    {t(
                        "games.thatsRight",
                        "That's right!"
                    )}
                </div>
            )}

            {feedback === "try-again" && (
                <div className="sound-feedback feedback-wrong">
                    {t(
                        "games.listenAgain",
                        "That's okay. Listen again."
                    )}
                </div>
            )}

        </div>
    );
};

export default SoundObjectMatch;