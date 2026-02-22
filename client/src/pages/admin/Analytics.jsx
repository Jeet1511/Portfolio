import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BarChart3, TrendingUp, Users, FolderKanban } from 'lucide-react';

export default function Analytics() {
    const { adminFetch } = useAdminAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminFetch('/analytics')
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="admin-page-loading">Loading analytics...</div>;

    const maxUsers = Math.max(...(data?.userGrowth?.map(m => m.users) || [1]), 1);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Analytics</h1>
                <p>User growth and platform activity</p>
            </div>

            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(108,92,231,0.15)', color: '#6c5ce7' }}><Users size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{data?.totalUsers || 0}</span><span className="admin-stat-label">Total Users</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(0,206,209,0.15)', color: '#00ced1' }}><FolderKanban size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{data?.totalProjects || 0}</span><span className="admin-stat-label">Total Projects</span></div>
                </div>
            </div>

            <div className="admin-section">
                <h2><TrendingUp size={18} /> User Growth (Last 12 Months)</h2>
                <div className="admin-chart">
                    {data?.userGrowth?.map((m, i) => (
                        <div className="admin-chart-bar-wrap" key={i}>
                            <div className="admin-chart-bar" style={{ height: `${Math.max((m.users / maxUsers) * 100, 4)}%` }}>
                                <span className="admin-chart-value">{m.users}</span>
                            </div>
                            <span className="admin-chart-label">{m.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="admin-section">
                <h2><BarChart3 size={18} /> Top Users by Projects</h2>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>#</th><th>User</th><th>Name</th><th>Projects</th></tr></thead>
                        <tbody>
                            {data?.topUsers?.map((u, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td><td>@{u.username}</td><td>{u.displayName}</td>
                                    <td><strong>{u.projects}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
