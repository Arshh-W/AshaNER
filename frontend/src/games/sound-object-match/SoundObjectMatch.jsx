import React, { useEffect, useRef, useState } from "react";
import { useGameSession } from "../../context/GameSessionContext";
import { useLanguage } from "../../context/LanguageContext";
import { soundMatches } from "./soundObjectMatchData";
import "./soundObjectMatch.css";

const SOUND_URLS = {
    rain: "https://moodly.site/sounds/rain.mp3",
    bird: "https://moodly.site/sounds/birds.mp3",
    cooking: "https://moodly.site/sounds/cafe.mp3",
    market:
        "https://raw.githubusercontent.com/SillyTavern/SillyTavern-Content/main/assets/ambient/cityscape-medieval-market.mp3",
};

const SoundObjectMatch = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState("");

    const { record, complete } = useGameSession();
    const { t } = useLanguage();

    const questionStartedAtRef = useRef(performance.now());
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const fallbackNodesRef = useRef([]);

    const question = soundMatches[questionIndex];

    const stopFallbackSound = () => {
        fallbackNodesRef.current.forEach((node) => {
            try {
                node.stop?.();
                node.disconnect?.();
            } catch {
                // Ignore already stopped nodes.
            }
        });

        fallbackNodesRef.current = [];
    };

    const stopSound = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        stopFallbackSound();
    };

    const getAudioContext = () => {
        if (!audioContextRef.current) {
            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContext) {
                return null;
            }

            audioContextRef.current =
                new AudioContext();
        }

        return audioContextRef.current;
    };

    const playFallbackSound = (type) => {
        const context = getAudioContext();

        if (!context) return;

        stopFallbackSound();

        if (context.state === "suspended") {
            context.resume();
        }

        const master =
            context.createGain();

        master.gain.value = 0.18;
        master.connect(context.destination);

        if (type === "rain") {
            const bufferSize =
                context.sampleRate * 2;

            const buffer =
                context.createBuffer(
                    1,
                    bufferSize,
                    context.sampleRate
                );

            const data =
                buffer.getChannelData(0);

            for (
                let i = 0;
                i < bufferSize;
                i++
            ) {
                data[i] =
                    (Math.random() * 2 - 1) *
                    0.35;
            }

            const source =
                context.createBufferSource();

            const filter =
                context.createBiquadFilter();

            filter.type = "lowpass";
            filter.frequency.value = 4200;

            source.buffer = buffer;
            source.loop = true;

            source.connect(filter);
            filter.connect(master);

            source.start();

            fallbackNodesRef.current = [
                source,
                filter,
                master,
            ];

            return;
        }

        if (type === "bird") {
            const createChirp = () => {
                const oscillator =
                    context.createOscillator();

                const gain =
                    context.createGain();

                oscillator.type = "sine";

                const start =
                    context.currentTime;

                oscillator.frequency.setValueAtTime(
                    1200,
                    start
                );

                oscillator.frequency.exponentialRampToValueAtTime(
                    2300,
                    start + 0.12
                );

                oscillator.frequency.exponentialRampToValueAtTime(
                    1500,
                    start + 0.24
                );

                gain.gain.setValueAtTime(
                    0.001,
                    start
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.35,
                    start + 0.02
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.001,
                    start + 0.3
                );

                oscillator.connect(gain);
                gain.connect(master);

                oscillator.start(start);
                oscillator.stop(start + 0.32);

                fallbackNodesRef.current.push(
                    oscillator,
                    gain
                );
            };

            createChirp();

            const timer = setTimeout(
                createChirp,
                550
            );

            fallbackNodesRef.current.push({
                stop: () => clearTimeout(timer),
            });

            return;
        }

        if (type === "cooking") {
            const oscillator =
                context.createOscillator();

            const gain =
                context.createGain();

            oscillator.type = "sawtooth";
            oscillator.frequency.value = 95;

            gain.gain.value = 0.04;

            oscillator.connect(gain);
            gain.connect(master);

            oscillator.start();

            fallbackNodesRef.current = [
                oscillator,
                gain,
                master,
            ];

            return;
        }

        if (type === "market") {
            const bufferSize =
                context.sampleRate * 2;

            const buffer =
                context.createBuffer(
                    1,
                    bufferSize,
                    context.sampleRate
                );

            const data =
                buffer.getChannelData(0);

            for (
                let i = 0;
                i < bufferSize;
                i++
            ) {
                data[i] =
                    (Math.random() * 2 - 1) *
                    0.18;
            }

            const source =
                context.createBufferSource();

            const filter =
                context.createBiquadFilter();

            filter.type = "bandpass";
            filter.frequency.value = 850;
            filter.Q.value = 0.7;

            source.buffer = buffer;
            source.loop = true;

            source.connect(filter);
            filter.connect(master);

            source.start();

            fallbackNodesRef.current = [
                source,
                filter,
                master,
            ];

            return;
        }
    };

    const playSound = async () => {
        if (!question) return;

        stopSound();

        const soundUrl =
            SOUND_URLS[question.id];

        if (!soundUrl) {
            playFallbackSound(question.id);
            return;
        }

        const audio =
            new Audio(soundUrl);

        audio.preload = "auto";
        audio.volume = 0.9;

        audioRef.current = audio;

        try {
            await audio.play();
        } catch (error) {
            console.warn(
                "CDN audio failed. Using fallback sound.",
                error
            );

            audioRef.current = null;

            playFallbackSound(
                question.id
            );
        }
    };

    useEffect(() => {
        stopSound();

        questionStartedAtRef.current =
            performance.now();

        return () => {
            stopSound();
        };
    }, [questionIndex]);

    const handleOptionClick = (option) => {
        if (
            feedback === "correct" ||
            feedback === "complete"
        ) {
            return;
        }

        const now = performance.now();

        const latencyMs = Math.max(
            0,
            Math.round(
                now -
                    questionStartedAtRef.current
            )
        );

        const isCorrect =
            option.id === question.id;

        record({
            correct: isCorrect,
            latencyMs,
        });

        if (isCorrect) {
            setFeedback("correct");

            setTimeout(() => {
                if (
                    questionIndex ===
                    soundMatches.length - 1
                ) {
                    stopSound();

                    complete().catch((error) => {
                        console.error(
                            "Failed to complete game session:",
                            error
                        );
                    });

                    setFeedback("complete");

                    questionStartedAtRef.current =
                        null;
                } else {
                    setQuestionIndex(
                        (previous) =>
                            previous + 1
                    );

                    setFeedback("");

                    questionStartedAtRef.current =
                        performance.now();
                }
            }, 1000);
        } else {
            setFeedback("try-again");

            setTimeout(() => {
                setFeedback("");

                questionStartedAtRef.current =
                    performance.now();
            }, 1200);
        }
    };

    const restartGame = () => {
        stopSound();

        setQuestionIndex(0);
        setFeedback("");

        questionStartedAtRef.current =
            performance.now();
    };

    if (!question) {
        return null;
    }

    if (feedback === "complete") {
        return (
            <div className="sound-match">
                <div className="sound-complete">
                    <div className="sound-complete-icon">
                        🎵
                    </div>

                    <h2>
                        {t(
                            "games.wonderful",
                            "Wonderful!"
                        )}
                    </h2>

                    <p>
                        {t(
                            "games.matchedAllSounds",
                            "You matched all the sounds."
                        )}
                    </p>

                    <button
                        type="button"
                        className="sound-button"
                        onClick={restartGame}
                    >
                        {t(
                            "games.playAgain",
                            "Play Again"
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="sound-match">
            <div className="sound-header">
                <p className="sound-label">
                    {t(
                        "games.soundObjectMatch",
                        "SOUND & OBJECT MATCH"
                    )}
                </p>

                <h2>
                    {t(
                        "games.listenCarefully",
                        "Listen carefully"
                    )}
                </h2>

                <p>
                    {t(
                        "games.whichPictureMatchesSound",
                        "Which picture matches the sound?"
                    )}
                </p>

                <div className="sound-progress">
                    {questionIndex + 1}{" "}
                    {t("common.of", "of")}{" "}
                    {soundMatches.length}
                </div>
            </div>

            <div className="sound-player">
                <button
                    type="button"
                    className="sound-play-button"
                    onClick={playSound}
                    aria-label={t(
                        "games.playSound",
                        "Play sound"
                    )}
                >
                    🔊
                </button>

                <button
                    type="button"
                    className="sound-button"
                    onClick={playSound}
                >
                    {t(
                        "games.playSound",
                        "Play Sound"
                    )}
                </button>
            </div>

            <div className="sound-options">
                {question.options.map((option) => (
                    <button
                        type="button"
                        key={option.id}
                        className="sound-option"
                        onClick={() =>
                            handleOptionClick(
                                option
                            )
                        }
                        disabled={
                            feedback ===
                            "correct"
                        }
                    >
                        <span className="sound-option-emoji">
                            {option.emoji}
                        </span>

                        <span>
                            {option.name}
                        </span>
                    </button>
                ))}
            </div>

            {feedback === "correct" && (
                <div className="sound-feedback feedback-correct">
                    ✓{" "}
                    {t(
                        "games.thatsRight",
                        "That's right!"
                    )}
                </div>
            )}

            {feedback === "try-again" && (
                <div className="sound-feedback feedback-wrong">
                    {t(
                        "games.listenAgain",
                        "That's okay. Listen again."
                    )}
                </div>
            )}
        </div>
    );
};

export default SoundObjectMatch;