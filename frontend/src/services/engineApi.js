import api from "./api";

export const adaptGameDifficulty = (data) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    return api.post("/ml/adapt", data, { signal: controller.signal })
        .finally(() => window.clearTimeout(timeout));
};

export const analyzeSpeech = (audioBlob) => {
    const formData = new FormData();
    formData.append("audio_file", audioBlob, audioBlob.name || "speech.webm");
    return api.post("/ml/analyze-speech", formData);
};

export default { adaptGameDifficulty, analyzeSpeech };