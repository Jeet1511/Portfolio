import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FolderKanban,
    Eye,
    Plus,
    ExternalLink,
    TrendingUp,
    Clock,
    ArrowRight,
} from 'lucide-react';

export default function Dashboard() {
    const { user, apiFetch } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchProjects();
    }, [apiFetch]);

    if (loading) {
        return (
            <div className="loading-page" style={{ minHeight: 'auto', padding: '64px 0' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    const featuredCount = projects.filter((p) => p.featured).length;

    return (
        <div className="fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">
                        Welcome back, {user?.displayName?.split(' ')[0]}
                    </h1>
                    <p className="dashboard-subtitle">
                        Here is an overview of your portfolio activity.
                    </p>
                </div>
                <Link to="/dashboard/projects/new" className="btn btn-primary">
                    <Plus size={16} />
                    New Project
                </Link>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="card-stat">
                    <div className="stat-icon" style={{ background: 'rgba(108, 92, 231, 0.1)', color: 'var(--accent-primary)' }}>
                        <FolderKanban size={22} />
                    </div>
                    <div>
                        <div className="stat-value">{projects.length}</div>
                        <div className="stat-label">Total Projects</div>
                    </div>
                </div>

                <div className="card-stat">
                    <div className="stat-icon" style={{ background: 'rgba(0, 206, 201, 0.1)', color: 'var(--success)' }}>
                        <Eye size={22} />
                    </div>
                    <div>
                        <div className="stat-value">{user?.profileViews || 0}</div>
                        <div className="stat-label">Profile Views</div>
                    </div>
                </div>

                <div className="card-stat">
                    <div className="stat-icon" style={{ background: 'rgba(253, 203, 110, 0.1)', color: 'var(--warning)' }}>
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <div className="stat-value">{featuredCount}</div>
                        <div className="stat-label">Featured Projects</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
                    Quick Actions
                </h3>
                <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
                    <Link to="/dashboard/projects/new" className="btn btn-secondary btn-sm">
                        <Plus size={14} />
                        Add Project
                    </Link>
                    <Link to="/dashboard/settings" className="btn btn-secondary btn-sm">
                        <Clock size={14} />
                        Edit Profile
                    </Link>
                    <a
                        href={`/${user?.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                    >
                        <ExternalLink size={14} />
                        View Portfolio
                    </a>
                </div>
            </div>

            {/* Recent Projects */}
            <div className="card">
                <div className="flex justify-between items-center mb-16">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        Recent Projects
                    </h3>
                    {projects.length > 0 && (
                        <Link to="/dashboard/projects" className="btn btn-ghost btn-sm">
                            View All
                            <ArrowRight size={14} />
                        </Link>
                    )}
                </div>

                {projects.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {projects.slice(0, 5).map((project) => (
                            <Link
                                key={project._id}
                                to={`/dashboard/projects/${project._id}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '14px 16px',
                                    background: 'var(--bg-glass)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    transition: 'all 0.2s ease',
                                }}
                                className="project-list-item"
                            >
                                <div className="flex items-center gap-12">
                                    <FolderKanban size={16} style={{ color: 'var(--accent-primary)' }} />
                                    <span style={{ fontWeight: 600 }}>{project.title}</span>
                                    {project.featured && (
                                        <span className="badge badge-primary">Featured</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-8">
                                    {project.technologies?.slice(0, 3).map((tech, i) => (
                                        <span key={i} className="project-tech-tag">{tech}</span>
                                    ))}
                                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FolderKanban size={40} />
                        <h3>No Projects Yet</h3>
                        <p>Start building your portfolio by adding your first project.</p>
                        <Link to="/dashboard/projects/new" className="btn btn-primary btn-sm">
                            <Plus size={14} />
                            Add First Project
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
