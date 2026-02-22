import { useEffect, useRef } from 'react';

export default function CircuitBoardBackground() {
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

        const gridSize = 40;
        const nodes = [];
        const traces = [];
        const pulses = [];
        let lastPulse = 0;

        function generateCircuit() {
            nodes.length = 0;
            traces.length = 0;
            const cols = Math.ceil(canvas.width / gridSize) + 1;
            const rows = Math.ceil(canvas.height / gridSize) + 1;

            // Create nodes at grid intersections (sparse)
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (Math.random() < 0.25) {
                        nodes.push({
                            x: c * gridSize, y: r * gridSize,
                            type: Math.random() > 0.7 ? 'chip' : Math.random() > 0.5 ? 'junction' : 'pad',
                            glow: Math.random() * Math.PI * 2,
                            glowSpeed: 0.01 + Math.random() * 0.03,
                            size: Math.random() > 0.8 ? 5 : 3,
                        });
                    }
                }
            }

            // Generate traces between nearby nodes
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const m = nodes[j];
                    const dx = Math.abs(n.x - m.x);
                    const dy = Math.abs(n.y - m.y);
                    if ((dx === gridSize && dy === 0) || (dx === 0 && dy === gridSize)) {
                        if (Math.random() < 0.5) {
                            traces.push({ x1: n.x, y1: n.y, x2: m.x, y2: m.y });
                        }
                    } else if (dx === gridSize && dy === gridSize && Math.random() < 0.15) {
                        // L-shaped traces
                        const midX = Math.random() > 0.5 ? m.x : n.x;
                        const midY = midX === m.x ? n.y : m.y;
                        traces.push({ x1: n.x, y1: n.y, x2: midX, y2: midY });
                        traces.push({ x1: midX, y1: midY, x2: m.x, y2: m.y });
                    }
                }
            }
        }

        generateCircuit();
        window.addEventListener('resize', () => { resize(); generateCircuit(); });

        function spawnPulse() {
            if (traces.length === 0) return;
            const trace = traces[Math.floor(Math.random() * traces.length)];
            const hue = Math.random() > 0.5 ? 270 : Math.random() > 0.3 ? 180 : 120;
            pulses.push({
                trace, progress: 0, speed: 0.015 + Math.random() * 0.02,
                hue, life: 1,
            });
        }

        function draw(time) {
            ctx.fillStyle = 'rgba(8, 8, 18, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw traces
            ctx.lineWidth = 0.8;
            for (const t of traces) {
                ctx.beginPath();
                ctx.moveTo(t.x1, t.y1);
                ctx.lineTo(t.x2, t.y2);
                ctx.strokeStyle = 'rgba(108, 92, 231, 0.06)';
                ctx.stroke();
            }

            // Draw nodes
            for (const node of nodes) {
                node.glow += node.glowSpeed;
                const alpha = 0.2 + 0.15 * Math.sin(node.glow);

                if (node.type === 'chip') {
                    ctx.fillStyle = `rgba(108, 92, 231, ${alpha})`;
                    ctx.fillRect(node.x - node.size, node.y - node.size, node.size * 2, node.size * 2);
                    ctx.strokeStyle = `rgba(162, 155, 254, ${alpha * 0.6})`;
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(node.x - node.size, node.y - node.size, node.size * 2, node.size * 2);
                } else if (node.type === 'junction') {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 206, 201, ${alpha})`;
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(162, 155, 254, ${alpha * 0.8})`;
                    ctx.fill();
                }
            }

            // Spawn pulses
            if (time - lastPulse > 200 + Math.random() * 600) {
                spawnPulse();
                lastPulse = time;
            }

            // Draw pulses
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                p.progress += p.speed;
                if (p.progress >= 1) { pulses.splice(i, 1); continue; }

                const t = p.trace;
                const x = t.x1 + (t.x2 - t.x1) * p.progress;
                const y = t.y1 + (t.y2 - t.y1) * p.progress;
                const alpha = Math.sin(p.progress * Math.PI);

                // Pulse glow
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.15})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 80%, 80%, ${alpha * 0.7})`;
                ctx.fill();

                // Trace highlight
                ctx.beginPath();
                ctx.moveTo(t.x1, t.y1);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `hsla(${p.hue}, 70%, 60%, ${alpha * 0.15})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
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
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#080812' }}
            />
        </div>
    );
}
