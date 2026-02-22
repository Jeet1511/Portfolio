import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        displayName: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData.username, formData.email, formData.password, formData.displayName);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const usernamePattern = /^[a-z0-9_-]*$/;
    const isUsernameValid = formData.username.length >= 3 && usernamePattern.test(formData.username);

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join EvoZ and build your professional portfolio</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Display Name</label>
                        <input
                            type="text"
                            name="displayName"
                            className="form-input"
                            placeholder="John Doe"
                            value={formData.displayName}
                            onChange={handleChange}
                            required
                            maxLength={50}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            placeholder="johndoe"
                            value={formData.username}
                            onChange={(e) => {
                                const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                                setFormData({ ...formData, username: val });
                                setError('');
                            }}
                            required
                            minLength={3}
                            maxLength={30}
                        />
                        <div className="form-hint" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {formData.username && isUsernameValid && (
                                <CheckCircle size={12} style={{ color: 'var(--success)' }} />
                            )}
                            Your portfolio URL: evoz.com/{formData.username || 'username'}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Min. 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full btn-lg"
                        disabled={loading || !isUsernameValid}
                    >
                        {loading ? (
                            <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                        ) : (
                            <>
                                <UserPlus size={18} />
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    );
}
