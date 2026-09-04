import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

import Logo from "./Logo";
import LanguagePicker from "./LanguagePicker";

import "../../assets/styles/Navbar.css";


export default function Navbar() {

    const { user } = useAuth();

    const { t } = useLanguage();


    return (
        <header className="navbar">

            <div className="navbar-container">


                {/* =====================================================
                    ASHANER BRAND
                   ===================================================== */}

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


                {/* =====================================================
                    RIGHT SIDE
                   ===================================================== */}

                <div className="navbar-right">


                    {/* =================================================
                        NAVIGATION
                       ================================================= */}

                    <nav
                        className="navbar-links"
                        aria-label="Main navigation"
                    >

                        {/* HOME */}

                        <Link to="/">
                            {t("navbar.home")}
                        </Link>


                        {/* =================================================
                            PUBLIC USER
                           ================================================= */}

                        {!user && (
                            <>
                                <Link to="/login">
                                    {t("navbar.login")}
                                </Link>

                                <Link to="/register">
                                    {t("navbar.register")}
                                </Link>
                            </>
                        )}


                        {/* =================================================
                            PATIENT
                           ================================================= */}

                        {user?.role === "patient" && (
                            <>

                                <Link to="/patient">
                                    {t("navbar.dashboard")}
                                </Link>

                                <Link to="/patient/games">
                                    {t("navbar.games")}
                                </Link>

                                <Link to="/patient/profile">
                                    {t("navbar.profile")}
                                </Link>

                                <Link to="/patient/settings">
                                    {t("navbar.settings")}
                                </Link>

                            </>
                        )}


                        {/* =================================================
                            CAREGIVER
                           ================================================= */}

                        {user?.role === "caregiver" && (

                            <Link to="/caregiver">
                                {t("navbar.dashboard")}
                            </Link>

                        )}

                    </nav>


                    {/* =================================================
                        LANGUAGE PICKER
                       ================================================= */}

                    <LanguagePicker />

                </div>

            </div>

        </header>
    );
}