import React from "react";
import "../assets/styles/patient-dashboard.css";
import PatientHeader from "../components/dashboard/PatientHeader";
import DailyGreeting from "../components/dashboard/DailyGreeting";
import RoutineReminder from "../components/dashboard/RoutineReminder";
import FamilyPreview from "../components/dashboard/FamilyPreview";
import QuickActionHub from "../components/dashboard/QuickActionHub";


const PatientDashboard = () => {
    return (
        <div className="patient-dashboard">
            <PatientHeader />

            <main className="patient-dashboard-content">
                <DailyGreeting />

                <RoutineReminder />

                <FamilyPreview />

                <QuickActionHub />

             
            </main>

        
        </div>
    );
};

export default PatientDashboard;