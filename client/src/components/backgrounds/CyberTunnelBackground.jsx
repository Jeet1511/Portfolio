import { useEffect, useRef } from 'react';

export default function CyberTunnelBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const ringCount = 24;
        let time = 0;

        // Data streams
        const streams = Array.from({ length: 40 }, () => ({
            angle: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.03,
            depth: Math.random(),
            depthSpeed: 0.003 + Math.random() * 0.006,
            hue: Math.random() > 0.5 ? 270 : Math.random() > 0.3 ? 180 : 320,
            size: 1 + Math.random() * 2,
        }));

        // Floating hex data particles
        const dataParticles = Array.from({ length: 20 }, () => ({
            angle: Math.random() * Math.PI * 2,
            depth: Math.random(),
            depthSpeed: 0.004 + Math.random() * 0.004,
            char: Math.random().toString(16).substr(2, 4).toUpperCase(),
            hue: 260 + Math.random() * 60,
        }));

        function draw() {
            time += 0.01;

            ctx.fillStyle = 'rgba(5, 3, 12, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const maxR = Math.max(canvas.width, canvas.height) * 0.7;

            // Draw tunnel rings
            for (let i = 0; i < ringCount; i++) {
                const depth = ((i / ringCount) + time * 0.15) % 1;
                const r = depth * maxR;
                const alpha = Math.sin(depth * Math.PI) * 0.15;
                const sides = 6;

                if (alpha <= 0) continue;

                ctx.beginPath();
                for (let s = 0; s <= sides; s++) {
                    const angle = (s / sides) * Math.PI * 2 + time * 0.2;
                    const px = cx + Math.cos(angle) * r;
                    const py = cy + Math.sin(angle) * r * 0.6;
                    if (s === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.strokeStyle = `hsla(270, 70%, 60%, ${alpha})`;
                ctx.lineWidth = 1 + depth * 1.5;
                ctx.stroke();

                // Corner nodes
                for (let s = 0; s < sides; s++) {
                    const angle = (s / sides) * Math.PI * 2 + time * 0.2;
                    const px = cx + Math.cos(angle) * r;
                    const py = cy + Math.sin(angle) * r * 0.6;

                    ctx.beginPath();
                    ctx.arc(px, py, 1.5 + depth * 2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(200, 80%, 70%, ${alpha * 1.5})`;
                    ctx.fill();
                }
            }

            // Center glow
            const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.08);
            centerGlow.addColorStop(0, 'rgba(162, 155, 254, 0.15)');
            centerGlow.addColorStop(0.5, 'rgba(108, 92, 231, 0.05)');
            centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = centerGlow;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw data streams
            for (const s of streams) {
                s.depth += s.depthSpeed;
                if (s.depth > 1) { s.depth = 0; s.angle = Math.random() * Math.PI * 2; }

                const r = s.depth * maxR;
                const x = cx + Math.cos(s.angle + time * 0.1) * r;
                const y = cy + Math.sin(s.angle + time * 0.1) * r * 0.6;
                const alpha = Math.sin(s.depth * Math.PI) * 0.6;

                ctx.beginPath();
                ctx.arc(x, y, s.size * s.depth + 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${alpha})`;
                ctx.fill();

                // Trail
                const trailR = (s.depth - 0.02) * maxR;
                if (trailR > 0) {
                    const tx = cx + Math.cos(s.angle + time * 0.1) * trailR;
                    const ty = cy + Math.sin(s.angle + time * 0.1) * trailR * 0.6;
                    ctx.beginPath();
                    ctx.moveTo(tx, ty);
                    ctx.lineTo(x, y);
                    ctx.strokeStyle = `hsla(${s.hue}, 70%, 60%, ${alpha * 0.3})`;
                    ctx.lineWidth = s.size * 0.5;
                    ctx.stroke();
                }
            }

            // Draw data particles (hex values)
            ctx.font = '10px monospace';
            for (const p of dataParticles) {
                p.depth += p.depthSpeed;
                if (p.depth > 1) {
                    p.depth = 0;
                    p.char = Math.random().toString(16).substr(2, 4).toUpperCase();
                    p.angle = Math.random() * Math.PI * 2;
                }

                const r = p.depth * maxR * 0.6;
                const x = cx + Math.cos(p.angle + time * 0.05) * r;
                const y = cy + Math.sin(p.angle + time * 0.05) * r * 0.6;
                const alpha = Math.sin(p.depth * Math.PI) * 0.4;

                ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${alpha})`;
                ctx.fillText(p.char, x, y);
            }

            animId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className="portfolio-bg-container">
            <canvas
                ref={canvasRef}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#05030c' }}
            />
        </div>
    );
}
