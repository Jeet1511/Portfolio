import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
} from 'lucide-react';

export default function PublicPortfolio() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
    };

    const socialLabels = {
        github: 'GitHub',
        linkedin: 'LinkedIn',
        twitter: 'Twitter',
        website: 'Website',
        instagram: 'Instagram',
    };

    const activeSocials = user.socialLinks
        ? Object.entries(user.socialLinks).filter(([_, url]) => url)
        : [];

    const customLinks = user.customSocialLinks?.filter(l => l.label && l.url) || [];

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
                                return (
                                    <a
                                        key={platform}
                                        href={url.startsWith('http') ? url : `https://${url}`}
                                        target="_blank"
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
                                    <LinkIcon size={14} />
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
                                                {project.technologies.map((tech, i) => (
                                                    <span key={i} className="project-tech-tag">{tech}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="project-actions">
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <ExternalLink size={14} />
                                                    Live Demo
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    <Github size={14} />
                                                    Source
                                                </a>
                                            )}
                                        </div>
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
        </>
    );
}
