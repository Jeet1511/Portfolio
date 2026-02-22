import { useState } from 'react';
import { ShieldCheck, Ban, AlertTriangle, Clock, Lock, Unlock } from 'lucide-react';

export default function SecurityCenter() {
    const [settings, setSettings] = useState({
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        sessionTimeout: 60,
        twoFactorEnabled: false,
        rateLimitPerMinute: 100,
    });

    const bannedAccounts = [
        { username: 'spam_bot', reason: 'Automated spam', bannedAt: new Date(Date.now() - 172800000).toISOString() },
    ];

    const loginAttempts = [
        { email: 'admin@test.com', ip: '192.168.1.50', attempts: 5, status: 'locked', lastAttempt: new Date(Date.now() - 600000).toISOString() },
        { email: 'hacker@evil.com', ip: '10.10.10.10', attempts: 12, status: 'blocked', lastAttempt: new Date(Date.now() - 1800000).toISOString() },
        { email: 'jeet@gmail.com', ip: '203.0.113.42', attempts: 1, status: 'ok', lastAttempt: new Date().toISOString() },
    ];

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Security Center</h1>
                <p>Security settings, login monitoring, and access controls</p>
            </div>

            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(255,118,117,0.15)', color: '#ff7675' }}><AlertTriangle size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{loginAttempts.filter(l => l.status !== 'ok').length}</span><span className="admin-stat-label">Failed Logins</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(225,112,85,0.15)', color: '#e17055' }}><Ban size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{bannedAccounts.length}</span><span className="admin-stat-label">Banned Accounts</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(0,184,148,0.15)', color: '#00b894' }}><Lock size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{settings.twoFactorEnabled ? 'On' : 'Off'}</span><span className="admin-stat-label">2FA Status</span></div>
                </div>
            </div>

            <div className="admin-section">
                <h2>Security Config</h2>
                <div className="admin-settings-list">
                    <div className="admin-setting-item">
                        <div><strong>Max Login Attempts</strong><p>Lock account after this many failed attempts</p></div>
                        <input type="number" value={settings.maxLoginAttempts} onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })} className="admin-setting-input" style={{ width: 80 }} />
                    </div>
                    <div className="admin-setting-item">
                        <div><strong>Lockout Duration (min)</strong><p>Minutes to lock account after exceeding attempts</p></div>
                        <input type="number" value={settings.lockoutDuration} onChange={(e) => setSettings({ ...settings, lockoutDuration: parseInt(e.target.value) })} className="admin-setting-input" style={{ width: 80 }} />
                    </div>
                    <div className="admin-setting-item">
                        <div><strong>Session Timeout (min)</strong><p>Auto-logout after inactivity</p></div>
                        <input type="number" value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })} className="admin-setting-input" style={{ width: 80 }} />
                    </div>
                    <div className="admin-setting-item">
                        <div><strong>Rate Limit (req/min)</strong><p>Maximum API requests per minute per IP</p></div>
                        <input type="number" value={settings.rateLimitPerMinute} onChange={(e) => setSettings({ ...settings, rateLimitPerMinute: parseInt(e.target.value) })} className="admin-setting-input" style={{ width: 80 }} />
                    </div>
                </div>
            </div>

            <div className="admin-section">
                <h2><Clock size={18} /> Recent Login Attempts</h2>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Email</th><th>IP</th><th>Attempts</th><th>Status</th><th>Last Attempt</th></tr></thead>
                        <tbody>
                            {loginAttempts.map((l, i) => (
                                <tr key={i}>
                                    <td>{l.email}</td><td><code>{l.ip}</code></td><td>{l.attempts}</td>
                                    <td><span className={`admin-badge ${l.status}`}>{l.status}</span></td>
                                    <td>{new Date(l.lastAttempt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="admin-section">
                <h2><Ban size={18} /> Banned Accounts</h2>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Username</th><th>Reason</th><th>Banned At</th><th>Action</th></tr></thead>
                        <tbody>
                            {bannedAccounts.map((b, i) => (
                                <tr key={i}>
                                    <td>@{b.username}</td><td>{b.reason}</td>
                                    <td>{new Date(b.bannedAt).toLocaleString()}</td>
                                    <td><button className="admin-action-btn"><Unlock size={14} /> Unban</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
