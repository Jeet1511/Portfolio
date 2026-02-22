import { useEffect, useRef } from 'react';

export default function QuantumFieldBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let w, h;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Quantum particles
        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random(),
            y: Math.random(),
            baseRadius: 1 + Math.random() * 2.5,
            phase: Math.random() * Math.PI * 2,
            waveSpeed: 0.02 + Math.random() * 0.03,
            waveAmp: 15 + Math.random() * 25,
            driftX: (Math.random() - 0.5) * 0.3,
            driftY: (Math.random() - 0.5) * 0.3,
            hue: Math.random() > 0.5 ? 260 + Math.random() * 30 : 180 + Math.random() * 30,
            entangled: Math.random() > 0.7,
        }));

        // Wave field
        const waveLines = 8;

        function draw(time) {
            const t = time * 0.001;
            ctx.fillStyle = 'rgba(6, 4, 18, 0.08)';
            ctx.fillRect(0, 0, w, h);

            // Draw probability wave field
            ctx.strokeStyle = 'rgba(108, 92, 231, 0.03)';
            ctx.lineWidth = 1;
            for (let i = 0; i < waveLines; i++) {
                const baseY = (h / (waveLines + 1)) * (i + 1);
                ctx.beginPath();
                for (let x = 0; x < w; x += 3) {
                    const y = baseY + Math.sin(x * 0.008 + t * 0.5 + i) * 20 +
                        Math.sin(x * 0.015 + t * 0.8 - i * 0.5) * 10;
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Draw particles with quantum effects
            for (const p of particles) {
                p.phase += p.waveSpeed;
                const px = (p.x * w) + Math.sin(p.phase) * p.waveAmp;
                const py = (p.y * h) + Math.cos(p.phase * 0.7) * p.waveAmp * 0.6;

                // Probability cloud (uncertainty halo)
                const uncertainty = 8 + Math.sin(t * 2 + p.phase) * 4;
                const grad = ctx.createRadialGradient(px, py, 0, px, py, uncertainty);
                grad.addColorStop(0, `hsla(${p.hue}, 70%, 65%, ${0.08 + Math.sin(p.phase) * 0.04})`);
                grad.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(px, py, uncertainty, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                // Core particle
                const pulse = 0.6 + Math.sin(p.phase * 2) * 0.4;
                ctx.beginPath();
                ctx.arc(px, py, p.baseRadius * pulse, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${0.5 + pulse * 0.3})`;
                ctx.fill();

                // Entanglement connections
                if (p.entangled) {
                    for (const q of particles) {
                        if (q === p || !q.entangled) continue;
                        const qx = (q.x * w) + Math.sin(q.phase) * q.waveAmp;
                        const qy = (q.y * h) + Math.cos(q.phase * 0.7) * q.waveAmp * 0.6;
                        const dist = Math.hypot(px - qx, py - qy);
                        if (dist < 150) {
                            const alpha = (1 - dist / 150) * 0.08 * Math.abs(Math.sin(t + p.phase));
                            ctx.beginPath();
                            ctx.moveTo(px, py);
                            ctx.lineTo(qx, qy);
                            ctx.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 60%, 60%, ${alpha})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }

                // Drift
                p.x += p.driftX * 0.0001;
                p.y += p.driftY * 0.0001;
                if (p.x < -0.1) p.x = 1.1;
                if (p.x > 1.1) p.x = -0.1;
                if (p.y < -0.1) p.y = 1.1;
                if (p.y > 1.1) p.y = -0.1;
            }

            animId = requestAnimationFrame(draw);
        }

        draw(0);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return (
        <div className="portfolio-bg-container">
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#060412' }} />
        </div>
    );
}
