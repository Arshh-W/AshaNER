export const useAudio=()=>({play:()=>{},stop:()=>{}});
import { useCallback, useRef, useState } from "react";

const useAudio = () => {
    const audioCache = useRef(new Map());

    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const getAudio = useCallback((src) => {
        if (!src) {
            return null;
        }

        if (!audioCache.current.has(src)) {
            const audio = new Audio(src);

            audio.preload = "auto";

            audioCache.current.set(
                src,
                audio
            );
        }

        return audioCache.current.get(src);
    }, []);

    const play = useCallback(
        async (src) => {
            const audio = getAudio(src);

            if (!audio || isMuted) {
                return;
            }

            try {
                audio.volume = volume;
                audio.currentTime = 0;

                await audio.play();
            } catch (error) {
                console.warn(
                    "Audio playback failed:",
                    error
                );
            }
        },
        [getAudio, isMuted, volume]
    );

    const pause = useCallback((src) => {
        const audio =
            audioCache.current.get(src);

        if (audio) {
            audio.pause();
        }
    }, []);

    const stop = useCallback((src) => {
        const audio =
            audioCache.current.get(src);

        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }, []);

    const stopAll = useCallback(() => {
        audioCache.current.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
    }, []);

    const changeVolume = useCallback((value) => {
        const nextVolume = Math.min(
            Math.max(Number(value) || 0, 0),
            1
        );

        setVolume(nextVolume);

        audioCache.current.forEach((audio) => {
            audio.volume = nextVolume;
        });
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted((previous) => !previous);
    }, []);

    return {
        play,
        pause,
        stop,
        stopAll,
        volume,
        setVolume: changeVolume,
        isMuted,
        toggleMute
    };
};

export default useAudio;