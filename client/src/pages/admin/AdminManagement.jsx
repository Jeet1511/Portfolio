import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { UserPlus, Trash2, Edit, X, Check, ShieldCheck, Shield } from 'lucide-react';

export default function AdminManagement() {
    const { adminFetch, isSuperAdmin, admin: currentAdmin } = useAdminAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ email: '', password: '', displayName: '' });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ displayName: '', email: '' });

    const fetchAdmins = async () => {
        try {
            const data = await adminFetch('/admins');
            setAdmins(data.admins);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAdmins(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await adminFetch('/admins', { method: 'POST', body: JSON.stringify(newAdmin) });
            setNewAdmin({ email: '', password: '', displayName: '' });
            setShowAddForm(false);
            fetchAdmins();
        } catch (err) { alert(err.message); }
    };

    const handleUpdate = async (id) => {
        try {
            await adminFetch(`/admins/${id}`, { method: 'PUT', body: JSON.stringify(editData) });
            setEditingId(null);
            fetchAdmins();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Remove admin "${name}"?`)) return;
        try {
            await adminFetch(`/admins/${id}`, { method: 'DELETE' });
            fetchAdmins();
        } catch (err) { alert(err.message); }
    };

    const startEdit = (a) => {
        setEditingId(a._id);
        setEditData({ displayName: a.displayName, email: a.email });
    };

    if (loading) return <div className="admin-page-loading">Loading admins...</div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Admin Management</h1>
                <p>Manage administrator accounts</p>
                {isSuperAdmin && (
                    <button className="admin-primary-btn" onClick={() => setShowAddForm(!showAddForm)}>
                        <UserPlus size={16} /> Add Admin
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="admin-section">
                    <h2>New Admin Account</h2>
                    <form onSubmit={handleAdd} className="admin-inline-form">
                        <input placeholder="Display Name" value={newAdmin.displayName} onChange={(e) => setNewAdmin({ ...newAdmin, displayName: e.target.value })} required />
                        <input type="email" placeholder="Email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                        <input type="password" placeholder="Password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                        <button type="submit" className="admin-primary-btn">Create</button>
                        <button type="button" className="admin-secondary-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                    </form>
                </div>
            )}

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((a) => (
                            <tr key={a._id}>
                                <td>
                                    {editingId === a._id ? (
                                        <input value={editData.displayName} onChange={(e) => setEditData({ ...editData, displayName: e.target.value })} className="admin-inline-input" />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {a.role === 'super_admin' ? <ShieldCheck size={16} style={{ color: '#fdcb6e' }} /> : <Shield size={16} />}
                                            {a.displayName}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {editingId === a._id ? (
                                        <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="admin-inline-input" />
                                    ) : a.email}
                                </td>
                                <td><span className={`admin-badge ${a.role === 'super_admin' ? 'super' : 'normal'}`}>{a.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span></td>
                                <td>{a.lastLogin ? new Date(a.lastLogin).toLocaleString() : 'Never'}</td>
                                <td>
                                    <div className="admin-action-btns">
                                        {editingId === a._id ? (
                                            <>
                                                <button onClick={() => handleUpdate(a._id)} className="admin-action-btn"><Check size={16} className="text-success" /></button>
                                                <button onClick={() => setEditingId(null)} className="admin-action-btn"><X size={16} /></button>
                                            </>
                                        ) : (
                                            <>
                                                {(isSuperAdmin || currentAdmin?.id === a._id) && (
                                                    <button onClick={() => startEdit(a)} className="admin-action-btn"><Edit size={16} /></button>
                                                )}
                                                {isSuperAdmin && a.role !== 'super_admin' && (
                                                    <button onClick={() => handleDelete(a._id, a.displayName)} className="admin-action-btn danger"><Trash2 size={16} /></button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
