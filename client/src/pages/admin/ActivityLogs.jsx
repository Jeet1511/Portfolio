import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Activity, LogIn, Shield, Trash2, Ban, Settings, Key, ChevronLeft, ChevronRight } from 'lucide-react';

const ACTION_ICONS = {
    admin_login: { icon: LogIn, color: '#00b894' },
    password_changed: { icon: Key, color: '#fdcb6e' },
    content_removed: { icon: Trash2, color: '#e17055' },
    user_banned: { icon: Ban, color: '#ff7675' },
    admin_created: { icon: Shield, color: '#6c5ce7' },
    user_toggled: { icon: Settings, color: '#00ced1' },
};

export default function ActivityLogs() {
    const { adminFetch } = useAdminAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [filter, setFilter] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 30 });
            if (filter) params.append('action', filter);
            const data = await adminFetch(`/activity-logs?${params}`);
            setLogs(data.logs);
            setPagination(data.pagination);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLogs(); }, [page, filter]);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Activity Logs</h1>
                <p>Audit trail of all admin actions</p>
            </div>

            <div className="admin-toolbar">
                <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
                    <option value="">All Actions</option>
                    <option value="admin_login">Admin Logins</option>
                    <option value="password_changed">Password Changes</option>
                    <option value="content_removed">Content Removed</option>
                    <option value="user_banned">Users Banned</option>
                </select>
            </div>

            {loading ? (
                <div className="admin-page-loading">Loading logs...</div>
            ) : logs.length === 0 ? (
                <div className="admin-section" style={{ textAlign: 'center', padding: 40 }}>
                    <p style={{ color: 'var(--text-muted)' }}>No activity logs yet. Actions will appear here as admins use the panel.</p>
                </div>
            ) : (
                <div className="admin-section">
                    <div className="admin-timeline">
                        {logs.map((log) => {
                            const iconDef = ACTION_ICONS[log.action] || { icon: Activity, color: '#a29bfe' };
                            const Icon = iconDef.icon;
                            return (
                                <div className="admin-timeline-item" key={log._id}>
                                    <div className="admin-timeline-icon" style={{ background: `${iconDef.color}20`, color: iconDef.color }}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="admin-timeline-content">
                                        <div className="admin-timeline-header">
                                            <strong>{log.action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</strong>
                                            <span className="admin-timeline-time">{new Date(log.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p>
                                            By <strong>{log.performedByName}</strong>
                                            {log.targetName && <> — {log.targetName}</>}
                                            {log.details && <> · {log.details}</>}
                                        </p>
                                        {log.ip && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IP: {log.ip}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {pagination.pages > 1 && (
                <div className="admin-pagination">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /> Prev</button>
                    <span>Page {page} of {pagination.pages}</span>
                    <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next <ChevronRight size={16} /></button>
                </div>
            )}
        </div>
    );
}
