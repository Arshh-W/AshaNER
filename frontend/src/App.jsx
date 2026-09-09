import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { OfflineProvider } from "./context/OfflineContext";
import { GameSessionProvider } from "./context/GameSessionContext";
import ScrollToTop from "./components/common/ScrollToTop";
import AshaNERLogoAnimation from "./components/common/AshaNERLogoAnimation";
import LoadingScreen from "./components/common/LoadingScreen";
import Navbar from "./components/common/Navbar";

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
                        <ScrollToTop />
                        {/* ================================
                            STARTUP ANIMATION
                        ================================= */}

                        {isSplashPage && startupStage === "logo" && (
                            <AshaNERLogoAnimation
                                onComplete={handleLogoComplete}
                            />
                        )}

                        {/* ================================
                            LOADING SCREEN
                        ================================= */}

                        {isSplashPage && startupStage === "loading" && (
                            <LoadingScreen
                                duration={1200}
                                message="Preparing AshaNER..."
                                onComplete={handleLoadingComplete}
                            />
                        )}

                        {/* ================================
                            NAVBAR
                        ================================= */}

                        {startupStage === "ready" && (
                            <Navbar />
                        )}

                        {/* ================================
                            ROUTES
                        ================================= */}

                        {(!isSplashPage || startupStage === "ready") && (
                            <AppRoutes />
                        )}

                    </GameSessionProvider>
                </OfflineProvider>
            </LanguageProvider>
        </AuthProvider>
    );
}