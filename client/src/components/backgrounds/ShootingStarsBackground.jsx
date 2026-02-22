import { useEffect, useRef } from 'react';

export default function ShootingStarsBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let w, h;

        // Use normalized coordinates (0-1) for stars so they survive resize
        const bgStarData = Array.from({ length: 200 }, () => ({
            nx: Math.random(),
            ny: Math.random(),
            radius: Math.random() * 1.2 + 0.3,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.005 + Math.random() * 0.02,
            color: Math.random() > 0.7 ? [180, 170, 255] : Math.random() > 0.5 ? [255, 220, 180] : [220, 220, 255],
        }));

        const shootingStars = [];
        let lastSpawn = 0;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        function spawnShootingStar() {
            // Start from top-right area, streak toward bottom-left (like real meteors)
            const startX = w * 0.3 + Math.random() * w * 0.8;
            const startY = -10 + Math.random() * h * 0.3;
            // Angle: roughly 200-240 degrees (heading lower-left)
            const angle = (200 + Math.random() * 40) * (Math.PI / 180);
            const speed = 6 + Math.random() * 10;
            const hue = Math.random() > 0.6 ? 260 : Math.random() > 0.3 ? 210 : 40;

            shootingStars.push({
                x: startX, y: startY,
                vx: Math.cos(angle) * speed,
                vy: -Math.sin(angle) * speed, // negative sin because canvas Y is flipped
                life: 1,
                decay: 0.006 + Math.random() * 0.01,
                width: 1.5 + Math.random() * 2,
                hue,
                trail: [],
                maxTrail: 25 + Math.floor(Math.random() * 25),
            });
        }

        function draw(time) {
            // Fade out previous frame (creates trail persistence)
            ctx.fillStyle = 'rgba(8, 6, 20, 0.12)';
            ctx.fillRect(0, 0, w, h);

            // Draw background stars
            for (const star of bgStarData) {
                star.twinkle += star.twinkleSpeed;
                const alpha = 0.3 + 0.5 * Math.sin(star.twinkle);
                const [r, g, b] = star.color;
                const sx = star.nx * w;
                const sy = star.ny * h;

                // Glow
                ctx.beginPath();
                ctx.arc(sx, sy, star.radius * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fill();
            }

            // Spawn shooting stars periodically
            if (time - lastSpawn > 800 + Math.random() * 1500) {
                spawnShootingStar();
                lastSpawn = time;
            }

            // Update & draw shooting stars
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                s.x += s.vx;
                s.y += s.vy;
                s.life -= s.decay;
                s.trail.unshift({ x: s.x, y: s.y });
                if (s.trail.length > s.maxTrail) s.trail.pop();

                // Draw trail (fading segments)
                for (let j = 1; j < s.trail.length; j++) {
                    const from = s.trail[j - 1];
                    const to = s.trail[j];
                    const progress = 1 - j / s.trail.length;
                    const alpha = progress * s.life * 0.7;
                    const lineW = s.width * progress;

                    ctx.beginPath();
                    ctx.moveTo(from.x, from.y);
                    ctx.lineTo(to.x, to.y);
                    ctx.strokeStyle = `hsla(${s.hue}, 80%, 75%, ${alpha})`;
                    ctx.lineWidth = lineW;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }

                // Bright head
                if (s.life > 0) {
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.width * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${s.hue}, 80%, 85%, ${s.life * 0.25})`;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.width * 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${s.hue}, 60%, 95%, ${s.life * 0.8})`;
                    ctx.fill();
                }

                // Remove dead or off-screen meteors
                if (s.life <= 0 || s.x < -100 || s.x > w + 100 || s.y > h + 100) {
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
