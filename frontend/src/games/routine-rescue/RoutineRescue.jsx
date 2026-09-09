import React, { useRef, useState } from "react";
import { useGameSession } from "../../context/GameSessionContext";
import { useLanguage } from "../../context/LanguageContext";
import { routines } from "./routineRescueData";
import "./routineRescue.css";


// Fisher-Yates shuffle
const shuffleArray = (array) => {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
};


const RoutineRescue = () => {

    // Randomize the routine order
    const [shuffledRoutines, setShuffledRoutines] =
        useState(() => shuffleArray(routines));

    const [routineIndex, setRoutineIndex] =
        useState(0);

    const [nextStep, setNextStep] =
        useState(0);

    const [selectedSteps, setSelectedSteps] =
        useState([]);

    const [feedback, setFeedback] =
        useState("");


    /*
     * IMPORTANT:
     * Cards are randomized separately for the
     * CURRENT routine.
     */
    const [shuffledSteps, setShuffledSteps] =
        useState(() => {
            const firstRoutine =
                shuffleArray(routines);

            return shuffleArray(
                firstRoutine[0].steps
            );
        });


    const {
        record,
        complete
    } = useGameSession();
    const { t } = useLanguage();


    // Reaction-time tracking
    const stepStartedAtRef =
        useRef(performance.now());


    // Current randomized routine
    const routine =
        shuffledRoutines[routineIndex];


    const handleStepClick = (step) => {

        // Prevent another click while showing
        // correct feedback
        if (feedback === "correct") {
            return;
        }


        /*
         * IMPORTANT:
         *
         * routine.steps is the ORIGINAL correct order.
         *
         * shuffledSteps is ONLY the display order.
         */
        const correctStep =
            routine.steps[nextStep];


        // Measure reaction time
        const now = performance.now();

        const latencyMs = Math.max(
            0,
            Math.round(
                now - stepStartedAtRef.current
            )
        );


        // Check answer
        const isCorrect =
            step.id === correctStep.id;


        // Record attempt
        record({
            correct: isCorrect,
            latencyMs
        });


        if (isCorrect) {

            // Add selected step
            const updatedSteps = [
                ...selectedSteps,
                step
            ];

            setSelectedSteps(updatedSteps);

            setFeedback("correct");


            setTimeout(() => {

                /*
                 * Current routine is finished
                 */
                if (
                    nextStep ===
                    routine.steps.length - 1
                ) {

                    /*
                     * All routines are finished
                     */
                    if (
                        routineIndex ===
                        shuffledRoutines.length - 1
                    ) {
                        complete().catch(() => undefined);

                        setFeedback("complete");

                        stepStartedAtRef.current = null;
                    } else {

                        /*
                         * Move to next routine
                         */
                        const nextRoutineIndex =
                            routineIndex + 1;


                        const nextRoutine =
                            shuffledRoutines[
                            nextRoutineIndex
                            ];


                        setRoutineIndex(
                            nextRoutineIndex
                        );


                        setNextStep(0);

                        setSelectedSteps([]);

                        setFeedback("");


                        /*
                         * RANDOMIZE ONLY THE CARDS
                         * BELONGING TO THE NEXT ROUTINE
                         */
                        setShuffledSteps(
                            shuffleArray(
                                nextRoutine.steps
                            )
                        );


                        // Restart reaction-time tracking
                        stepStartedAtRef.current =
                            performance.now();
                    }

                } else {

                    /*
                     * Move to next step
                     */
                    setNextStep(
                        (previous) =>
                            previous + 1
                    );

                    setFeedback("");


                    // Restart reaction-time tracking
                    stepStartedAtRef.current =
                        performance.now();
                }

            }, 900);

        } else {

            /*
             * Wrong answer
             */
            setFeedback("try-again");


            setTimeout(() => {

                setFeedback("");


                /*
                 * Do not count feedback time
                 */
                stepStartedAtRef.current =
                    performance.now();

            }, 1200);
        }
    };


    const restartGame = () => {

        /*
         * Create a completely new random
         * routine order.
         */
        const newShuffledRoutines =
            shuffleArray(routines);


        setShuffledRoutines(
            newShuffledRoutines
        );


        // Start from first routine
        setRoutineIndex(0);

        setNextStep(0);

        setSelectedSteps([]);

        setFeedback("");


        /*
         * IMPORTANT:
         *
         * Shuffle the cards from the NEW
         * first routine.
         */
        setShuffledSteps(
            shuffleArray(
                newShuffledRoutines[0].steps
            )
        );


        // Restart reaction-time tracking
        stepStartedAtRef.current =
            performance.now();
    };


    /*
     * =========================
     * COMPLETION SCREEN
     * =========================
     */

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


    /*
     * =========================
     * MAIN GAME
     * =========================
     */

    return (
        <div className="routine-rescue">


            {/* HEADER */}

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


            {/* SELECTED STEPS */}

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


            {/* RANDOMIZED CARDS */}

            <div className="routine-options">

                {shuffledSteps.map((step) => {

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
                            className={`
                                routine-option
                                ${alreadySelected
                                    ? "already-selected"
                                    : ""
                                }
                                ${feedback ===
                                    "try-again"
                                    ? "option-shake"
                                    : ""
                                }
                            `}
                            onClick={() =>
                                handleStepClick(step)
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


            {/* CORRECT FEEDBACK */}

            {feedback === "correct" && (

                <div className="routine-feedback feedback-correct">

                    ✓{" "}

                    {t(
                        "games.thatsRight",
                        "That's right!"
                    )}

                </div>

            )}


            {/* WRONG FEEDBACK */}

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