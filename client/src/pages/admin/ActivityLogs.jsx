import { Activity, LogIn, UserPlus, Settings, Trash2, Shield } from 'lucide-react';

export default function ActivityLogs() {
    const logs = [
        { action: 'User Login', user: 'jeet1511', icon: LogIn, color: '#00b894', time: new Date().toISOString(), details: 'Successful login from 203.0.113.42' },
        { action: 'New Signup', user: 'demo_user', icon: UserPlus, color: '#6c5ce7', time: new Date(Date.now() - 1800000).toISOString(), details: 'New account created' },
        { action: 'Profile Update', user: 'jeet1511', icon: Settings, color: '#fdcb6e', time: new Date(Date.now() - 3600000).toISOString(), details: 'Updated bio and social links' },
        { action: 'Project Created', user: 'jeet1511', icon: Activity, color: '#00ced1', time: new Date(Date.now() - 7200000).toISOString(), details: 'Created project "Resume Maker"' },
        { action: 'Admin Login', user: 'Super Admin', icon: Shield, color: '#ff7675', time: new Date(Date.now() - 10800000).toISOString(), details: 'Admin panel accessed' },
        { action: 'User Deactivated', user: 'test_user', icon: Trash2, color: '#e17055', time: new Date(Date.now() - 86400000).toISOString(), details: 'Account deactivated by admin' },
    ];

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Activity Logs</h1>
                <p>Audit trail of user and admin actions</p>
            </div>

            <div className="admin-section">
                <div className="admin-timeline">
                    {logs.map((log, i) => {
                        const Icon = log.icon;
                        return (
                            <div className="admin-timeline-item" key={i}>
                                <div className="admin-timeline-icon" style={{ background: `${log.color}20`, color: log.color }}>
                                    <Icon size={18} />
                                </div>
                                <div className="admin-timeline-content">
                                    <div className="admin-timeline-header">
                                        <strong>{log.action}</strong>
                                        <span className="admin-timeline-time">{new Date(log.time).toLocaleString()}</span>
                                    </div>
                                    <p>By <strong>@{log.user}</strong> — {log.details}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
