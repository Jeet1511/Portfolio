import { useEffect, useRef } from 'react';

export default function HologramGridBackground() {
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

        // Floating data fragments
        const fragments = Array.from({ length: 20 }, () => ({
            x: Math.random(),
            y: Math.random(),
            size: 3 + Math.random() * 8,
            speed: 0.0002 + Math.random() * 0.0004,
            phase: Math.random() * Math.PI * 2,
            chars: Array.from({ length: 3 + Math.floor(Math.random() * 5) }, () =>
                String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
            ).join(''),
            hue: Math.random() > 0.5 ? 180 : 260,
        }));

        // Scan line
        let scanY = 0;

        function draw(time) {
            const t = time * 0.001;
            ctx.fillStyle = 'rgba(4, 6, 14, 0.06)';
            ctx.fillRect(0, 0, w, h);

            // 3D Perspective grid
            const vanishX = w * 0.5;
            const vanishY = h * 0.35;
            const gridLines = 24;
            const horizonLines = 18;

            // Horizontal grid lines (receding into distance)
            for (let i = 0; i < horizonLines; i++) {
                const progress = i / horizonLines;
                const y = vanishY + (h - vanishY) * Math.pow(progress, 1.5);
                const spread = progress * w * 0.8;
                const alpha = progress * 0.15;
                const glitch = Math.sin(t * 3 + i * 0.5) > 0.95 ? 3 : 0;

                ctx.beginPath();
                ctx.moveTo(vanishX - spread + glitch, y);
                ctx.lineTo(vanishX + spread + glitch, y);
                ctx.strokeStyle = `rgba(0, 206, 201, ${alpha})`;
                ctx.lineWidth = 0.5 + progress * 0.5;
                ctx.stroke();
            }

            // Vertical grid lines (converging to vanishing point)
            for (let i = -gridLines / 2; i <= gridLines / 2; i++) {
                const ratio = i / (gridLines / 2);
                const bottomX = vanishX + ratio * w * 0.8;
                const alpha = (1 - Math.abs(ratio) * 0.7) * 0.12;

                ctx.beginPath();
                ctx.moveTo(vanishX, vanishY);
                ctx.lineTo(bottomX, h);
                ctx.strokeStyle = `rgba(108, 92, 231, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Scan line
            scanY = (scanY + 1.5) % h;
            const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
            scanGrad.addColorStop(0, 'transparent');
            scanGrad.addColorStop(0.5, 'rgba(0, 206, 201, 0.06)');
            scanGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = scanGrad;
            ctx.fillRect(0, scanY - 30, w, 60);

            // Bright scan line
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(w, scanY);
            ctx.strokeStyle = 'rgba(0, 206, 201, 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Floating data fragments
            ctx.font = '10px monospace';
            for (const f of fragments) {
                f.y -= f.speed;
                f.phase += 0.02;
                if (f.y < -0.1) {
                    f.y = 1.1;
                    f.x = Math.random();
                    f.chars = Array.from({ length: 3 + Math.floor(Math.random() * 5) }, () =>
                        String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
                    ).join('');
                }

                const fx = f.x * w + Math.sin(f.phase) * 10;
                const fy = f.y * h;
                const alpha = 0.15 + Math.sin(f.phase) * 0.1;

                // Glow behind text
                ctx.fillStyle = `hsla(${f.hue}, 70%, 60%, ${alpha * 0.3})`;
                ctx.fillRect(fx - 2, fy - 8, f.chars.length * 7 + 4, 14);

                ctx.fillStyle = `hsla(${f.hue}, 70%, 70%, ${alpha})`;
                ctx.fillText(f.chars, fx, fy);
            }

            // Corner HUD frames
            const cornerSize = 40;
            const cornerAlpha = 0.1 + Math.sin(t * 2) * 0.05;
            ctx.strokeStyle = `rgba(0, 206, 201, ${cornerAlpha})`;
            ctx.lineWidth = 1;

            // Top-left
            ctx.beginPath();
            ctx.moveTo(20, 20 + cornerSize);
            ctx.lineTo(20, 20);
            ctx.lineTo(20 + cornerSize, 20);
            ctx.stroke();

            // Top-right
            ctx.beginPath();
            ctx.moveTo(w - 20 - cornerSize, 20);
            ctx.lineTo(w - 20, 20);
            ctx.lineTo(w - 20, 20 + cornerSize);
            ctx.stroke();

            // Bottom-left
            ctx.beginPath();
            ctx.moveTo(20, h - 20 - cornerSize);
            ctx.lineTo(20, h - 20);
            ctx.lineTo(20 + cornerSize, h - 20);
            ctx.stroke();

            // Bottom-right
            ctx.beginPath();
            ctx.moveTo(w - 20 - cornerSize, h - 20);
            ctx.lineTo(w - 20, h - 20);
            ctx.lineTo(w - 20, h - 20 - cornerSize);
            ctx.stroke();

            animId = requestAnimationFrame(draw);
        }

        draw(0);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return (
        <div className="portfolio-bg-container">
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#04060e' }} />
        </div>
    );
}
