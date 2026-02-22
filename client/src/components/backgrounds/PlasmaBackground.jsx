import { useEffect, useRef } from 'react';

export default function PlasmaBackground() {
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

        const animate = () => {
            time += 0.008;
            const w = canvas.width;
            const h = canvas.height;
            const imageData = ctx.createImageData(w, h);
            const data = imageData.data;
            const step = 4; // sample every 4th pixel for performance

            for (let y = 0; y < h; y += step) {
                for (let x = 0; x < w; x += step) {
                    const v1 = Math.sin(x * 0.01 + time);
                    const v2 = Math.sin(y * 0.012 + time * 0.7);
                    const v3 = Math.sin((x + y) * 0.008 + time * 1.3);
                    const v4 = Math.sin(Math.sqrt(x * x + y * y) * 0.005 + time * 0.5);
                    const v = (v1 + v2 + v3 + v4) / 4;

                    const r = Math.floor((Math.sin(v * Math.PI) * 0.5 + 0.5) * 40);
                    const g = Math.floor((Math.cos(v * Math.PI * 0.7) * 0.5 + 0.5) * 15);
                    const b = Math.floor((Math.sin(v * Math.PI * 1.3 + 1) * 0.5 + 0.5) * 60);

                    for (let dy = 0; dy < step && y + dy < h; dy++) {
                        for (let dx = 0; dx < step && x + dx < w; dx++) {
                            const idx = ((y + dy) * w + (x + dx)) * 4;
                            data[idx] = r;
                            data[idx + 1] = g;
                            data[idx + 2] = b;
                            data[idx + 3] = 255;
                        }
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
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
