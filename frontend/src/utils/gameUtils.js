export const calculateAccuracy = (
    correct,
    total
) => {
    if (!total || total <= 0) {
        return 0;
    }

    return Math.round(
        (correct / total) * 100
    );
};

export const calculateScore = ({
    correct = 0,
    incorrect = 0,
    bonus = 0
} = {}) => {
    const baseScore =
        correct * 10;

    const penalty =
        incorrect * 2;

    return Math.max(
        0,
        baseScore - penalty + bonus
    );
};

export const formatDuration = (
    seconds
) => {
    const totalSeconds =
        Math.max(
            0,
            Number(seconds) || 0
        );

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const remainingSeconds =
        totalSeconds % 60;

    return `${String(minutes).padStart(
        2,
        "0"
    )}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
};

export const shuffleArray = (
    array = []
) => {
    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i -= 1
    ) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
};

export const getGameResult = ({
    gameId,
    sessionId,
    score = 0,
    correct = 0,
    incorrect = 0,
    elapsedTime = 0
} = {}) => {
    const total =
        correct + incorrect;

    return {
        gameId,
        sessionId,
        score,
        correct,
        incorrect,
        total,
        accuracy:
            calculateAccuracy(
                correct,
                total
            ),
        elapsedTime,
        completedAt:
            new Date().toISOString()
    };
};

export const isGameCompleted = (
    currentRound,
    totalRounds
) => {
    return (
        Number(totalRounds) > 0 &&
        Number(currentRound) >=
            Number(totalRounds)
    );
};

export default {
    calculateAccuracy,
    calculateScore,
    formatDuration,
    shuffleArray,
    getGameResult,
    isGameCompleted
};