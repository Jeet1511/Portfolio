import { useEffect, useRef } from 'react';

export default function ShootingStarsBackground() {
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

        // Background stars
        const bgStars = Array.from({ length: 200 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.2 + 0.3,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.005 + Math.random() * 0.02,
            color: Math.random() > 0.7 ? [180, 170, 255] : Math.random() > 0.5 ? [255, 220, 180] : [220, 220, 255],
        }));

        // Shooting stars pool
        const shootingStars = [];
        let lastSpawn = 0;

        function spawnShootingStar() {
            const startX = Math.random() * canvas.width * 1.2;
            const startY = Math.random() * canvas.height * 0.4;
            const angle = (Math.PI / 6) + Math.random() * (Math.PI / 4);
            const speed = 8 + Math.random() * 12;
            const length = 80 + Math.random() * 160;
            const hue = Math.random() > 0.6 ? 260 : Math.random() > 0.3 ? 210 : 40;

            shootingStars.push({
                x: startX, y: startY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                length, life: 1, decay: 0.008 + Math.random() * 0.012,
                width: 1.5 + Math.random() * 2,
                hue, trail: [],
            });
        }

        function draw(time) {
            ctx.fillStyle = 'rgba(8, 6, 20, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw static stars
            for (const star of bgStars) {
                star.twinkle += star.twinkleSpeed;
                const alpha = 0.3 + 0.5 * Math.sin(star.twinkle);
                const [r, g, b] = star.color;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fill();
            }

            // Spawn shooting stars
            if (time - lastSpawn > 600 + Math.random() * 2000) {
                spawnShootingStar();
                lastSpawn = time;
            }

            // Update & draw shooting stars
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                s.x += s.vx;
                s.y += s.vy;
                s.life -= s.decay;
                s.trail.push({ x: s.x, y: s.y, alpha: s.life });
                if (s.trail.length > s.length / 2) s.trail.shift();

                // Draw trail
                for (let j = 1; j < s.trail.length; j++) {
                    const t = s.trail[j];
                    const prev = s.trail[j - 1];
                    const alpha = (j / s.trail.length) * s.life * 0.6;
                    const width = s.width * (j / s.trail.length);

                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(t.x, t.y);
                    ctx.strokeStyle = `hsla(${s.hue}, 80%, 75%, ${alpha})`;
                    ctx.lineWidth = width;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }

                // Head glow
                if (s.life > 0) {
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.width * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${s.hue}, 80%, 85%, ${s.life * 0.3})`;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.width, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${s.hue}, 60%, 95%, ${s.life * 0.8})`;
                    ctx.fill();
                }

                if (s.life <= 0 || s.x > canvas.width * 1.2 || s.y > canvas.height * 1.2) {
                    shootingStars.splice(i, 1);
                }
            }

            animId = requestAnimationFrame(draw);
        }

        draw(0);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className="portfolio-bg-container">
            <canvas
                ref={canvasRef}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#08061a' }}
            />
        </div>
    );
}
