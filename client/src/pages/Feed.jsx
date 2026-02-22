import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Search, Heart, Eye, Layers, TrendingUp, Clock, Star,
    ChevronLeft, ChevronRight, Sparkles, User as UserIcon,
} from 'lucide-react';

const SORT_OPTIONS = [
    { key: 'likes', label: 'Top Rated', icon: TrendingUp },
    { key: 'views', label: 'Most Viewed', icon: Eye },
    { key: 'newest', label: 'Newest', icon: Clock },
];

export default function Feed() {
    const { user, apiFetch } = useAuth();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('likes');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [likedUsers, setLikedUsers] = useState(new Set());
    const [likeAnimating, setLikeAnimating] = useState(null);

    const fetchFeed = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 12, search, sort });
            const data = await apiFetch(`/users/discover?${params}`);
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (err) {
            console.error('Feed error:', err);
        } finally {
            setLoading(false);
        }
    }, [page, sort, apiFetch]);

    useEffect(() => { fetchFeed(); }, [fetchFeed]);

    // Search with debounce
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchFeed();
    };

    const handleLike = async (userId) => {
        try {
            setLikeAnimating(userId);
            const data = await apiFetch(`/users/${userId}/like`, { method: 'POST' });

            // Update local state
            setLikedUsers(prev => {
                const newSet = new Set(prev);
                if (data.liked) newSet.add(userId);
                else newSet.delete(userId);
                return newSet;
            });

            // Update like count in users list
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, likeCount: data.likeCount } : u
            ));

            setTimeout(() => setLikeAnimating(null), 600);
        } catch (err) {
            console.error('Like error:', err);
            setLikeAnimating(null);
        }
    };

    const getInitials = (name) => {
        return (name || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="feed-container">
            {/* Feed Header */}
            <div className="feed-header">
                <div className="feed-header-content">
                    <div className="feed-header-text">
                        <h1 className="feed-title">
                            <Sparkles size={24} className="feed-title-icon" />
                            Discover
                        </h1>
                        <p className="feed-subtitle">
                            Explore portfolios from talented developers. Like, discover, and get inspired.
                        </p>
                    </div>
                </div>

                {/* Search */}
                <form className="feed-search" onSubmit={handleSearch}>
                    <Search size={18} className="feed-search-icon" />
                    <input
                        type="text"
                        className="feed-search-input"
                        placeholder="Search by name, username, skills..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="feed-search-btn">Search</button>
                </form>

                {/* Sort Tabs */}
                <div className="feed-sort-tabs">
                    {SORT_OPTIONS.map(opt => (
                        <button
                            key={opt.key}
                            className={`feed-sort-tab ${sort === opt.key ? 'active' : ''}`}
                            onClick={() => { setSort(opt.key); setPage(1); }}
                        >
                            <opt.icon size={15} />
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Cards Grid */}
            {loading ? (
                <div className="feed-loading">
                    <div className="loading-spinner" />
                    <p>Discovering amazing portfolios...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="feed-empty">
                    <UserIcon size={48} />
                    <h3>No portfolios found</h3>
                    <p>Try adjusting your search or check back later!</p>
                </div>
            ) : (
                <>
                    <div className="feed-grid">
                        {users.map((u, index) => {
                            const isOwn = user?.id === u.id;
                            const isLiked = likedUsers.has(u.id);

                            return (
                                <div
                                    className="feed-card"
                                    key={u.id}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Rank badge for top 3 */}
                                    {sort === 'likes' && page === 1 && index < 3 && (
                                        <div className={`feed-rank-badge rank-${index + 1}`}>
                                            <Star size={12} />
                                            #{index + 1}
                                        </div>
                                    )}

                                    <Link to={`/${u.username}`} className="feed-card-link">
                                        {/* Avatar */}
                                        <div className="feed-card-avatar">
                                            {u.avatar ? (
                                                <img src={u.avatar} alt={u.displayName} />
                                            ) : (
                                                <div className="feed-card-avatar-placeholder">
                                                    {getInitials(u.displayName)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="feed-card-info">
                                            <h3 className="feed-card-name">{u.displayName}</h3>
                                            <p className="feed-card-username">@{u.username}</p>
                                            {u.bio && (
                                                <p className="feed-card-bio">
                                                    {u.bio.length > 80 ? u.bio.substring(0, 80) + '...' : u.bio}
                                                </p>
                                            )}
                                        </div>

                                        {/* Skills */}
                                        {u.skills?.length > 0 && (
                                            <div className="feed-card-skills">
                                                {u.skills.slice(0, 4).map((s, i) => (
                                                    <span key={i} className="feed-skill-tag">{s}</span>
                                                ))}
                                                {u.skills.length > 4 && (
                                                    <span className="feed-skill-tag feed-skill-more">+{u.skills.length - 4}</span>
                                                )}
                                            </div>
                                        )}
                                    </Link>

                                    {/* Stats & Like */}
                                    <div className="feed-card-footer">
                                        <div className="feed-card-stats">
                                            <span className="feed-stat">
                                                <Layers size={14} />
                                                {u.projectCount} project{u.projectCount !== 1 ? 's' : ''}
                                            </span>
                                            <span className="feed-stat">
                                                <Eye size={14} />
                                                {u.profileViews} view{u.profileViews !== 1 ? 's' : ''}
                                            </span>
                                        </div>

                                        {!isOwn && (
                                            <button
                                                className={`feed-like-btn ${isLiked ? 'liked' : ''} ${likeAnimating === u.id ? 'animating' : ''}`}
                                                onClick={() => handleLike(u.id)}
                                            >
                                                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                                                <span>{u.likeCount || 0}</span>
                                            </button>
                                        )}
                                        {isOwn && (
                                            <span className="feed-own-badge">You</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="feed-pagination">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="feed-page-btn"
                            >
                                <ChevronLeft size={16} /> Prev
                            </button>
                            <span className="feed-page-info">
                                Page {page} of {pagination.pages} ({pagination.total} users)
                            </span>
                            <button
                                disabled={page >= pagination.pages}
                                onClick={() => setPage(p => p + 1)}
                                className="feed-page-btn"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
