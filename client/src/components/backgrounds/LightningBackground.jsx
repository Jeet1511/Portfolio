import { useEffect, useRef } from 'react';

export default function LightningBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let bolts = [];
        let nextBolt = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const createBolt = (x1, y1, x2, y2, depth = 0) => {
            const segments = [];
            const dx = x2 - x1;
            const dy = y2 - y1;
            const steps = 8 + Math.floor(Math.random() * 8);

            let cx = x1, cy = y1;
            for (let i = 0; i < steps; i++) {
                const nx = cx + dx / steps + (Math.random() - 0.5) * 60;
                const ny = cy + dy / steps + (Math.random() - 0.5) * 20;
                segments.push({ x1: cx, y1: cy, x2: nx, y2: ny });
                cx = nx;
                cy = ny;
            }

            return {
                segments,
                life: 1,
                decay: 0.03 + Math.random() * 0.02,
                width: depth === 0 ? 2 : 1,
                branches: depth < 2 ? Math.floor(Math.random() * 2) : 0,
                depth,
            };
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.12)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const now = Date.now();
            if (now > nextBolt) {
                const x = Math.random() * canvas.width;
                const bolt = createBolt(x, 0, x + (Math.random() - 0.5) * 200, canvas.height * 0.7);
                bolts.push(bolt);

                // Add branches
                if (bolt.branches > 0) {
                    const seg = bolt.segments[Math.floor(bolt.segments.length * 0.4)];
                    bolts.push(createBolt(seg.x2, seg.y2, seg.x2 + (Math.random() - 0.5) * 150, seg.y2 + 100 + Math.random() * 200, 1));
                }

                nextBolt = now + 2000 + Math.random() * 4000;
            }

            bolts.forEach(bolt => {
                if (bolt.life <= 0) return;

                ctx.strokeStyle = `rgba(162, 155, 254, ${bolt.life * 0.8})`;
                ctx.shadowColor = `rgba(108, 92, 231, ${bolt.life})`;
                ctx.shadowBlur = 20 * bolt.life;
                ctx.lineWidth = bolt.width * bolt.life;
                ctx.beginPath();

                bolt.segments.forEach(s => {
                    ctx.moveTo(s.x1, s.y1);
                    ctx.lineTo(s.x2, s.y2);
                });
                ctx.stroke();

                // Flash effect
                if (bolt.life > 0.9 && bolt.depth === 0) {
                    ctx.fillStyle = `rgba(108, 92, 231, ${(bolt.life - 0.9) * 0.3})`;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                bolt.life -= bolt.decay;
            });

            ctx.shadowBlur = 0;
            bolts = bolts.filter(b => b.life > 0);
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
