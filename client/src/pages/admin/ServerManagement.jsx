import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Server, Cpu, HardDrive, Clock, Database, Wifi } from 'lucide-react';

function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
}

export default function ServerManagement() {
    const { adminFetch } = useAdminAuth();
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchInfo = async () => {
        try {
            const data = await adminFetch('/server-info');
            setInfo(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchInfo(); const id = setInterval(fetchInfo, 10000); return () => clearInterval(id); }, []);

    if (loading) return <div className="admin-page-loading">Loading server info...</div>;

    const memPercent = info ? Math.round((1 - info.freeMemory / info.totalMemory) * 100) : 0;
    const heapPercent = info ? Math.round((info.heapUsed / info.heapTotal) * 100) : 0;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Server Management</h1>
                <p>Monitor server health and performance</p>
            </div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(0,206,209,0.15)', color: '#00ced1' }}><Clock size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{info ? formatUptime(info.uptime) : '-'}</span><span className="admin-stat-label">Uptime</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(108,92,231,0.15)', color: '#6c5ce7' }}><Cpu size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{info?.cpus || 0} cores</span><span className="admin-stat-label">CPU</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(253,203,110,0.15)', color: '#fdcb6e' }}><HardDrive size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{memPercent}%</span><span className="admin-stat-label">Memory Used</span></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(0,184,148,0.15)', color: '#00b894' }}><Database size={24} /></div>
                    <div className="admin-stat-info"><span className="admin-stat-value">{info ? formatBytes(info.heapUsed) : '-'}</span><span className="admin-stat-label">Heap Used ({heapPercent}%)</span></div>
                </div>
            </div>

            <div className="admin-section">
                <h2>System Details</h2>
                <div className="admin-info-grid">
                    <div className="admin-info-item"><span>Hostname</span><strong>{info?.hostname}</strong></div>
                    <div className="admin-info-item"><span>Platform</span><strong>{info?.platform} ({info?.arch})</strong></div>
                    <div className="admin-info-item"><span>Node.js</span><strong>{info?.nodeVersion}</strong></div>
                    <div className="admin-info-item"><span>Environment</span><strong>{info?.env}</strong></div>
                    <div className="admin-info-item"><span>Total Memory</span><strong>{info ? formatBytes(info.totalMemory) : '-'}</strong></div>
                    <div className="admin-info-item"><span>Free Memory</span><strong>{info ? formatBytes(info.freeMemory) : '-'}</strong></div>
                    <div className="admin-info-item"><span>Heap Total</span><strong>{info ? formatBytes(info.heapTotal) : '-'}</strong></div>
                    <div className="admin-info-item"><span>RSS</span><strong>{info ? formatBytes(info.rss) : '-'}</strong></div>
                </div>
            </div>

            <div className="admin-section">
                <h2>Memory Usage</h2>
                <div className="admin-progress-bar">
                    <div className="admin-progress-fill" style={{ width: `${memPercent}%` }}>{memPercent}%</div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>
                    {info ? formatBytes(info.totalMemory - info.freeMemory) : '-'} used of {info ? formatBytes(info.totalMemory) : '-'} total
                </p>
            </div>
        </div>
    );
}
