import { useEffect, useRef } from 'react';

export default function FirefliesBackground() {
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

        const count = 60;
        const fireflies = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: 1.5 + Math.random() * 2,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: 0.015 + Math.random() * 0.025,
            hue: 40 + Math.random() * 30, // Warm amber-gold
        }));

        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (const f of fireflies) {
                f.phase += f.phaseSpeed;

                // Gentle wandering
                f.vx += (Math.random() - 0.5) * 0.05;
                f.vy += (Math.random() - 0.5) * 0.05;
                f.vx *= 0.98;
                f.vy *= 0.98;
                f.x += f.vx;
                f.y += f.vy;

                // Wrap
                if (f.x < -10) f.x = canvas.width + 10;
                if (f.x > canvas.width + 10) f.x = -10;
                if (f.y < -10) f.y = canvas.height + 10;
                if (f.y > canvas.height + 10) f.y = -10;

                const brightness = Math.sin(f.phase) * 0.5 + 0.5;
                const alpha = 0.1 + brightness * 0.7;

                // Outer glow
                const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 8);
                glow.addColorStop(0, `hsla(${f.hue}, 80%, 65%, ${alpha * 0.2})`);
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.fillRect(f.x - f.size * 8, f.y - f.size * 8, f.size * 16, f.size * 16);

                // Core
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.size * brightness, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${f.hue}, 90%, 70%, ${alpha})`;
                ctx.fill();
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
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        </div>
    );
}
