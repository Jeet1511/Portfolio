import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Globe, ShieldBan, Plus, Trash2, LogIn } from 'lucide-react';

export default function IPManagement() {
    const { adminFetch } = useAdminAuth();
    const [loginLogs, setLoginLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [blockedIPs, setBlockedIPs] = useState(() => {
        try { return JSON.parse(localStorage.getItem('evoz_blocked_ips') || '[]'); }
        catch { return []; }
    });
    const [newIP, setNewIP] = useState('');
    const [newReason, setNewReason] = useState('');

    useEffect(() => {
        adminFetch('/activity-logs?action=admin_login&limit=30')
            .then(data => setLoginLogs(data.logs || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const saveBlocked = (list) => {
        setBlockedIPs(list);
        localStorage.setItem('evoz_blocked_ips', JSON.stringify(list));
    };

    const handleBlock = () => {
        if (!newIP.trim()) return;
        saveBlocked([...blockedIPs, { ip: newIP, reason: newReason || 'Manual block', blockedAt: new Date().toISOString() }]);
        setNewIP('');
        setNewReason('');
    };

    const handleUnblock = (ip) => {
        saveBlocked(blockedIPs.filter(b => b.ip !== ip));
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>IP Management</h1>
                <p>Monitor admin login IPs and manage blocked addresses</p>
            </div>

            <div className="admin-section">
                <h2><LogIn size={18} /> Recent Login IPs</h2>
                {loading ? (
                    <div className="admin-page-loading">Loading...</div>
                ) : loginLogs.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No login records yet.</p>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead><tr><th>Admin</th><th>IP Address</th><th>Time</th><th>Details</th></tr></thead>
                            <tbody>
                                {loginLogs.map((l) => (
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
                )}
            </div>

            <div className="admin-section">
                <h2><ShieldBan size={18} /> Blocked IPs ({blockedIPs.length})</h2>
                <div className="admin-inline-form" style={{ marginBottom: 16 }}>
                    <input placeholder="IP Address (e.g. 192.168.1.100)" value={newIP} onChange={(e) => setNewIP(e.target.value)} />
                    <input placeholder="Reason (optional)" value={newReason} onChange={(e) => setNewReason(e.target.value)} />
                    <button className="admin-primary-btn" onClick={handleBlock}><Plus size={14} /> Block</button>
                </div>
                {blockedIPs.length > 0 ? (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead><tr><th>IP Address</th><th>Reason</th><th>Blocked At</th><th>Action</th></tr></thead>
                            <tbody>
                                {blockedIPs.map((b, i) => (
                                    <tr key={i}>
                                        <td><code>{b.ip}</code></td><td>{b.reason}</td>
                                        <td>{new Date(b.blockedAt).toLocaleString()}</td>
                                        <td><button className="admin-action-btn danger" onClick={() => handleUnblock(b.ip)}><Trash2 size={14} /> Unblock</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No blocked IPs.</p>
                )}
            </div>
        </div>
    );
}
