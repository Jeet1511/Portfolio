import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, LogOut, LogIn, UserPlus,
    Home, Eye, User, FolderKanban, Palette, Settings,
    ChevronUp,
} from 'lucide-react';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const [dashExpanded, setDashExpanded] = useState(false);

    const isDashboard = location.pathname.startsWith('/dashboard');

    // Build nav items for reuse in both top and bottom bars
    const navItems = [
        { to: '/', icon: Home, label: 'Home', active: location.pathname === '/' },
    ];

    if (isAuthenticated) {
        navItems.push(
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: isDashboard },
            { to: `/${user?.username}`, icon: Eye, label: 'Portfolio', active: location.pathname === `/${user?.username}` },
        );
    }

    const dashSubLinks = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { to: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
        { to: '/dashboard/background', icon: Palette, label: 'Background' },
        { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];

    const handleDashClick = (e) => {
        // On mobile, toggle sub-menu instead of navigating
        if (window.innerWidth <= 768) {
            e.preventDefault();
            setDashExpanded((prev) => !prev);
        }
    };

    const handleSubLinkClick = () => {
        setDashExpanded(false);
    };

    return (
        <>
            {/* Top navbar - always visible */}
            <nav className="navbar">
                <Link to="/" className="navbar-logo">
                    Evo<span className="logo-accent">Q</span>
                </Link>

                {/* Desktop links - hidden on mobile via CSS */}
                <div className="navbar-links desktop-only">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`navbar-link ${item.active ? 'active' : ''}`}
                        >
                            <item.icon size={16} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard/settings" className="navbar-user" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="navbar-avatar">
                                    {user?.displayName?.charAt(0).toUpperCase()}
                                </div>
                                <span className="navbar-username">{user?.displayName}</span>
                            </Link>
                            <button className="btn btn-ghost btn-icon" onClick={logout} title="Sign Out">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost btn-sm">
                                <LogIn size={16} />
                                <span>Sign In</span>
                            </Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">
                                <UserPlus size={16} />
                                <span>Get Started</span>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile dashboard sub-menu - slides up above bottom nav */}
            {isAuthenticated && (
                <div className={`mobile-dash-submenu ${dashExpanded ? 'expanded' : ''}`}>
                    {dashSubLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.to === '/dashboard'
                            ? location.pathname === '/dashboard'
                            : location.pathname.startsWith(link.to);
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`dash-submenu-item ${isActive ? 'active' : ''}`}
                                onClick={handleSubLinkClick}
                            >
                                <Icon size={18} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Mobile bottom nav - only visible on mobile */}
            <div className="mobile-bottom-nav">
                {navItems.map((item) => {
                    const isDash = item.label === 'Dashboard';
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`bottom-nav-item ${item.active ? 'active' : ''}`}
                            onClick={isDash ? handleDashClick : () => setDashExpanded(false)}
                        >
                            {isDash && dashExpanded ? (
                                <ChevronUp size={20} />
                            ) : (
                                <item.icon size={20} />
                            )}
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
                {isAuthenticated && (
                    <Link
                        to="/dashboard/settings"
                        className={`bottom-nav-item ${location.pathname === '/dashboard/settings' ? 'active' : ''}`}
                        onClick={() => setDashExpanded(false)}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </Link>
                )}
            </div>

            {/* Backdrop to close sub-menu when clicking outside */}
            {dashExpanded && (
                <div className="dash-submenu-backdrop" onClick={() => setDashExpanded(false)} />
            )}
        </>
    );
}
