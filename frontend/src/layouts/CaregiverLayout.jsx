import { useEffect } from "react";
import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";
import {
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    Users
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function CaregiverLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        if (!user || user.role !== "caregiver") {
            navigate("/login/caregiver", { replace: true });
        }
    }, [user, navigate]);

    if (!user || user.role !== "caregiver") {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login/caregiver", { replace: true });
    };

    return (
        <div className="app-shell caregiver-shell">
            <PageHeader />
            <main className="page-wrap">
                <Outlet />
            </main>

            <nav className="bottom-nav caregiver-bottom-nav">
                <NavLink to="/caregiver" end>
                    <LayoutDashboard />
                    <span>
                        {t(
                            "caregiverDashboard.overview",
                            "Overview"
                        )}
                    </span>
                </NavLink>

                <NavLink to="/caregiver/patients">
                    <Users />
                    <span>
                        {t(
                            "caregiverDashboard.patients",
                            "Patients"
                        )}
                    </span>
                </NavLink>

                <NavLink to="/caregiver/reports">
                    <FileText />
                    <span>
                        {t(
                            "caregiverDashboard.reports",
                            "Reports"
                        )}
                    </span>
                </NavLink>

                <NavLink to="/caregiver/settings">
                    <Settings />
                    <span>
                        {t("navbar.settings", "Settings")}
                    </span>
                </NavLink>

                <button
                    type="button"
                    className="bottom-nav-logout"
                    onClick={handleLogout}
                >
                    <LogOut />
                    <span>
                        {t("common.logout", "Log out")}
                    </span>
                </button>
            </nav>
        </div>
    );
}
