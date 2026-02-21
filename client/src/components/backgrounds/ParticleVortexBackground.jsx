import { useEffect, useRef } from 'react';

export default function ParticleVortexBackground() {
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

        const particleCount = 150;
        const particles = Array.from({ length: particleCount }, () => {
            const angle = Math.random() * Math.PI * 2;
            const radius = 50 + Math.random() * 300;
            return {
                angle,
                radius,
                speed: 0.002 + Math.random() * 0.004,
                size: 1 + Math.random() * 2,
                drift: (Math.random() - 0.5) * 0.3,
                alpha: 0.2 + Math.random() * 0.5,
                color: Math.random() > 0.5 ? [108, 92, 231] : Math.random() > 0.5 ? [0, 206, 201] : [225, 112, 85],
            };
        });

        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            for (const p of particles) {
                p.angle += p.speed;
                p.radius += p.drift;

                // Keep in bounds
                if (p.radius < 20) p.drift = Math.abs(p.drift);
                if (p.radius > Math.min(cx, cy) * 0.9) p.drift = -Math.abs(p.drift);

                const x = cx + Math.cos(p.angle) * p.radius;
                const y = cy + Math.sin(p.angle) * p.radius;

                // Trail
                const tx = cx + Math.cos(p.angle - p.speed * 8) * p.radius;
                const ty = cy + Math.sin(p.angle - p.speed * 8) * p.radius;

                ctx.beginPath();
                ctx.moveTo(tx, ty);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(${p.color.join(',')}, ${p.alpha * 0.3})`;
                ctx.lineWidth = p.size * 0.5;
                ctx.stroke();

                // Particle
                ctx.beginPath();
                ctx.arc(x, y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.join(',')}, ${p.alpha})`;
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.join(',')}, ${p.alpha * 0.1})`;
                ctx.fill();
            }

            // Center glow
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
            gradient.addColorStop(0, 'rgba(108, 92, 231, 0.06)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(cx - 80, cy - 80, 160, 160);

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
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        </div>
    );
}
