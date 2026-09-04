// src/games/sound-object-match/SoundObjectMatch.jsx

import React, { useState } from "react";
import { useGameSession } from "../../context/GameSessionContext";
import { soundMatches } from "./soundObjectMatchData";
import "./soundObjectMatch.css";

const SoundObjectMatch = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState("");
    const { record } = useGameSession();

    const question = soundMatches[questionIndex];

    const handleOptionClick = (option) => {
        if (option.id === question.id) {
            record({ correct: true });
            setFeedback("correct");

            setTimeout(() => {
                if (questionIndex === soundMatches.length - 1) {
                    setFeedback("complete");
                } else {
                    setQuestionIndex((previous) => previous + 1);
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
        console.log(`Playing sound: ${question.soundName}`);
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

                    <h2>Wonderful!</h2>

                    <p>
                        You matched all the sounds.
                    </p>

                    <button
                        className="sound-button"
                        onClick={restartGame}
                    >
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="sound-match">

            <div className="sound-header">

                <p className="sound-label">
                    SOUND & OBJECT MATCH
                </p>

                <h2>Listen carefully</h2>

                <p>
                    Which picture matches the sound?
                </p>

                <div className="sound-progress">
                    {questionIndex + 1} of {soundMatches.length}
                </div>

            </div>

            <div className="sound-player">

                <button
                    className="sound-play-button"
                    onClick={playSound}
                    aria-label="Play sound"
                >
                    🔊
                </button>

                <h3>{question.soundName}</h3>

                <p>
                    {question.description}
                </p>

                <button
                    className="sound-button"
                    onClick={playSound}
                >
                    Play Sound
                </button>

            </div>

            <div className="sound-options">

                {question.options.map((option) => (
                    <button
                        key={option.id}
                        className="sound-option"
                        onClick={() => handleOptionClick(option)}
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
                    ✓ That's right!
                </div>
            )}

            {feedback === "try-again" && (
                <div className="sound-feedback feedback-wrong">
                    That's okay. Listen again.
                </div>
            )}

        </div>
    );
};

export default SoundObjectMatch;