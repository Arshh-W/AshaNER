import { useRef, useState } from "react";
import { useGameSession } from "../../context/GameSessionContext";
import { useLanguage } from "../../context/LanguageContext";
import {
    villageItems,
    villageTasks
} from "./memoryVillageData";
import "./memoryVillage.css";

const MemoryVillage = () => {
    const [currentTask, setCurrentTask] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [completed, setCompleted] = useState(false);

    const { record } = useGameSession();
    const { t } = useLanguage();

    // Stores the time at which the current task became available.
    const taskStartedAtRef = useRef(performance.now());

    const task = villageTasks[currentTask];

    const handleItemClick = (item) => {
        const now = performance.now();

        // Measure how long the player took to answer.
        const latencyMs = Math.max(
            0,
            Math.round(
                now - taskStartedAtRef.current
            )
        );

        const isCorrect =
            item.id === task.targetId;

        record({
            correct: isCorrect,
            latencyMs
        });

        if (isCorrect) {
            setFeedback("correct");

            setTimeout(() => {
                if (
                    currentTask ===
                    villageTasks.length - 1
                ) {
                    setCompleted(true);
                    taskStartedAtRef.current = null;
                } else {
                    setCurrentTask(
                        (previous) => previous + 1
                    );

                    setFeedback("");

                    // Start timing the next task only after
                    // it becomes available.
                    taskStartedAtRef.current =
                        performance.now();
                }
            }, 1000);
        } else {
            setFeedback("try-again");

            setTimeout(() => {
                setFeedback("");

                // Start a fresh measurement after the
                // wrong-answer feedback disappears.
                taskStartedAtRef.current =
                    performance.now();
            }, 1200);
        }
    };

    const restartGame = () => {
        setCurrentTask(0);
        setFeedback("");
        setCompleted(false);

        // Restart reaction-time tracking.
        taskStartedAtRef.current =
            performance.now();
    };

    if (completed) {
        return (
            <div className="memory-village">
                <div className="memory-village-complete">
                    <div className="complete-icon">
                        🌟
                    </div>

                    <h2>
                        {t(
                            "games.wonderful",
                            "Wonderful!"
                        )}
                    </h2>

                    <p>
                        {t(
                            "games.foundEveryoneAndEverything",
                            "You found everyone and everything in the village."
                        )}
                    </p>

                    <button
                        type="button"
                        className="restart-button"
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
        <div className="memory-village">

            <div className="memory-village-header">

                <p className="game-label">
                    {t(
                        "games.memoryVillage",
                        "MEMORY VILLAGE"
                    )}
                </p>

                <h2>
                    {task.instruction}
                </h2>

                <p className="game-hint">
                    {t(
                        "games.takeYourTimeLookAround",
                        "Take your time and look around the village."
                    )}
                </p>

                <div className="progress">

                    <span>
                        {currentTask + 1}{" "}
                        {t(
                            "common.of",
                            "of"
                        )}{" "}
                        {villageTasks.length}
                    </span>

                    <div className="progress-track">

                        <div
                            className="progress-fill"
                            style={{
                                width: `${
                                    ((currentTask + 1) /
                                        villageTasks.length) *
                                    100
                                }%`,
                            }}
                        />

                    </div>

                </div>
            </div>

            <div className="village">

                {villageItems.map((item) => (
                    <button
                        type="button"
                        key={item.id}
                        className={`village-item ${
                            feedback === "correct" &&
                            item.id === task.targetId
                                ? "correct"
                                : ""
                        }`}
                        onClick={() =>
                            handleItemClick(item)
                        }
                        aria-label={item.name}
                    >
                        <span className="item-emoji">
                            {item.emoji}
                        </span>

                        <span className="item-name">
                            {item.name}
                        </span>
                    </button>
                ))}

            </div>

            {feedback === "correct" && (
                <div className="feedback correct-feedback">
                    <span>✓</span>

                    <p>
                        {t(
                            "games.wellDone",
                            "Well done!"
                        )}
                    </p>
                </div>
            )}

            {feedback === "try-again" && (
                <div className="feedback try-again-feedback">
                    <span>💭</span>

                    <p>
                        {t(
                            "games.haveAnotherLook",
                            "That's okay. Have another look."
                        )}
                    </p>
                </div>
            )}

        </div>
    );
};

export default MemoryVillage;