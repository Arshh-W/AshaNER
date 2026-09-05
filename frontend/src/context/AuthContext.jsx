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

const clearStoredAuth = () => {
    [
        TOKEN_KEY,
        "role",
        "email",
        "name",
        "patientId",
        "patientName",
        "patientCode",
        "caregiverCode",
        "userId",
        "user"
    ].forEach((key) => localStorage.removeItem(key));
};

const saveUser = (nextUser) => {
    if (!nextUser) {
        localStorage.removeItem("user");
        return;
    }

    localStorage.setItem("user", JSON.stringify(nextUser));

    if (nextUser.id != null) {
        localStorage.setItem("userId", String(nextUser.id));
    }

    if (nextUser.role) {
        localStorage.setItem("role", nextUser.role);
    }

    if (nextUser.email) {
        localStorage.setItem("email", nextUser.email);
    }

    if (nextUser.name) {
        localStorage.setItem("name", nextUser.name);
    }

    if (nextUser.patientId != null) {
        localStorage.setItem("patientId", String(nextUser.patientId));
    } else {
        localStorage.removeItem("patientId");
    }

    if (nextUser.patientName) {
        localStorage.setItem("patientName", nextUser.patientName);
    } else {
        localStorage.removeItem("patientName");
    }

    if (nextUser.patientCode) {
        localStorage.setItem("patientCode", nextUser.patientCode);
    } else {
        localStorage.removeItem("patientCode");
    }

    if (nextUser.caregiverCode) {
        localStorage.setItem("caregiverCode", nextUser.caregiverCode);
    } else {
        localStorage.removeItem("caregiverCode");
    }
};

const normalizeUser = (
    data,
    fallbackRole = "patient",
    fallbackEmail = ""
) => {
    const role = data?.role || fallbackRole;

    const patientId =
        data?.patientId ??
        data?.patient_id ??
        null;

    const name =
        data?.name ||
        data?.patientName ||
        data?.patient_name ||
        data?.fullName ||
        data?.displayName ||
        data?.username ||
        fallbackEmail.split("@")[0] ||
        (role === "caregiver" ? "Caregiver" : "Patient");

    return {
        id: data?.id ?? data?.user_id ?? null,
        name,
        email: data?.email || fallbackEmail,
        role,

        // IMPORTANT:
        // patientId comes from the backend patient record.
        // Never fall back to user id.
        patientId,

        patientName:
            data?.patientName ||
            data?.patient_name ||
            (role === "patient" ? name : null),

        patientCode:
            data?.patientCode ||
            data?.patient_code ||
            null,

        caregiverCode:
            data?.caregiverCode ||
            data?.caregiver_code ||
            null
    };
};

const createUserFromStorage = () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
        try {
            return JSON.parse(savedUser);
        } catch {
            localStorage.removeItem("user");
        }
    }

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
        return null;
    }

    const role = localStorage.getItem("role") || "patient";
    const email = localStorage.getItem("email") || "";
    const name = localStorage.getItem("name") || null;

    return normalizeUser(
        {
            id: localStorage.getItem("userId"),
            name,
            email,
            role,
            patient_id: localStorage.getItem("patientId"),
            patient_name: localStorage.getItem("patientName"),
            patient_code: localStorage.getItem("patientCode"),
            caregiver_code: localStorage.getItem("caregiverCode")
        },
        role,
        email
    );
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(createUserFromStorage);

    const [authError, setAuthError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const refreshUserProfile = async (
        fallbackRole = user?.role || "patient",
        fallbackEmail = user?.email || ""
    ) => {
        try {
            const profile = await getCurrentUser();

            const nextUser = normalizeUser(
                profile,
                fallbackRole,
                fallbackEmail
            );

            setUser(nextUser);
            saveUser(nextUser);

            return nextUser;
        } catch (error) {
            console.warn(
                "Unable to fetch current AshaNER user profile:",
                error
            );

            return null;
        }
    };

    useEffect(() => {
        if (!localStorage.getItem(TOKEN_KEY)) {
            return;
        }

        refreshUserProfile(
            localStorage.getItem("role") || "patient",
            localStorage.getItem("email") || ""
        );
        // Restore only once when AuthProvider mounts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (
        email,
        password,
        selectedRole
    ) => {
        setIsLoggingIn(true);
        setAuthError(null);

        try {
            const cleanEmail = email.trim().toLowerCase();

            if (!cleanEmail || !password) {
                throw new Error(
                    "Please enter your email and password."
                );
            }

            if (
                selectedRole !== "patient" &&
                selectedRole !== "caregiver"
            ) {
                throw new Error("Invalid account type.");
            }

            // Prevent stale patient/caregiver information from leaking
            // into the next session.
            clearStoredAuth();

            const formData = new URLSearchParams();

            formData.append("username", cleanEmail);
            formData.append("password", password);

            const data = await api.post(
                "/auth/login",
                formData
            );

            if (!data?.access_token) {
                throw new Error(
                    "Login succeeded but the server did not return an access token."
                );
            }

            // The backend is the authority for the actual role.
            if (
                data.role &&
                data.role !== selectedRole
            ) {
                throw new Error(
                    `This account is registered as ${data.role}, not ${selectedRole}.`
                );
            }

            localStorage.setItem(
                TOKEN_KEY,
                data.access_token
            );

            const temporaryUser = normalizeUser(
                data,
                selectedRole,
                cleanEmail
            );

            setUser(temporaryUser);
            saveUser(temporaryUser);

            const profile = await refreshUserProfile(
                selectedRole,
                cleanEmail
            );

            if (!profile) {
                // Keep the valid authenticated session for
                // offline-friendly behavior.
                return true;
            }

            if (profile.role !== selectedRole) {
                clearStoredAuth();
                setUser(null);

                throw new Error(
                    `This account is registered as ${profile.role}, not ${selectedRole}.`
                );
            }

            return true;
        } catch (error) {
            console.error(
                "AshaNER login failed:",
                error
            );

            clearStoredAuth();
            setUser(null);

            setAuthError(
                error?.response?.data?.detail ||
                error?.message ||
                "Incorrect email or password."
            );

            return false;
        } finally {
            setIsLoggingIn(false);
        }
    };

    const register = async (registrationData, legacyEmail, legacyPassword, legacyRole) => {
        setIsRegistering(true);
        setAuthError(null);

        try {
            let payload;

            // Supports the old register(name, email, password, role)
            // signature while allowing the new detailed patient payload.
            if (
                registrationData &&
                typeof registrationData === "object" &&
                !Array.isArray(registrationData)
            ) {
                payload = {
                    ...registrationData
                };
            } else {
                payload = {
                    name: String(registrationData || "").trim(),
                    email: String(legacyEmail || "").trim().toLowerCase(),
                    password: legacyPassword,
                    role: legacyRole
                };
            }

            payload.name = String(payload.name || "").trim();
            payload.email = String(payload.email || "")
                .trim()
                .toLowerCase();

            if (!payload.name) {
                throw new Error("Please enter your full name.");
            }

            if (!payload.email) {
                throw new Error(
                    "Please enter your email address."
                );
            }

            if (!payload.password) {
                throw new Error("Please enter a password.");
            }

            if (
                payload.role !== "patient" &&
                payload.role !== "caregiver"
            ) {
                throw new Error("Invalid account type.");
            }

            if (payload.password.length < 8) {
                throw new Error(
                    "Password must be at least 8 characters."
                );
            }

            if (payload.role === "patient") {
                const requiredPatientFields = [
                    ["date_of_birth", "date of birth"],
                    ["gender", "gender"],
                    ["phone", "phone number"],
                    ["address", "address"],
                    ["city", "city"],
                    ["district", "district"],
                    ["state", "state"],
                    ["preferred_language", "preferred language"]
                ];

                const missing = requiredPatientFields.find(
                    ([key]) => !String(payload[key] || "").trim()
                );

                if (missing) {
                    throw new Error(
                        `Please provide your ${missing[1]}.`
                    );
                }
            }

            const data = await registerUser(payload);

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
                error?.response?.data?.detail ||
                error?.message ||
                "Unable to create your account. Please try again."
            );

            return false;
        } finally {
            setIsRegistering(false);
        }
    };

    const logout = () => {
        clearStoredAuth();
        setUser(null);
        setAuthError(null);
    };

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

export const useAuth = () => useContext(Ctx);
