import { createContext, useContext, useState } from "react";
import api from "../services/api";

const Ctx = createContext(null);
const TOKEN_KEY = "token";

const userForRole = (role) => ({
  name: role === "caregiver" ? "Ananya Barua" : "Kangkan",
  role,
  patientName: "Demo_Patient"
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (
    localStorage.getItem(TOKEN_KEY)
      ? userForRole(localStorage.getItem("role") || "patient")
      : null
  ));
  const [authError, setAuthError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = async (role = "patient") => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const data = await api.post("/auth/login", {
        username: import.meta.env.VITE_DEMO_EMAIL || "caregiver@example.com",
        password: import.meta.env.VITE_DEMO_PASSWORD || "password123"
      });
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("patientId", "1");
      setUser(userForRole(role));
      return true;
    } catch (error) {
      setAuthError(error.message || "Unable to connect to AshaNER.");
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("role");
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout, authError, isLoggingIn }}>
    {children}
  </Ctx.Provider>;
}

export const useAuth=()=>useContext(Ctx);
