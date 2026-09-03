import React, { useState } from "react";

const PatientHeader = () => {
    const [largeText, setLargeText] = useState(false);
    const [contrast, setContrast] = useState(false);

    const handleHaptic = () => {
        if ("vibrate" in navigator) {
            navigator.vibrate(20);
        }
    };

    const toggleTextSize = () => {
        handleHaptic();
        setLargeText((previous) => !previous);
        document.documentElement.classList.toggle("large-text", !largeText);
    };

    const toggleContrast = () => {
        handleHaptic();
        setContrast((previous) => !previous);
        document.documentElement.classList.toggle("high-contrast", !contrast);
    };

    return (
        <header className="patient-header">
            <div className="brand">
                <div className="brand-mark">
                    <span>◐</span>
                </div>

                <div className="brand-text">
                    <strong>AshaNER</strong>
                    <span>Cognitive Care & Memory Assistance</span>
                </div>
            </div>

            <div className="header-actions">
                <button
                    className="header-control"
                    onClick={toggleContrast}
                    aria-label="Toggle high contrast"
                >
                    <span>◐</span>
                    Contrast
                </button>

                <button
                    className="header-control font-control"
                    onClick={toggleTextSize}
                    aria-label="Increase text size"
                >
                    A−
                    <span>A+</span>
                </button>

                <button className="language-selector">
                    <span>文</span>
                    অসমীয়া
                    <span className="chevron">⌄</span>
                </button>

                <div className="connection-status">
                    <span className="connection-dot"></span>

                    <div>
                        <strong>Connected</strong>
                        <small>• Local Sync</small>
                    </div>
                </div>

                <button
                    className="talk-button"
                    onClick={handleHaptic}
                >
                    <span className="mic-icon">♩</span>
                    Talk to Asha
                </button>
            </div>
        </header>
    );
};

export default PatientHeader;