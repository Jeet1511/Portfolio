import { useEffect, useRef } from 'react';

export default function HomeBackground() {
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

        // Floating nodes
        const nodes = Array.from({ length: 60 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: 1 + Math.random() * 2,
            hue: Math.random() > 0.6 ? 260 : Math.random() > 0.3 ? 190 : 320,
            pulse: Math.random() * Math.PI * 2,
        }));

        // Ambient orbs
        const orbs = [
            { x: 0.2, y: 0.3, radius: 250, hue: 260, speed: 0.0003, phase: 0 },
            { x: 0.7, y: 0.6, radius: 200, hue: 190, speed: 0.0004, phase: 2 },
            { x: 0.5, y: 0.8, radius: 180, hue: 310, speed: 0.0005, phase: 4 },
        ];

        // Grid lines
        const gridSpacing = 60;

        function draw(time) {
            const t = time * 0.001;

            // Clear with subtle trail
            ctx.fillStyle = 'rgba(8, 6, 18, 0.15)';
            ctx.fillRect(0, 0, w, h);

            // Draw subtle grid
            ctx.strokeStyle = 'rgba(108, 92, 231, 0.015)';
            ctx.lineWidth = 0.5;
            for (let x = 0; x <= w; x += gridSpacing) {
                const offset = Math.sin(t * 0.2 + x * 0.005) * 2;
                ctx.beginPath();
                ctx.moveTo(x + offset, 0);
                ctx.lineTo(x + offset, h);
                ctx.stroke();
            }
            for (let y = 0; y <= h; y += gridSpacing) {
                const offset = Math.cos(t * 0.15 + y * 0.005) * 2;
                ctx.beginPath();
                ctx.moveTo(0, y + offset);
                ctx.lineTo(w, y + offset);
                ctx.stroke();
            }

            // Draw ambient orbs (blurred glow)
            for (const orb of orbs) {
                orb.phase += orb.speed;
                const ox = (orb.x + Math.sin(orb.phase) * 0.05) * w;
                const oy = (orb.y + Math.cos(orb.phase * 0.7) * 0.04) * h;
                const pulse = 0.8 + Math.sin(t * 0.5 + orb.phase) * 0.2;

                const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.radius * pulse);
                grad.addColorStop(0, `hsla(${orb.hue}, 70%, 50%, 0.04)`);
                grad.addColorStop(0.5, `hsla(${orb.hue}, 60%, 40%, 0.015)`);
                grad.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.arc(ox, oy, orb.radius * pulse, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }

            // Update and draw nodes
            for (const node of nodes) {
                node.x += node.vx;
                node.y += node.vy;
                node.pulse += 0.02;

                // Wrap around edges
                if (node.x < -20) node.x = w + 20;
                if (node.x > w + 20) node.x = -20;
                if (node.y < -20) node.y = h + 20;
                if (node.y > h + 20) node.y = -20;

                const alpha = 0.3 + Math.sin(node.pulse) * 0.2;

                // Node glow
                const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 6);
                glow.addColorStop(0, `hsla(${node.hue}, 70%, 60%, ${alpha * 0.15})`);
                glow.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * 6, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();

                // Node core
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * (0.7 + Math.sin(node.pulse) * 0.3), 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${node.hue}, 70%, 70%, ${alpha})`;
                ctx.fill();
            }

            // Draw connections between nearby nodes
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 180) {
                        const alpha = (1 - dist / 180) * 0.06;
                        const midHue = (nodes[i].hue + nodes[j].hue) / 2;

                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `hsla(${midHue}, 50%, 55%, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();

                        // Pulse traveling along the connection
                        if (dist < 100 && Math.sin(t * 2 + i * 0.5) > 0.7) {
                            const progress = (Math.sin(t * 3 + i) + 1) / 2;
                            const px = nodes[i].x + dx * -progress;
                            const py = nodes[i].y + dy * -progress;
                            ctx.beginPath();
                            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                            ctx.fillStyle = `hsla(${midHue}, 80%, 70%, ${0.4 * (1 - dist / 100)})`;
                            ctx.fill();
                        }
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        }

        // Initial fill
        ctx.fillStyle = '#080612';
        ctx.fillRect(0, 0, w, h);

        draw(0);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="home-bg-canvas"
        />
    );
}
