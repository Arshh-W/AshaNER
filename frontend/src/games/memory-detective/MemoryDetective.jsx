// src/games/memory-detective/MemoryDetective.jsx

import React, { useState } from "react";
import { detectiveScenes } from "./memoryDetectiveData";
import "./memoryDetective.css";

const MemoryDetective = () => {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [phase, setPhase] = useState("observe");
    const [selectedObject, setSelectedObject] = useState(null);
    const [feedback, setFeedback] = useState("");

    const scene = detectiveScenes[sceneIndex];

    const handleStart = () => {
        setPhase("detect");
    };

    const handleObjectClick = (object) => {
        if (phase !== "detect") return;

        setSelectedObject(object.id);

        if (object.id === scene.changedObject) {
            setFeedback("correct");

            setTimeout(() => {
                if (sceneIndex === detectiveScenes.length - 1) {
                    setPhase("complete");
                } else {
                    setSceneIndex((previous) => previous + 1);
                    setPhase("observe");
                    setSelectedObject(null);
                    setFeedback("");
                }
            }, 1200);
        } else {
            setFeedback("try-again");

            setTimeout(() => {
                setSelectedObject(null);
                setFeedback("");
            }, 1200);
        }
    };

    const restartGame = () => {
        setSceneIndex(0);
        setPhase("observe");
        setSelectedObject(null);
        setFeedback("");
    };

    if (phase === "complete") {
        return (
            <div className="memory-detective">
                <div className="detective-complete">
                    <div className="detective-complete-icon">🕵️</div>

                    <h2>Excellent!</h2>

                    <p>
                        You noticed all the changes.
                    </p>

                    <button
                        className="detective-button"
                        onClick={restartGame}
                    >
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="memory-detective">

            <div className="detective-header">

                <p className="detective-label">
                    MEMORY DETECTIVE
                </p>

                <h2>{scene.title}</h2>

                <p className="detective-instruction">
                    {phase === "observe"
                        ? scene.instruction
                        : "What has changed?"
                    }
                </p>

                <div className="detective-progress">
                    {sceneIndex + 1} of {detectiveScenes.length}
                </div>

            </div>

            <div className="detective-scene">

                {scene.objects.map((object) => (
                    <button
                        key={object.id}
                        className={`detective-object ${
                            selectedObject === object.id
                                ? feedback === "correct"
                                    ? "object-correct"
                                    : "object-wrong"
                                : ""
                        }`}
                        onClick={() => handleObjectClick(object)}
                        disabled={phase === "observe"}
                    >
                        <span className="detective-object-emoji">
                            {object.emoji}
                        </span>

                        <span className="detective-object-name">
                            {object.name}
                        </span>
                    </button>
                ))}

            </div>

            {phase === "observe" && (
                <button
                    className="detective-button"
                    onClick={handleStart}
                >
                    I've Seen Everything
                </button>
            )}

            {phase === "detect" && (
                <p className="detective-hint">
                    Tap the object that has changed.
                </p>
            )}

            {feedback === "correct" && (
                <div className="detective-feedback feedback-correct">
                    ✓ That's right! Good memory.
                </div>
            )}

            {feedback === "try-again" && (
                <div className="detective-feedback feedback-wrong">
                    That's okay. Look carefully again.
                </div>
            )}

        </div>
    );
};

export default MemoryDetective;