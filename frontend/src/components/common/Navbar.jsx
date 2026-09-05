import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

import Logo from "./Logo";
import LanguagePicker from "./LanguagePicker";

import "../../assets/styles/Navbar.css";

export default function Navbar() {
    const { user } = useAuth();
    const { t } = useLanguage();

    const isLoggedIn = !!user;
    const isPatient = user?.role === "patient";
    const isCaregiver = user?.role === "caregiver";

    return (
        <header className="navbar">

            <div className="navbar-container">

                {/* =================================================
                    BRAND
                ================================================= */}
                <Link
                    to="/"
                    className="navbar-brand"
                    aria-label="AshaNER Home"
                >
                    <Logo className="navbar-logo" />

                    <span className="navbar-brand-name">
                        AshaNER
                    </span>
                </Link>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}
                <div className="navbar-right">

                    <nav
                        className="navbar-links"
                        aria-label="Main navigation"
                    >

                        {/* HOME
                            Always visible
                        */}
                        <Link to="/">
                            {t("navbar.home", "Home")}
                        </Link>


                        {/* =================================================
                            FULL NAVBAR
                            ONLY FOR LOGGED-IN / PROFILE USERS
                        ================================================= */}
                        {isLoggedIn && isPatient && (
                            <>
                                <Link to="/patient">
                                    {t("navbar.dashboard", "Dashboard")}
                                </Link>

                                <Link to="/patient/games">
                                    {t("navbar.games", "Games")}
                                </Link>

                                <Link to="/patient/profile">
                                    {t("navbar.profile", "Profile")}
                                </Link>

                                <Link to="/patient/settings">
                                    {t("navbar.settings", "Settings")}
                                </Link>
                            </>
                        )}


                        {isLoggedIn && isCaregiver && (
                            <>
                                <Link to="/caregiver">
                                    {t("navbar.dashboard", "Dashboard")}
                                </Link>

                                <Link to="/caregiver/patients">
                                    Patients
                                </Link>
                            </>
                        )}

                    </nav>


                    {/* =================================================
                        LANGUAGE
                        Always visible
                    ================================================= */}
                    <LanguagePicker />

                </div>

            </div>

        </header>
    );
}