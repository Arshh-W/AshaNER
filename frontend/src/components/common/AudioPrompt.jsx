import { Volume2 } from "lucide-react";
import useWebSpeech from "../../hooks/useWebSpeech";

export default function AudioPrompt({
    children,
    text,
    language = "en-IN"
}) {
    const { speak, isSpeaking } =
        useWebSpeech();

    const message = text || children;

    const handleSpeak = () => {
        if (!message) {
            return;
        }

        speak(String(message), {
            lang: language,
            rate: 0.85
        });
    };

    return (
        <button
            type="button"
            className={`audio-prompt ${
                isSpeaking ? "speaking" : ""
            }`}
            onClick={handleSpeak}
            aria-label={`Listen to ${message}`}
        >
            <Volume2 size={20} />
            <span>{children}</span>
        </button>
    );
}