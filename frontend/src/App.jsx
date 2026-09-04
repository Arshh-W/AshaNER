import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { OfflineProvider } from "./context/OfflineContext";
import { GameSessionProvider } from "./context/GameSessionContext";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <OfflineProvider>
          <GameSessionProvider>
            <AppRoutes />
          </GameSessionProvider>
        </OfflineProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
