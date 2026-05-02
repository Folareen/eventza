'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from './types';
import { setToken, getToken } from './auth-token';

interface AuthState {
    user: User | null;
    isLoading: boolean;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
    loginWithCode: (email: string, otp: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

    useEffect(() => {
        fetch('/api/auth/refresh', { method: 'POST' })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data?.accessToken) {
                    setToken(data.accessToken);
                    setState({ user: data.user, isLoading: false });
                } else {
                    setState({ user: null, isLoading: false });
                }
            })
            .catch(() => setState({ user: null, isLoading: false }));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Login failed');
        setToken(data.accessToken);
        setState({ user: data.user, isLoading: false });
    }, []);

    const register = useCallback(async (body: { firstName: string; lastName: string; email: string; password: string }) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Registration failed');
        setToken(data.accessToken);
        setState({ user: data.user, isLoading: false });
    }, []);

    const loginWithCode = useCallback(async (email: string, otp: string) => {
        const res = await fetch('/api/auth/verify-passwordless-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Verification failed');
        setToken(data.accessToken);
        setState({ user: data.user, isLoading: false });
    }, []);

    const logout = useCallback(async () => {
        const token = getToken();
        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).catch(() => { });
        setToken(null);
        setState({ user: null, isLoading: false });
    }, []);

    const setUser = useCallback((user: User) => {
        setState((s) => ({ ...s, user }));
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, login, register, loginWithCode, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
