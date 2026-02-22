import { useState } from 'react';
import { Settings, Save, ToggleLeft, ToggleRight } from 'lucide-react';

export default function SiteSettings() {
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

    const toggleSetting = (key) => {
        setSettings(s => ({ ...s, [key]: !s[key] }));
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Site Settings</h1>
                <p>Platform configuration and defaults</p>
                <button className="admin-primary-btn" onClick={handleSave}><Save size={16} /> Save Changes</button>
            </div>

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

            <div className="admin-section">
                <h2>Toggles</h2>
                <div className="admin-settings-list">
                    {[
                        { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable public access during maintenance' },
                        { key: 'registrationEnabled', label: 'User Registration', desc: 'Allow new users to sign up' },
                        { key: 'analyticsEnabled', label: 'Analytics', desc: 'Collect usage analytics' },
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email notifications to users' },
                        { key: 'autoApproveProjects', label: 'Auto-approve Projects', desc: 'Projects go live immediately' },
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
        </div>
    );
}
