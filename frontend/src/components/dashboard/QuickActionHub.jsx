import React from "react";

const QuickActionHub = () => {
    const handleAction = (action) => {
        if ("vibrate" in navigator) {
            navigator.vibrate(25);
        }

        console.log(`${action} selected`);
    };

    return (
        <div className="quick-action-hub">

            <button
                className="quick-action quick-action-green"
                onClick={() => handleAction("Mark Taken")}
            >
                ✓ Mark Taken
                <span>(সেই খালোঁ)</span>
            </button>

            <button
                className="quick-action quick-action-gold"
                onClick={() => handleAction("Log Water")}
            >
                ♧ + Log 1 Glass Water
            </button>

            <button
                className="quick-action quick-action-red"
                onClick={() => handleAction("Call Ananya")}
            >
                ☎ Call Ananya
                <span>(One-Touch)</span>
            </button>

        </div>
    );
};

export default QuickActionHub;