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
    Sparkles,
    Settings,
    Palette,
    Activity,
} from 'lucide-react';
import { getTechInfo } from '../../data/techStack';

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
    const firstName = user?.displayName?.split(' ')[0] || 'User';

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">
                        Welcome back, {firstName}
                        <Activity size={22} className="icon-pulse" style={{ display: 'inline-block', marginLeft: 8, color: 'var(--accent-primary)' }} />
                    </h1>
                    <p className="dashboard-subtitle">
                        Here's an overview of your portfolio activity.
                    </p>
                </div>
                <Link to="/dashboard/projects/new" className="btn btn-primary">
                    <Plus size={16} className="icon-rotate-hover" />
                    New Project
                </Link>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="card-stat fade-in-up" style={{ animationDelay: '0s' }}>
                    <div className="stat-icon" style={{ background: 'rgba(108, 92, 231, 0.1)', color: 'var(--accent-primary)' }}>
                        <FolderKanban size={22} className="icon-float" />
                    </div>
                    <div>
                        <div className="stat-value">{projects.length}</div>
                        <div className="stat-label">Total Projects</div>
                    </div>
                </div>

                <div className="card-stat fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-icon" style={{ background: 'rgba(0, 206, 201, 0.1)', color: 'var(--success)' }}>
                        <Eye size={22} className="icon-float" />
                    </div>
                    <div>
                        <div className="stat-value">{user?.profileViews || 0}</div>
                        <div className="stat-label">Profile Views</div>
                    </div>
                </div>

                <div className="card-stat fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-icon" style={{ background: 'rgba(253, 203, 110, 0.1)', color: 'var(--warning)' }}>
                        <TrendingUp size={22} className="icon-float" />
                    </div>
                    <div>
                        <div className="stat-value">{featuredCount}</div>
                        <div className="stat-label">Featured</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card dash-quick-actions fade-in-up" style={{ animationDelay: '0.15s', marginBottom: 24 }}>
                <h3 className="dash-section-title">
                    <Sparkles size={16} className="icon-sparkle" />
                    Quick Actions
                </h3>
                <div className="dash-actions-grid">
                    <Link to="/dashboard/projects/new" className="dash-action-item">
                        <div className="dash-action-icon">
                            <Plus size={18} />
                        </div>
                        <span>Add Project</span>
                    </Link>
                    <Link to="/dashboard/settings" className="dash-action-item">
                        <div className="dash-action-icon">
                            <Settings size={18} />
                        </div>
                        <span>Edit Profile</span>
                    </Link>
                    <Link to="/dashboard/background" className="dash-action-item">
                        <div className="dash-action-icon">
                            <Palette size={18} />
                        </div>
                        <span>Background</span>
                    </Link>
                    <a
                        href={`/${user?.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dash-action-item"
                    >
                        <div className="dash-action-icon">
                            <ExternalLink size={18} />
                        </div>
                        <span>View Portfolio</span>
                    </a>
                </div>
            </div>

            {/* Recent Projects */}
            <div className="card fade-in-up" style={{ animationDelay: '0.25s' }}>
                <div className="dash-section-header">
                    <h3 className="dash-section-title">
                        <Clock size={16} className="icon-spin-slow" />
                        Recent Projects
                    </h3>
                    {projects.length > 0 && (
                        <Link to="/dashboard/projects" className="dash-view-all">
                            View All
                            <ArrowRight size={14} />
                        </Link>
                    )}
                </div>

                {projects.length > 0 ? (
                    <div className="dash-project-list">
                        {projects.slice(0, 5).map((project, i) => (
                            <Link
                                key={project._id}
                                to={`/dashboard/projects/${project._id}`}
                                className="dash-project-row fade-in-up"
                                style={{ animationDelay: `${0.3 + i * 0.05}s` }}
                            >
                                <div className="dash-project-left">
                                    <FolderKanban size={15} className="dash-project-icon" />
                                    <span className="dash-project-name">{project.title}</span>
                                    {project.featured && (
                                        <span className="dash-featured-badge">
                                            <Sparkles size={10} />
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <div className="dash-project-right">
                                    {project.technologies?.slice(0, 3).map((tech, idx) => {
                                        const info = getTechInfo(tech);
                                        const isDark = info.color === '#000000' || info.color === '#1a1a2e';
                                        return (
                                            <span
                                                key={idx}
                                                className="dash-tech-pill"
                                                style={{
                                                    background: isDark ? 'rgba(255, 255, 255, 0.05)' : info.color + '15',
                                                    color: isDark ? 'var(--text-secondary)' : info.color,
                                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : info.color + '30'
                                                }}
                                            >
                                                {tech}
                                            </span>
                                        );
                                    })}
                                    <ArrowRight size={13} className="dash-project-arrow" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FolderKanban size={40} className="icon-float" />
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
