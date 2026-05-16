'use client';

import React, { useEffect, useRef } from 'react';

interface Point { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; }

export default function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const pointsRef = useRef<Point[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor((canvas.width * canvas.height) / 14000);
      pointsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 0.8, alpha: Math.random() * 0.5 + 0.2,
      }));
    };

    const onMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onTouchMove = (e: TouchEvent) => { if (e.touches[0]) mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = pointsRef.current;
      const { x: mx, y: my } = mouseRef.current;
      const MR = 160, CD = 110;

      pts.forEach(p => {
        const dx = p.x - mx, dy = p.y - my, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MR) { const f = (MR - dist) / MR; p.vx += (dx / dist) * f * 0.6; p.vy += (dy / dist) * f * 0.6; }
        p.vx *= 0.97; p.vy *= 0.97; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const gf = dist < MR ? 1 - dist / MR : 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + gf * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${Math.min(p.alpha + gf * 0.6, 0.95)})`;
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CD) {
            const a = (1 - d / CD) * 0.25;
            const midX = (pts[i].x + pts[j].x) / 2, midY = (pts[i].y + pts[j].y) / 2;
            const md = Math.sqrt((midX - mx) ** 2 + (midY - my) ** 2);
            const boost = md < MR ? (1 - md / MR) * 0.4 : 0;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${Math.min(a + boost, 0.7)})`; ctx.lineWidth = 0.6 + boost; ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="mesh-canvas" aria-hidden="true" />;
}
