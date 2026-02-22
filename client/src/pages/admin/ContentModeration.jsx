import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { FileSearch, Trash2, Ban, Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export default function ContentModeration() {
    const { adminFetch, isSuperAdmin } = useAdminAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const fetchContent = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 15 });
            if (search) params.append('search', search);
            const data = await adminFetch(`/content?${params}`);
            setProjects(data.projects);
            setPagination(data.pagination);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchContent(); }, [page, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const handleRemove = async (id, title) => {
        if (!confirm(`Remove project "${title}"? This cannot be undone.`)) return;
        try {
            await adminFetch(`/content/${id}`, { method: 'DELETE' });
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) { alert(err.message); }
    };

    const handleBan = async (userId, username) => {
        if (!confirm(`Ban @${username}? This will deactivate their account and DELETE ALL their projects permanently.`)) return;
        try {
            const result = await adminFetch(`/users/${userId}/ban`, { method: 'PUT' });
            alert(result.message);
            fetchContent();
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Content Moderation</h1>
                <p>Review all user-uploaded projects — remove suspicious content or ban users</p>
            </div>

            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(108,92,231,0.15)', color: '#6c5ce7' }}><FileSearch size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{pagination.total || 0}</span><span className="admin-stat-label">Total Projects</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(0,206,209,0.15)', color: '#00ced1' }}><FileSearch size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{projects.length}</span><span className="admin-stat-label">Showing</span></div>
                </div>
            </div>

            <div className="admin-toolbar">
                <form className="admin-search-form" onSubmit={handleSearch}>
                    <Search size={16} style={{ color: 'var(--text-muted)' }} />
                    <input placeholder="Search projects by title or description..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    <button type="submit">Search</button>
                </form>
            </div>

            {loading ? (
                <div className="admin-page-loading">Loading content...</div>
            ) : projects.length === 0 ? (
                <div className="admin-section" style={{ textAlign: 'center', padding: 40 }}>
                    <p style={{ color: 'var(--text-muted)' }}>No projects found</p>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Owner</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div>
                                            <strong style={{ color: 'var(--text-primary)' }}>{p.title}</strong>
                                            {p.description && (
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '2px 0 0', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {p.description}
                                                </p>
                                            )}
                                            {p.technologies?.length > 0 && (
                                                <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                                                    {p.technologies.slice(0, 3).map((t, i) => (
                                                        <span key={i} style={{ background: 'rgba(108,92,231,0.12)', color: '#a29bfe', padding: '1px 6px', borderRadius: 4, fontSize: '0.7rem' }}>{t}</span>
                                                    ))}
                                                    {p.technologies.length > 3 && <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>+{p.technologies.length - 3}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {p.owner ? (
                                            <div>
                                                <span style={{ color: 'var(--text-primary)' }}>@{p.owner.username}</span>
                                                {!p.owner.isActive && <span className="admin-badge inactive" style={{ marginLeft: 6 }}>banned</span>}
                                            </div>
                                        ) : <span style={{ color: 'var(--text-muted)' }}>Unknown</span>}
                                    </td>
                                    <td><span className={`admin-badge ${p.status}`}>{p.status}</span></td>
                                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="admin-action-btns">
                                            {p.liveUrl && (
                                                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="admin-action-btn" title="View Live">
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                            <button className="admin-action-btn danger" onClick={() => handleRemove(p.id, p.title)} title="Remove project">
                                                <Trash2 size={14} /> Remove
                                            </button>
                                            {isSuperAdmin && p.owner && p.owner.isActive && (
                                                <button className="admin-action-btn danger" onClick={() => handleBan(p.owner.id, p.owner.username)} title="Ban user + remove all content">
                                                    <Ban size={14} /> Ban User
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {pagination.pages > 1 && (
                <div className="admin-pagination">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /> Prev</button>
                    <span>Page {page} of {pagination.pages}</span>
                    <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next <ChevronRight size={16} /></button>
                </div>
            )}
        </div>
    );
}
