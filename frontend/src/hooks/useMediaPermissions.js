import { useCallback, useState } from "react";

export default function useMediaPermissions() {
    const [mediaError, setMediaError] = useState(null);
    const [stream, setStream] = useState(null);

    const requestMedia = useCallback(async (constraints = { audio: true, video: true }) => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setMediaError("Audio and camera access are unavailable. Touch controls remain available.");
            return null;
        }

        try {
            const nextStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(nextStream);
            setMediaError(null);
            return nextStream;
        } catch {
            setMediaError("Media access was denied. Continuing with touch telemetry.");
            return null;
        }
    }, []);

    const releaseMedia = useCallback(() => {
        stream?.getTracks().forEach((track) => track.stop());
        setStream(null);
    }, [stream]);

    return { requestMedia, releaseMedia, mediaError, hasMedia: Boolean(stream) };
}