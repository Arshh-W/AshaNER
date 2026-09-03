import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import SplashPage from "../pages/SplashPage";
import LoginPage from "../pages/LoginPage";
import OfflinePage from "../pages/OfflinePage";
import PatientDashboard from "../pages/PatientDashboard";
import CaregiverDashboard from "../pages/CaregiverDashboard";
import GamesPage from "../pages/GamesPage";
import GamePage from "../pages/GamePage";
import ReminiscencePage from "../pages/ReminiscencePage";
import TeaMakingPage from "../pages/TeaMakingPage";
import MemoryMatchPage from "../pages/MemoryMatchPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";

// Layouts
import PatientLayout from "../layouts/PatientLayout";
import CaregiverLayout from "../layouts/CaregiverLayout";
import GameLayout from "../layouts/GameLayout";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* ==================== PUBLIC ROUTES ==================== */}

                <Route path="/" element={<SplashPage />} />

                <Route path="/login" element={<LoginPage />} />

                <Route path="/offline" element={<OfflinePage />} />


                {/* ==================== PATIENT ROUTES ==================== */}

                <Route path="/patient" element={<PatientLayout />}>

                    {/* /patient */}
                    <Route
                        index
                        element={<PatientDashboard />}
                    />

                    {/* /patient/games */}
                    <Route
                        path="games"
                        element={<GamesPage />}
                    />

                    {/* /patient/games/reminiscence */}
                    <Route
                        path="games/reminiscence"
                        element={<ReminiscencePage />}
                    />

                    {/* /patient/games/tea-making */}
                    <Route
                        path="games/tea-making"
                        element={<TeaMakingPage />}
                    />

                    {/* /patient/games/memory-match */}
                    <Route
                        path="games/memory-match"
                        element={<MemoryMatchPage />}
                    />

                    {/* /patient/profile */}
                    <Route
                        path="profile"
                        element={<ProfilePage />}
                    />

                    {/* /patient/settings */}
                    <Route
                        path="settings"
                        element={<SettingsPage />}
                    />

                </Route>


                {/* ==================== CAREGIVER ROUTES ==================== */}

                <Route path="/caregiver" element={<CaregiverLayout />}>

                    {/* /caregiver */}
                    <Route
                        index
                        element={<CaregiverDashboard />}
                    />

                    {/* /caregiver/profile */}
                    <Route
                        path="profile"
                        element={<ProfilePage />}
                    />

                    {/* /caregiver/settings */}
                    <Route
                        path="settings"
                        element={<SettingsPage />}
                    />

                </Route>


                {/* ==================== GENERIC GAME ROUTE ==================== */}

                <Route path="/game" element={<GameLayout />}>

                    {/* /game/:gameId */}
                    <Route
                        path=":gameId"
                        element={<GamePage />}
                    />

                </Route>


                {/* ==================== 404 ==================== */}

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;