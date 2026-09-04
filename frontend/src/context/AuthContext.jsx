import {
    createContext,
    useContext,
    useState
} from "react";

import api from "../services/api";
import {
    register as registerUser
} from "../services/authApi";


const Ctx = createContext(null);

const TOKEN_KEY = "token";


/* =========================================================
   CREATE USER
   ========================================================= */

const createUser = (
    role,
    email,
    name = null
) => ({
    name:
        name ||
        (
            role === "caregiver"
                ? "Caregiver"
                : "Patient"
        ),

    email,

    role,

    patientName: "Demo_Patient"
});


/* =========================================================
   AUTH PROVIDER
   ========================================================= */

export function AuthProvider({ children }) {

    /* =====================================================
       RESTORE LOGIN SESSION
       ===================================================== */

    const [user, setUser] = useState(() => {

        const token =
            localStorage.getItem(TOKEN_KEY);

        if (!token) {
            return null;
        }

        const role =
            localStorage.getItem("role") ||
            "patient";

        const email =
            localStorage.getItem("email") ||
            "";

        const name =
            localStorage.getItem("name") ||
            null;

        return createUser(
            role,
            email,
            name
        );
    });


    /* =====================================================
       STATE
       ===================================================== */

    const [authError, setAuthError] =
        useState(null);

    const [isLoggingIn, setIsLoggingIn] =
        useState(false);

    const [isRegistering, setIsRegistering] =
        useState(false);


    /* =====================================================
       LOGIN
       ===================================================== */

    const login = async (
        email,
        password,
        selectedRole
    ) => {

        setIsLoggingIn(true);
        setAuthError(null);


        try {

            const cleanEmail =
                email.trim().toLowerCase();


            if (!cleanEmail || !password) {

                throw new Error(
                    "Please enter your email and password."
                );
            }


            /*
             * FastAPI OAuth2PasswordRequestForm
             * requires application/x-www-form-urlencoded.
             */

            const formData =
                new URLSearchParams();

            formData.append(
                "username",
                cleanEmail
            );

            formData.append(
                "password",
                password
            );


            console.log(
                "Attempting AshaNER login:",
                {
                    email: cleanEmail,
                    role: selectedRole
                }
            );


            const data =
                await api.post(
                    "/auth/login",
                    formData
                );


            console.log(
                "AshaNER login response:",
                data
            );


            if (!data?.access_token) {

                throw new Error(
                    "Login succeeded but the server did not return an access token."
                );
            }


            /* =================================================
               SAVE TOKEN
               ================================================= */

            localStorage.setItem(
                TOKEN_KEY,
                data.access_token
            );


            /*
             * The backend JWT contains the user's actual role.
             *
             * For now the frontend receives the selected role
             * from RoleLoginPage, so keep it consistent.
             */

            localStorage.setItem(
                "role",
                selectedRole
            );


            localStorage.setItem(
                "email",
                cleanEmail
            );


            localStorage.setItem(
                "patientId",
                "1"
            );


            /* =================================================
               UPDATE AUTH STATE
               ================================================= */

            setUser(
                createUser(
                    selectedRole,
                    cleanEmail
                )
            );


            return true;

        } catch (error) {

            console.error(
                "AshaNER login failed:",
                error
            );


            /*
             * api.js may already convert the FastAPI response
             * into an Error. Use its message when available.
             */

            const message =
                error?.message ||
                "Incorrect email or password.";


            setAuthError(message);


            return false;

        } finally {

            setIsLoggingIn(false);
        }
    };


    /* =====================================================
       REGISTER
       ===================================================== */

    const register = async (
        name,
        email,
        password,
        role
    ) => {

        setIsRegistering(true);
        setAuthError(null);


        try {

            const cleanName =
                name.trim();

            const cleanEmail =
                email.trim().toLowerCase();


            if (!cleanName) {

                throw new Error(
                    "Please enter your full name."
                );
            }


            if (!cleanEmail) {

                throw new Error(
                    "Please enter your email address."
                );
            }


            if (!password) {

                throw new Error(
                    "Please enter a password."
                );
            }


            /*
             * Backend currently accepts:
             *
             * email
             * password
             * role
             *
             * `name` is harmless if Pydantic ignores extra
             * fields, but we don't need to depend on that.
             */

            const data =
                await registerUser({
                    email: cleanEmail,
                    password,
                    role
                });


            console.log(
                "AshaNER registration successful:",
                data
            );


            return true;

        } catch (error) {

            console.error(
                "AshaNER registration failed:",
                error
            );


            setAuthError(
                error?.message ||
                "Unable to create your account. Please try again."
            );


            return false;

        } finally {

            setIsRegistering(false);
        }
    };


    /* =====================================================
       LOGOUT
       ===================================================== */

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
            "name"
        );

        localStorage.removeItem(
            "patientId"
        );


        setUser(null);
        setAuthError(null);
    };


    /* =====================================================
       PROVIDER
       ===================================================== */

    return (
        <Ctx.Provider
            value={{
                user,

                login,

                register,

                logout,

                authError,

                isLoggingIn,

                isRegistering
            }}
        >
            {children}
        </Ctx.Provider>
    );
}


/* =========================================================
   USE AUTH
   ========================================================= */

export const useAuth = () =>
    useContext(Ctx);