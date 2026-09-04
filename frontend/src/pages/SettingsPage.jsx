import { useState } from "react";

export default function SettingsPage() {
    return (
        <section className="simple-page">
            <h1>Settings</h1>

            <div className="card setting-row">
                <span>Large text</span>

                <button
                    type="button"
                    className="toggle"
                    onClick={(event) =>
                        event.currentTarget.classList.toggle("on")
                    }
                >
                    <span />
                </button>
            </div>

            <div className="card setting-row">
                <span>Voice assistance</span>

                <button
                    type="button"
                    className="toggle on"
                >
                    <span />
                </button>
            </div>
        </section>
    );
}