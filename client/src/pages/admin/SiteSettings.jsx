import { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Save, ToggleLeft, ToggleRight, Key, CheckCircle } from 'lucide-react';

export default function SiteSettings() {
    const { adminFetch, admin } = useAdminAuth();
    const [settings, setSettings] = useState({
        siteName: 'EvoQ',
        siteDescription: 'Professional Portfolio Platform',
        maintenanceMode: false,
        registrationEnabled: true,
        maxProjectsPerUser: 20,
        maxUploadSize: 10,
        defaultTheme: 'dark',
        analyticsEnabled: true,
        emailNotifications: true,
        autoApproveProjects: true,
    });

    // Password change state
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordMsg, setPasswordMsg] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    const toggleSetting = (key) => {
        setSettings(s => ({ ...s, [key]: !s[key] }));
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMsg('');
        setPasswordError('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        setChangingPassword(true);
        try {
            const result = await adminFetch('/change-password', {
                method: 'PUT',
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });
            setPasswordMsg(result.message);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Site Settings</h1>
                <p>Platform configuration, defaults, and account security</p>
            </div>

            {/* Password Change Section */}
            <div className="admin-section">
                <h2><Key size={18} /> Change Password</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
                    Logged in as <strong>{admin?.email}</strong> ({admin?.role?.replace('_', ' ')})
                </p>

                {passwordMsg && (
                    <div style={{ background: 'rgba(0,184,148,0.1)', border: '1px solid rgba(0,184,148,0.3)', color: '#00b894', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle size={16} /> {passwordMsg}
                    </div>
                )}
                {passwordError && (
                    <div style={{ background: 'rgba(255,118,117,0.1)', border: '1px solid rgba(255,118,117,0.3)', color: '#ff7675', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>
                        {passwordError}
                    </div>
                )}

                <form onSubmit={handlePasswordChange} style={{ maxWidth: 400 }}>
                    <div className="admin-form-group">
                        <label>Current Password</label>
                        <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
                    </div>
                    <div className="admin-form-group">
                        <label>New Password</label>
                        <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Confirm New Password</label>
                        <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
                    </div>
                    <button type="submit" className="admin-primary-btn" disabled={changingPassword}>
                        <Key size={16} /> {changingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>

            {/* General Settings */}
            <div className="admin-section">
                <h2>General</h2>
                <div className="admin-settings-list">
                    <div className="admin-setting-item">
                        <div><strong>Site Name</strong><p>The name displayed across the platform</p></div>
                        <input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="admin-setting-input" />
                    </div>
                    <div className="admin-setting-item">
                        <div><strong>Description</strong><p>Platform description for SEO</p></div>
                        <input value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} className="admin-setting-input" />
                    </div>
                    <div className="admin-setting-item">
                        <div><strong>Default Theme</strong><p>Default theme for new users</p></div>
                        <select value={settings.defaultTheme} onChange={(e) => setSettings({ ...settings, defaultTheme: e.target.value })} className="admin-setting-input">
                            <option value="dark">Dark</option><option value="light">Light</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Limits */}
            <div className="admin-section">
                <h2>Limits</h2>
                <div className="admin-settings-list">
                    <div className="admin-setting-item">
                        <div><strong>Max Projects Per User</strong><p>Maximum number of projects a user can create</p></div>
                        <input type="number" value={settings.maxProjectsPerUser} onChange={(e) => setSettings({ ...settings, maxProjectsPerUser: parseInt(e.target.value) })} className="admin-setting-input" style={{ width: 80 }} />
                    </div>
                    <div className="admin-setting-item">
                        <div><strong>Max Upload Size (MB)</strong><p>Maximum file upload size</p></div>
                        <input type="number" value={settings.maxUploadSize} onChange={(e) => setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) })} className="admin-setting-input" style={{ width: 80 }} />
                    </div>
                </div>
            </div>

            {/* Toggles */}
            <div className="admin-section">
                <h2>Feature Toggles</h2>
                <div className="admin-settings-list">
                    {[
                        { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable public access during maintenance' },
                        { key: 'registrationEnabled', label: 'User Registration', desc: 'Allow new users to sign up' },
                        { key: 'analyticsEnabled', label: 'Analytics', desc: 'Collect usage analytics' },
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email notifications to users' },
                        { key: 'autoApproveProjects', label: 'Auto-approve Projects', desc: 'Projects go live immediately (users upload freely)' },
                    ].map(item => (
                        <div className="admin-setting-item" key={item.key}>
                            <div><strong>{item.label}</strong><p>{item.desc}</p></div>
                            <button className="admin-toggle-btn" onClick={() => toggleSetting(item.key)}>
                                {settings[item.key] ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 16 }}>
                <button className="admin-primary-btn" onClick={handleSave}><Save size={16} /> Save All Settings</button>
            </div>
        </div>
    );
}
