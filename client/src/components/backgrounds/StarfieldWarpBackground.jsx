import { useEffect, useRef } from 'react';

export default function StarfieldWarpBackground() {
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

        const starCount = 600;
        const stars = [];
        const cx = () => canvas.width / 2;
        const cy = () => canvas.height / 2;

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: (Math.random() - 0.5) * canvas.width * 2,
                y: (Math.random() - 0.5) * canvas.height * 2,
                z: Math.random() * 1500 + 1,
                pz: 0,
                hue: 240 + Math.random() * 40,
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = cx();
            const centerY = cy();

            stars.forEach(s => {
                s.pz = s.z;
                s.z -= 4;

                if (s.z <= 0) {
                    s.x = (Math.random() - 0.5) * canvas.width * 2;
                    s.y = (Math.random() - 0.5) * canvas.height * 2;
                    s.z = 1500;
                    s.pz = s.z;
                }

                const sx = (s.x / s.z) * 400 + centerX;
                const sy = (s.y / s.z) * 400 + centerY;
                const px = (s.x / s.pz) * 400 + centerX;
                const py = (s.y / s.pz) * 400 + centerY;

                const size = Math.max(0.5, (1 - s.z / 1500) * 3);
                const alpha = Math.min(1, (1 - s.z / 1500) * 1.5);

                ctx.strokeStyle = `hsla(${s.hue}, 70%, 70%, ${alpha})`;
                ctx.lineWidth = size;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();
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
