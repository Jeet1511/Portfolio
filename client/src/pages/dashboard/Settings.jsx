import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ImageCropper from '../../components/ImageCropper';
import { Save, AlertCircle, CheckCircle, X, User, Plus, Trash2, Link as LinkIcon, Mail, Image } from 'lucide-react';
import TechPicker from '../../components/TechPicker';

export default function Settings() {
    const { user, apiFetch, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        avatar: '',
        skills: [],
        socialLinks: {
            github: '',
            linkedin: '',
            twitter: '',
            website: '',
            instagram: '',
            email: '',
        },
        customSocialLinks: [],
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || '',
                bio: user.bio || '',
                avatar: user.avatar || '',
                skills: user.skills || [],
                socialLinks: {
                    github: user.socialLinks?.github || '',
                    linkedin: user.socialLinks?.linkedin || '',
                    twitter: user.socialLinks?.twitter || '',
                    website: user.socialLinks?.website || '',
                    instagram: user.socialLinks?.instagram || '',
                    email: user.socialLinks?.email || '',
                },
                customSocialLinks: user.customSocialLinks || [],
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSocialChange = (platform, value) => {
        setFormData({
            ...formData,
            socialLinks: { ...formData.socialLinks, [platform]: value },
        });
    };

    const handleAvatarCropped = (url) => {
        setFormData({ ...formData, avatar: url });
    };

    // Custom social links
    const addCustomLink = () => {
        setFormData({
            ...formData,
            customSocialLinks: [...formData.customSocialLinks, { label: '', url: '', icon: '' }],
        });
    };

    const updateCustomLink = (index, field, value) => {
        const updated = [...formData.customSocialLinks];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, customSocialLinks: updated });
    };

    const removeCustomLink = (index) => {
        setFormData({
            ...formData,
            customSocialLinks: formData.customSocialLinks.filter((_, i) => i !== index),
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const data = await apiFetch('/users/profile/update', {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            updateUser(data.user);
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Profile Settings</h1>
                    <p className="dashboard-subtitle">
                        Customize your public profile, social links, and add custom links.
                    </p>
                </div>
            </div>

            {message.text && (
                <div
                    className={message.type === 'success' ? 'auth-error' : 'auth-error'}
                    style={
                        message.type === 'success'
                            ? { background: 'var(--success-bg)', color: 'var(--success)', borderColor: 'rgba(0,206,201,0.2)', marginBottom: 24 }
                            : { marginBottom: 24 }
                    }
                >
                    {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                </div>
            )}

            <div className="card" style={{ maxWidth: 720 }}>
                <form onSubmit={handleSubmit}>
                    {/* Profile Picture */}
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <User size={18} />
                        Profile Picture
                    </h3>

                    <div className="form-group">
                        <ImageCropper
                            onImageCropped={handleAvatarCropped}
                            currentImage={formData.avatar}
                            label="Upload Profile Picture"
                            circular={true}
                            aspectRatio={1}
                        />
                    </div>

                    {/* Profile Info */}
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, marginTop: 32 }}>
                        Profile Information
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Display Name</label>
                        <input
                            type="text"
                            name="displayName"
                            className="form-input"
                            placeholder="Your full name"
                            value={formData.displayName}
                            onChange={handleChange}
                            required
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea
                            name="bio"
                            className="form-input form-textarea"
                            placeholder="Tell the world about yourself..."
                            value={formData.bio}
                            onChange={handleChange}
                            maxLength={500}
                            rows={3}
                        />
                        <p className="form-hint">{formData.bio.length}/500 characters</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Skills / Tech Stack</label>
                        <TechPicker
                            selected={formData.skills}
                            onChange={(skills) => setFormData({ ...formData, skills })}
                        />
                    </div>

                    {/* Social Links */}
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, marginTop: 32 }}>
                        Social Links
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {[
                            { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
                            { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
                            { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
                            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
                            { key: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
                            { key: 'email', label: 'Email', placeholder: 'your@email.com' },
                        ].map((social) => (
                            <div className="form-group" key={social.key}>
                                <label className="form-label">{social.label}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder={social.placeholder}
                                    value={formData.socialLinks[social.key]}
                                    onChange={(e) => handleSocialChange(social.key, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Custom Social Links */}
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, marginTop: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <LinkIcon size={18} />
                        Custom Links
                    </h3>
                    <p className="form-hint" style={{ marginBottom: 16 }}>
                        Add any additional links to display on your portfolio. You can optionally paste an SVG data URL for a custom icon (e.g. from Lucide, Simple Icons, etc.)
                    </p>

                    {formData.customSocialLinks.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            {formData.customSocialLinks.map((link, index) => (
                                <div className="custom-social-item" key={index}>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        {link.icon && link.icon.startsWith('data:image/svg') && (
                                            <img
                                                src={link.icon}
                                                alt="icon"
                                                style={{ width: 20, height: 20, filter: 'brightness(0) invert(1)', flexShrink: 0 }}
                                            />
                                        )}
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Label (e.g. Dribbble)"
                                            value={link.label}
                                            onChange={(e) => updateCustomLink(index, 'label', e.target.value)}
                                            maxLength={50}
                                            style={{ marginBottom: 0 }}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="https://dribbble.com/username"
                                        value={link.url}
                                        onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                                        style={{ marginBottom: 0 }}
                                    />
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="SVG data URL (optional)"
                                        value={link.icon || ''}
                                        onChange={(e) => updateCustomLink(index, 'icon', e.target.value)}
                                        style={{ marginBottom: 0, fontSize: '0.75rem' }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm btn-icon"
                                        onClick={() => removeCustomLink(index)}
                                        title="Remove link"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={addCustomLink}
                    >
                        <Plus size={14} />
                        Add Custom Link
                    </button>

                    <div style={{ marginTop: 32 }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? (
                                <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
