import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageCropper from '../../components/ImageCropper';
import { Save, ArrowLeft, X, Plus, AlertCircle } from 'lucide-react';

export default function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { apiFetch } = useAuth();
    const isNew = !id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: [],
        liveUrl: '',
        githubUrl: '',
        image: '',
        featured: false,
        status: 'active',
    });
    const [techInput, setTechInput] = useState('');
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isNew) {
            const fetchProject = async () => {
                try {
                    const data = await apiFetch('/projects');
                    const project = data.projects.find((p) => p._id === id);
                    if (project) {
                        setFormData({
                            title: project.title || '',
                            description: project.description || '',
                            technologies: project.technologies || [],
                            liveUrl: project.liveUrl || '',
                            githubUrl: project.githubUrl || '',
                            image: project.image || '',
                            featured: project.featured || false,
                            status: project.status || 'active',
                        });
                    }
                } catch (err) {
                    setError('Failed to load project');
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
        }
    }, [id, isNew, apiFetch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const addTech = () => {
        const tech = techInput.trim();
        if (tech && !formData.technologies.includes(tech)) {
            setFormData({
                ...formData,
                technologies: [...formData.technologies, tech],
            });
        }
        setTechInput('');
    };

    const removeTech = (tech) => {
        setFormData({
            ...formData,
            technologies: formData.technologies.filter((t) => t !== tech),
        });
    };

    const handleTechKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTech();
        }
        if (e.key === 'Backspace' && !techInput && formData.technologies.length > 0) {
            removeTech(formData.technologies[formData.technologies.length - 1]);
        }
    };

    const handleImageCropped = (url) => {
        setFormData({ ...formData, image: url });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            if (isNew) {
                await apiFetch('/projects', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                });
            } else {
                await apiFetch(`/projects/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData),
                });
            }
            navigate('/dashboard/projects');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-page" style={{ minHeight: 'auto', padding: '64px 0' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">
                        {isNew ? 'Add New Project' : 'Edit Project'}
                    </h1>
                    <p className="dashboard-subtitle">
                        {isNew
                            ? 'Fill in the details below to add a new project to your portfolio.'
                            : 'Update the details of your project.'}
                    </p>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/dashboard/projects')}
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            {error && (
                <div className="auth-error mb-24">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="card" style={{ maxWidth: 720 }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Project Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="My Awesome Project"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-input form-textarea"
                            placeholder="Describe what this project does, what problems it solves..."
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={2000}
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Technologies</label>
                        <div className="tag-input-container" onClick={() => document.getElementById('tech-input').focus()}>
                            {formData.technologies.map((tech) => (
                                <span key={tech} className="tag-item">
                                    {tech}
                                    <button type="button" onClick={() => removeTech(tech)}>
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                            <input
                                id="tech-input"
                                type="text"
                                className="tag-input"
                                placeholder={formData.technologies.length === 0 ? 'Type and press Enter...' : ''}
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={handleTechKeyDown}
                            />
                        </div>
                        <p className="form-hint">Press Enter or comma to add a technology tag</p>
                    </div>

                    {/* Image Upload with Crop */}
                    <div className="form-group">
                        <label className="form-label">Project Image</label>
                        <ImageCropper
                            onImageCropped={handleImageCropped}
                            currentImage={formData.image}
                            label="Upload Project Screenshot"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div className="form-group">
                            <label className="form-label">Live URL</label>
                            <input
                                type="url"
                                name="liveUrl"
                                className="form-input"
                                placeholder="https://myproject.com"
                                value={formData.liveUrl}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">GitHub URL</label>
                            <input
                                type="url"
                                name="githubUrl"
                                className="form-input"
                                placeholder="https://github.com/..."
                                value={formData.githubUrl}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-input"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ marginBottom: 12 }}>Featured</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                />
                                <span className="toggle-slider" />
                            </label>
                        </div>
                    </div>

                    <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? (
                                <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                            ) : (
                                <>
                                    <Save size={16} />
                                    {isNew ? 'Create Project' : 'Save Changes'}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/dashboard/projects')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
