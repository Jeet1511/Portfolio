import { useEffect, useRef } from 'react';

export default function WormholeBackground() {
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

        // Spiral particles
        const spiralParticles = Array.from({ length: 120 }, () => ({
            angle: Math.random() * Math.PI * 2,
            dist: 50 + Math.random() * Math.min(w, h) * 0.4,
            speed: 0.005 + Math.random() * 0.015,
            size: 0.5 + Math.random() * 2,
            hue: 240 + Math.random() * 60,
            z: Math.random(), // depth
            fallSpeed: 0.002 + Math.random() * 0.004,
        }));

        // Ring layers
        const rings = Array.from({ length: 12 }, (_, i) => ({
            radius: 30 + i * 30,
            rotation: Math.random() * Math.PI * 2,
            speed: (0.003 + i * 0.001) * (i % 2 === 0 ? 1 : -1),
            alpha: 0.08 - i * 0.004,
            hue: 260 + i * 8,
        }));

        function draw(time) {
            const t = time * 0.001;
            const cx = w * 0.5;
            const cy = h * 0.5;

            ctx.fillStyle = 'rgba(4, 2, 12, 0.06)';
            ctx.fillRect(0, 0, w, h);

            // Wormhole core glow
            const coreSize = 30 + Math.sin(t * 1.5) * 8;
            const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize * 4);
            coreGrad.addColorStop(0, `rgba(162, 155, 254, ${0.06 + Math.sin(t) * 0.02})`);
            coreGrad.addColorStop(0.4, 'rgba(108, 92, 231, 0.02)');
            coreGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(cx, cy, coreSize * 4, 0, Math.PI * 2);
            ctx.fillStyle = coreGrad;
            ctx.fill();

            // Energy rings
            for (const ring of rings) {
                ring.rotation += ring.speed;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(ring.rotation);

                // Draw dashed ring
                const segments = 6 + Math.floor(ring.radius / 20);
                const segmentAngle = (Math.PI * 2) / segments;
                for (let i = 0; i < segments; i++) {
                    const angle = i * segmentAngle;
                    const arcLen = segmentAngle * 0.6;
                    const pulse = Math.sin(t * 2 + i + ring.radius * 0.01) * 0.5 + 0.5;

                    ctx.beginPath();
                    ctx.arc(0, 0, ring.radius, angle, angle + arcLen);
                    ctx.strokeStyle = `hsla(${ring.hue}, 70%, 65%, ${ring.alpha * (0.5 + pulse * 0.5)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
                ctx.restore();
            }

            // Spiral particles
            for (const p of spiralParticles) {
                p.angle += p.speed;
                p.dist -= p.fallSpeed * p.dist * 0.01;
                p.z = Math.max(0.05, p.dist / (Math.min(w, h) * 0.4));

                if (p.dist < 15) {
                    p.dist = 50 + Math.random() * Math.min(w, h) * 0.4;
                    p.angle = Math.random() * Math.PI * 2;
                    p.z = 1;
                }

                const px = cx + Math.cos(p.angle) * p.dist;
                const py = cy + Math.sin(p.angle) * p.dist * 0.7; // Elliptical for perspective
                const size = p.size * p.z;
                const alpha = (1 - p.z) * 0.4 + 0.2;

                // Streak (motion trail toward center)
                const trailLen = (1 - p.z) * 8 + 2;
                const trailAngle = Math.atan2(py - cy, px - cx);
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(
                    px + Math.cos(trailAngle) * trailLen,
                    py + Math.sin(trailAngle) * trailLen
                );
                ctx.strokeStyle = `hsla(${p.hue}, 70%, 70%, ${alpha * 0.3})`;
                ctx.lineWidth = size * 0.5;
                ctx.stroke();

                // Particle
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, ${alpha})`;
                ctx.fill();
            }

            // Center bright point
            const coreAlpha = 0.4 + Math.sin(t * 3) * 0.15;
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 215, 255, ${coreAlpha})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(162, 155, 254, ${coreAlpha * 0.2})`;
            ctx.fill();

            animId = requestAnimationFrame(draw);
        }

        draw(0);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return (
        <div className="portfolio-bg-container">
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#04020c' }} />
        </div>
    );
}
