import { useEffect, useRef, useState } from "react";
import {
    analyzeVideoFrame,
    sendGameAudioSnippet
} from "../services/engineApi";

const FRAME_INTERVAL_MS = 1500;
const AUDIO_INTERVAL_MS = 10000;
const AUDIO_DURATION_MS = 3000;

export default function useInGameAAMonitor(isActive, onBiomarkerUpdate) {
    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const recorderRef = useRef(null);
    const timersRef = useRef([]);
    const callbackRef = useRef(onBiomarkerUpdate);
    const [isMonitoring, setIsMonitoring] = useState(false);

    useEffect(() => {
        callbackRef.current = onBiomarkerUpdate;
    }, [onBiomarkerUpdate]);

    useEffect(() => {
        let cancelled = false;

        const cleanup = () => {
            timersRef.current.forEach((timer) => {
                clearInterval(timer);
                clearTimeout(timer);
            });
            timersRef.current = [];
            if (recorderRef.current?.state === "recording") {
                recorderRef.current.stop();
            }
            recorderRef.current = null;
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current = null;
            }
            setIsMonitoring(false);
        };

        if (!isActive || !navigator.mediaDevices?.getUserMedia) {
            cleanup();
            return cleanup;
        }

        const start = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 320, height: 240, facingMode: "user" },
                    audio: true
                });
                if (cancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;
                const video = document.createElement("video");
                video.muted = true;
                video.playsInline = true;
                video.srcObject = stream;
                await video.play();
                videoRef.current = video;

                const canvas = document.createElement("canvas");
                canvas.width = 224;
                canvas.height = 224;
                const context = canvas.getContext("2d");
                if (!context) return;

                const frameTimer = setInterval(async () => {
                    if (video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) return;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const result = await analyzeVideoFrame(canvas.toDataURL("image/jpeg", 0.6));
                    callbackRef.current?.({ type: "affect", data: result });
                }, FRAME_INTERVAL_MS);
                timersRef.current.push(frameTimer);

                const audioTrack = stream.getAudioTracks()[0];
                if (audioTrack && typeof MediaRecorder !== "undefined") {
                    const recorder = new MediaRecorder(new MediaStream([audioTrack]));
                    recorderRef.current = recorder;
                    recorder.ondataavailable = async (event) => {
                        if (!event.data.size) return;
                        const result = await sendGameAudioSnippet(event.data);
                        callbackRef.current?.({ type: "acoustic", data: result });
                    };

                    const audioTimer = setInterval(() => {
                        if (recorder.state !== "inactive") return;
                        recorder.start();
                        const stopTimer = setTimeout(() => {
                            if (recorder.state === "recording") recorder.stop();
                        }, AUDIO_DURATION_MS);
                        timersRef.current.push(stopTimer);
                    }, AUDIO_INTERVAL_MS);
                    timersRef.current.push(audioTimer);
                }

                setIsMonitoring(true);
            } catch (error) {
                console.warn("Live A/V monitor unavailable; using touch telemetry", error);
                cleanup();
            }
        };

        start();
        return () => {
            cancelled = true;
            cleanup();
        };
    }, [isActive]);

    return { isMonitoring };
}