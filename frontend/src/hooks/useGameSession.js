export const useGameSession = () => {
    // TODO: Implement game session hook
    return {
        currentGame: null,
        sessionId: null,
        startSession: () => {},
        endSession: () => {},
        recordTap: () => {},
        recordError: () => {},
        recordReactionTime: () => {},
        recordEvent: () => {},
        getSessionSummary: () => ({})
    };
};