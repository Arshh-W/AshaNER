import React, { useRef, useState } from "react";
import { useGameSession } from "../../context/GameSessionContext";
import { useLanguage } from "../../context/LanguageContext";
import { detectiveScenes } from "./memoryDetectiveData";
import "./memoryDetective.css";

const MemoryDetective = () => {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [phase, setPhase] = useState("observe");
    const [selectedObject, setSelectedObject] = useState(null);
    const [feedback, setFeedback] = useState("");

    const {
        record,
        complete
    } = useGameSession();

    const { t } = useLanguage();

    const detectionStartedAtRef = useRef(null);

    const scene = detectiveScenes[sceneIndex];

    const handleStart = () => {
        setPhase("detect");

        detectionStartedAtRef.current =
            performance.now();
    };

    const handleObjectClick = (object) => {
        if (phase !== "detect") return;

        const now = performance.now();

        const latencyMs =
            detectionStartedAtRef.current
                ? Math.max(
                    0,
                    Math.round(
                        now -
                        detectionStartedAtRef.current
                    )
                )
                : 0;

        setSelectedObject(object.id);

        const isCorrect =
            object.id === scene.changedObject;

        record({
            correct: isCorrect,
            latencyMs
        });

        if (isCorrect) {
            setFeedback("correct");

            setTimeout(() => {
                if (
                    sceneIndex ===
                    detectiveScenes.length - 1
                ) {
                    complete().catch((error) => {
                        console.error(
                            "Failed to complete game session:",
                            error
                        );
                    });

                    setPhase("complete");
                } else {
                    setSceneIndex(
                        (previous) => previous + 1
                    );

                    setPhase("observe");
                    setSelectedObject(null);
                    setFeedback("");

                    detectionStartedAtRef.current =
                        null;
                }
            }, 1200);
        } else {
            setFeedback("try-again");

            setTimeout(() => {
                setSelectedObject(null);
                setFeedback("");

                detectionStartedAtRef.current =
                    performance.now();
            }, 1200);
        }
    };

    const restartGame = () => {
        setSceneIndex(0);
        setPhase("observe");
        setSelectedObject(null);
        setFeedback("");

        detectionStartedAtRef.current = null;
    };

    if (phase === "complete") {
        return (
            <div className="memory-detective">
                <div className="detective-complete">
                    <div className="detective-complete-icon">
                        🕵️
                    </div>

                    <h2>
                        {t(
                            "games.excellent",
                            "Excellent!"
                        )}
                    </h2>

                    <p>
                        {t(
                            "games.noticedAllChanges",
                            "You noticed all the changes."
                        )}
                    </p>

                    <button
                        type="button"
                        className="detective-button"
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
        <div className="memory-detective">

            <div className="detective-header">

                <p className="detective-label">
                    {t(
                        "games.memoryDetective",
                        "MEMORY DETECTIVE"
                    )}
                </p>

                <h2>
                    {scene.title}
                </h2>

                <p className="detective-instruction">
                    {phase === "observe"
                        ? scene.instruction
                        : t(
                            "games.whatHasChanged",
                            "What has changed?"
                        )}
                </p>

                <div className="detective-progress">
                    {sceneIndex + 1}{" "}
                    {t("common.of", "of")}{" "}
                    {detectiveScenes.length}
                </div>

            </div>

            <div className="detective-scene">

                {scene.objects.map((object) => {
                    const isChangedObject =
                        object.id ===
                        scene.changedObject;

                    const isSelected =
                        selectedObject ===
                        object.id;

                    return (
                        <button
                            type="button"
                            key={object.id}
                            className={`detective-object ${
                                isSelected
                                    ? feedback === "correct"
                                        ? "object-correct"
                                        : "object-wrong"
                                    : ""
                            } ${
                                phase === "detect" &&
                                isChangedObject
                                    ? "object-changed"
                                    : ""
                            }`}
                            onClick={() =>
                                handleObjectClick(
                                    object
                                )
                            }
                            disabled={
                                phase === "observe"
                            }
                        >
                            <span
                                className="detective-object-emoji"
                                style={
                                    phase === "detect" &&
                                    isChangedObject
                                        ? {
                                            filter:
                                                "invert(1)"
                                        }
                                        : undefined
                                }
                            >
                                {object.emoji}
                            </span>

                            <span className="detective-object-name">
                                {object.name}
                            </span>
                        </button>
                    );
                })}

            </div>

            {phase === "observe" && (
                <button
                    type="button"
                    className="detective-button"
                    onClick={handleStart}
                >
                    {t(
                        "games.iveSeenEverything",
                        "I've Seen Everything"
                    )}
                </button>
            )}

            {phase === "detect" && (
                <p className="detective-hint">
                    {t(
                        "games.tapChangedObject",
                        "Tap the object that has changed."
                    )}
                </p>
            )}

            {feedback === "correct" && (
                <div className="detective-feedback feedback-correct">
                    ✓{" "}
                    {t(
                        "games.thatsRightGoodMemory",
                        "That's right! Good memory."
                    )}
                </div>
            )}

            {feedback === "try-again" && (
                <div className="detective-feedback feedback-wrong">
                    {t(
                        "games.lookCarefullyAgain",
                        "That's okay. Look carefully again."
                    )}
                </div>
            )}

        </div>
    );
};

export default MemoryDetective;