import { useEffect, useRef } from 'react';

export default function NebulaBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create nebula clouds
        const clouds = [];
        for (let i = 0; i < 6; i++) {
            clouds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 150 + Math.random() * 250,
                hue: 250 + Math.random() * 60,
                speed: 0.2 + Math.random() * 0.3,
                drift: Math.random() * Math.PI * 2,
            });
        }

        // Stars
        const stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5,
                twinkle: Math.random() * Math.PI * 2,
            });
        }

        const animate = () => {
            time += 0.005;
            ctx.fillStyle = 'rgba(5, 2, 15, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw stars
            stars.forEach(s => {
                const alpha = 0.3 + Math.sin(time * 3 + s.twinkle) * 0.3;
                ctx.fillStyle = `rgba(200, 200, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw nebula clouds
            clouds.forEach(c => {
                const cx = c.x + Math.sin(time * c.speed + c.drift) * 40;
                const cy = c.y + Math.cos(time * c.speed * 0.7 + c.drift) * 30;

                const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.radius);
                g.addColorStop(0, `hsla(${c.hue + Math.sin(time) * 20}, 70%, 40%, 0.04)`);
                g.addColorStop(0.5, `hsla(${c.hue + 30}, 60%, 30%, 0.02)`);
                g.addColorStop(1, 'transparent');

                ctx.fillStyle = g;
                ctx.fillRect(cx - c.radius, cy - c.radius, c.radius * 2, c.radius * 2);
            });

            animId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="portfolio-bg-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
}
