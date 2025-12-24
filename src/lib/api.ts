import axios, { AxiosError } from "axios"
import { getSessionId } from "./utils";
const BASE_URL = "http://localhost:3000";

const useAxios = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 5000,
})
type GetOptions = {
    requireSession?: boolean;
    headers?: Record<string, string>;
    params?: Record<string, string>;
}
export const getSessionHeaders = () => {
    const sessionId = getSessionId();
    if (!sessionId) return null;
    return { "X-Session-ID": sessionId };
};


export const handleGetRequest = async <T>(
    url: string,
    options: GetOptions = {},
): Promise<T | null> => {
    const { requireSession = false, headers = {}, params } = options;
    let finalHeaders = { ...headers };

    if (requireSession) {
        const sessionHeaders = getSessionHeaders();
        if (!sessionHeaders) {
            throw new Error("Session not found");
        }
        finalHeaders = { ...finalHeaders, ...sessionHeaders };
    }

    try {
        const response = await useAxios.get(url, {
            headers: finalHeaders,
            params,
        });
        return response.data.data as T;
    } catch (err) {
        const error = err as AxiosError<{ message?: string, error?: string }>;

        if (error.response) {
            if (error.response.data?.error) {
                throw new Error(error.response.data?.error);
            }
            const msg = error.response.data?.message || `Request failed with status ${error.response.status}`;
            throw new Error(msg);
        }
        throw new Error("Network error");
    }
};
export const handlePostRequest = async <T, B = unknown>(
    url: string,
    body?: B,
    options: GetOptions = {},
): Promise<T | null> => {
    const { requireSession = false, headers = {} } = options;
    let finalHeaders = { ...headers };

    if (requireSession) {
        const sessionHeaders = getSessionHeaders();
        if (!sessionHeaders) {
            throw new Error("Session not found");
        }
        finalHeaders = { ...finalHeaders, ...sessionHeaders };
    }

    try {
        const response = await useAxios.post(url, body, {
            headers: finalHeaders
        });
        return response.data.data as T;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const error = err as AxiosError<{ data?: T; message?: string, error?: string }>;
            const responseData = error.response?.data;

            if (responseData?.data) {
                return responseData.data;
            }
            if (responseData?.error) {
                throw new Error(responseData?.error);
            }
            const msg = responseData?.message || `Request failed with status ${error.response?.status}`;
            throw new Error(msg);
        } else {
            // Non-Axios errors (network issues, etc.)
            throw new Error(err instanceof Error ? err.message : "Network error");
        }
    }
}
export const handlePatchRequest = async <T, B = unknown>(
    url: string,
    body?: B,
    options: GetOptions = {},
): Promise<T | null> => {
    const { requireSession = false, headers = {} } = options;
    let finalHeaders = { ...headers };

    if (requireSession) {
        const sessionHeaders = getSessionHeaders();
        if (!sessionHeaders) {
            throw new Error("Session not found");
        }
        finalHeaders = { ...finalHeaders, ...sessionHeaders };
    }

    try {
        const response = await useAxios.patch(url, body, {
            headers: finalHeaders
        });
        return response.data.data as T;
    } catch (err) {
        const error = err as AxiosError<{ message?: string, error?: string }>;

        if (error.response) {
            if (error.response.data?.error) {
                throw new Error(error.response.data?.error);
            }
            const msg = error.response.data?.message || `Request failed with status ${error.response.status}`;
            throw new Error(msg);
        }
        throw new Error("Network error");
    }
}
export const handleDeleteRequest = async <T>(
    url: string,
    options: GetOptions = {},
): Promise<T | null> => {
    const { requireSession = false, headers = {} } = options;
    let finalHeaders = { ...headers };

    if (requireSession) {
        const sessionHeaders = getSessionHeaders();
        if (!sessionHeaders) {
            throw new Error("Session not found");
        }
        finalHeaders = { ...finalHeaders, ...sessionHeaders };
    }

    try {
        const response = await useAxios.delete(url, {
            headers: finalHeaders
        });
        return response.data.data as T;
    } catch (err) {
        const error = err as AxiosError<{ message?: string, error?: string }>;

        if (error.response) {
            if (error.response.data?.error) {
                throw new Error(error.response.data?.error);
            }
            const msg = error.response.data?.message || `Request failed with status ${error.response.status}`;
            throw new Error(msg);
        }
        throw new Error("Network error");
    }
}


export default useAxios;