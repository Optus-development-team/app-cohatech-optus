'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

const defaultColors = ['#5227FF', '#FF9FFC', '#B497CF'];

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = defaultColors,
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6,
}: LiquidEtherProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const autoDemoRef = useRef({ enabled: autoDemo, active: false, time: 0, target: { x: 0, y: 0 } });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Crear paleta de colores
    const colorPalette = colors.map(c => {
      const col = new THREE.Color(c);
      return { r: col.r * 255, g: col.g * 255, b: col.b * 255 };
    });

    // Función para interpolar color
    function getColorAtIntensity(intensity: number): [number, number, number] {
      intensity = Math.max(0, Math.min(1, intensity));
      const idx = intensity * (colorPalette.length - 1);
      const i1 = Math.floor(idx);
      const i2 = Math.ceil(idx);
      const t = idx - i1;

      if (i1 === i2) {
        const c = colorPalette[i1];
        return [c.r, c.g, c.b];
      }

      const c1 = colorPalette[i1];
      const c2 = colorPalette[i2];
      return [
        Math.round(c1.r + (c2.r - c1.r) * t),
        Math.round(c1.g + (c2.g - c1.g) * t),
        Math.round(c1.b + (c2.b - c1.b) * t),
      ];
    }

    // Partículas simples
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];

    function addParticle(x: number, y: number) {
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 60,
          y: y + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          maxLife: 4,
        });
      }
    }

    // Entrada del ratón - escuchar a nivel global
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (autoDemoRef.current.active) {
        autoDemoRef.current.active = false;
      }

      addParticle(mouseRef.current.x, mouseRef.current.y);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = touch.clientX;
      mouseRef.current.y = touch.clientY;
      addParticle(mouseRef.current.x, mouseRef.current.y);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Auto demo
    const startAutoDemo = () => {
      autoDemoRef.current.active = true;
      autoDemoRef.current.time = 0;
    };

    let idleTime = 0;
    const idleThreshold = autoResumeDelay;

    // Animación principal
    let time = 0;
    const animate = () => {
      time += dt;
      idleTime += dt;

      // Auto demo después de inactividad
      if (autoDemoRef.current.enabled && idleTime > idleThreshold && !autoDemoRef.current.active) {
        startAutoDemo();
      }

      if (autoDemoRef.current.active) {
        autoDemoRef.current.time += dt * autoSpeed;
        const t = autoDemoRef.current.time;
        autoDemoRef.current.target.x = width / 2 + Math.sin(t * 0.7) * (width * 0.3);
        autoDemoRef.current.target.y = height / 2 + Math.cos(t * 0.5) * (height * 0.25);

        if (Math.random() < 0.2) {
          addParticle(autoDemoRef.current.target.x, autoDemoRef.current.target.y);
        }
      }

      // Limpiar canvas con fondo transparente/oscuro (efecto de estela minimal)
      ctx.fillStyle = 'rgba(10, 10, 20, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Actualizar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Física
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vx += (Math.random() - 0.5) * 0.2;
        p.vy += (Math.random() - 0.5) * 0.2 + 0.05;

        p.x += p.vx;
        p.y += p.vy;

        // Rebote
        if (p.x < 0 || p.x > width) p.vx *= -0.8;
        if (p.y < 0 || p.y > height) p.vy *= -0.8;

        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        // Vida
        p.life -= dt / p.maxLife;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Renderizar nodo (más grande y definido)
        const intensity = Math.pow(p.life, 0.6);
        const [r, g, b] = getColorAtIntensity(intensity);
        const nodeSize = Math.max(4, intensity * 12); // Nodos más grandes

        // Glow/halo alrededor del nodo
        ctx.shadowBlur = 30;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${intensity * 1.0})`;
        
        // Nodo central
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();

        // Borde del nodo para definición
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${intensity * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
        ctx.stroke();

        // Reset shadow
        ctx.shadowBlur = 0;
      }

      // Dibujar líneas entre partículas cercanas (conexiones de red neuronal)
      const maxDist = 180;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.6;
            const avgLife = (particles[i].life + particles[j].life) / 2;
            const [r, g, b] = getColorAtIntensity(avgLife);
            
            // Línea de conexión con glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`;
            
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            
            ctx.shadowBlur = 0;
          }
        }
      }

      // Cursor visual si no está en auto demo - REMOVIDO para no dibujar cursor
      if (!autoDemoRef.current.active) {
        idleTime = 0;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [mouseForce, cursorSize, isViscous, viscous, iterationsViscous, iterationsPoisson, dt, BFECC, resolution, isBounce, colors, autoDemo, autoSpeed, autoIntensity, takeoverDuration, autoResumeDelay, autoRampDuration]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        ...style,
      }}
    />
  );
}
