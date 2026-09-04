import {
    createContext,
    useContext,
    useState
} from "react";

import api from "../services/api";

const Ctx = createContext(null);

const TOKEN_KEY = "token";

const createUser = (role, email) => ({
    name:
        role === "caregiver"
            ? "Caregiver"
            : "Patient",

    email,

    role,

    patientName: "Demo_Patient"
});

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const token =
            localStorage.getItem(TOKEN_KEY);

        const role =
            localStorage.getItem("role");

        const email =
            localStorage.getItem("email");

        if (!token) {
            return null;
        }

        return createUser(
            role || "patient",
            email || ""
        );
    });


    const [authError, setAuthError] =
        useState(null);


    const [isLoggingIn, setIsLoggingIn] =
        useState(false);


    const login = async (
        email,
        password,
        role
    ) => {

        setIsLoggingIn(true);
        setAuthError(null);

        try {

            /*
             * FastAPI's OAuth2PasswordRequestForm
             * expects application/x-www-form-urlencoded
             */

            const credentials =
                new URLSearchParams();

            credentials.append(
                "username",
                email
            );

            credentials.append(
                "password",
                password
            );


            const data = await api.post(
                "/auth/login",
                credentials
            );


            if (!data?.access_token) {
                throw new Error(
                    "Login succeeded but no access token was returned."
                );
            }


            localStorage.setItem(
                TOKEN_KEY,
                data.access_token
            );


            localStorage.setItem(
                "role",
                role
            );


            localStorage.setItem(
                "email",
                email
            );


            localStorage.setItem(
                "patientId",
                "1"
            );


            setUser(
                createUser(
                    role,
                    email
                )
            );


            return true;

        } catch (error) {

            console.error(
                "AshaNER login failed:",
                error
            );


            setAuthError(
                error?.message ||
                "Unable to sign in. Please check your email and password."
            );


            return false;

        } finally {

            setIsLoggingIn(false);

        }
    };


    const logout = () => {

        localStorage.removeItem(
            TOKEN_KEY
        );

        localStorage.removeItem(
            "role"
        );

        localStorage.removeItem(
            "email"
        );

        localStorage.removeItem(
            "patientId"
        );

        setUser(null);

        setAuthError(null);
    };


    return (
        <Ctx.Provider
            value={{
                user,
                login,
                logout,
                authError,
                isLoggingIn
            }}
        >
            {children}
        </Ctx.Provider>
    );
}


export const useAuth = () =>
    useContext(Ctx);