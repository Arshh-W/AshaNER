import { useEffect, useRef, useState } from "react";
import {
    analyzeVideoFrame,
    sendGameAudioSnippet
} from "../services/engineApi";

const FRAME_INTERVAL_MS = 1500;
const AUDIO_INTERVAL_MS = 10000;
const AUDIO_DURATION_MS = 3000;

export default function useInGameAAMonitor(
    isActive,
    onBiomarkerUpdate
) {
    /*
     * Camera and microphone intentionally have separate streams.
     *
     * This is important because disconnecting the camera must NOT
     * make the microphone appear disconnected.
     */
    const cameraStreamRef = useRef(null);
    const microphoneStreamRef = useRef(null);

    const videoRef = useRef(null);
    const recorderRef = useRef(null);

    const timersRef = useRef([]);
    const callbackRef = useRef(onBiomarkerUpdate);
    const deviceCleanupRef = useRef(null);

    const [isMonitoring, setIsMonitoring] = useState(false);

    /*
     * Individual device status.
     *
     * checking
     * connected
     * disconnected
     * permission-denied
     * unavailable
     */
    const [cameraStatus, setCameraStatus] =
        useState("checking");

    const [micStatus, setMicStatus] =
        useState("checking");

    /*
     * Keep the latest biomarker callback without
     * restarting the media monitor.
     */
    useEffect(() => {
        callbackRef.current =
            onBiomarkerUpdate;
    }, [onBiomarkerUpdate]);

    useEffect(() => {
        let cancelled = false;

        /*
         * --------------------------------------------------------
         * TIMER CLEANUP
         * --------------------------------------------------------
         */

        const clearTimers = () => {
            timersRef.current.forEach(
                (timer) => {
                    clearInterval(timer);
                    clearTimeout(timer);
                }
            );

            timersRef.current = [];
        };

        /*
         * --------------------------------------------------------
         * COMPLETE CLEANUP
         * --------------------------------------------------------
         */

        const cleanup = () => {
            clearTimers();

            /*
             * Remove devicechange listener.
             */
            if (deviceCleanupRef.current) {
                deviceCleanupRef.current();
                deviceCleanupRef.current = null;
            }

            /*
             * Stop current audio recording.
             *
             * This preserves the existing behavior where a
             * currently-recording snippet is allowed to finish.
             */
            if (
                recorderRef.current?.state ===
                "recording"
            ) {
                try {
                    recorderRef.current.stop();
                } catch (error) {
                    console.warn(
                        "Unable to stop audio recorder:",
                        error
                    );
                }
            }

            recorderRef.current = null;

            /*
             * Remove camera track event handlers.
             */
            cameraStreamRef.current
                ?.getTracks()
                .forEach((track) => {
                    track.onended = null;
                });

            /*
             * Remove microphone track event handlers.
             */
            microphoneStreamRef.current
                ?.getTracks()
                .forEach((track) => {
                    track.onended = null;
                });

            /*
             * Stop camera stream.
             */
            cameraStreamRef.current
                ?.getTracks()
                .forEach((track) => {
                    track.stop();
                });

            /*
             * Stop microphone stream.
             */
            microphoneStreamRef.current
                ?.getTracks()
                .forEach((track) => {
                    track.stop();
                });

            cameraStreamRef.current = null;
            microphoneStreamRef.current = null;

            /*
             * Detach hidden video element.
             */
            if (videoRef.current) {
                videoRef.current.srcObject =
                    null;

                videoRef.current = null;
            }

            setIsMonitoring(false);
        };

        /*
         * --------------------------------------------------------
         * MONITOR INACTIVE
         * --------------------------------------------------------
         */

        if (!isActive) {
            cleanup();

            setCameraStatus(
                "unavailable"
            );

            setMicStatus(
                "unavailable"
            );

            return cleanup;
        }

        /*
         * --------------------------------------------------------
         * MEDIA API UNAVAILABLE
         * --------------------------------------------------------
         */

        if (
            !navigator.mediaDevices?.getUserMedia
        ) {
            cleanup();

            setCameraStatus(
                "unavailable"
            );

            setMicStatus(
                "unavailable"
            );

            return cleanup;
        }

        /*
         * Start both checks independently.
         */
        setCameraStatus("checking");
        setMicStatus("checking");

        /*
         * --------------------------------------------------------
         * CAMERA STATUS
         * --------------------------------------------------------
         */

        const updateCameraStatus =
            (stream) => {
                const track =
                    stream?.getVideoTracks()[0];

                if (!track) {
                    setCameraStatus(
                        "unavailable"
                    );

                    return;
                }

                if (
                    track.readyState ===
                        "live" &&
                    track.enabled
                ) {
                    setCameraStatus(
                        "connected"
                    );
                } else {
                    setCameraStatus(
                        "disconnected"
                    );
                }
            };

        /*
         * --------------------------------------------------------
         * MICROPHONE STATUS
         * --------------------------------------------------------
         */

        const updateMicStatus =
            (stream) => {
                const track =
                    stream?.getAudioTracks()[0];

                if (!track) {
                    setMicStatus(
                        "unavailable"
                    );

                    return;
                }

                if (
                    track.readyState ===
                        "live" &&
                    track.enabled
                ) {
                    setMicStatus(
                        "connected"
                    );
                } else {
                    setMicStatus(
                        "disconnected"
                    );
                }
            };

        /*
         * --------------------------------------------------------
         * CAMERA INITIALIZATION
         * --------------------------------------------------------
         */

        const startCamera = async () => {
            try {
                const stream =
                    await navigator.mediaDevices.getUserMedia(
                        {
                            video: {
                                width: 320,
                                height: 240,
                                facingMode:
                                    "user"
                            }
                        }
                    );

                if (cancelled) {
                    stream
                        .getTracks()
                        .forEach((track) =>
                            track.stop()
                        );

                    return;
                }

                cameraStreamRef.current =
                    stream;

                const videoTrack =
                    stream.getVideoTracks()[0];

                updateCameraStatus(
                    stream
                );

                /*
                 * Camera physical disconnection.
                 */
                if (videoTrack) {
                    videoTrack.onended =
                        () => {
                            setCameraStatus(
                                "disconnected"
                            );
                        };
                }

                /*
                 * Hidden video element used by the
                 * existing frame-analysis pipeline.
                 */
                const video =
                    document.createElement(
                        "video"
                    );

                video.muted = true;
                video.playsInline = true;
                video.srcObject = stream;

                await video.play();

                if (cancelled) {
                    stream
                        .getTracks()
                        .forEach((track) =>
                            track.stop()
                        );

                    return;
                }

                videoRef.current =
                    video;

                /*
                 * Canvas used by the existing
                 * analyzeVideoFrame() pipeline.
                 */
                const canvas =
                    document.createElement(
                        "canvas"
                    );

                canvas.width = 224;
                canvas.height = 224;

                const context =
                    canvas.getContext(
                        "2d"
                    );

                if (!context) {
                    setCameraStatus(
                        "unavailable"
                    );

                    return;
                }

                /*
                 * ------------------------------------------------
                 * VIDEO MONITORING
                 * ------------------------------------------------
                 *
                 * Existing 1500ms interval preserved.
                 */

                const frameTimer =
                    setInterval(
                        async () => {
                            if (
                                cancelled
                            ) {
                                return;
                            }

                            const currentStream =
                                cameraStreamRef.current;

                            const currentTrack =
                                currentStream
                                    ?.getVideoTracks()[0];

                            /*
                             * Camera has been disconnected.
                             */
                            if (
                                !currentTrack ||
                                currentTrack.readyState !==
                                    "live"
                            ) {
                                setCameraStatus(
                                    "disconnected"
                                );

                                return;
                            }

                            /*
                             * Camera has been disabled.
                             */
                            if (
                                !currentTrack.enabled
                            ) {
                                setCameraStatus(
                                    "disconnected"
                                );

                                return;
                            }

                            setCameraStatus(
                                "connected"
                            );

                            /*
                             * Make sure video data is
                             * actually available.
                             */
                            if (
                                video.readyState <
                                HTMLMediaElement.HAVE_ENOUGH_DATA
                            ) {
                                return;
                            }

                            context.drawImage(
                                video,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );

                            try {
                                const result =
                                    await analyzeVideoFrame(
                                        canvas.toDataURL(
                                            "image/jpeg",
                                            0.6
                                        )
                                    );

                                callbackRef.current?.(
                                    {
                                        type: "affect",
                                        data: result
                                    }
                                );
                            } catch (error) {
                                /*
                                 * Biomarker analysis failure
                                 * must not stop the game.
                                 */
                                console.warn(
                                    "Video biomarker analysis failed:",
                                    error
                                );
                            }
                        },
                        FRAME_INTERVAL_MS
                    );

                timersRef.current.push(
                    frameTimer
                );
            } catch (error) {
                console.warn(
                    "Camera monitor unavailable:",
                    error
                );

                if (
                    error?.name ===
                        "NotAllowedError" ||
                    error?.name ===
                        "PermissionDeniedError"
                ) {
                    setCameraStatus(
                        "permission-denied"
                    );
                } else {
                    setCameraStatus(
                        "unavailable"
                    );
                }
            }
        };

        /*
         * --------------------------------------------------------
         * MICROPHONE INITIALIZATION
         * --------------------------------------------------------
         */

        const startMicrophone =
            async () => {
                try {
                    const stream =
                        await navigator.mediaDevices.getUserMedia(
                            {
                                audio: true
                            }
                        );

                    if (cancelled) {
                        stream
                            .getTracks()
                            .forEach((track) =>
                                track.stop()
                            );

                        return;
                    }

                    microphoneStreamRef.current =
                        stream;

                    const audioTrack =
                        stream.getAudioTracks()[0];

                    updateMicStatus(
                        stream
                    );

                    /*
                     * Microphone physical disconnection.
                     */
                    if (audioTrack) {
                        audioTrack.onended =
                            () => {
                                setMicStatus(
                                    "disconnected"
                                );
                            };
                    }

                    /*
                     * MediaRecorder is the existing
                     * audio-analysis mechanism.
                     */
                    if (
                        !audioTrack ||
                        typeof MediaRecorder ===
                            "undefined"
                    ) {
                        setMicStatus(
                            audioTrack
                                ? "connected"
                                : "unavailable"
                        );

                        return;
                    }

                    const recorder =
                        new MediaRecorder(
                            new MediaStream([
                                audioTrack
                            ])
                        );

                    recorderRef.current =
                        recorder;

                    /*
                     * Existing audio result handling.
                     */
                    recorder.ondataavailable =
                        async (
                            event
                        ) => {
                            if (
                                !event
                                    .data
                                    .size
                            ) {
                                return;
                            }

                            try {
                                const result =
                                    await sendGameAudioSnippet(
                                        event.data
                                    );

                                callbackRef.current?.(
                                    {
                                        type: "acoustic",
                                        data: result
                                    }
                                );
                            } catch (error) {
                                /*
                                 * Audio analysis failure
                                 * must not stop the game.
                                 */
                                console.warn(
                                    "Audio biomarker analysis failed:",
                                    error
                                );
                            }
                        };

                    /*
                     * Existing 10 second audio interval.
                     */
                    const audioTimer =
                        setInterval(
                            () => {
                                if (
                                    cancelled
                                ) {
                                    return;
                                }

                                const currentStream =
                                    microphoneStreamRef.current;

                                const currentTrack =
                                    currentStream
                                        ?.getAudioTracks()[0];

                                /*
                                 * Microphone disconnected.
                                 */
                                if (
                                    !currentTrack ||
                                    currentTrack.readyState !==
                                        "live"
                                ) {
                                    setMicStatus(
                                        "disconnected"
                                    );

                                    return;
                                }

                                /*
                                 * Microphone disabled.
                                 */
                                if (
                                    !currentTrack.enabled
                                ) {
                                    setMicStatus(
                                        "disconnected"
                                    );

                                    return;
                                }

                                setMicStatus(
                                    "connected"
                                );

                                /*
                                 * Don't overlap recordings.
                                 */
                                if (
                                    recorder.state !==
                                    "inactive"
                                ) {
                                    return;
                                }

                                try {
                                    recorder.start();

                                    const stopTimer =
                                        setTimeout(
                                            () => {
                                                if (
                                                    recorder.state ===
                                                    "recording"
                                                ) {
                                                    try {
                                                        recorder.stop();
                                                    } catch (
                                                        error
                                                    ) {
                                                        console.warn(
                                                            "Unable to stop audio recording:",
                                                            error
                                                        );
                                                    }
                                                }
                                            },
                                            AUDIO_DURATION_MS
                                        );

                                    timersRef.current.push(
                                        stopTimer
                                    );
                                } catch (
                                    error
                                ) {
                                    console.warn(
                                        "Unable to start audio recording:",
                                        error
                                    );
                                }
                            },
                            AUDIO_INTERVAL_MS
                        );

                    timersRef.current.push(
                        audioTimer
                    );
                } catch (error) {
                    console.warn(
                        "Microphone monitor unavailable:",
                        error
                    );

                    if (
                        error?.name ===
                            "NotAllowedError" ||
                        error?.name ===
                            "PermissionDeniedError"
                    ) {
                        setMicStatus(
                            "permission-denied"
                        );
                    } else {
                        setMicStatus(
                            "unavailable"
                        );
                    }
                }
            };

        /*
         * --------------------------------------------------------
         * DEVICE CHANGE
         * --------------------------------------------------------
         *
         * Camera and microphone are checked independently.
         *
         * IMPORTANT:
         * We never use the camera stream to determine microphone
         * status, and never use the microphone stream to determine
         * camera status.
         */

        const handleDeviceChange =
            () => {
                if (cancelled) {
                    return;
                }

                if (
                    cameraStreamRef.current
                ) {
                    updateCameraStatus(
                        cameraStreamRef.current
                    );
                }

                if (
                    microphoneStreamRef.current
                ) {
                    updateMicStatus(
                        microphoneStreamRef.current
                    );
                }
            };

        navigator.mediaDevices.addEventListener?.(
            "devicechange",
            handleDeviceChange
        );

        deviceCleanupRef.current =
            () => {
                navigator.mediaDevices.removeEventListener?.(
                    "devicechange",
                    handleDeviceChange
                );
            };

        /*
         * --------------------------------------------------------
         * START BOTH INDEPENDENT MONITORS
         * --------------------------------------------------------
         *
         * Promise.allSettled ensures that failure of one device
         * does not stop the other device.
         */

        Promise.allSettled([
            startCamera(),
            startMicrophone()
        ]).finally(() => {
            if (cancelled) {
                return;
            }

            /*
             * At least one A/V monitor can be active.
             *
             * The game continues using touch telemetry regardless.
             */
            setIsMonitoring(true);
        });

        /*
         * --------------------------------------------------------
         * PERIODIC DEVICE HEALTH CHECK
         * --------------------------------------------------------
         *
         * This catches disabled/ended tracks even on browsers
         * that don't immediately fire devicechange.
         */

        const healthTimer =
            setInterval(() => {
                if (cancelled) {
                    return;
                }

                if (
                    cameraStreamRef.current
                ) {
                    updateCameraStatus(
                        cameraStreamRef.current
                    );
                }

                if (
                    microphoneStreamRef.current
                ) {
                    updateMicStatus(
                        microphoneStreamRef.current
                    );
                }
            }, 1000);

        timersRef.current.push(
            healthTimer
        );

        /*
         * --------------------------------------------------------
         * EFFECT CLEANUP
         * --------------------------------------------------------
         */

        return () => {
            cancelled = true;
            cleanup();
        };
    }, [isActive]);

    return {
        isMonitoring,

        /*
         * Independent status values.
         */
        cameraStatus,
        micStatus
    };
}