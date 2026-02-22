import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Search, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, Ban } from 'lucide-react';

export default function UserManagement() {
    const { adminFetch, isSuperAdmin } = useAdminAuth();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 15, search, status: statusFilter });
            const data = await adminFetch(`/users?${params}`);
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [page, statusFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleToggle = async (userId) => {
        try {
            await adminFetch(`/users/${userId}/toggle`, { method: 'PUT' });
            fetchUsers();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (userId, name) => {
        if (!isSuperAdmin) return alert('Only Super Admin can delete users');
        if (!confirm(`Delete user "${name}"? This will also delete all their projects.`)) return;
        try {
            await adminFetch(`/users/${userId}`, { method: 'DELETE' });
            fetchUsers();
        } catch (err) { alert(err.message); }
    };

    const handleBan = async (userId, username) => {
        if (!isSuperAdmin) return alert('Only Super Admin can ban users');
        if (!confirm(`Ban @${username}? This will deactivate their account AND delete ALL their projects permanently.`)) return;
        try {
            const result = await adminFetch(`/users/${userId}/ban`, { method: 'PUT' });
            alert(result.message);
            fetchUsers();
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>User Management</h1>
                <p>Manage platform users</p>
            </div>

            <div className="admin-toolbar">
                <form onSubmit={handleSearch} className="admin-search-form">
                    <Search size={16} />
                    <input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button type="submit">Search</button>
                </form>
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive / Banned</option>
                </select>
            </div>

            {loading ? (
                <div className="admin-page-loading">Loading users...</div>
            ) : (
                <>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Projects</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td><strong>@{u.username}</strong><br /><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.displayName}</span></td>
                                        <td>{u.email}</td>
                                        <td>{u.projectCount}</td>
                                        <td><span className={`admin-badge ${u.isActive !== false ? 'active' : 'inactive'}`}>{u.isActive !== false ? 'Active' : 'Banned'}</span></td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="admin-action-btns">
                                                <button onClick={() => handleToggle(u._id)} title={u.isActive !== false ? 'Deactivate' : 'Activate'} className="admin-action-btn">
                                                    {u.isActive !== false ? <ToggleRight size={18} className="text-success" /> : <ToggleLeft size={18} />}
                                                </button>
                                                {isSuperAdmin && u.isActive !== false && (
                                                    <button onClick={() => handleBan(u._id, u.username)} title="Ban user + delete all content" className="admin-action-btn danger">
                                                        <Ban size={16} />
                                                    </button>
                                                )}
                                                {isSuperAdmin && (
                                                    <button onClick={() => handleDelete(u._id, u.displayName)} title="Delete" className="admin-action-btn danger">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination.pages > 1 && (
                        <div className="admin-pagination">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /> Prev</button>
                            <span>Page {page} of {pagination.pages}</span>
                            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next <ChevronRight size={16} /></button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
