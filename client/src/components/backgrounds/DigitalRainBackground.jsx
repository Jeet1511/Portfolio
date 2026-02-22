import { useEffect, useRef } from 'react';

export default function DigitalRainBackground() {
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

        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = new Array(columns).fill(1);
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.06)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const brightness = Math.random();

                if (brightness > 0.7) {
                    ctx.fillStyle = 'rgba(108, 92, 231, 0.9)';
                    ctx.shadowColor = 'rgba(108, 92, 231, 0.5)';
                    ctx.shadowBlur = 8;
                } else if (brightness > 0.4) {
                    ctx.fillStyle = 'rgba(162, 155, 254, 0.6)';
                    ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = 'rgba(108, 92, 231, 0.25)';
                    ctx.shadowBlur = 0;
                }

                ctx.font = `${fontSize}px monospace`;
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            ctx.shadowBlur = 0;
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="portfolio-bg-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
}
