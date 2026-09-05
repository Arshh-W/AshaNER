import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { OfflineProvider } from "./context/OfflineContext";
import { GameSessionProvider } from "./context/GameSessionContext";

import AshaNERLogoAnimation from "./components/common/AshaNERLogoAnimation";
import LoadingScreen from "./components/common/LoadingScreen";

export default function App() {
    const { pathname } = useLocation();
    const isSplashPage = pathname === "/";

    const [startupStage, setStartupStage] = useState(
        isSplashPage ? "logo" : "ready"
    );

    useEffect(() => {
        if (isSplashPage) {
            setStartupStage("logo");
        } else {
            setStartupStage("ready");
        }
    }, [isSplashPage]);

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
                        {isSplashPage && startupStage === "logo" && (
                            <AshaNERLogoAnimation
                                onComplete={handleLogoComplete}
                            />
                        )}

                        {isSplashPage && startupStage === "loading" && (
                            <LoadingScreen
                                duration={1200}
                                message="Preparing AshaNER..."
                                onComplete={handleLoadingComplete}
                            />
                        )}

                        {(!isSplashPage ||
                            startupStage === "ready") && (
                            <AppRoutes />
                        )}
                    </GameSessionProvider>
                </OfflineProvider>
            </LanguageProvider>
        </AuthProvider>
    );
}
