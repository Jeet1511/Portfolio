import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
    LayoutDashboard, Users, UserCog, Globe, Server,
    Activity, FileSearch, Settings, BarChart3, ShieldCheck,
    LogOut, Shield,
} from 'lucide-react';

const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/admins', icon: UserCog, label: 'Admin Management' },
    { to: '/admin/ip', icon: Globe, label: 'IP Management' },
    { to: '/admin/server', icon: Server, label: 'Server Management' },
    { to: '/admin/logs', icon: Activity, label: 'Activity Logs' },
    { to: '/admin/content', icon: FileSearch, label: 'Content Moderation' },
    { to: '/admin/settings', icon: Settings, label: 'Site Settings' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/security', icon: ShieldCheck, label: 'Security Center' },
];

export default function AdminLayout() {
    const { admin, adminLogout, isSuperAdmin } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        adminLogout();
        navigate('/admin');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-logo">
                        <Shield size={22} />
                        <span>Evo<span style={{ color: 'var(--accent-primary)' }}>Q</span> Admin</span>
                    </div>
                    <div className="admin-sidebar-user">
                        <div className="admin-sidebar-avatar">
                            {admin?.displayName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="admin-sidebar-user-info">
                            <span className="admin-sidebar-name">{admin?.displayName}</span>
                            <span className="admin-sidebar-role">
                                {isSuperAdmin ? '🔑 Super Admin' : '🛡️ Admin'}
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="admin-sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `admin-sidebar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-sidebar-link admin-logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
