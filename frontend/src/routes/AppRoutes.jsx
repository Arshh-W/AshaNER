import { Routes, Route } from "react-router-dom";

import SplashPage from "../pages/SplashPage";
import LoginPage from "../pages/LoginPage";
import PatientDashboard from "../pages/PatientDashboard";
import GamesPage from "../pages/GamesPage";
import GamePage from "../pages/GamePage";
import CaregiverDashboard from "../pages/CaregiverDashboard";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import OfflinePage from "../pages/OfflinePage";
import NotFoundPage from "../pages/NotFoundPage";

import PatientLayout from "../layouts/PatientLayout";
import CaregiverLayout from "../layouts/CaregiverLayout";
import ProtectedRoute from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* ─────────────────────────────
          PUBLIC ROUTES
      ───────────────────────────── */}

      <Route path="/" element={<SplashPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/offline" element={<OfflinePage />} />

      {/* ─────────────────────────────
          PATIENT APP
      ───────────────────────────── */}

      <Route
        element={
          <ProtectedRoute>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        {/* Patient Home */}
        <Route path="/patient" element={<PatientDashboard />} />

        {/* Brain Games Hub */}
        <Route path="/patient/games" element={<GamesPage />} />

        {/* Individual Games
            Examples:
            /patient/games/memory-detective
            /patient/games/memory-mosaic
            /patient/games/memory-village
            /patient/games/routine-rescue
            /patient/games/sound-object-match
        */}
        <Route path="/patient/games/:gameId" element={<GamePage />} />

        {/* Patient Profile */}
        <Route path="/patient/profile" element={<ProfilePage />} />

        {/* Patient Settings */}
        <Route path="/patient/settings" element={<SettingsPage />} />
      </Route>

      {/* ─────────────────────────────
          CAREGIVER APP
      ───────────────────────────── */}

      <Route
        element={
          <ProtectedRoute role="caregiver">
            <CaregiverLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/caregiver" element={<CaregiverDashboard />} />
      </Route>

      {/* ─────────────────────────────
          FALLBACK / 404
      ───────────────────────────── */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
