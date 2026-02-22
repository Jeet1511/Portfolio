import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [adminToken, setAdminToken] = useState(localStorage.getItem('evoq_admin_token'));
    const [loading, setLoading] = useState(true);

    const API_BASE = '/api/admin-auth';

    // Helper for authenticated admin fetches
    const adminFetch = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
            ...options.headers,
        };

        const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    };

    // Load admin on mount
    useEffect(() => {
        if (!adminToken) {
            setLoading(false);
            return;
        }

        adminFetch('/me')
            .then((data) => setAdmin(data.admin))
            .catch(() => {
                localStorage.removeItem('evoq_admin_token');
                setAdminToken(null);
                setAdmin(null);
            })
            .finally(() => setLoading(false));
    }, [adminToken]);

    const adminLogin = async (email, password) => {
        const data = await adminFetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        localStorage.setItem('evoq_admin_token', data.token);
        setAdminToken(data.token);
        setAdmin(data.admin);
        return data.admin;
    };

    const adminLogout = () => {
        localStorage.removeItem('evoq_admin_token');
        setAdminToken(null);
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider
            value={{
                admin,
                adminToken,
                loading,
                adminLogin,
                adminLogout,
                adminFetch,
                isSuperAdmin: admin?.role === 'super_admin',
                isAdminAuthenticated: !!admin,
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
    return ctx;
}
