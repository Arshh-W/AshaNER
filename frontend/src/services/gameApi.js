import api from "./api";

export const getGames = async () => {
    return api.get("/games");
};

export const getGame = async (
    gameId
) => {
    return api.get(
        `/games/${gameId}`
    );
};

export const startGame = async (
    gameId,
    data = {}
) => {
    return api.post(
        `/games/${gameId}/start`,
        data
    );
};

export const submitGameResult = async (
    gameId,
    result
) => {
    return api.post(
        `/games/${gameId}/results`,
        result
    );
};

export const getGameProgress = async (
    gameId
) => {
    return api.get(
        `/games/${gameId}/progress`
    );
};

export const getGameHistory = async (
    gameId
) => {
    return api.get(
        `/games/${gameId}/history`
    );
};

export default {
    getGames,
    getGame,
    startGame,
    submitGameResult,
    getGameProgress,
    getGameHistory
};