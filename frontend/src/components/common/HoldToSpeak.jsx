import { Mic } from "lucide-react";
import useWebSpeech from "../../hooks/useWebSpeech";

export default function HoldToSpeak({
    language = "en-IN",
    onTranscript,
    label = "Hold to speak"
}) {
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        error
    } = useWebSpeech();

    const handleStart = () => {
        startListening(language);
    };

    const handleStop = () => {
        stopListening();

        if (transcript && onTranscript) {
            onTranscript(transcript);
        }
    };

    return (
        <div className="hold-to-speak">
            <button
                type="button"
                className={`hold-speak-button ${
                    isListening ? "listening" : ""
                }`}
                onPointerDown={handleStart}
                onPointerUp={handleStop}
                onPointerCancel={handleStop}
                onPointerLeave={
                    isListening
                        ? handleStop
                        : undefined
                }
                aria-label={label}
            >
                <Mic size={24} />

                <span>
                    {isListening
                        ? "Listening..."
                        : label}
                </span>
            </button>

            {transcript && (
                <p className="speech-transcript">
                    {transcript}
                </p>
            )}

            {error && (
                <p className="speech-error">
                    {error}
                </p>
            )}
        </div>
    );
}