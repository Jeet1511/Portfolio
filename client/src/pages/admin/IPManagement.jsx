import { useState } from 'react';
import { Globe, ShieldBan, Search, Plus, Trash2 } from 'lucide-react';

export default function IPManagement() {
    const [blockedIPs, setBlockedIPs] = useState([
        { ip: '192.168.1.100', reason: 'Brute force attempt', blockedAt: new Date().toISOString() },
        { ip: '10.0.0.55', reason: 'Suspicious activity', blockedAt: new Date(Date.now() - 86400000).toISOString() },
    ]);
    const [newIP, setNewIP] = useState('');
    const [newReason, setNewReason] = useState('');
    const [search, setSearch] = useState('');

    const recentLogins = [
        { user: 'jeet1511', ip: '203.0.113.42', time: new Date().toISOString(), status: 'success', location: 'India' },
        { user: 'demo_user', ip: '198.51.100.7', time: new Date(Date.now() - 3600000).toISOString(), status: 'success', location: 'USA' },
        { user: 'unknown', ip: '192.168.1.100', time: new Date(Date.now() - 7200000).toISOString(), status: 'blocked', location: 'Unknown' },
    ];

    const handleBlock = () => {
        if (!newIP.trim()) return;
        setBlockedIPs([...blockedIPs, { ip: newIP, reason: newReason || 'Manual block', blockedAt: new Date().toISOString() }]);
        setNewIP('');
        setNewReason('');
    };

    const handleUnblock = (ip) => {
        setBlockedIPs(blockedIPs.filter(b => b.ip !== ip));
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>IP Management</h1>
                <p>Monitor login IPs and manage blocked addresses</p>
            </div>

            <div className="admin-section">
                <h2><Globe size={18} /> Recent Login Activity</h2>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>User</th><th>IP Address</th><th>Location</th><th>Status</th><th>Time</th></tr></thead>
                        <tbody>
                            {recentLogins.map((l, i) => (
                                <tr key={i}>
                                    <td>{l.user}</td><td><code>{l.ip}</code></td><td>{l.location}</td>
                                    <td><span className={`admin-badge ${l.status}`}>{l.status}</span></td>
                                    <td>{new Date(l.time).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="admin-section">
                <h2><ShieldBan size={18} /> Blocked IPs ({blockedIPs.length})</h2>
                <div className="admin-inline-form" style={{ marginBottom: 16 }}>
                    <input placeholder="IP Address" value={newIP} onChange={(e) => setNewIP(e.target.value)} />
                    <input placeholder="Reason (optional)" value={newReason} onChange={(e) => setNewReason(e.target.value)} />
                    <button className="admin-primary-btn" onClick={handleBlock}><Plus size={14} /> Block</button>
                </div>
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
            </div>
        </div>
    );
}
