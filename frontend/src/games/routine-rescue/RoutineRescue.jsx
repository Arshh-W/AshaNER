// src/games/routine-rescue/RoutineRescue.jsx

import React, { useState } from "react";
import { useGameSession } from "../../context/GameSessionContext";
import { routines } from "./routineRescueData";
import "./routineRescue.css";

const RoutineRescue = () => {
    const [routineIndex, setRoutineIndex] = useState(0);
    const [nextStep, setNextStep] = useState(0);
    const [selectedSteps, setSelectedSteps] = useState([]);
    const [feedback, setFeedback] = useState("");
    const { record } = useGameSession();

    const routine = routines[routineIndex];

    const handleStepClick = (step) => {
        if (feedback === "correct") return;

        const correctStep = routine.steps[nextStep];

        if (step.id === correctStep.id) {
            const updatedSteps = [...selectedSteps, step];
            setSelectedSteps(updatedSteps);
            setFeedback("correct");
                record({ correct: true });

            setTimeout(() => {
                if (nextStep === routine.steps.length - 1) {
                    if (routineIndex === routines.length - 1) {
                        setFeedback("complete");
                    } else {
                        setRoutineIndex((previous) => previous + 1);
                        setNextStep(0);
                        setSelectedSteps([]);
                        setFeedback("");
                    }
                } else {
                    setNextStep((previous) => previous + 1);
                    setFeedback("");
                }
            }, 900);
        } else {
            record({ correct: false });
            setFeedback("try-again");

            setTimeout(() => {
                setFeedback("");
            }, 1200);
        }
    };

    const restartGame = () => {
        setRoutineIndex(0);
        setNextStep(0);
        setSelectedSteps([]);
        setFeedback("");
    };

    if (feedback === "complete") {
        return (
            <div className="routine-rescue">
                <div className="routine-complete">
                    <div className="routine-complete-icon">
                        🌟
                    </div>

                    <h2>Wonderful!</h2>

                    <p>
                        You completed all the routines.
                    </p>

                    <button
                        className="routine-button"
                        onClick={restartGame}
                    >
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="routine-rescue">

            <div className="routine-header">

                <p className="routine-label">
                    ROUTINE RESCUE
                </p>

                <h2>{routine.title}</h2>

                <p className="routine-instruction">
                    {routine.instruction}
                </p>

                <p className="routine-progress">
                    Step {nextStep + 1} of {routine.steps.length}
                </p>

            </div>

            {selectedSteps.length > 0 && (
                <div className="selected-steps">

                    {selectedSteps.map((step, index) => (
                        <div
                            className="selected-step"
                            key={step.id}
                        >
                            <span className="step-number">
                                {index + 1}
                            </span>

                            <span>
                                {step.emoji} {step.text}
                            </span>
                        </div>
                    ))}

                </div>
            )}

            <div className="routine-options">

                {routine.steps.map((step) => {

                    const alreadySelected = selectedSteps.some(
                        (selected) => selected.id === step.id
                    );

                    return (
                        <button
                            key={step.id}
                            className={`routine-option ${
                                alreadySelected
                                    ? "already-selected"
                                    : ""
                            } ${
                                feedback === "try-again"
                                    ? "option-shake"
                                    : ""
                            }`}
                            onClick={() => handleStepClick(step)}
                            disabled={alreadySelected}
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
                    ✓ That's right!
                </div>
            )}

            {feedback === "try-again" && (
                <div className="routine-feedback feedback-wrong">
                    That's okay. Think about what comes first.
                </div>
            )}

        </div>
    );
};

export default RoutineRescue;