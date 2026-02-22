import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('evoz_token'));
    const [loading, setLoading] = useState(true);

    const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';

    const apiFetch = useCallback(async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}${url}`, {
            ...options,
            headers,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    }, [token]);

    const loadUser = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await apiFetch('/auth/me');
            setUser(data.user);
        } catch (err) {
            console.error('Failed to load user:', err);
            localStorage.removeItem('evoz_token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [token, apiFetch]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = async (email, password) => {
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        localStorage.setItem('evoz_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (username, email, password, displayName) => {
        const data = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, displayName }),
        });

        localStorage.setItem('evoz_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('evoz_token');
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        apiFetch,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
