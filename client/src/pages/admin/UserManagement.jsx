import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Users,
    Search,
    Trash2,
    Shield,
    ShieldOff,
    UserX,
    UserCheck,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
} from 'lucide-react';

export default function UserManagement() {
    const { apiFetch } = useAuth();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionUser, setActionUser] = useState(null);
    const [actionType, setActionType] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchUsers = async (page = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 15 });
            if (searchQuery) params.set('search', searchQuery);

            const data = await apiFetch(`/admin/users?${params}`);
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [apiFetch]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1, search);
    };

    const handleToggleRole = async (user) => {
        setProcessing(true);
        try {
            const newRole = user.role === 'admin' ? 'user' : 'admin';
            await apiFetch(`/admin/users/${user._id}/role`, {
                method: 'PUT',
                body: JSON.stringify({ role: newRole }),
            });
            fetchUsers(pagination.page, search);
        } catch (err) {
            console.error('Failed to update role:', err);
        } finally {
            setProcessing(false);
            setActionUser(null);
            setActionType('');
        }
    };

    const handleToggleActive = async (user) => {
        setProcessing(true);
        try {
            await apiFetch(`/admin/users/${user._id}/toggle`, { method: 'PUT' });
            fetchUsers(pagination.page, search);
        } catch (err) {
            console.error('Failed to toggle user:', err);
        } finally {
            setProcessing(false);
            setActionUser(null);
            setActionType('');
        }
    };

    const handleDelete = async () => {
        if (!actionUser) return;
        setProcessing(true);
        try {
            await apiFetch(`/admin/users/${actionUser._id}`, { method: 'DELETE' });
            fetchUsers(pagination.page, search);
        } catch (err) {
            console.error('Failed to delete user:', err);
        } finally {
            setProcessing(false);
            setActionUser(null);
            setActionType('');
        }
    };

    const confirmAction = (user, type) => {
        setActionUser(user);
        setActionType(type);
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">User Management</h1>
                    <p className="dashboard-subtitle">
                        Manage platform users, roles, and access controls.
                    </p>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                    {pagination.total} Users
                </span>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-24">
                <div className="search-input-wrapper" style={{ maxWidth: 400 }}>
                    <Search size={16} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name, username, or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </form>

            {/* Users Table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Projects</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>
                                    <div className="loading-spinner" style={{ margin: '0 auto' }} />
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u._id}>
                                    <td>
                                        <div className="flex items-center gap-12">
                                            <div
                                                className="navbar-avatar"
                                                style={{ width: 32, height: 32, fontSize: '0.8rem', flexShrink: 0 }}
                                            >
                                                {u.displayName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {u.displayName}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    @{u.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge badge-${u.role === 'admin' ? 'danger' : 'primary'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>{u.projectCount || 0}</td>
                                    <td>
                                        <span className={`badge badge-${u.isActive ? 'success' : 'warning'}`}>
                                            {u.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.82rem' }}>
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
                                            <a
                                                href={`/${u.username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-ghost btn-sm btn-icon"
                                                title="View Portfolio"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                            <button
                                                className="btn btn-ghost btn-sm btn-icon"
                                                onClick={() => confirmAction(u, 'role')}
                                                title={u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                            >
                                                {u.role === 'admin' ? <ShieldOff size={14} /> : <Shield size={14} />}
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-sm btn-icon"
                                                onClick={() => confirmAction(u, 'toggle')}
                                                title={u.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                                            </button>
                                            {u.role !== 'admin' && (
                                                <button
                                                    className="btn btn-danger btn-sm btn-icon"
                                                    onClick={() => confirmAction(u, 'delete')}
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-12 mt-24">
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={pagination.page === 1}
                        onClick={() => fetchUsers(pagination.page - 1, search)}
                    >
                        <ChevronLeft size={14} />
                        Previous
                    </button>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={pagination.page === pagination.pages}
                        onClick={() => fetchUsers(pagination.page + 1, search)}
                    >
                        Next
                        <ChevronRight size={14} />
                    </button>
                </div>
            )}

            {/* Action Confirmation Modal */}
            {actionUser && actionType && (
                <div className="modal-overlay" onClick={() => !processing && setActionUser(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {actionType === 'delete' && 'Delete User'}
                                {actionType === 'role' && 'Change Role'}
                                {actionType === 'toggle' && (actionUser.isActive ? 'Deactivate User' : 'Activate User')}
                            </h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            {actionType === 'delete' && (
                                <>Are you sure you want to permanently delete <strong>{actionUser.displayName}</strong> (@{actionUser.username}) and all their projects? This action cannot be undone.</>
                            )}
                            {actionType === 'role' && (
                                <>Change <strong>{actionUser.displayName}</strong> role from <strong>{actionUser.role}</strong> to <strong>{actionUser.role === 'admin' ? 'user' : 'admin'}</strong>?</>
                            )}
                            {actionType === 'toggle' && (
                                <>Are you sure you want to {actionUser.isActive ? 'deactivate' : 'activate'} <strong>{actionUser.displayName}</strong>?</>
                            )}
                        </p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => { setActionUser(null); setActionType(''); }}
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                className={`btn ${actionType === 'delete' ? 'btn-danger' : 'btn-primary'}`}
                                onClick={() => {
                                    if (actionType === 'delete') handleDelete();
                                    else if (actionType === 'role') handleToggleRole(actionUser);
                                    else if (actionType === 'toggle') handleToggleActive(actionUser);
                                }}
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                ) : (
                                    'Confirm'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
