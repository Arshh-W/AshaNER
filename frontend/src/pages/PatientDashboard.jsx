import React from "react";
import "../assets/styles/patient-dashboard.css";
import PatientHeader from "../components/dashboard/PatientHeader";
import DailyGreeting from "../components/dashboard/DailyGreeting";
import RoutineReminder from "../components/dashboard/RoutineReminder";
import FamilyPreview from "../components/dashboard/FamilyPreview";
import QuickActionHub from "../components/dashboard/QuickActionHub";
import BrainPuzzle from "../components/dashboard/BrainPuzzle";
import BottomNavigation from "../components/dashboard/BottomNavigation";

import "../assets/styles/patient-dashboard.css";

const PatientDashboard = () => {
    return (
        <div className="patient-dashboard">
            <PatientHeader />

            <main className="patient-dashboard-content">
                <DailyGreeting />

                <RoutineReminder />

                <BrainPuzzle />

                <QuickActionHub />

                <FamilyPreview />
            </main>

            <BottomNavigation />
        </div>
    );
};

export default PatientDashboard;