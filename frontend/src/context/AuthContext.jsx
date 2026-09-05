import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

import {
    getCurrentUser,
    register as registerUser
} from "../services/authApi";


const Ctx = createContext(null);

const TOKEN_KEY = "token";


/* =========================================================
   SAVE USER
   ========================================================= */

const saveUser = (nextUser) => {
    localStorage.setItem(
        "user",
        JSON.stringify(nextUser)
    );
};


/* =========================================================
   NORMALIZE USER
   ========================================================= */

const normalizeUser = (
    data,
    fallbackRole = "patient",
    fallbackEmail = ""
) => ({
    id:
        data?.id ??
        data?.user_id ??
        null,

    name:
        data?.name ||
        data?.patientName ||
        data?.patient_name ||
        data?.fullName ||
        data?.displayName ||
        data?.username ||
        fallbackEmail.split("@", 1)[0] ||
        "Patient",

    email:
        data?.email ||
        fallbackEmail,

    role:
        data?.role ||
        fallbackRole,

    patientId:
        data?.patientId ??
        data?.patient_id ??
        (
            data?.role === "patient"
                ? data?.id
                : null
        ),

    patientName:
        data?.patientName ||
        data?.patient_name ||
        data?.name ||
        data?.fullName ||
        data?.displayName ||
        data?.username ||
        fallbackEmail.split("@", 1)[0] ||
        "Patient",

    contactName:
        data?.contactName ||
        data?.contact_name ||
        null
});


/* =========================================================
   CREATE USER
   ========================================================= */

const createUser = (
    role,
    email,
    name = null,
    id = null,
    patientId = null,
    patientName = null
) => ({
    id,

    name:
        name ||
        (
            role === "caregiver"
                ? "Caregiver"
                : "Patient"
        ),

    email,

    role,

    patientId,

    patientName
});


/* =========================================================
   AUTH PROVIDER
   ========================================================= */

export function AuthProvider({ children }) {

    /* =====================================================
       RESTORE LOGIN SESSION
       ===================================================== */

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch {
                localStorage.removeItem("user");
            }
        }

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
            name,
            localStorage.getItem("userId"),
            localStorage.getItem("patientId"),
            localStorage.getItem("patientName")
        );
    });


    /* =====================================================
       RESTORE CURRENT USER FROM BACKEND
       ===================================================== */

    useEffect(() => {

        if (!localStorage.getItem(TOKEN_KEY)) {
            return;
        }

        getCurrentUser()
            .then((profile) => {

                const nextUser =
                    normalizeUser(profile);

                setUser(nextUser);
                saveUser(nextUser);

                if (profile.id != null) {
                    localStorage.setItem(
                        "userId",
                        String(profile.id)
                    );
                }

                if (profile.role) {
                    localStorage.setItem(
                        "role",
                        profile.role
                    );
                }

                if (profile.email) {
                    localStorage.setItem(
                        "email",
                        profile.email
                    );
                }

                if (profile.name) {
                    localStorage.setItem(
                        "name",
                        profile.name
                    );
                }

                if (profile.patient_id != null) {
                    localStorage.setItem(
                        "patientId",
                        String(profile.patient_id)
                    );
                }

                if (profile.patient_name) {
                    localStorage.setItem(
                        "patientName",
                        profile.patient_name
                    );
                }

            })
            .catch((error) => {

                console.warn(
                    "Unable to restore current user:",
                    error
                );

                /*
                 * Keep the locally restored session.
                 * This is important for offline usage.
                 */
            });

    }, []);


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
       UPDATE USER FROM BACKEND
       ===================================================== */

    const refreshUserProfile = async (
        fallbackRole = "patient",
        fallbackEmail = ""
    ) => {

        try {

            const profile =
                await getCurrentUser();

            const nextUser =
                normalizeUser(
                    profile,
                    fallbackRole,
                    fallbackEmail
                );

            setUser(nextUser);
            saveUser(nextUser);

            if (profile.id != null) {
                localStorage.setItem(
                    "userId",
                    String(profile.id)
                );
            }

            if (profile.role) {
                localStorage.setItem(
                    "role",
                    profile.role
                );
            }

            if (profile.email) {
                localStorage.setItem(
                    "email",
                    profile.email
                );
            }

            if (profile.name) {
                localStorage.setItem(
                    "name",
                    profile.name
                );
            }

            if (profile.patient_id != null) {
                localStorage.setItem(
                    "patientId",
                    String(profile.patient_id)
                );
            }

            if (profile.patient_name) {
                localStorage.setItem(
                    "patientName",
                    profile.patient_name
                );
            }

            return nextUser;

        } catch (error) {

            console.warn(
                "Unable to fetch current user profile:",
                error
            );

            return null;
        }
    };


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
             * Create a temporary local user first.
             *
             * The real patient ID will be retrieved from
             * /auth/me immediately below.
             */

            const temporaryUser =
                normalizeUser(
                    data,
                    selectedRole,
                    cleanEmail
                );

            setUser(temporaryUser);
            saveUser(temporaryUser);


            localStorage.setItem(
                "role",
                selectedRole
            );

            localStorage.setItem(
                "email",
                cleanEmail
            );


            /* =================================================
               FETCH ACTUAL USER PROFILE
               ================================================= */

            /*
             * IMPORTANT:
             *
             * The original code only called /auth/me when
             * AuthProvider mounted.
             *
             * That meant a newly logged-in patient could
             * have no patientId until the next page refresh.
             *
             * We now fetch /auth/me immediately after login.
             */

            const profile =
                await refreshUserProfile(
                    selectedRole,
                    cleanEmail
                );


            /*
             * If /auth/me succeeded, make sure we actually
             * have the patient information before continuing.
             */

            if (profile) {

                console.log(
                    "Authenticated AshaNER user:",
                    profile
                );

                console.log(
                    "AshaNER patient ID:",
                    profile.patientId
                );

            } else {

                /*
                 * Keep the login successful even if /auth/me
                 * temporarily fails.
                 *
                 * This preserves offline-friendly behavior.
                 */
                console.warn(
                    "Login succeeded, but the user profile could not be loaded."
                );
            }


            return true;

        } catch (error) {

            console.error(
                "AshaNER login failed:",
                error
            );


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
             * Keep the existing registration behavior.
             *
             * The backend's important authentication fields
             * are email, password and role.
             */

            const data =
                await registerUser({
                    email: cleanEmail,
                    password,
                    role,
                    name: cleanName
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

        localStorage.removeItem(
            "patientName"
        );

        localStorage.removeItem(
            "userId"
        );

        localStorage.removeItem(
            "user"
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

                isRegistering,

                refreshUserProfile
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