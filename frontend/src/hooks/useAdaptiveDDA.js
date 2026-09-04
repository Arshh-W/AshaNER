export const useAdaptiveDDA=()=>({difficulty:"Gentle",adjust:()=>{}});
import { useCallback, useMemo, useState } from "react";

const DEFAULT_DIFFICULTY = 0.5;

const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

const useAdaptiveDDA = (initialDifficulty = DEFAULT_DIFFICULTY) => {
    const [difficulty, setDifficulty] = useState(
        clamp(initialDifficulty, 0, 1)
    );

    const [history, setHistory] = useState([]);

    const recordResult = useCallback((result) => {
        const correct = Boolean(result?.correct);

        setHistory((previous) => [
            ...previous.slice(-9),
            correct
        ]);

        setDifficulty((previous) => {
            if (correct) {
                return clamp(
                    previous + 0.05,
                    0,
                    1
                );
            }

            return clamp(
                previous - 0.08,
                0,
                1
            );
        });
    }, []);

    const increaseDifficulty = useCallback(() => {
        setDifficulty((previous) =>
            clamp(previous + 0.05, 0, 1)
        );
    }, []);

    const decreaseDifficulty = useCallback(() => {
        setDifficulty((previous) =>
            clamp(previous - 0.05, 0, 1)
        );
    }, []);

    const resetDifficulty = useCallback(() => {
        setDifficulty(
            clamp(initialDifficulty, 0, 1)
        );

        setHistory([]);
    }, [initialDifficulty]);

    const performance = useMemo(() => {
        if (history.length === 0) {
            return 0;
        }

        const correctAnswers = history.filter(
            Boolean
        ).length;

        return correctAnswers / history.length;
    }, [history]);

    return {
        difficulty,
        performance,
        history,
        recordResult,
        increaseDifficulty,
        decreaseDifficulty,
        resetDifficulty
    };
};

export default useAdaptiveDDA;