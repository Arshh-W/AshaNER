import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Import pages
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

// Import layouts
import PatientLayout from "../layouts/PatientLayout";
import CaregiverLayout from "../layouts/CaregiverLayout";
import GameLayout from "../layouts/GameLayout";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<SplashPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/offline" element={<OfflinePage />} />

                {/* Patient routes */}
                <Route
                    path="/patient"
                    element={
                        <PatientLayout>
                            <ProtectedRoute>
                                <Routes>
                                    <Route path="" element={<PatientDashboard />} />
                                    <Route path="games" element={
                                        <GamesPage>
                                            <Routes>
                                                <Route path="" element={<GamesPage />} />
                                                <Route path="reminiscence" element={<ReminiscencePage />} />
                                                <Route path="tea-making" element={<TeaMakingPage />} />
                                                <Route path="memory-match" element={<MemoryMatchPage />} />
                                            </Routes>
                                        </GamesPage>
                                    } />
                                    <Route path="profile" element={<ProfilePage />} />
                                    <Route path="settings" element={<SettingsPage />} />
                                </Routes>
                            </ProtectedRoute>
                        </PatientLayout>
                    }
                />

                {/* Caregiver routes */}
                <Route
                    path="/caregiver"
                    element={
                        <CaregiverLayout>
                            <ProtectedRoute>
                                <Routes>
                                    <Route path="" element={<CaregiverDashboard />} />
                                    <Route path="profile" element={<ProfilePage />} />
                                    <Route path="settings" element={<SettingsPage />} />
                                </Routes>
                            </ProtectedRoute>
                        </CaregiverLayout>
                    }
                />

                {/* Game route */}
                <Route
                    path="/game/:gameId"
                    element={
                        <GameLayout>
                            <ProtectedRoute>
                                <GamePage />
                            </ProtectedRoute>
                        </GameLayout>
                    }
                />

                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;