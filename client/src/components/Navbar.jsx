import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, LogOut, LogIn, UserPlus,
    Home, Eye, User,
} from 'lucide-react';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();

    // Build nav items for reuse in both top and bottom bars
    const navItems = [
        { to: '/', icon: Home, label: 'Home', active: location.pathname === '/' },
    ];

    if (isAuthenticated) {
        navItems.push(
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: location.pathname.startsWith('/dashboard') },
            { to: `/${user?.username}`, icon: Eye, label: 'Portfolio', active: location.pathname === `/${user?.username}` },
        );
    }

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
                            <div className="navbar-user">
                                <div className="navbar-avatar">
                                    {user?.displayName?.charAt(0).toUpperCase()}
                                </div>
                                <span className="navbar-username">{user?.displayName}</span>
                            </div>
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

            {/* Mobile bottom nav - only visible on mobile */}
            <div className="mobile-bottom-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`bottom-nav-item ${item.active ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
                {isAuthenticated && (
                    <Link
                        to="/dashboard/settings"
                        className={`bottom-nav-item ${location.pathname === '/dashboard/settings' ? 'active' : ''}`}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </Link>
                )}
            </div>
        </>
    );
}
