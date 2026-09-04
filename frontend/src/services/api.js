const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api/v1";


const getToken = () =>
    localStorage.getItem("token");


async function request(
    endpoint,
    options = {}
) {

    const token = getToken();

    const isFormData =
        options.body instanceof FormData;

    const isUrlEncoded =
        options.body instanceof URLSearchParams;


    const headers = {
        ...(isFormData || isUrlEncoded
            ? {}
            : {
                "Content-Type":
                    "application/json"
            }),

        ...(options.headers || {})
    };


    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
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

        const message =
            data?.detail ||
            data?.message ||
            `Request failed with status ${response.status}`;

        throw new Error(message);
    }


    return data;
}


const api = {

    get(endpoint, options = {}) {

        return request(
            endpoint,
            {
                ...options,
                method: "GET"
            }
        );
    },


    post(
        endpoint,
        body,
        options = {}
    ) {

        const isFormData =
            body instanceof FormData;

        const isUrlEncoded =
            body instanceof URLSearchParams;


        return request(
            endpoint,
            {
                ...options,

                method: "POST",

                body:
                    isFormData ||
                    isUrlEncoded
                        ? body
                        : JSON.stringify(body)
            }
        );
    },


    put(
        endpoint,
        body,
        options = {}
    ) {

        return request(
            endpoint,
            {
                ...options,

                method: "PUT",

                body:
                    JSON.stringify(body)
            }
        );
    },


    patch(
        endpoint,
        body,
        options = {}
    ) {

        return request(
            endpoint,
            {
                ...options,

                method: "PATCH",

                body:
                    JSON.stringify(body)
            }
        );
    },


    delete(
        endpoint,
        options = {}
    ) {

        return request(
            endpoint,
            {
                ...options,
                method: "DELETE"
            }
        );
    }
};


export default api;