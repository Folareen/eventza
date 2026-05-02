import { getToken, setToken } from './auth-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

async function refreshSession(): Promise<string | null> {
    try {
        const res = await fetch('/api/auth/refresh', { method: 'POST' });
        if (!res.ok) return null;
        const { accessToken } = await res.json();
        setToken(accessToken);
        return accessToken;
    } catch {
        return null;
    }
}

export class ApiError extends Error {
    constructor(public status: number, public data: Record<string, unknown>) {
        super((data.error as string) ?? 'Request failed');
    }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const isFormData = init?.body instanceof FormData;
    const token = getToken();

    const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(init?.headers as Record<string, string>),
    };

    const res = await fetch(`${API_URL}${path}`, { ...init, headers });

    if (res.status === 401) {
        const newToken = await refreshSession();
        if (newToken) {
            const retry = await fetch(`${API_URL}${path}`, {
                ...init,
                headers: { ...headers, Authorization: `Bearer ${newToken}` },
            });
            if (!retry.ok) throw new ApiError(retry.status, await retry.json().catch(() => ({})));
            if (retry.status === 204) return null as T;
            return retry.json();
        }
        setToken(null);
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
        throw new ApiError(401, { error: 'Session expired' });
    }

    if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => ({})));
    if (res.status === 204) return null as T;
    return res.json();
}

export const api = {
    get: <T>(path: string) => apiFetch<T>(path),
    post: <T>(path: string, body: unknown) =>
        apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    postForm: <T>(path: string, body: FormData) =>
        apiFetch<T>(path, { method: 'POST', body }),
    put: <T>(path: string, body: unknown) =>
        apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    putForm: <T>(path: string, body: FormData) =>
        apiFetch<T>(path, { method: 'PUT', body }),
    patch: <T>(path: string, body: unknown) =>
        apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string) =>
        apiFetch<T>(path, { method: 'DELETE' }),
};
