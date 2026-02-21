import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                Folio<span className="logo-accent">X</span>
            </Link>

            <div className="navbar-links">
                <Link
                    to="/"
                    className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                    Home
                </Link>
                {isAuthenticated && (
                    <Link
                        to={`/${user.username}`}
                        className={`navbar-link ${location.pathname === `/${user.username}` ? 'active' : ''}`}
                    >
                        My Portfolio
                    </Link>
                )}
            </div>

            <div className="navbar-actions">
                {isAuthenticated ? (
                    <>
                        {isAdmin && (
                            <Link to="/admin" className="btn btn-ghost btn-sm">
                                <LayoutDashboard size={16} />
                                Admin
                            </Link>
                        )}
                        <Link to="/dashboard" className="btn btn-secondary btn-sm">
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>
                        <div className="navbar-user" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <div className="navbar-avatar">
                                {user.displayName?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                {user.displayName}
                            </span>
                        </div>
                        <button className="btn btn-ghost btn-icon" onClick={logout} title="Sign Out">
                            <LogOut size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-ghost btn-sm">
                            <LogIn size={16} />
                            Sign In
                        </Link>
                        <Link to="/signup" className="btn btn-primary btn-sm">
                            <UserPlus size={16} />
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
