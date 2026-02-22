import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Ban, AlertTriangle, Clock, Unlock, LogIn } from 'lucide-react';

export default function SecurityCenter() {
    const { adminFetch, isSuperAdmin } = useAdminAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminFetch('/security')
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleUnban = async (userId) => {
        try {
            await adminFetch(`/users/${userId}/toggle`, { method: 'PUT' });
            setData(d => ({
                ...d,
                bannedUsers: d.bannedUsers.filter(u => u._id !== userId),
            }));
        } catch (err) { alert(err.message); }
    };

    if (loading) return <div className="admin-page-loading">Loading security data...</div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Security Center</h1>
                <p>Login monitoring, banned accounts, and security events</p>
            </div>

            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(0,184,148,0.15)', color: '#00b894' }}><LogIn size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{data?.loginLogs?.length || 0}</span><span className="admin-stat-label">Recent Logins</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(225,112,85,0.15)', color: '#e17055' }}><Ban size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{data?.bannedUsers?.length || 0}</span><span className="admin-stat-label">Banned Users</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(255,118,117,0.15)', color: '#ff7675' }}><AlertTriangle size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{data?.banLogs?.length || 0}</span><span className="admin-stat-label">Ban Actions</span></div>
                </div>
            </div>

            <div className="admin-section">
                <h2><Clock size={18} /> Recent Admin Logins</h2>
                {data?.loginLogs?.length > 0 ? (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead><tr><th>Admin</th><th>IP</th><th>Time</th><th>Details</th></tr></thead>
                            <tbody>
                                {data.loginLogs.map((l) => (
                                    <tr key={l._id}>
                                        <td><strong>{l.performedByName}</strong></td>
                                        <td><code>{l.ip || 'N/A'}</code></td>
                                        <td>{new Date(l.createdAt).toLocaleString()}</td>
                                        <td>{l.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No login records yet.</p>
                )}
            </div>

            <div className="admin-section">
                <h2><Ban size={18} /> Banned / Deactivated Users ({data?.bannedUsers?.length || 0})</h2>
                {data?.bannedUsers?.length > 0 ? (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead><tr><th>Username</th><th>Name</th><th>Email</th><th>Banned At</th><th>Action</th></tr></thead>
                            <tbody>
                                {data.bannedUsers.map((u) => (
                                    <tr key={u._id}>
                                        <td>@{u.username}</td>
                                        <td>{u.displayName}</td>
                                        <td>{u.email}</td>
                                        <td>{new Date(u.updatedAt).toLocaleString()}</td>
                                        <td>
                                            {isSuperAdmin && (
                                                <button className="admin-action-btn" onClick={() => handleUnban(u._id)}>
                                                    <Unlock size={14} /> Unban
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No banned users.</p>
                )}
            </div>

            {data?.banLogs?.length > 0 && (
                <div className="admin-section">
                    <h2><AlertTriangle size={18} /> Ban Activity Log</h2>
                    <div className="admin-timeline">
                        {data.banLogs.map((log) => (
                            <div className="admin-timeline-item" key={log._id}>
                                <div className="admin-timeline-icon" style={{ background: 'rgba(255,118,117,0.2)', color: '#ff7675' }}>
                                    <Ban size={18} />
                                </div>
                                <div className="admin-timeline-content">
                                    <div className="admin-timeline-header">
                                        <strong>{log.targetName}</strong>
                                        <span className="admin-timeline-time">{new Date(log.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p>By <strong>{log.performedByName}</strong> — {log.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
