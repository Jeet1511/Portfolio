import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Users, FolderKanban, TrendingUp, UserPlus, Activity, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
    const { adminFetch, isSuperAdmin } = useAdminAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminFetch('/stats')
            .then((data) => setStats(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="admin-page-loading">Loading dashboard...</div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Dashboard</h1>
                <p>Platform overview and key metrics</p>
            </div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(108, 92, 231, 0.15)', color: '#6c5ce7' }}><Users size={24} /></div>
                    <div className="admin-stat-info">
                        <span className="admin-stat-value">{stats?.totalUsers || 0}</span>
                        <span className="admin-stat-label">Total Users</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(0, 206, 209, 0.15)', color: '#00ced1' }}><FolderKanban size={24} /></div>
                    <div className="admin-stat-info">
                        <span className="admin-stat-value">{stats?.totalProjects || 0}</span>
                        <span className="admin-stat-label">Total Projects</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(0, 184, 148, 0.15)', color: '#00b894' }}><TrendingUp size={24} /></div>
                    <div className="admin-stat-info">
                        <span className="admin-stat-value">{stats?.activeUsers || 0}</span>
                        <span className="admin-stat-label">Active Users</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(253, 203, 110, 0.15)', color: '#fdcb6e' }}><UserPlus size={24} /></div>
                    <div className="admin-stat-info">
                        <span className="admin-stat-value">{stats?.newUsersThisWeek || 0}</span>
                        <span className="admin-stat-label">New This Week</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(255, 118, 117, 0.15)', color: '#ff7675' }}><Activity size={24} /></div>
                    <div className="admin-stat-info">
                        <span className="admin-stat-value">{stats?.newUsersToday || 0}</span>
                        <span className="admin-stat-label">New Today</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(162, 155, 254, 0.15)', color: '#a29bfe' }}><ShieldCheck size={24} /></div>
                    <div className="admin-stat-info">
                        <span className="admin-stat-value">{stats?.totalAdmins || 0}</span>
                        <span className="admin-stat-label">Admin Accounts</span>
                    </div>
                </div>
            </div>

            <div className="admin-section">
                <h2>Recent Users</h2>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentUsers?.map((u) => (
                                <tr key={u._id}>
                                    <td>{u.displayName}</td>
                                    <td>@{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`admin-badge ${u.isActive !== false ? 'active' : 'inactive'}`}>
                                            {u.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
