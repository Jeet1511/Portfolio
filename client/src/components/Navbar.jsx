import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobile = () => setMobileMenuOpen(false);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                Folio<span className="logo-accent">X</span>
            </Link>

            <button
                className="navbar-hamburger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={closeMobile}
                    >
                        Home
                    </Link>
                    {isAuthenticated && (
                        <Link
                            to={`/${user.username}`}
                            className={`navbar-link ${location.pathname === `/${user.username}` ? 'active' : ''}`}
                            onClick={closeMobile}
                        >
                            My Portfolio
                        </Link>
                    )}
                    {isAuthenticated && (
                        <Link
                            to="/dashboard"
                            className={`navbar-link ${location.pathname.startsWith('/dashboard') ? 'active' : ''}`}
                            onClick={closeMobile}
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="btn btn-ghost btn-sm" onClick={closeMobile}>
                                    <LayoutDashboard size={16} />
                                    Admin
                                </Link>
                            )}
                            <div className="navbar-user">
                                <div className="navbar-avatar">
                                    {user.displayName?.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                    {user.displayName}
                                </span>
                            </div>
                            <button className="btn btn-ghost btn-icon" onClick={() => { logout(); closeMobile(); }} title="Sign Out">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost btn-sm" onClick={closeMobile}>
                                <LogIn size={16} />
                                Sign In
                            </Link>
                            <Link to="/signup" className="btn btn-primary btn-sm" onClick={closeMobile}>
                                <UserPlus size={16} />
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {mobileMenuOpen && <div className="navbar-overlay" onClick={closeMobile} />}
        </nav>
    );
}
