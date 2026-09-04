export const DDA_CONFIG = {
    MIN_DIFFICULTY: 0,
    MAX_DIFFICULTY: 1,

    CORRECT_ADJUSTMENT: 0.05,
    INCORRECT_ADJUSTMENT: 0.08,

    TARGET_PERFORMANCE: 0.7
};

export const clampDifficulty = (
    difficulty
) => {
    return Math.min(
        Math.max(
            difficulty,
            DDA_CONFIG.MIN_DIFFICULTY
        ),
        DDA_CONFIG.MAX_DIFFICULTY
    );
};

export const adjustDifficulty = (
    difficulty,
    correct
) => {
    const change = correct
        ? DDA_CONFIG.CORRECT_ADJUSTMENT
        : -DDA_CONFIG.INCORRECT_ADJUSTMENT;

    return clampDifficulty(
        difficulty + change
    );
};

export const getDifficultyLabel = (
    difficulty
) => {
    if (difficulty < 0.34) {
        return "easy";
    }

    if (difficulty < 0.67) {
        return "medium";
    }

    return "hard";
};

export const shouldReduceDifficulty = (
    recentResults = []
) => {
    if (
        recentResults.length < 3
    ) {
        return false;
    }

    const recent =
        recentResults.slice(-3);

    const correct =
        recent.filter(Boolean).length;

    return correct <= 1;
};

export const shouldIncreaseDifficulty = (
    recentResults = []
) => {
    if (
        recentResults.length < 3
    ) {
        return false;
    }

    const recent =
        recentResults.slice(-3);

    const correct =
        recent.filter(Boolean).length;

    return correct === 3;
};

export default {
    DDA_CONFIG,
    clampDifficulty,
    adjustDifficulty,
    getDifficultyLabel,
    shouldReduceDifficulty,
    shouldIncreaseDifficulty
};