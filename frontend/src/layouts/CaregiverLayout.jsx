import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Home,
    Users,
    LogOut,
} from "lucide-react";

import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";


export default function CaregiverLayout() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();


    /* =====================================================
       ROLE PROTECTION
    ===================================================== */

    useEffect(() => {

        if (!user) {
            navigate("/login/caregiver", { replace: true });
            return;
        }

        if (user.role !== "caregiver") {
            navigate("/patient", { replace: true });
        }

    }, [user, navigate]);


    if (!user || user.role !== "caregiver") {
        return null;
    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = async () => {

        try {
            await logout();
        } finally {
            navigate("/login/caregiver", {
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
                CAREGIVER BOTTOM NAVIGATION
            ================================================= */}

            <nav className="bottom-nav">

                {/* OVERVIEW */}

                <NavLink
                    to="/caregiver"
                    end
                >
                    <Home size={20} />

                    <span>
                        Overview
                    </span>
                </NavLink>


                {/* PATIENTS */}

                <NavLink
                    to="/caregiver/patients"
                >
                    <Users size={20} />

                    <span>
                        Patients
                    </span>
                </NavLink>


                {/* LOGOUT */}

                <button
                    type="button"
                    className="logout-nav"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />

                    <span>
                        Logout
                    </span>
                </button>

            </nav>

        </div>
    );
}