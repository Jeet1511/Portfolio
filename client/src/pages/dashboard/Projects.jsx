import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    ExternalLink,
    Github,
    Star,
    FolderKanban,
    Code2,
    MoreVertical,
} from 'lucide-react';
import { getTechInfo } from '../../data/techStack';

export default function Projects() {
    const { apiFetch } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleteModal, setDeleteModal] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchProjects = async () => {
        try {
            const data = await apiFetch('/projects');
            setProjects(data.projects);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [apiFetch]);

    const handleDelete = async () => {
        if (!deleteModal) return;
        setDeleting(true);

        try {
            await apiFetch(`/projects/${deleteModal._id}`, { method: 'DELETE' });
            setProjects(projects.filter((p) => p._id !== deleteModal._id));
            setDeleteModal(null);
        } catch (err) {
            console.error('Failed to delete project:', err);
        } finally {
            setDeleting(false);
        }
    };

    const toggleFeatured = async (project) => {
        try {
            const data = await apiFetch(`/projects/${project._id}`, {
                method: 'PUT',
                body: JSON.stringify({ featured: !project.featured }),
            });
            setProjects(projects.map((p) => (p._id === project._id ? data.project : p)));
        } catch (err) {
            console.error('Failed to toggle featured:', err);
        }
    };

    const filtered = projects.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.technologies?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );

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
                    <h1 className="dashboard-title">Projects</h1>
                    <p className="dashboard-subtitle">
                        Manage your portfolio projects. Add, edit, or remove them as needed.
                    </p>
                </div>
                <Link to="/dashboard/projects/new" className="btn btn-primary">
                    <Plus size={16} />
                    New Project
                </Link>
            </div>

            {/* Search */}
            {projects.length > 0 && (
                <div className="search-input-wrapper mb-24">
                    <Search size={16} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            )}

            {/* Project Grid */}
            {filtered.length > 0 ? (
                <div className="projects-grid">
                    {filtered.map((project, index) => (
                        <div
                            key={project._id}
                            className="project-card fade-in-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="project-image">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} />
                                ) : (
                                    <Code2 size={40} className="placeholder-icon" />
                                )}
                                {project.featured && (
                                    <div className="project-featured-badge">
                                        <Star size={10} style={{ marginRight: 4 }} />
                                        Featured
                                    </div>
                                )}
                            </div>

                            <div className="project-body">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="project-title" style={{ marginBottom: 0 }}>
                                        {project.title}
                                    </h3>
                                    <span className={`badge badge-${project.status === 'active' ? 'success' : project.status === 'draft' ? 'warning' : 'danger'}`}>
                                        {project.status}
                                    </span>
                                </div>

                                {project.description && (
                                    <p className="project-description">{project.description}</p>
                                )}

                                {project.technologies?.length > 0 && (
                                    <div className="project-tech">
                                        {project.technologies.map((tech, i) => {
                                            const info = getTechInfo(tech);
                                            const isDark = info.color === '#000000' || info.color === '#1a1a2e';
                                            return (
                                                <span
                                                    key={i}
                                                    className="project-tech-tag"
                                                    style={{
                                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : info.color + '20',
                                                        color: isDark ? 'var(--text-primary)' : info.color,
                                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : info.color + '40'
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="project-actions" style={{ justifyContent: 'space-between' }}>
                                    <div className="flex gap-8">
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-ghost btn-sm btn-icon"
                                                title="Live Demo"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-ghost btn-sm btn-icon"
                                                title="GitHub"
                                            >
                                                <Github size={14} />
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex gap-8">
                                        <button
                                            className="btn btn-ghost btn-sm btn-icon"
                                            onClick={() => toggleFeatured(project)}
                                            title={project.featured ? 'Remove from Featured' : 'Mark as Featured'}
                                        >
                                            <Star
                                                size={14}
                                                fill={project.featured ? 'var(--warning)' : 'none'}
                                                color={project.featured ? 'var(--warning)' : 'var(--text-muted)'}
                                            />
                                        </button>
                                        <Link
                                            to={`/dashboard/projects/${project._id}`}
                                            className="btn btn-secondary btn-sm btn-icon"
                                            title="Edit"
                                        >
                                            <Edit3 size={14} />
                                        </Link>
                                        <button
                                            className="btn btn-danger btn-sm btn-icon"
                                            onClick={() => setDeleteModal(project)}
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : projects.length > 0 ? (
                <div className="empty-state">
                    <Search size={40} />
                    <h3>No Results Found</h3>
                    <p>No projects match your search query.</p>
                </div>
            ) : (
                <div className="empty-state">
                    <FolderKanban size={48} />
                    <h3>No Projects Yet</h3>
                    <p>Start building your portfolio by adding your first project.</p>
                    <Link to="/dashboard/projects/new" className="btn btn-primary">
                        <Plus size={16} />
                        Add Your First Project
                    </Link>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteModal && (
                <div className="modal-overlay" onClick={() => !deleting && setDeleteModal(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Delete Project</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            Are you sure you want to delete <strong>"{deleteModal.title}"</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setDeleteModal(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                ) : (
                                    <>
                                        <Trash2 size={14} />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
