import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Home,
    Brain,
    User,
    Settings,
    PhoneCall,
    LogOut,
} from "lucide-react";

import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";


export default function PatientLayout() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();


    /* =====================================================
       ROLE PROTECTION
    ===================================================== */

    useEffect(() => {

        if (!user) {
            navigate("/login/patient", {
                replace: true,
            });

            return;
        }

        if (user.role !== "patient") {
            navigate("/caregiver", {
                replace: true,
            });
        }

    }, [user, navigate]);


    if (!user || user.role !== "patient") {
        return null;
    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = async () => {

        try {
            await logout();
        } finally {
            navigate("/login/patient", {
                replace: true,
            });
        }

    };


    return (
        <div className="app-shell">

            {/* =================================================
                TOP NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                PAGE CONTENT
            ================================================= */}

            <main className="page-wrap">
                <Outlet />
            </main>


            {/* =================================================
                PATIENT BOTTOM NAVIGATION
            ================================================= */}

            <nav className="bottom-nav">

                {/* HOME */}

                <NavLink
                    to="/patient"
                    end
                >
                    <Home size={20} />

                    <span>
                        Home
                    </span>
                </NavLink>


                {/* GAMES */}

                <NavLink
                    to="/patient/games"
                >
                    <Brain size={20} />

                    <span>
                        Games
                    </span>
                </NavLink>


                {/* PROFILE */}

                <NavLink
                    to="/patient/profile"
                >
                    <User size={20} />

                    <span>
                        Profile
                    </span>
                </NavLink>


                {/* SETTINGS */}

                <NavLink
                    to="/patient/settings"
                >
                    <Settings size={20} />

                    <span>
                        Settings
                    </span>
                </NavLink>


                {/* EMERGENCY */}

                <button
                    type="button"
                    className="sos-nav"
                    onClick={() =>
                        alert("Emergency call initiated.")
                    }
                >
                    <PhoneCall size={20} />

                    <span>
                        Emergency
                    </span>
                </button>


                {/* LOGOUT */}

                <button
                    type="button"
                    className="logout-nav"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />

                    <span>
                        Log out
                    </span>
                </button>

            </nav>

        </div>
    );
}