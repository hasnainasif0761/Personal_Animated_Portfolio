import React, { useEffect, useRef } from "react";
import './Wrap.scss'

export default function WrapSpeed() {
    const canvasRef = useRef(null);
    const rafRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let w = 0, h = 0; // ye CSS pixels honge

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            w = window.innerWidth;
            h = window.innerHeight;

            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);          // ab draw CSS pixels mein karo
        };
        resize();

        let xMode = 0, yMode = 0, wrapSpeed = 0;
        const setWrap = (on) => { wrapSpeed = on ? 1 : 0; };

        function Star() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.c = 0;
        }
        Star.prototype.updateColor = function () {
            this.c = Math.min(255, this.c + 5);
        };
        Star.prototype.updatePos = function () {
            const speed = wrapSpeed ? 0.08 : 0.02; // thoda tez rakho taake effect nazar aaye
            const cx = w / 2, cy = h / 2;

            // center se bahar ki taraf expand
            this.x = cx + (this.x - cx) * (1 + speed) + xMode;
            this.y = cy + (this.y - cy) * (1 + speed) + yMode;

            this.updateColor();

            if (this.x > w || this.x < 0 || this.y > h || this.y < 0) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.c = 0;
            }
        };

        const STAR_COUNT = 200;
        const stars = Array.from({ length: STAR_COUNT }, () => new Star());

        const onKeyDown = (e) => {
            const code = e.keyCode || e.which;
            if (code === 32) setWrap(true);
            if (code === 37) xMode = Math.min(6, xMode + 0.3);
            if (code === 39) xMode = Math.max(-6, xMode - 0.3);
            if (code === 38) yMode = Math.min(6, yMode + 0.3);
            if (code === 40) yMode = Math.max(-6, yMode - 0.3);
            if ([32,37,38,39,40].includes(code)) e.preventDefault();
        };
        const onKeyUp = (e) => {
            const code = e.keyCode || e.which;
            if (code === 32) setWrap(false);
            if (code === 37 || code === 39) xMode = 0;
            if (code === 38 || code === 40) yMode = 0;
            if ([32,37,38,39,40].includes(code)) e.preventDefault();
        };
        const onMouseDown = (e) => { if (e.button === 0) setWrap(true); };
        const onMouseUp   = (e) => { if (e.button === 0) setWrap(false); };
        const onTouchStart = (e) => { e.preventDefault(); setWrap(true); };
        const onTouchEnd   = () => setWrap(false);

        const draw = () => {
            // trail effect
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(0, 0, w, h);

            for (const s of stars) {
                const c = s.c;
                ctx.fillStyle = wrapSpeed
                    ? `rgb(${c},${Math.floor(c * 0.45)},0)`
                    : `rgb(${c},${c},${c})`;
                const size = Math.max(1, c / 128);
                ctx.fillRect(s.x, s.y, size, size);
                s.updatePos();
            }
            rafRef.current = requestAnimationFrame(draw);
        };
        rafRef.current = requestAnimationFrame(draw);

        window.addEventListener('resize', resize);
        window.addEventListener('keydown', onKeyDown, { passive: false });
        window.addEventListener('keyup', onKeyUp, { passive: false });
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        canvas.addEventListener('touchend', onTouchEnd);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('touchstart', onTouchStart);
            canvas.removeEventListener('touchend', onTouchEnd); // ← fix
        };
    }, []);

    return (
        <div className="warp-wrap">
            <canvas ref={canvasRef} className="warp-canvas" /> 
        </div>
    );
}