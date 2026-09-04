import { useCallback, useState } from "react";

import { AppRoutes } from "./routes/AppRoutes";

import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { OfflineProvider } from "./context/OfflineContext";
import { GameSessionProvider } from "./context/GameSessionContext";

import AshaNERLogoAnimation from "./components/common/AshaNERLogoAnimation";
import LoadingScreen from "./components/common/LoadingScreen";

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

                        {startupStage === "logo" && (
                            <AshaNERLogoAnimation
                                onComplete={handleLogoComplete}
                            />
                        )}

                        {startupStage === "loading" && (
                            <LoadingScreen
                                duration={1200}
                                message="Preparing AshaNER..."
                                onComplete={handleLoadingComplete}
                            />
                        )}

                        {startupStage === "ready" && (
                            <AppRoutes />
                        )}

                    </GameSessionProvider>
                </OfflineProvider>
            </LanguageProvider>
        </AuthProvider>
    );
}