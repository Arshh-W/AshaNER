import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

const useWebSpeech = () => {
    const recognitionRef = useRef(null);

    const [isListening, setIsListening] =
        useState(false);

    const [transcript, setTranscript] =
        useState("");

    const [error, setError] =
        useState(null);

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const SpeechRecognition =
        typeof window !== "undefined"
            ? window.SpeechRecognition ||
              window.webkitSpeechRecognition
            : null;

    const isRecognitionSupported =
        Boolean(SpeechRecognition);

    const isSpeechSynthesisSupported =
        typeof window !== "undefined" &&
        "speechSynthesis" in window;

    const startListening = useCallback(
        (language = "en-IN") => {
            if (!SpeechRecognition) {
                setError(
                    "Speech recognition is not supported."
                );

                return;
            }

            setError(null);
            setTranscript("");

            const recognition =
                new SpeechRecognition();

            recognition.lang = language;
            recognition.continuous = false;
            recognition.interimResults = true;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                let text = "";

                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i += 1
                ) {
                    text +=
                        event.results[i][0].transcript;
                }

                setTranscript(text);
            };

            recognition.onerror = (event) => {
                setError(
                    event.error === "not-allowed"
                        ? "Microphone access was denied. Touch controls remain available."
                        : event.error || "Speech recognition failed."
                );

                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current =
                recognition;

            try {
                recognition.start();
            } catch (recognitionError) {
                setError(
                    recognitionError?.message ||
                    "Unable to start speech recognition."
                );

                setIsListening(false);
            }
        },
        [SpeechRecognition]
    );

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        setIsListening(false);
    }, []);

    const speak = useCallback(
        (
            text,
            options = {}
        ) => {
            if (
                !isSpeechSynthesisSupported ||
                !text
            ) {
                return;
            }

            window.speechSynthesis.cancel();

            const utterance =
                new SpeechSynthesisUtterance(
                    text
                );

            utterance.lang =
                options.lang || "en-IN";

            utterance.rate =
                options.rate ?? 0.9;

            utterance.pitch =
                options.pitch ?? 1;

            utterance.volume =
                options.volume ?? 1;

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = () => {
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(
                utterance
            );
        },
        [isSpeechSynthesisSupported]
    );

    const stopSpeaking = useCallback(() => {
        if (isSpeechSynthesisSupported) {
            window.speechSynthesis.cancel();
        }

        setIsSpeaking(false);
    }, [isSpeechSynthesisSupported]);

    useEffect(() => {
        return () => {
            recognitionRef.current?.abort();

            if (
                typeof window !== "undefined" &&
                "speechSynthesis" in window
            ) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return {
        isListening,
        transcript,
        error,
        isSpeaking,
        isRecognitionSupported,
        isSpeechSynthesisSupported,
        startListening,
        stopListening,
        speak,
        stopSpeaking
    };
};

export default useWebSpeech;