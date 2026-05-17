'use client';

import React, { useEffect, useRef } from 'react';

export interface GameOfLifeBackgroundProps {
  cellSize?: number;
  color?: string;
  speed?: number;
  density?: number;
  className?: string;
  style?: React.CSSProperties;
  fillOpacity?: number;
}

export default function GameOfLifeBackground({
  cellSize = 16,
  color = '#9353d0',
  speed = 0.3,
  density = 0.12,
  className = '',
  style = {},
  fillOpacity = 1.0,
}: GameOfLifeBackgroundProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const gridRef = useRef<Map<string, boolean>>(new Map());
  const generationRef = useRef(0);
  const updateIntervalRef = useRef(0);

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

    const ctx = canvas.getContext('2d', { alpha: true })!;
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    // Inicializar grid aleatoriamente
    function initializeGrid() {
      gridRef.current.clear();
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (Math.random() < density) {
            gridRef.current.set(`${i},${j}`, true);
          }
        }
      }
    }

    // Obtener vecinos vivos
    function countNeighbors(x: number, y: number): number {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const key = `${(x + i + cols) % cols},${(y + j + rows) % rows}`;
          if (gridRef.current.get(key)) count++;
        }
      }
      return count;
    }

    // Aplicar reglas del Juego de la Vida
    function updateGeneration() {
      const newGrid = new Map<string, boolean>();

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const key = `${i},${j}`;
          const isAlive = gridRef.current.get(key) || false;
          const neighbors = countNeighbors(i, j);

          // Reglas de Conway
          if (isAlive && (neighbors === 2 || neighbors === 3)) {
            newGrid.set(key, true); // Sobrevive
          } else if (!isAlive && neighbors === 3) {
            newGrid.set(key, true); // Nace
          }
        }
      }

      gridRef.current = newGrid;
    }

    // Pintar grid - LIMPIO, sin rastros
    function draw() {
      // Fondo completamente limpio (sin semi-transparencia)
      ctx.fillStyle = 'rgba(10, 10, 20, 1)';
      ctx.fillRect(0, 0, width, height);

      // Dibujar células vivas - SIN GLOW, SIN SHADOW
      const hexColor = color.replace('#', '');
      const r = parseInt(hexColor.substring(0, 2), 16);
      const g = parseInt(hexColor.substring(2, 4), 16);
      const b = parseInt(hexColor.substring(4, 6), 16);

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fillOpacity})`;
      ctx.shadowBlur = 0; // SIN GLOW
      ctx.shadowColor = 'transparent';

      gridRef.current.forEach((alive, key) => {
        if (alive) {
          const [xStr, yStr] = key.split(',');
          const x = parseInt(xStr);
          const y = parseInt(yStr);
          const px = x * cellSize;
          const py = y * cellSize;

          // Dibujar rectángulo LIMPIO, sin padding, sin glow
          ctx.fillRect(px, py, cellSize, cellSize);
        }
      });
    }

    // Click/Touch para crear células (no mousemove)
    const onClick = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      let clientX: number, clientY: number;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Crear cluster pequeño de células en el punto de click
      const gridX = Math.floor(x / cellSize);
      const gridY = Math.floor(y / cellSize);
      const radius = 2; // Radio pequeño alrededor del click

      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          const cellX = (gridX + i + cols) % cols;
          const cellY = (gridY + j + rows) % rows;
          gridRef.current.set(`${cellX},${cellY}`, true);
        }
      }
    };

    container.addEventListener('click', onClick);
    container.addEventListener('touchend', onClick, { passive: true });

    initializeGrid();

    // Animation loop
    const animate = () => {
      updateIntervalRef.current++;

      // Actualizar grid cada N frames (controla velocidad - más lento)
      const updateFrame = Math.round(60 / (speed * 5 + 1));
      if (updateIntervalRef.current % updateFrame === 0) {
        updateGeneration();
        generationRef.current++;
      }

      draw();
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
      container.removeEventListener('click', onClick);
      container.removeEventListener('touchend', onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [cellSize, color, speed, density, fillOpacity]);

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
        pointerEvents: 'auto',
        cursor: 'pointer',
        ...style,
      }}
    />
  );
}
