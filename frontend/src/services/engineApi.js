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

export const analyzeVideoFrame = async (imageBase64) => {
    try {
        return await api.post("/ml/analyze-frame", {
            image_base64: imageBase64
        });
    } catch (error) {
        console.warn("Frame analysis failed, using telemetry fallback", error);
        return {
            valence: 0,
            arousal: 0,
            distress_detected: false
        };
    }
};

export const sendGameAudioSnippet = async (audioBlob) => {
    try {
        const formData = new FormData();
        formData.append("audio_file", audioBlob, "game-snippet.webm");
        return await api.post("/ml/analyze-speech", formData);
    } catch (error) {
        console.warn("Audio snippet analysis failed", error);
        return {
            cognitive_drift_index: 0,
            hesitation_detected: false
        };
    }
};

export default {
    adaptGameDifficulty,
    analyzeSpeech,
    analyzeVideoFrame,
    sendGameAudioSnippet
};