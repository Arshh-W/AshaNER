import { useEffect } from "react";
import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";
import {
    Brain,
    Home,
    LogOut,
    PhoneCall,
    Settings,
    UserRound
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function PatientLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        if (!user || user.role !== "patient") {
            navigate("/login/patient", { replace: true });
        }
    }, [user, navigate]);

    if (!user || user.role !== "patient") {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login/patient", { replace: true });
    };

    return (
        <div className="app-shell patient-shell">
            <PageHeader />
            <main className="page-wrap">
                <Outlet />
            </main>

            <nav className="bottom-nav patient-bottom-nav">
                <NavLink to="/patient" end>
                    <Home />
                    <span>{t("navbar.home", "Home")}</span>
                </NavLink>

                <NavLink to="/patient/games">
                    <Brain />
                    <span>{t("navbar.games", "Games")}</span>
                </NavLink>

                <NavLink to="/patient/profile">
                    <UserRound />
                    <span>{t("navbar.profile", "Profile")}</span>
                </NavLink>

                <NavLink to="/patient/settings">
                    <Settings />
                    <span>{t("navbar.settings", "Settings")}</span>
                </NavLink>

                <button
                    type="button"
                    className="sos-nav"
                    onClick={() =>
                        alert(
                            t(
                                "dashboard.emergencyCall",
                                "Emergency call initiated. Caregiver notified."
                            )
                        )
                    }
                >
                    <PhoneCall />
                    <span>
                        {t("dashboard.emergency", "Emergency")}
                    </span>
                </button>

                <button
                    type="button"
                    className="bottom-nav-logout"
                    onClick={handleLogout}
                >
                    <LogOut />
                    <span>{t("common.logout", "Log out")}</span>
                </button>
            </nav>
        </div>
    );
}
