import { Routes, Route } from "react-router-dom";

import SplashPage from "../pages/SplashPage";
import LoginPage from "../pages/LoginPage";
import RoleLoginPage from "../pages/RoleLoginPage";
import PatientDashboard from "../pages/PatientDashboard";
import GamesPage from "../pages/GamesPage";
import GamePage from "../pages/GamePage";
import CaregiverDashboard from "../pages/CaregiverDashboard";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import OfflinePage from "../pages/OfflinePage";
import NotFoundPage from "../pages/NotFoundPage";
import RoleRegisterPage from "../pages/RoleRegisterPage";
import RegisterPage from "../pages/RegisterPage";
import PatientLayout from "../layouts/PatientLayout";
import CaregiverLayout from "../layouts/CaregiverLayout";
import ProtectedRoute from "./ProtectedRoute";

export function AppRoutes() {
    return (
        <Routes>

            {/* PUBLIC LANDING PAGE */}
            <Route
                path="/"
                element={<SplashPage />}
            />

            {/* LOGIN PAGE */}
            <Route
                path="/login"
                element={<LoginPage />}
            />

            {/* ROLE LOGIN */}
            <Route
                path="/login/:role"
                element={<RoleLoginPage />}
            />
            {/* REGISTRATION */}
            {/* REGISTRATION */}
            <Route
                path="/register"
                element={<RoleRegisterPage />}
            />

            <Route
                path="/register/:role"
                element={<RegisterPage />}
            />

            {/* OFFLINE */}
            <Route
                path="/offline"
                element={<OfflinePage />}
            />

            {/* PATIENT */}
            <Route
                element={
                    <ProtectedRoute>
                        <PatientLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/patient"
                    element={<PatientDashboard />}
                />

                <Route
                    path="/patient/games"
                    element={<GamesPage />}
                />

                <Route
                    path="/patient/games/:gameId"
                    element={<GamePage />}
                />

                <Route
                    path="/patient/profile"
                    element={<ProfilePage />}
                />

                <Route
                    path="/patient/settings"
                    element={<SettingsPage />}
                />
            </Route>

            {/* CAREGIVER */}
            <Route
                element={
                    <ProtectedRoute role="caregiver">
                        <CaregiverLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/caregiver"
                    element={<CaregiverDashboard />}
                />
            </Route>

            {/* 404 */}
            <Route
                path="*"
                element={<NotFoundPage />}
            />

        </Routes>
    );
}