import React, { useRef, useState } from "react";
import { useGameSession } from "../../context/GameSessionContext";
import { useLanguage } from "../../context/LanguageContext";
import { routines } from "./routineRescueData";
import "./routineRescue.css";

const RoutineRescue = () => {
    const [routineIndex, setRoutineIndex] = useState(0);
    const [nextStep, setNextStep] = useState(0);
    const [selectedSteps, setSelectedSteps] = useState([]);
    const [feedback, setFeedback] = useState("");

    const { record } = useGameSession();
    const { t } = useLanguage();

    // Stores when the current routine step became available.
    const stepStartedAtRef = useRef(performance.now());

    const routine = routines[routineIndex];

    const handleStepClick = (step) => {
        if (feedback === "correct") return;

        const correctStep = routine.steps[nextStep];

        // Measure how long the player took to choose
        // the current step.
        const now = performance.now();

        const latencyMs = Math.max(
            0,
            Math.round(
                now - stepStartedAtRef.current
            )
        );

        const isCorrect = step.id === correctStep.id;

        record({
            correct: isCorrect,
            latencyMs
        });

        if (isCorrect) {
            const updatedSteps = [
                ...selectedSteps,
                step
            ];

            setSelectedSteps(updatedSteps);
            setFeedback("correct");

            setTimeout(() => {
                if (
                    nextStep ===
                    routine.steps.length - 1
                ) {
                    if (
                        routineIndex ===
                        routines.length - 1
                    ) {
                        setFeedback("complete");
                        stepStartedAtRef.current = null;
                    } else {
                        setRoutineIndex(
                            (previous) =>
                                previous + 1
                        );

                        setNextStep(0);
                        setSelectedSteps([]);
                        setFeedback("");

                        // Start measuring the first step
                        // of the next routine.
                        stepStartedAtRef.current =
                            performance.now();
                    }
                } else {
                    setNextStep(
                        (previous) => previous + 1
                    );

                    setFeedback("");

                    // Start a fresh measurement for the
                    // next step.
                    stepStartedAtRef.current =
                        performance.now();
                }
            }, 900);
        } else {
            setFeedback("try-again");

            setTimeout(() => {
                setFeedback("");

                // Do not count the feedback display time.
                // Start measuring again when the player
                // can make another attempt.
                stepStartedAtRef.current =
                    performance.now();
            }, 1200);
        }
    };

    const restartGame = () => {
        setRoutineIndex(0);
        setNextStep(0);
        setSelectedSteps([]);
        setFeedback("");

        // Restart reaction-time tracking.
        stepStartedAtRef.current =
            performance.now();
    };

    if (feedback === "complete") {
        return (
            <div className="routine-rescue">
                <div className="routine-complete">
                    <div className="routine-complete-icon">
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
                            "games.completedAllRoutines",
                            "You completed all the routines."
                        )}
                    </p>

                    <button
                        type="button"
                        className="routine-button"
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
        <div className="routine-rescue">

            <div className="routine-header">

                <p className="routine-label">
                    {t(
                        "games.routineRescue",
                        "ROUTINE RESCUE"
                    )}
                </p>

                <h2>
                    {routine.title}
                </h2>

                <p className="routine-instruction">
                    {routine.instruction}
                </p>

                <p className="routine-progress">
                    {t(
                        "games.step",
                        "Step"
                    )}{" "}
                    {nextStep + 1}{" "}
                    {t(
                        "common.of",
                        "of"
                    )}{" "}
                    {routine.steps.length}
                </p>

            </div>

            {selectedSteps.length > 0 && (
                <div className="selected-steps">

                    {selectedSteps.map(
                        (step, index) => (
                            <div
                                className="selected-step"
                                key={step.id}
                            >
                                <span className="step-number">
                                    {index + 1}
                                </span>

                                <span>
                                    {step.emoji}{" "}
                                    {step.text}
                                </span>
                            </div>
                        )
                    )}

                </div>
            )}

            <div className="routine-options">

                {routine.steps.map((step) => {

                    const alreadySelected =
                        selectedSteps.some(
                            (selected) =>
                                selected.id ===
                                step.id
                        );

                    return (
                        <button
                            type="button"
                            key={step.id}
                            className={`routine-option ${
                                alreadySelected
                                    ? "already-selected"
                                    : ""
                            } ${
                                feedback ===
                                "try-again"
                                    ? "option-shake"
                                    : ""
                            }`}
                            onClick={() =>
                                handleStepClick(
                                    step
                                )
                            }
                            disabled={
                                alreadySelected
                            }
                        >
                            <span className="routine-emoji">
                                {step.emoji}
                            </span>

                            <span className="routine-text">
                                {step.text}
                            </span>
                        </button>
                    );
                })}

            </div>

            {feedback === "correct" && (
                <div className="routine-feedback feedback-correct">
                    ✓{" "}
                    {t(
                        "games.thatsRight",
                        "That's right!"
                    )}
                </div>
            )}

            {feedback === "try-again" && (
                <div className="routine-feedback feedback-wrong">
                    {t(
                        "games.thinkWhatComesFirst",
                        "That's okay. Think about what comes first."
                    )}
                </div>
            )}

        </div>
    );
};

export default RoutineRescue;