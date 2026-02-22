import { useEffect, useRef } from 'react';

export default function AuroraBorealisBackground() {
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

        // Aurora curtain layers
        const curtains = [
            { yBase: 0.2, amplitude: 80, wavelength: 400, speed: 0.0004, phase: 0, hue: 160, sat: 80, light: 50, alpha: 0.06, width: 200 },
            { yBase: 0.25, amplitude: 60, wavelength: 350, speed: 0.0005, phase: 2, hue: 130, sat: 70, light: 55, alpha: 0.05, width: 180 },
            { yBase: 0.3, amplitude: 100, wavelength: 500, speed: 0.0003, phase: 4, hue: 270, sat: 60, light: 50, alpha: 0.04, width: 160 },
            { yBase: 0.22, amplitude: 50, wavelength: 300, speed: 0.0006, phase: 1, hue: 180, sat: 75, light: 60, alpha: 0.05, width: 140 },
            { yBase: 0.35, amplitude: 70, wavelength: 450, speed: 0.00035, phase: 3, hue: 300, sat: 50, light: 45, alpha: 0.03, width: 120 },
        ];

        // Background stars
        const stars = Array.from({ length: 150 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.6,
            radius: Math.random() * 1.2 + 0.2,
            alpha: 0.2 + Math.random() * 0.5,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.005 + Math.random() * 0.02,
        }));

        let time = 0;

        function draw() {
            time++;

            // Dark sky gradient
            const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            skyGrad.addColorStop(0, '#020810');
            skyGrad.addColorStop(0.5, '#0a0e1a');
            skyGrad.addColorStop(1, '#0d1520');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars
            for (const star of stars) {
                star.twinkle += star.twinkleSpeed;
                const a = star.alpha * (0.6 + 0.4 * Math.sin(star.twinkle));
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220, 230, 255, ${a})`;
                ctx.fill();
            }

            // Draw aurora curtains
            for (const c of curtains) {
                const cols = Math.ceil(canvas.width / 3);

                for (let i = 0; i < cols; i++) {
                    const x = i * 3;
                    const noiseVal = Math.sin((x / c.wavelength + time * c.speed) * Math.PI * 2 + c.phase)
                        + Math.sin((x / (c.wavelength * 0.7) + time * c.speed * 1.3) * Math.PI * 2 + c.phase * 1.5) * 0.5
                        + Math.sin((x / (c.wavelength * 1.5) + time * c.speed * 0.7) * Math.PI * 2 + c.phase * 0.8) * 0.3;

                    const y = canvas.height * c.yBase + noiseVal * c.amplitude;
                    const intensity = 0.5 + 0.5 * Math.sin((x / canvas.width) * Math.PI * 2 + time * 0.001);
                    const curtainAlpha = c.alpha * intensity;

                    // Vertical curtain ray
                    const rayGrad = ctx.createLinearGradient(x, y - c.width * 0.3, x, y + c.width);
                    rayGrad.addColorStop(0, `hsla(${c.hue}, ${c.sat}%, ${c.light}%, 0)`);
                    rayGrad.addColorStop(0.15, `hsla(${c.hue}, ${c.sat}%, ${c.light + 15}%, ${curtainAlpha * 0.6})`);
                    rayGrad.addColorStop(0.4, `hsla(${c.hue}, ${c.sat}%, ${c.light}%, ${curtainAlpha})`);
                    rayGrad.addColorStop(0.7, `hsla(${c.hue}, ${c.sat}%, ${c.light - 10}%, ${curtainAlpha * 0.4})`);
                    rayGrad.addColorStop(1, `hsla(${c.hue}, ${c.sat}%, ${c.light}%, 0)`);

                    ctx.fillStyle = rayGrad;
                    ctx.fillRect(x, y - c.width * 0.3, 3, c.width * 1.3);
                }
            }

            // Ambient glow at horizon
            const horizonGrad = ctx.createRadialGradient(
                canvas.width * 0.5, canvas.height * 0.35, 0,
                canvas.width * 0.5, canvas.height * 0.35, canvas.width * 0.5
            );
            horizonGrad.addColorStop(0, 'rgba(100, 200, 150, 0.03)');
            horizonGrad.addColorStop(0.5, 'rgba(80, 150, 200, 0.015)');
            horizonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = horizonGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

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
