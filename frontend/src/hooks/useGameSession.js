import {useGameSession} from "../context/GameSessionContext"; export {useGameSession};
import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

const useGameSession = (gameId = null) => {
    const [sessionId, setSessionId] =
        useState(null);

    const [score, setScore] =
        useState(0);

    const [correct, setCorrect] =
        useState(0);

    const [incorrect, setIncorrect] =
        useState(0);

    const [round, setRound] =
        useState(0);

    const [elapsedTime, setElapsedTime] =
        useState(0);

    const [isActive, setIsActive] =
        useState(false);

    const [isPaused, setIsPaused] =
        useState(false);

    const startedAt = useRef(null);

    useEffect(() => {
        if (!isActive || isPaused) {
            return;
        }

        const timer = setInterval(() => {
            if (startedAt.current) {
                const elapsed =
                    Date.now() -
                    startedAt.current;

                setElapsedTime(
                    Math.floor(elapsed / 1000)
                );
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, isPaused]);

    const start = useCallback(() => {
        const id =
            `${gameId || "game"}-${Date.now()}`;

        setSessionId(id);
        setScore(0);
        setCorrect(0);
        setIncorrect(0);
        setRound(0);
        setElapsedTime(0);

        startedAt.current = Date.now();

        setIsActive(true);
        setIsPaused(false);

        return id;
    }, [gameId]);

    const pause = useCallback(() => {
        setIsPaused(true);
    }, []);

    const resume = useCallback(() => {
        setIsPaused(false);
    }, []);

    const addScore = useCallback((points) => {
        setScore((previous) =>
            previous + Number(points || 0)
        );
    }, []);

    const recordCorrect = useCallback(
        (points = 0) => {
            setCorrect((previous) =>
                previous + 1
            );

            setRound((previous) =>
                previous + 1
            );

            if (points) {
                addScore(points);
            }
        },
        [addScore]
    );

    const recordIncorrect = useCallback(() => {
        setIncorrect((previous) =>
            previous + 1
        );

        setRound((previous) =>
            previous + 1
        );
    }, []);

    const complete = useCallback(() => {
        setIsActive(false);
        setIsPaused(false);

        return {
            sessionId,
            gameId,
            score,
            correct,
            incorrect,
            round,
            elapsedTime,
            completedAt: new Date().toISOString()
        };
    }, [
        sessionId,
        gameId,
        score,
        correct,
        incorrect,
        round,
        elapsedTime
    ]);

    const reset = useCallback(() => {
        setSessionId(null);
        setScore(0);
        setCorrect(0);
        setIncorrect(0);
        setRound(0);
        setElapsedTime(0);

        setIsActive(false);
        setIsPaused(false);

        startedAt.current = null;
    }, []);

    return {
        sessionId,
        gameId,
        score,
        correct,
        incorrect,
        round,
        elapsedTime,
        isActive,
        isPaused,
        start,
        pause,
        resume,
        addScore,
        recordCorrect,
        recordIncorrect,
        complete,
        reset
    };
};

export default useGameSession;