import { useEffect, useRef } from 'react';

export default function DeepSpaceBackground() {
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

        // Star layers (parallax)
        const farStars = Array.from({ length: 300 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 0.8 + 0.1,
            alpha: 0.1 + Math.random() * 0.3,
        }));

        const midStars = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1 + 0.3,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.008 + Math.random() * 0.02,
            color: Math.random() > 0.7 ? [255, 200, 150] : Math.random() > 0.3 ? [180, 190, 255] : [255, 255, 230],
        }));

        // Distant galaxies
        const galaxies = Array.from({ length: 4 }, () => ({
            x: 0.1 + Math.random() * 0.8,
            y: 0.1 + Math.random() * 0.8,
            size: 20 + Math.random() * 60,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.0003,
            hue: 200 + Math.random() * 100,
            tilt: 0.3 + Math.random() * 0.4,
            brightness: 0.02 + Math.random() * 0.04,
            starCount: 30 + Math.floor(Math.random() * 40),
        }));

        // Nebula clouds
        const clouds = Array.from({ length: 3 }, () => ({
            x: 0.15 + Math.random() * 0.7,
            y: 0.15 + Math.random() * 0.7,
            radiusX: 100 + Math.random() * 200,
            radiusY: 60 + Math.random() * 120,
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.0001,
            hue: Math.random() > 0.5 ? 270 : Math.random() > 0.3 ? 200 : 320,
            alpha: 0.015 + Math.random() * 0.02,
        }));

        let time = 0;

        function draw() {
            time++;

            // Deep space background
            const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            bg.addColorStop(0, '#030108');
            bg.addColorStop(0.3, '#050210');
            bg.addColorStop(0.7, '#060312');
            bg.addColorStop(1, '#030108');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw nebula clouds
            for (const cloud of clouds) {
                cloud.rotation += cloud.rotSpeed;
                ctx.save();
                ctx.translate(cloud.x * canvas.width, cloud.y * canvas.height);
                ctx.rotate(cloud.rotation);

                const nebulaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, cloud.radiusX);
                nebulaGrad.addColorStop(0, `hsla(${cloud.hue}, 60%, 50%, ${cloud.alpha * 1.5})`);
                nebulaGrad.addColorStop(0.3, `hsla(${cloud.hue + 20}, 50%, 40%, ${cloud.alpha})`);
                nebulaGrad.addColorStop(0.6, `hsla(${cloud.hue - 20}, 40%, 30%, ${cloud.alpha * 0.5})`);
                nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = nebulaGrad;
                ctx.beginPath();
                ctx.ellipse(0, 0, cloud.radiusX, cloud.radiusY, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Far stars (static)
            for (const s of farStars) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 200, 220, ${s.alpha})`;
                ctx.fill();
            }

            // Mid stars (twinkling)
            for (const s of midStars) {
                s.twinkle += s.twinkleSpeed;
                const alpha = 0.3 + 0.5 * Math.sin(s.twinkle);
                const [r, g, b] = s.color;

                // Glow
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`;
                ctx.fill();

                // Star
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fill();

                // Cross flare on bright stars
                if (s.radius > 0.9) {
                    const flareAlpha = alpha * 0.15;
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${flareAlpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(s.x - s.radius * 6, s.y);
                    ctx.lineTo(s.x + s.radius * 6, s.y);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y - s.radius * 6);
                    ctx.lineTo(s.x, s.y + s.radius * 6);
                    ctx.stroke();
                }
            }

            // Draw distant galaxies
            for (const g of galaxies) {
                g.rotation += g.rotSpeed;
                const gx = g.x * canvas.width;
                const gy = g.y * canvas.height;

                // Galaxy glow
                const glowGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.size * 1.5);
                glowGrad.addColorStop(0, `hsla(${g.hue}, 50%, 60%, ${g.brightness * 2})`);
                glowGrad.addColorStop(0.5, `hsla(${g.hue}, 40%, 40%, ${g.brightness})`);
                glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = glowGrad;
                ctx.fillRect(gx - g.size * 2, gy - g.size * 2, g.size * 4, g.size * 4);

                // Spiral dots
                for (let i = 0; i < g.starCount; i++) {
                    const armAngle = (i % 2 === 0 ? 0 : Math.PI) + g.rotation;
                    const dist = (i / g.starCount) * g.size;
                    const spiral = dist * 0.08;
                    const scatter = (Math.random() - 0.5) * g.size * 0.15;

                    const sx = gx + Math.cos(armAngle + spiral) * dist + scatter;
                    const sy = gy + Math.sin(armAngle + spiral) * dist * g.tilt + scatter * g.tilt;

                    ctx.beginPath();
                    ctx.arc(sx, sy, 0.5 + Math.random() * 0.5, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${g.hue + Math.random() * 40}, 50%, 70%, ${g.brightness * 3 + Math.random() * 0.05})`;
                    ctx.fill();
                }
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
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
        </div>
    );
}
