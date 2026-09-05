import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState
} from "react";

import { queueOperation } from "../services/syncService";
import { adaptGameDifficulty } from "../services/engineApi";
import { useAuth } from "./AuthContext";

const Ctx = createContext(null);

/*
 * Converts the frontend game ID into the exact enum values
 * expected by the existing backend.
 *
 * Frontend:
 *   memory-detective
 *   memory-mosaic
 *   memory-village
 *   routine-rescue
 *   sound-object-match
 *
 * Backend:
 *   memory_detective
 *   memory_mosaic
 *   memory_village
 *   routine_rescue
 *   sound_object
 */
const gameTypeForApi = (gameId) => {
    if (gameId === "sound-object-match") {
        return "sound_object";
    }

    return gameId.replaceAll("-", "_");
};

export function GameSessionProvider({ children }) {
    const [session, setSession] = useState(null);
    const [engineError, setEngineError] = useState(null);
    const [isAdapting, setIsAdapting] = useState(false);

    /*
     * Ref is used because game interactions can happen rapidly.
     * It always contains the latest session without waiting for
     * React state updates.
     */
    const sessionRef = useRef(null);

    /*
     * Prevents the same session from being completed more than once.
     */
    const completingSessionRef = useRef(null);

    const { user } = useAuth();

    /*
     * ------------------------------------------------------------
     * START SESSION
     * ------------------------------------------------------------
     */
    const start = useCallback((gameId) => {
        if (!gameId) {
            return null;
        }

        const nextSession = {
            local_session_id: `${gameId}-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

            gameId,

            /*
             * Core performance metrics
             */
            score: 0,
            correct: 0,
            errors: 0,

            /*
             * Number of consecutive incorrect attempts.
             * Used by the adaptive difficulty engine.
             */
            consecutiveErrors: 0,

            /*
             * Every attempt's reaction time.
             *
             * Example:
             * [1200, 950, 2100, 3400]
             */
            reactionTimes: [],

            /*
             * Additional frontend-only tracking.
             *
             * This allows us to know how many total attempts
             * happened without changing the backend payload.
             */
            totalAttempts: 0,

            /*
             * Session timing
             */
            startedAt: Date.now(),

            /*
             * Adaptive difficulty level
             */
            level: 1,

            /*
             * Completion state
             */
            completed: false
        };

        sessionRef.current = nextSession;
        completingSessionRef.current = null;

        setSession(nextSession);
        setEngineError(null);
        setIsAdapting(false);

        return nextSession.local_session_id;
    }, []);

    /*
     * ------------------------------------------------------------
     * RECORD GAME ATTEMPT
     * ------------------------------------------------------------
     *
     * Every individual game interaction should call:
     *
     * record({
     *     correct: true,
     *     latencyMs: 1250
     * });
     *
     * or:
     *
     * record({
     *     correct: false,
     *     latencyMs: 3200
     * });
     *
     * The games do NOT need to calculate:
     * - score
     * - errors
     * - consecutive errors
     *
     * This context handles all of that.
     */
    const record = useCallback(
        ({ correct, latencyMs = 0 } = {}) => {
            const current = sessionRef.current;

            /*
             * Ignore events when there is no active game.
             */
            if (!current || current.completed) {
                return;
            }

            const safeLatency = Number.isFinite(Number(latencyMs))
                ? Math.max(0, Number(latencyMs))
                : 0;

            const isCorrect = Boolean(correct);

            const nextConsecutiveErrors = isCorrect
                ? 0
                : current.consecutiveErrors + 1;

            const next = {
                ...current,

                /*
                 * One point per correct response.
                 */
                score:
                    current.score +
                    (isCorrect ? 1 : 0),

                /*
                 * Total correct attempts.
                 */
                correct:
                    current.correct +
                    (isCorrect ? 1 : 0),

                /*
                 * Total incorrect attempts.
                 */
                errors:
                    current.errors +
                    (isCorrect ? 0 : 1),

                /*
                 * Used by adaptive difficulty.
                 */
                consecutiveErrors:
                    nextConsecutiveErrors,

                /*
                 * Store reaction time for every attempt.
                 */
                reactionTimes: [
                    ...current.reactionTimes,
                    safeLatency
                ],

                /*
                 * Total number of attempts.
                 */
                totalAttempts:
                    current.totalAttempts + 1
            };

            sessionRef.current = next;
            setSession(next);

            /*
             * ----------------------------------------------------
             * ADAPTIVE DIFFICULTY
             * ----------------------------------------------------
             *
             * Only incorrect attempts trigger the existing
             * adaptation engine.
             */
            if (!isCorrect) {
                setIsAdapting(true);
                setEngineError(null);

                adaptGameDifficulty({
                    game_type: gameTypeForApi(
                        current.gameId
                    ),

                    current_level:
                        current.level,

                    consecutive_errors:
                        nextConsecutiveErrors,

                    last_action_latency_ms:
                        safeLatency,

                    is_stalled:
                        safeLatency > 4500
                })
                    .then((response) => {
                        /*
                         * The session may have ended while the
                         * adaptation request was running.
                         */
                        if (
                            !response?.next_level ||
                            !sessionRef.current ||
                            sessionRef.current.completed
                        ) {
                            return;
                        }

                        const updated = {
                            ...sessionRef.current,
                            level: response.next_level
                        };

                        sessionRef.current = updated;
                        setSession(updated);
                    })
                    .catch(() => {
                        /*
                         * Game continues normally even when the
                         * adaptive engine isn't available.
                         */
                        setEngineError(
                            "Difficulty adaptation is unavailable. Continuing with touch-based play."
                        );
                    })
                    .finally(() => {
                        setIsAdapting(false);
                    });
            }
        },
        []
    );

    /*
     * ------------------------------------------------------------
     * COMPLETE SESSION
     * ------------------------------------------------------------
     *
     * Called when the user leaves a game.
     *
     * This sends the accumulated game data to the EXISTING
     * backend /sync endpoint.
     */
    const complete = useCallback(async () => {
        const current = sessionRef.current;

        /*
         * AuthContext currently exposes patientId/id.
         */
        const patientId =
            user?.patientId ?? user?.id;

        /*
         * Nothing to send.
         */
        if (!current) {
            return;
        }

        /*
         * Already completed.
         */
        if (current.completed) {
            return;
        }

        /*
         * Prevent duplicate completion requests while
         * the first request is still being processed.
         */
        if (
            completingSessionRef.current ===
            current.local_session_id
        ) {
            return;
        }

        /*
         * We cannot send a session without a patient ID.
         */
        if (patientId == null) {
            console.warn(
                "Game session was not synced because no patient ID was available."
            );

            return;
        }

        completingSessionRef.current =
            current.local_session_id;

        /*
         * Freeze the session before sending it.
         */
        const completed = {
            ...current,
            completed: true
        };

        sessionRef.current = completed;
        setSession(completed);

        /*
         * Calculate final duration once.
         */
        const durationSeconds =
            Math.max(
                0,
                (Date.now() - current.startedAt) /
                    1000
            );

        /*
         * Existing backend payload.
         *
         * IMPORTANT:
         * We are NOT changing the backend.
         * These fields already match the existing
         * GameSessionSyncPayload.
         */
        const sessionPayload = {
            local_session_id:
                current.local_session_id,

            patient_id:
                Number(patientId),

            game_type:
                gameTypeForApi(
                    current.gameId
                ),

            score:
                current.score,

            duration_seconds:
                durationSeconds,

            total_errors:
                current.errors,

            level_achieved:
                current.level,

            reaction_times_ms:
                current.reactionTimes,

            created_at_offline:
                new Date().toISOString()
        };

        try {
            await queueOperation({
                endpoint: "/sync",
                method: "POST",

                data: {
                    sessions: [
                        sessionPayload
                    ]
                }
            });
        } catch (error) {
            /*
             * queueOperation is responsible for the offline
             * synchronization flow.
             *
             * We don't throw here because the game itself
             * should already be considered completed.
             */
            console.warn(
                "Game session queued for synchronization:",
                error
            );
        }
    }, [user?.patientId, user?.id]);

    /*
     * ------------------------------------------------------------
     * RESET SESSION
     * ------------------------------------------------------------
     */
    const reset = useCallback(() => {
        sessionRef.current = null;
        completingSessionRef.current = null;

        setSession(null);
        setEngineError(null);
        setIsAdapting(false);
    }, []);

    /*
     * ------------------------------------------------------------
     * CONTEXT VALUE
     * ------------------------------------------------------------
     *
     * Existing game components can continue using:
     *
     * const {
     *     start,
     *     record,
     *     complete
     * } = useGameSession();
     *
     * Nothing needs to change for the basic API.
     */
    const value = {
        session,

        /*
         * Current score.
         */
        score:
            session?.score ?? 0,

        /*
         * Existing property used by the game UI.
         */
        completed:
            session?.correct ?? 0,

        /*
         * Useful additional metrics for future UI.
         */
        correct:
            session?.correct ?? 0,

        errors:
            session?.errors ?? 0,

        totalAttempts:
            session?.totalAttempts ?? 0,

        level:
            session?.level ?? 1,

        reactionTimes:
            session?.reactionTimes ?? [],

        start,
        record,
        complete,
        reset,

        engineError,
        isAdapting
    };

    return (
        <Ctx.Provider value={value}>
            {children}
        </Ctx.Provider>
    );
}

export const useGameSession = () => {
    const context = useContext(Ctx);

    if (!context) {
        throw new Error(
            "useGameSession must be used inside GameSessionProvider"
        );
    }

    return context;
};