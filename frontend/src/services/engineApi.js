import api from "./api";

export const adaptGameDifficulty = (data) =>
    api.post("/ml/adapt", data);

export const analyzeSpeech = (audioBlob) => {
    const formData = new FormData();
    formData.append("audio_file", audioBlob, audioBlob.name || "speech.webm");
    return api.post("/ml/analyze-speech", formData);
};

export default { adaptGameDifficulty, analyzeSpeech };