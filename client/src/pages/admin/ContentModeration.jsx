import { useState } from 'react';
import { FileSearch, Eye, Flag, Check, X } from 'lucide-react';

export default function ContentModeration() {
    const [flaggedItems, setFlaggedItems] = useState([
        { id: 1, type: 'Project', title: 'My Portfolio', owner: 'demo_user', reason: 'Inappropriate content', status: 'pending', reportedAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, type: 'Profile', title: 'Bio text', owner: 'test_user', reason: 'Spam links', status: 'pending', reportedAt: new Date(Date.now() - 86400000).toISOString() },
    ]);

    const handleAction = (id, action) => {
        setFlaggedItems(items =>
            items.map(item => item.id === id ? { ...item, status: action } : item)
        );
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Content Moderation</h1>
                <p>Review flagged content and user reports</p>
            </div>

            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(255,118,117,0.15)', color: '#ff7675' }}><Flag size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{flaggedItems.filter(i => i.status === 'pending').length}</span><span className="admin-stat-label">Pending Reviews</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(0,184,148,0.15)', color: '#00b894' }}><Check size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{flaggedItems.filter(i => i.status === 'approved').length}</span><span className="admin-stat-label">Approved</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(225,112,85,0.15)', color: '#e17055' }}><X size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{flaggedItems.filter(i => i.status === 'rejected').length}</span><span className="admin-stat-label">Removed</span></div>
                </div>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr><th>Type</th><th>Content</th><th>Owner</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {flaggedItems.map((item) => (
                            <tr key={item.id}>
                                <td><span className={`admin-badge ${item.type.toLowerCase()}`}>{item.type}</span></td>
                                <td>{item.title}</td><td>@{item.owner}</td><td>{item.reason}</td>
                                <td><span className={`admin-badge ${item.status}`}>{item.status}</span></td>
                                <td>
                                    {item.status === 'pending' && (
                                        <div className="admin-action-btns">
                                            <button className="admin-action-btn" onClick={() => handleAction(item.id, 'approved')} title="Approve"><Check size={16} className="text-success" /></button>
                                            <button className="admin-action-btn danger" onClick={() => handleAction(item.id, 'rejected')} title="Remove"><X size={16} /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
