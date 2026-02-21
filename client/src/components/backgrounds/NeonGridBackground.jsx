import { useEffect, useRef } from 'react';

export default function NeonGridBackground() {
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

        const gridSize = 60;

        function draw() {
            time += 0.008;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cols = Math.ceil(canvas.width / gridSize) + 1;
            const rows = Math.ceil(canvas.height / gridSize) + 1;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Vertical lines
            for (let i = 0; i < cols; i++) {
                const x = i * gridSize;
                const dist = Math.abs(x - cx) / canvas.width;
                const pulse = Math.sin(time * 2 - dist * 8) * 0.5 + 0.5;
                const alpha = 0.03 + pulse * 0.06;

                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.strokeStyle = `rgba(108, 92, 231, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();

                // Glow nodes at intersections
                if (pulse > 0.7) {
                    for (let j = 0; j < rows; j++) {
                        const y = j * gridSize;
                        const nodePulse = Math.sin(time * 3 - (i + j) * 0.5) * 0.5 + 0.5;
                        if (nodePulse > 0.8) {
                            ctx.beginPath();
                            ctx.arc(x, y, 2, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(162, 155, 254, ${nodePulse * 0.6})`;
                            ctx.fill();

                            ctx.beginPath();
                            ctx.arc(x, y, 6, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(108, 92, 231, ${nodePulse * 0.15})`;
                            ctx.fill();
                        }
                    }
                }
            }

            // Horizontal lines
            for (let j = 0; j < rows; j++) {
                const y = j * gridSize;
                const dist = Math.abs(y - cy) / canvas.height;
                const pulse = Math.sin(time * 2 - dist * 8 + 1) * 0.5 + 0.5;
                const alpha = 0.03 + pulse * 0.06;

                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.strokeStyle = `rgba(108, 92, 231, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Central glow
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
            gradient.addColorStop(0, `rgba(108, 92, 231, ${0.04 + Math.sin(time) * 0.02})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
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
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        </div>
    );
}
