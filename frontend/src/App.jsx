import { useCallback, useState } from "react";

import { AppRoutes } from "./routes/AppRoutes";

import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { OfflineProvider } from "./context/OfflineContext";
import { GameSessionProvider } from "./context/GameSessionContext";

import AshaNERLogoAnimation from "./components/common/AshaNERLogoAnimation";
import LoadingScreen from "./components/common/LoadingScreen";
import Navbar from "./components/common/Navbar";


export default function App() {

    const [startupStage, setStartupStage] =
        useState("logo");


    const handleLogoComplete = useCallback(() => {
        setStartupStage("loading");
    }, []);


    const handleLoadingComplete = useCallback(() => {
        setStartupStage("ready");
    }, []);


    return (
        <AuthProvider>

            <LanguageProvider>

                <OfflineProvider>

                    <GameSessionProvider>

                        {/* =================================================
                            STARTUP LOGO
                           ================================================= */}

                        {startupStage === "logo" && (
                            <AshaNERLogoAnimation
                                onComplete={
                                    handleLogoComplete
                                }
                            />
                        )}


                        {/* =================================================
                            LOADING SCREEN
                           ================================================= */}

                        {startupStage === "loading" && (
                            <LoadingScreen
                                duration={1200}
                                message="Preparing AshaNER..."
                                onComplete={
                                    handleLoadingComplete
                                }
                            />
                        )}


                        {/* =================================================
                            APPLICATION
                           ================================================= */}

                        {startupStage === "ready" && (
                            <>
                                <Navbar />
                                <AppRoutes />
                            </>
                        )}

                    </GameSessionProvider>

                </OfflineProvider>

            </LanguageProvider>

        </AuthProvider>
    );
}