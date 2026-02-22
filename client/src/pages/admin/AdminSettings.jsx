import { Shield, Server, Database, Globe } from 'lucide-react';

export default function AdminSettings() {
    return (
        <div className="fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Platform Settings</h1>
                    <p className="dashboard-subtitle">
                        Configuration and platform information.
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Server size={18} />
                        System Information
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="flex justify-between">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Platform</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>EvoQ v1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Runtime</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Node.js</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Framework</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Express + React</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Database</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>MongoDB Atlas</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Shield size={18} />
                        Security
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="flex justify-between">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Authentication</span>
                            <span className="badge badge-success">JWT</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password Hashing</span>
                            <span className="badge badge-success">bcrypt (12 rounds)</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Token Expiry</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>30 days</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>CORS</span>
                            <span className="badge badge-success">Enabled</span>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Database size={18} />
                        API Endpoints
                    </h3>
                    <div className="table-container" style={{ border: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Method</th>
                                    <th>Endpoint</th>
                                    <th>Description</th>
                                    <th>Access</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { method: 'POST', endpoint: '/api/auth/register', desc: 'Register new user', access: 'Public' },
                                    { method: 'POST', endpoint: '/api/auth/login', desc: 'User login', access: 'Public' },
                                    { method: 'GET', endpoint: '/api/auth/me', desc: 'Get current user', access: 'Auth' },
                                    { method: 'GET', endpoint: '/api/users/:username', desc: 'Public profile', access: 'Public' },
                                    { method: 'PUT', endpoint: '/api/users/profile/update', desc: 'Update profile', access: 'Auth' },
                                    { method: 'GET', endpoint: '/api/projects', desc: 'User projects', access: 'Auth' },
                                    { method: 'POST', endpoint: '/api/projects', desc: 'Create project', access: 'Auth' },
                                    { method: 'PUT', endpoint: '/api/projects/:id', desc: 'Update project', access: 'Auth' },
                                    { method: 'DELETE', endpoint: '/api/projects/:id', desc: 'Delete project', access: 'Auth' },
                                    { method: 'GET', endpoint: '/api/admin/stats', desc: 'Platform stats', access: 'Admin' },
                                    { method: 'GET', endpoint: '/api/admin/users', desc: 'List users', access: 'Admin' },
                                ].map((api, i) => (
                                    <tr key={i}>
                                        <td>
                                            <span className={`badge badge-${api.method === 'GET' ? 'success' : api.method === 'POST' ? 'primary' : api.method === 'PUT' ? 'warning' : 'danger'}`}>
                                                {api.method}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                                            {api.endpoint}
                                        </td>
                                        <td>{api.desc}</td>
                                        <td>
                                            <span className={`badge badge-${api.access === 'Public' ? 'success' : api.access === 'Admin' ? 'danger' : 'warning'}`}>
                                                {api.access}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
