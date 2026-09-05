import { Routes, Route } from "react-router-dom";

import SplashPage from "../pages/SplashPage";
import LoginPage from "../pages/LoginPage";
import RoleLoginPage from "../pages/RoleLoginPage";

import PatientDashboard from "../pages/PatientDashboard";
import GamesPage from "../pages/GamesPage";
import GamePage from "../pages/GamePage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";

import CaregiverDashboard from "../pages/CaregiverDashboard";
import PatientsPage from "../pages/patients";
import PatientRecordPage from "../pages/PatientRecordPage";
import PatientReportPage from "../pages/PatientReportPage";

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

            {/* =====================================================
                PUBLIC LANDING PAGE
            ===================================================== */}

            <Route
                path="/"
                element={<SplashPage />}
            />


            {/* =====================================================
                LOGIN
            ===================================================== */}

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/login/:role"
                element={<RoleLoginPage />}
            />


            {/* =====================================================
                REGISTRATION
            ===================================================== */}

            <Route
                path="/register"
                element={<RoleRegisterPage />}
            />

            <Route
                path="/register/:role"
                element={<RegisterPage />}
            />


            {/* =====================================================
                OFFLINE
            ===================================================== */}

            <Route
                path="/offline"
                element={<OfflinePage />}
            />


            {/* =====================================================
                PATIENT AREA
                PATIENT ROLE ONLY
            ===================================================== */}

            <Route
                element={
                    <ProtectedRoute role="patient">
                        <PatientLayout />
                    </ProtectedRoute>
                }
            >

                {/* /patient */}
                <Route
                    path="patient"
                    element={<PatientDashboard />}
                />

                {/* /patient/games */}
                <Route
                    path="patient/games"
                    element={<GamesPage />}
                />

                {/* /patient/games/:gameId */}
                <Route
                    path="patient/games/:gameId"
                    element={<GamePage />}
                />

                {/* /patient/profile */}
                <Route
                    path="patient/profile"
                    element={<ProfilePage />}
                />

                {/* /patient/settings */}
                <Route
                    path="patient/settings"
                    element={<SettingsPage />}
                />

            </Route>


            {/* =====================================================
                CAREGIVER AREA
                CAREGIVER ROLE ONLY
            ===================================================== */}

            <Route
                element={
                    <ProtectedRoute role="caregiver">
                        <CaregiverLayout />
                    </ProtectedRoute>
                }
            >

                {/* /caregiver */}
                <Route
                    path="caregiver"
                    element={<CaregiverDashboard />}
                />

                {/* /caregiver/patients */}
                <Route
                    path="caregiver/patients"
                    element={<PatientsPage />}
                />

                {/* /caregiver/patients/:patientId */}
                <Route
                    path="caregiver/patients/:patientId"
                    element={<PatientRecordPage />}
                />

                {/* /caregiver/patients/:patientId/report */}
                <Route
                    path="caregiver/patients/:patientId/report"
                    element={<PatientReportPage />}
                />

            </Route>


            {/* =====================================================
                404
            ===================================================== */}

            <Route
                path="*"
                element={<NotFoundPage />}
            />

        </Routes>
    );
}