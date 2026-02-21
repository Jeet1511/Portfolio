import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, AlertCircle, CheckCircle, Check } from 'lucide-react';
import { backgroundList } from '../../components/backgrounds';

const previewRenderers = {
    orbs: (
        <div className="bg-preview-scene bg-preview-orbs">
            <div className="preview-orb preview-orb-1" />
            <div className="preview-orb preview-orb-2" />
            <div className="preview-orb preview-orb-3" />
            <div className="preview-grid-overlay" />
            <div className="preview-particle" style={{ left: '20%', top: '30%', animationDelay: '0s' }} />
            <div className="preview-particle" style={{ left: '60%', top: '60%', animationDelay: '1s' }} />
            <div className="preview-particle" style={{ left: '80%', top: '25%', animationDelay: '2s' }} />
        </div>
    ),
    waves: (
        <div className="bg-preview-scene bg-preview-waves">
            <div className="preview-wave preview-wave-1" />
            <div className="preview-wave preview-wave-2" />
            <div className="preview-wave preview-wave-3" />
            <div className="preview-aurora-glow" />
        </div>
    ),
    matrix: (
        <div className="bg-preview-scene bg-preview-matrix">
            {Array.from({ length: 12 }, (_, i) => (
                <div
                    key={i}
                    className="preview-matrix-col"
                    style={{
                        left: `${8 + i * 8}%`,
                        animationDelay: `${i * 0.3}s`,
                        height: `${40 + Math.random() * 50}%`,
                    }}
                />
            ))}
        </div>
    ),
    constellation: (
        <div className="bg-preview-scene bg-preview-constellation">
            {Array.from({ length: 15 }, (_, i) => (
                <div
                    key={i}
                    className="preview-star"
                    style={{
                        left: `${5 + Math.random() * 90}%`,
                        top: `${5 + Math.random() * 90}%`,
                        animationDelay: `${i * 0.4}s`,
                        width: `${2 + Math.random() * 3}px`,
                        height: `${2 + Math.random() * 3}px`,
                    }}
                />
            ))}
            <svg className="preview-constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="15" y1="20" x2="45" y2="35" stroke="rgba(108,92,231,0.15)" strokeWidth="0.3" />
                <line x1="45" y1="35" x2="70" y2="25" stroke="rgba(108,92,231,0.12)" strokeWidth="0.3" />
                <line x1="70" y1="25" x2="85" y2="55" stroke="rgba(108,92,231,0.1)" strokeWidth="0.3" />
                <line x1="30" y1="60" x2="55" y2="70" stroke="rgba(108,92,231,0.12)" strokeWidth="0.3" />
                <line x1="45" y1="35" x2="30" y2="60" stroke="rgba(108,92,231,0.08)" strokeWidth="0.3" />
            </svg>
        </div>
    ),
    gradientMesh: (
        <div className="bg-preview-scene bg-preview-gradient-mesh">
            <div className="preview-mesh-blob preview-mesh-blob-1" />
            <div className="preview-mesh-blob preview-mesh-blob-2" />
            <div className="preview-mesh-blob preview-mesh-blob-3" />
        </div>
    ),
    neonGrid: (
        <div className="bg-preview-scene bg-preview-neon-grid">
            {Array.from({ length: 7 }, (_, i) => (
                <div key={`v${i}`} className="preview-neon-line-v" style={{ left: `${14 * (i + 1)}%`, animationDelay: `${i * 0.2}s` }} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
                <div key={`h${i}`} className="preview-neon-line-h" style={{ top: `${20 * (i + 1)}%`, animationDelay: `${i * 0.3}s` }} />
            ))}
            <div className="preview-neon-glow" />
        </div>
    ),
    particleVortex: (
        <div className="bg-preview-scene bg-preview-vortex">
            {Array.from({ length: 12 }, (_, i) => (
                <div
                    key={i}
                    className="preview-vortex-dot"
                    style={{
                        animationDelay: `${i * 0.25}s`,
                        animationDuration: `${3 + Math.random() * 2}s`,
                    }}
                />
            ))}
            <div className="preview-vortex-center" />
        </div>
    ),
    holographic: (
        <div className="bg-preview-scene bg-preview-holographic">
            <div className="preview-holo-band preview-holo-band-1" />
            <div className="preview-holo-band preview-holo-band-2" />
            <div className="preview-holo-band preview-holo-band-3" />
            <div className="preview-holo-scanline" />
        </div>
    ),
    fireflies: (
        <div className="bg-preview-scene bg-preview-fireflies">
            {Array.from({ length: 10 }, (_, i) => (
                <div
                    key={i}
                    className="preview-firefly"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                />
            ))}
        </div>
    ),
    none: (
        <div className="bg-preview-scene bg-preview-none">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No animation</span>
        </div>
    ),
};

export default function Background() {
    const { user, apiFetch, updateUser } = useAuth();
    const [selected, setSelected] = useState(user?.backgroundStyle || 'orbs');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const data = await apiFetch('/users/profile/update', {
                method: 'PUT',
                body: JSON.stringify({ backgroundStyle: selected }),
            });
            updateUser(data.user);
            setMessage({ type: 'success', text: 'Background saved successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to save background' });
        }
        setSaving(false);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Portfolio Background</h1>
                <p className="page-subtitle">Choose an animated background for your public portfolio</p>
            </div>

            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                </div>
            )}

            <div className="bg-selector-grid">
                {backgroundList.map((bg) => (
                    <div
                        key={bg.id}
                        className={`bg-selector-card ${selected === bg.id ? 'bg-selected' : ''}`}
                        onClick={() => setSelected(bg.id)}
                    >
                        {previewRenderers[bg.id]}
                        <div className="bg-selector-info">
                            <div className="bg-selector-name">
                                {bg.name}
                                {selected === bg.id && <Check size={16} className="bg-check-icon" />}
                            </div>
                            <p className="bg-selector-desc">{bg.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 24 }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Background'}
                </button>
            </div>
        </div>
    );
}
