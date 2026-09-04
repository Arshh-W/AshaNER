import {
    HelpCircle,
    Volume2
} from "lucide-react";

import useWebSpeech from "../../hooks/useWebSpeech";

export default function VoiceHelp({
    text = "How can I help you?"
}) {
    const {
        speak,
        isSpeaking
    } = useWebSpeech();

    const handleSpeak = () => {
        speak(text, {
            lang: "en-IN",
            rate: 0.85
        });
    };

    return (
        <div className="voice-help">
            <div className="voice-help-icon">
                <HelpCircle size={24} />
            </div>

            <div className="voice-help-content">
                <strong>
                    Asha can help
                </strong>

                <p>{text}</p>
            </div>

            <button
                type="button"
                className={`voice-help-button ${
                    isSpeaking
                        ? "speaking"
                        : ""
                }`}
                onClick={handleSpeak}
                aria-label="Listen to voice help"
            >
                <Volume2 size={20} />
            </button>
        </div>
    );
}