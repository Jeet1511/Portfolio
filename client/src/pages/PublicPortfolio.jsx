import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTechInfo } from '../data/techStack';
import {
    Github,
    Linkedin,
    Twitter,
    Globe,
    Instagram,
    ExternalLink,
    FolderKanban,
    Code2,
    Star,
    UserX,
    Link as LinkIcon,
    X,
    Calendar,
    Mail,
} from 'lucide-react';

export default function PublicPortfolio() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const userRes = await fetch(`/api/users/${username}`);
                if (!userRes.ok) {
                    setError('Portfolio not found');
                    setLoading(false);
                    return;
                }
                const userData = await userRes.json();
                setUser(userData.user);

                const projRes = await fetch(`/api/users/${username}/projects`);
                if (projRes.ok) {
                    const projData = await projRes.json();
                    setProjects(projData.projects);
                }
            } catch (err) {
                setError('Failed to load portfolio');
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [username]);

    const openProject = (project) => {
        setSelectedProject(project);
        setIsClosing(false);
        document.body.style.overflow = 'hidden';
    };

    const closeProject = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedProject(null);
            setIsClosing(false);
            document.body.style.overflow = '';
        }, 300);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && selectedProject) {
                closeProject();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedProject, closeProject]);

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="not-found-page">
                <div>
                    <UserX size={64} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
                    <h2>Portfolio Not Found</h2>
                    <p>The user @{username} does not exist or has been deactivated.</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const socialIcons = {
        github: Github,
        linkedin: Linkedin,
        twitter: Twitter,
        website: Globe,
        instagram: Instagram,
        email: Mail,
    };

    const socialLabels = {
        github: 'GitHub',
        linkedin: 'LinkedIn',
        twitter: 'Twitter',
        website: 'Website',
        instagram: 'Instagram',
        email: 'Email',
    };

    const activeSocials = user.socialLinks
        ? Object.entries(user.socialLinks).filter(([_, url]) => url)
        : [];

    const customLinks = user.customSocialLinks?.filter(l => l.label && l.url) || [];

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            {/* Background Animations */}
            <div className="portfolio-bg-container">
                <div className="portfolio-bg-orb" />
                <div className="portfolio-bg-orb" />
                <div className="portfolio-bg-orb" />
                <div className="portfolio-bg-orb" />
                <div className="portfolio-bg-grid" />
                <div className="portfolio-bg-particles">
                    <div className="portfolio-bg-particle" />
                    <div className="portfolio-bg-particle" />
                    <div className="portfolio-bg-particle" />
                    <div className="portfolio-bg-particle" />
                    <div className="portfolio-bg-particle" />
                    <div className="portfolio-bg-particle" />
                    <div className="portfolio-bg-particle" />
                    <div className="portfolio-bg-particle" />
                </div>
            </div>

            <div className="portfolio-page">
                {/* Profile Header */}
                <div className="portfolio-header fade-in-up">
                    <div className="portfolio-avatar">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.displayName}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            user.displayName?.charAt(0).toUpperCase()
                        )}
                    </div>

                    <h1 className="portfolio-name">{user.displayName}</h1>
                    <p className="portfolio-username">@{user.username}</p>

                    {user.bio && <p className="portfolio-bio">{user.bio}</p>}

                    {user.skills && user.skills.length > 0 && (
                        <div className="portfolio-skills">
                            {user.skills.map((skill, i) => (
                                <span key={i} className="badge badge-primary">{skill}</span>
                            ))}
                        </div>
                    )}

                    {(activeSocials.length > 0 || customLinks.length > 0) && (
                        <div className="portfolio-social">
                            {activeSocials.map(([platform, url]) => {
                                const Icon = socialIcons[platform] || Globe;
                                const href = platform === 'email'
                                    ? `mailto:${url}`
                                    : (url.startsWith('http') ? url : `https://${url}`);
                                return (
                                    <a
                                        key={platform}
                                        href={href}
                                        target={platform === 'email' ? '_self' : '_blank'}
                                        rel="noopener noreferrer"
                                        title={socialLabels[platform] || platform}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                            {customLinks.map((link, i) => (
                                <a
                                    key={`custom-${i}`}
                                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={link.label}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 6,
                                        width: 'auto',
                                        padding: '0 14px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {link.icon && link.icon.startsWith('data:image/svg') ? (
                                        <img
                                            src={link.icon}
                                            alt=""
                                            style={{ width: 14, height: 14, filter: 'brightness(0) invert(1)' }}
                                        />
                                    ) : (
                                        <LinkIcon size={14} />
                                    )}
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Projects */}
                <div className="portfolio-projects">
                    <div className="portfolio-section-title">
                        <FolderKanban size={20} />
                        Projects ({projects.length})
                    </div>

                    {projects.length > 0 ? (
                        <div className="projects-grid">
                            {projects.map((project, index) => (
                                <div
                                    key={project._id}
                                    className="project-card fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    onClick={() => openProject(project)}
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
                                        <h3 className="project-title">{project.title}</h3>
                                        {project.description && (
                                            <p className="project-description">{project.description}</p>
                                        )}

                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="project-tech">
                                                {project.technologies.slice(0, 4).map((tech, i) => {
                                                    const info = getTechInfo(tech);
                                                    return (
                                                        <span
                                                            key={i}
                                                            className="tech-badge"
                                                            style={{ background: info.color, color: info.textColor, fontSize: '0.7rem', padding: '3px 8px' }}
                                                        >
                                                            {info.name}
                                                        </span>
                                                    );
                                                })}
                                                {project.technologies.length > 4 && (
                                                    <span className="project-tech-tag">+{project.technologies.length - 4}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <FolderKanban size={48} />
                            <h3>No Projects Yet</h3>
                            <p>This user has not added any projects to their portfolio.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Project Detail Overlay */}
            {selectedProject && (
                <div
                    className={`project-detail-overlay ${isClosing ? 'closing' : ''}`}
                    onClick={closeProject}
                >
                    <div
                        className="project-detail-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="project-detail-close" onClick={closeProject}>
                            <X size={18} />
                        </button>

                        <div className="project-detail-image">
                            {selectedProject.image ? (
                                <img src={selectedProject.image} alt={selectedProject.title} />
                            ) : (
                                <Code2 size={60} className="placeholder-icon" />
                            )}
                            {selectedProject.featured && (
                                <div className="project-featured-badge" style={{ top: 20, right: 60 }}>
                                    <Star size={12} style={{ marginRight: 4 }} />
                                    Featured
                                </div>
                            )}
                        </div>

                        <div className="project-detail-body">
                            <h3 className="project-title">{selectedProject.title}</h3>

                            <div className="project-detail-meta">
                                {selectedProject.createdAt && (
                                    <span className="project-detail-meta-item">
                                        <Calendar size={14} />
                                        {formatDate(selectedProject.createdAt)}
                                    </span>
                                )}
                                {selectedProject.status && (
                                    <span className="project-detail-meta-item">
                                        <span
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                background: selectedProject.status === 'active' ? 'var(--success)' : 'var(--text-muted)',
                                                display: 'inline-block',
                                            }}
                                        />
                                        {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                                    </span>
                                )}
                            </div>

                            {selectedProject.description && (
                                <p className="project-description">{selectedProject.description}</p>
                            )}

                            {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                                <div className="project-tech">
                                    {selectedProject.technologies.map((tech, i) => {
                                        const info = getTechInfo(tech);
                                        return (
                                            <span
                                                key={i}
                                                className="tech-badge"
                                                style={{ background: info.color, color: info.textColor }}
                                            >
                                                {info.name}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="project-actions">
                                {selectedProject.liveUrl && (
                                    <a
                                        href={selectedProject.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        <ExternalLink size={16} />
                                        Live Demo
                                    </a>
                                )}
                                {selectedProject.githubUrl && (
                                    <a
                                        href={selectedProject.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary"
                                    >
                                        <Github size={16} />
                                        View Source
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
