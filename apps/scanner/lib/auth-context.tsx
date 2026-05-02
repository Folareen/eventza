'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { setToken, getToken } from './scanner-token';

interface ScannerUser {
    id: number;
    username: string;
    eventIds?: number[];
}

interface AuthState {
    scanner: ScannerUser | null;
    isLoading: boolean;
}

interface AuthContextValue extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
const STORAGE_KEY = 'scanner_auth';

export function ScannerAuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({ scanner: null, isLoading: true });

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const { scanner, token } = JSON.parse(raw);
                setToken(token);
                setState({ scanner, isLoading: false });
            } else {
                setState({ scanner: null, isLoading: false });
            }
        } catch {
            setState({ scanner: null, isLoading: false });
        }
    }, []);

    const login = async (username: string, password: string) => {
        const res = await fetch(`${API_URL}/scanners/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Login failed');
        setToken(data.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ scanner: data.scanner, token: data.token }));
        setState({ scanner: data.scanner, isLoading: false });
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
        setState({ scanner: null, isLoading: false });
    };

    return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
}

export function useScannerAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useScannerAuth must be used inside ScannerAuthProvider');
    return ctx;
}
