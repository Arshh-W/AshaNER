import api from "./api";

export const adaptGameDifficulty = (data) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    return api
        .post("/ml/adapt", data, {
            signal: controller.signal
        })
        .finally(() => window.clearTimeout(timeout));
};

export const analyzeSpeech = (audioBlob) => {
    const formData = new FormData();

    formData.append(
        "audio_file",
        audioBlob,
        audioBlob.name || "speech.webm"
    );

    return api.post("/ml/analyze-speech", formData);
};

export const analyzeVideoFrame = async (imageBase64) => {
    try {
        const result = await api.post("/ml/analyze-frame", {
            image_base64: imageBase64
        });

        /*
         * The backend may return HTTP 200 even when
         * frame decoding or model inference fails.
         *
         * In that case, do NOT treat the response as
         * a real affect observation.
         */
        if (result?.error) {
            console.warn(
                "Frame analysis returned an ML error:",
                result.error
            );

            return {
                valence: 0,
                arousal: 0,
                distress_detected: false,
                analysis_ok: false,
                error: result.error
            };
        }

        /*
         * Valid ML observation.
         */
        return {
            ...result,
            analysis_ok: true
        };
    } catch (error) {
        console.warn(
            "Frame analysis failed; no affect sample stored",
            error
        );

        /*
         * Keep the existing API shape so callers do not break,
         * but explicitly mark this sample as invalid.
         */
        return {
            valence: 0,
            arousal: 0,
            distress_detected: false,
            analysis_ok: false,
            error: error?.message || "Frame analysis failed"
        };
    }
};

export const sendGameAudioSnippet = async (audioBlob) => {
    try {
        const formData = new FormData();

        formData.append(
            "audio_file",
            audioBlob,
            "game-snippet.webm"
        );

        return await api.post(
            "/ml/analyze-speech",
            formData
        );
    } catch (error) {
        console.warn(
            "Audio snippet analysis failed",
            error
        );

        /*
         * Preserve the existing response shape.
         */
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