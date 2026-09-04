import React from "react";

const DailyGreeting = () => {
    const currentTime = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const currentDate = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    const speakBriefing = () => {
        if (!("speechSynthesis" in window)) {
            return;
        }

        const message =
            "Good morning, Kangkan. You have three care activities today.";

        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = "en-IN";
        speech.rate = 0.85;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
    };

    return (
        <section className="greeting-card">
            <div className="weather-pill">
                <span>☀</span>
                Sunny in Jorhat, 24°C
                <span>•</span>
                Pleasant day for tea
            </div>

            <div className="greeting-content">
                <div className="greeting-information">
                    <h1>
                        Good Morning, Kangkan!
                        <span className="assamese-greeting">
                            (শুভ বাতিপুৱা)
                        </span>
                    </h1>

                    <div className="date-time">
                        <strong>{currentTime}</strong>
                        <span>{currentDate}</span>
                    </div>
                </div>

                <button
                    className="briefing-button"
                    onClick={speakBriefing}
                >
                    <span className="speaker-circle">◖</span>

                    <div>
                        <strong>Listen to Morning Briefing</strong>
                        <small>
                            ৰাতিপুৱা বতৰা শুনক (Assamese)
                        </small>
                    </div>
                </button>
            </div>

            <div className="greeting-decoration"></div>
        </section>
    );
};

export default DailyGreeting;