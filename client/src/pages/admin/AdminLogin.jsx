import { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
    const { adminLogin } = useAdminAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await adminLogin(email, password);
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <div className="admin-shield-icon">
                            <Shield size={40} />
                        </div>
                        <h1>Admin Panel</h1>
                        <p>Evo<span style={{ color: 'var(--accent-primary)' }}>Z</span> Administration</p>
                    </div>

                    {error && <div className="admin-login-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@evoz.com"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Password</label>
                            <div className="admin-password-field">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="admin-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="admin-login-btn" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Access Panel'}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <p>Restricted area. Unauthorized access is prohibited.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
