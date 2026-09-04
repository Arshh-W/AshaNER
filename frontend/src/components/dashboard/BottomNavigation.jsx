import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navigationItems = [
        {
            label: "Home & Routine",
            path: "/patient",
            icon: "⌂",
        },
        {
            label: "Brain Games",
            path: "/patient/games",
            icon: "◉",
        },
        {
            label: "Caregiver Hub",
            path: "/caregiver",
            icon: "♧",
        },
    ];

    const handleNavigation = (path) => {
        if ("vibrate" in navigator) {
            navigator.vibrate(20);
        }

        navigate(path);
    };

    return (
        <nav className="bottom-navigation">

            <div className="navigation-links">

                {navigationItems.map((item) => {
                    const active = location.pathname === item.path;

                    return (
                        <button
                            key={item.path}
                            className={`nav-item ${
                                active ? "active" : ""
                            }`}
                            onClick={() =>
                                handleNavigation(item.path)
                            }
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </button>
                    );
                })}

                <button
                    className="nav-item emergency"
                    onClick={() => {
                        if ("vibrate" in navigator) {
                            navigator.vibrate([50, 50, 50]);
                        }

                        window.alert(
                            "Emergency SOS activated."
                        );
                    }}
                >
                    <span>✱</span>
                    Emergency SOS
                </button>

            </div>

        </nav>
    );
};

export default BottomNavigation;