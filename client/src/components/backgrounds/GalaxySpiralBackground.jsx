import { useEffect, useRef } from 'react';

export default function GalaxySpiralBackground() {
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

        const armCount = 4;
        const starCount = 600;
        let rotation = 0;

        // Generate spiral galaxy stars
        const galaxyStars = Array.from({ length: starCount }, () => {
            const arm = Math.floor(Math.random() * armCount);
            const dist = Math.random() * 0.45;
            const armAngle = (arm / armCount) * Math.PI * 2;
            const spiralAngle = dist * 4;
            const scatter = (Math.random() - 0.5) * 0.12 * (1 + dist);

            const hue = 220 + Math.random() * 80;
            const sat = 50 + Math.random() * 40;
            const light = 60 + Math.random() * 35;

            return {
                dist, angle: armAngle + spiralAngle + scatter,
                offsetY: (Math.random() - 0.5) * 0.08,
                radius: 0.5 + Math.random() * 1.5 * (1 - dist * 0.5),
                hue, sat, light,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.01 + Math.random() * 0.02,
            };
        });

        // Distant background stars
        const bgStars = Array.from({ length: 120 }, () => ({
            x: Math.random(), y: Math.random(),
            radius: Math.random() * 0.8 + 0.2,
            alpha: 0.15 + Math.random() * 0.3,
        }));

        function draw() {
            ctx.fillStyle = 'rgba(5, 3, 15, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width * 0.5;
            const cy = canvas.height * 0.5;
            const maxR = Math.min(canvas.width, canvas.height) * 0.42;

            rotation += 0.0008;

            // Background stars
            for (const s of bgStars) {
                ctx.beginPath();
                ctx.arc(s.x * canvas.width, s.y * canvas.height, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 200, 230, ${s.alpha})`;
                ctx.fill();
            }

            // Galaxy core glow
            const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.15);
            coreGrad.addColorStop(0, 'rgba(255, 230, 200, 0.12)');
            coreGrad.addColorStop(0.5, 'rgba(180, 140, 255, 0.04)');
            coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = coreGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw spiral stars
            for (const star of galaxyStars) {
                star.twinkle += star.twinkleSpeed;
                const alpha = 0.4 + 0.4 * Math.sin(star.twinkle);

                const angle = star.angle + rotation;
                const r = star.dist * maxR;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r * 0.6 + star.offsetY * maxR;

                // Glow
                ctx.beginPath();
                ctx.arc(x, y, star.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${star.hue}, ${star.sat}%, ${star.light}%, ${alpha * 0.1})`;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(x, y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${star.hue}, ${star.sat}%, ${star.light}%, ${alpha})`;
                ctx.fill();
            }

            // Center bright core
            const brightCore = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.04);
            brightCore.addColorStop(0, 'rgba(255, 245, 230, 0.25)');
            brightCore.addColorStop(1, 'rgba(255, 245, 230, 0)');
            ctx.fillStyle = brightCore;
            ctx.fillRect(cx - maxR * 0.1, cy - maxR * 0.1, maxR * 0.2, maxR * 0.2);

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
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#05030f' }}
            />
        </div>
    );
}
