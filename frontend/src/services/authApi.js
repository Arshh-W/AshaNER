import api from "./api";

export const login = async (
    role,
    credentials = {}
) => {
    return api.post("/auth/login", {
        role,
        ...credentials
    });
};

export const register = async (userData) => {
    return api.post(
        "/auth/register",
        userData
    );
};

export const logout = async () => {
    try {
        return await api.post("/auth/logout");
    } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
};

export const getCurrentUser = async () => {
    return api.get("/auth/me");
};

export const refreshToken = async () => {
    return api.post("/auth/refresh");
};

export default {
    login,
    register,
    logout,
    getCurrentUser,
    refreshToken
};