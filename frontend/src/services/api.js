const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api/v1";

const getToken = () => {
    return localStorage.getItem("token");
};

const request = async (
    endpoint,
    options = {}
) => {
    const token = getToken();

    const isFormData = options.body instanceof FormData;
    const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(
            data?.message ||
            data?.error ||
            data?.detail ||
            `Request failed with status ${response.status}`
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};

const api = {
    get(endpoint, options = {}) {
        return request(endpoint, {
            ...options,
            method: "GET"
        });
    },

    post(endpoint, body, options = {}) {
        return request(endpoint, {
            ...options,
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body)
        });
    },

    put(endpoint, body, options = {}) {
        return request(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body)
        });
    },

    patch(endpoint, body, options = {}) {
        return request(endpoint, {
            ...options,
            method: "PATCH",
            body: JSON.stringify(body)
        });
    },

    delete(endpoint, options = {}) {
        return request(endpoint, {
            ...options,
            method: "DELETE"
        });
    }
};

export {
    API_BASE_URL,
    request
};

export default api;