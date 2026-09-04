import React from "react";

const FamilyPreview = () => {
    const callCaregiver = () => {
        if ("vibrate" in navigator) {
            navigator.vibrate(40);
        }

        window.alert("Calling ASHA Bina...");
    };

    return (
        <section className="help-card">
            <div className="help-icon">
                SOS
            </div>

            <div className="help-information">
                <h3>
                    Need help right away?
                    <span></span>
                </h3>

                <p>
                    One tap connects directly to Daughter Ananya
                    or local ASHA Health Worker Bina Gogoi.
                </p>
            </div>

            <div className="voice-status">
                <span>♩</span>
                <div>
                    Voice Active: Say
                    <strong>"Hey Asha"</strong>
                </div>
            </div>

            <button
                className="call-asha-button"
                onClick={callCaregiver}
            >
                ☎
                <span>
                    Call
                    <strong>ASHA Bina</strong>
                </span>
            </button>
        </section>
    );
};

export default FamilyPreview;