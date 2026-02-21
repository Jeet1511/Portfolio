import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    Settings,
    Users,
    BarChart3,
    Shield,
    ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const userLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: BarChart3 },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/settings', label: 'Platform Settings', icon: Shield },
];

export default function Sidebar({ type = 'user' }) {
    const { user } = useAuth();
    const location = useLocation();
    const links = type === 'admin' ? adminLinks : userLinks;
    const sectionTitle = type === 'admin' ? 'Administration' : 'Navigation';

    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <div className="sidebar-section-title">{sectionTitle}</div>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={`sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={18} />
                            {link.label}
                        </NavLink>
                    );
                })}
            </div>

            {type === 'user' && user && (
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Quick Links</div>
                    <a
                        href={`/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sidebar-link"
                    >
                        <ExternalLink size={18} />
                        View Portfolio
                    </a>
                </div>
            )}

            {type === 'admin' && (
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Switch</div>
                    <NavLink to="/dashboard" className="sidebar-link">
                        <LayoutDashboard size={18} />
                        User Dashboard
                    </NavLink>
                </div>
            )}
        </aside>
    );
}
