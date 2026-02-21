import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Users,
    FolderKanban,
    TrendingUp,
    UserPlus,
    Activity,
    Clock,
    Shield,
} from 'lucide-react';

export default function AdminDashboard() {
    const { apiFetch } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiFetch('/admin/stats');
                setStats(data.stats);
                setRecentUsers(data.recentUsers);
            } catch (err) {
                console.error('Failed to fetch admin stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [apiFetch]);

    if (loading) {
        return (
            <div className="loading-page" style={{ minHeight: 'auto', padding: '64px 0' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">
                        <Shield size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                        Admin Dashboard
                    </h1>
                    <p className="dashboard-subtitle">
                        Platform overview and management controls.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="card-stat">
                    <div className="stat-icon" style={{ background: 'rgba(108, 92, 231, 0.1)', color: 'var(--accent-primary)' }}>
                        <Users size={22} />
                    </div>
                    <div>
                        <div className="stat-value">{stats?.totalUsers || 0}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>

                <div className="card-stat">
                    <div className="stat-icon" style={{ background: 'rgba(0, 206, 201, 0.1)', color: 'var(--success)' }}>
                        <FolderKanban size={22} />
                    </div>
                    <div>
                        <div className="stat-value">{stats?.totalProjects || 0}</div>
                        <div className="stat-label">Total Projects</div>
                    </div>
                </div>

                <div className="card-stat">
                    <div className="stat-icon" style={{ background: 'rgba(253, 203, 110, 0.1)', color: 'var(--warning)' }}>
                        <UserPlus size={22} />
                    </div>
                    <div>
                        <div className="stat-value">{stats?.newUsersToday || 0}</div>
                        <div className="stat-label">New Users Today</div>
                    </div>
                </div>

                <div className="card-stat">
                    <div className="stat-icon" style={{ background: 'rgba(116, 185, 255, 0.1)', color: 'var(--info)' }}>
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <div className="stat-value">{stats?.newUsersThisWeek || 0}</div>
                        <div className="stat-label">New This Week</div>
                    </div>
                </div>
            </div>

            {/* Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={18} />
                        Platform Health
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Users</span>
                            <span className="badge badge-success">{stats?.activeUsers || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Projects</span>
                            <span className="badge badge-primary">{stats?.totalProjects || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Avg Projects/User</span>
                            <span className="badge badge-warning">
                                {stats?.totalUsers ? (stats.totalProjects / stats.totalUsers).toFixed(1) : '0'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={18} />
                        Recent Signups
                    </h3>
                    {recentUsers.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {recentUsers.map((u) => (
                                <div key={u._id} className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.displayName}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                                    </div>
                                    <span className={`badge badge-${u.role === 'admin' ? 'danger' : 'primary'}`}>
                                        {u.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent signups</p>
                    )}
                </div>
            </div>
        </div>
    );
}
