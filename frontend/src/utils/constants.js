export const APP_NAME = "AshaNER";

export const ROLES = {
    PATIENT: "patient",
    CAREGIVER: "caregiver"
};

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    PATIENT: "/patient",
    CAREGIVER: "/caregiver",
    GAMES: "/patient/games",
    PROFILE: "/profile",
    SETTINGS: "/settings",
    OFFLINE: "/offline"
};

export const LANGUAGES = {
    ENGLISH: "en",
    HINDI: "hi",
    ASSAMESE: "as",
    BENGALI: "bn",
    MEITEI: "mn"
};

export const GAME_CATEGORIES = {
    MEMORY: "memory",
    VISUAL_MEMORY: "visual-memory",
    SEQUENCE: "sequence",
    ATTENTION: "attention"
};

export const DIFFICULTY_LEVELS = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard"
};

export const DEFAULT_GAME_DURATION = 5;

export const STORAGE_KEYS = {
    TOKEN: "token",
    USER: "user",
    LANGUAGE: "language",
    SETTINGS: "settings"
};

export default {
    APP_NAME,
    ROLES,
    ROUTES,
    LANGUAGES,
    GAME_CATEGORIES,
    DIFFICULTY_LEVELS,
    DEFAULT_GAME_DURATION,
    STORAGE_KEYS
};