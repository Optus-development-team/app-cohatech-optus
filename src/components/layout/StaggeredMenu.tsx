'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Plus } from 'lucide-react';
import Image from 'next/image';

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  logoUrl?: string;
  menuButtonColor?: string;
  accentColor?: string;
  displayItemNumbering?: boolean;
  displaySocials?: boolean;
  items?: Array<{
    label: string;
    link: string;
    ariaLabel?: string;
    icon?: string;
  }>;
  className?: string;
}

export default function StaggeredMenu({
  position = 'right',
  colors = ['#B497CF', '#5227FF'],
  logoUrl = '/optus%20logo.gif',
  menuButtonColor = '#ffffff',
  accentColor = '#4e048c',
  displayItemNumbering = true,
  displaySocials = false,
  items = [
    { label: 'Inicio', link: '/', ariaLabel: 'Ir a Inicio' },
    { label: 'Login', link: '/login', ariaLabel: 'Ir a Login' },
  ],
  className = '',
}: StaggeredMenuProps): React.ReactElement {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuText, setMenuText] = useState('Menu');
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickAway);
    return () => document.removeEventListener('click', handleClickAway);
  }, [isOpen]);

  useEffect(() => {
    if (!menuRef.current) return;

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const timeline = gsap.timeline();
    timelineRef.current = timeline;

    if (isOpen) {
      // Opening animation
      setMenuText('Close');

      // Rotate plus icon
      if (menuButtonRef.current) {
        timeline.to(
          menuButtonRef.current.querySelector('svg'),
          {
            rotation: 45,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        );
      }

      // Animate pre-layer gradients
      const preLayerElements = menuRef.current.querySelectorAll(
        '.staggered-pre-layer'
      );
      preLayerElements.forEach((layer, index) => {
        timeline.to(
          layer,
          {
            opacity: 0.8,
            scale: 1,
            duration: 0.15,
            ease: 'back.out',
          },
          index * 0.05
        );
      });

      // Animate menu items
      const menuItems = itemsContainerRef.current?.querySelectorAll(
        '.menu-item'
      );
      if (menuItems) {
        menuItems.forEach((item, index) => {
          timeline.to(
            item,
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            },
            index * 0.08
          );
        });
      }
    } else {
      // Closing animation
      setMenuText('Menu');

      // Rotate plus icon back
      if (menuButtonRef.current) {
        timeline.to(
          menuButtonRef.current.querySelector('svg'),
          {
            rotation: 0,
            duration: 0.3,
            ease: 'power2.in',
          },
          0
        );
      }

      // Hide pre-layer gradients
      const preLayerElements = menuRef.current.querySelectorAll(
        '.staggered-pre-layer'
      );
      preLayerElements.forEach((layer, index) => {
        timeline.to(
          layer,
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.15,
            ease: 'back.in',
          },
          index * 0.05
        );
      });

      // Hide menu items
      const menuItems = itemsContainerRef.current?.querySelectorAll(
        '.menu-item'
      );
      if (menuItems) {
        menuItems.forEach((item, index) => {
          timeline.to(
            item,
            {
              opacity: 0,
              y: 10,
              duration: 0.25,
              ease: 'power2.in',
            },
            index * 0.05
          );
        });
      }
    }
  }, [isOpen]);

  const positionClass = position === 'left' ? 'left-0' : 'right-0';
  const itemsAlignment = position === 'left' ? 'items-start' : 'items-end';

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 ${positionClass} z-40 h-screen pointer-events-none ${className}`}
    >
      {/* Pre-layer gradient elements */}
      {[0, 1, 2].map((index) => (
        <div
          key={`layer-${index}`}
          ref={(el) => {
            if (el) layersRef.current[index] = el;
          }}
          className="staggered-pre-layer absolute pointer-events-none opacity-0"
          style={{
            width: `${200 + index * 150}px`,
            height: `${200 + index * 150}px`,
            [position]: `${-100 - index * 50}px`,
            top: `${50 - index * 30}px`,
            background: `radial-gradient(circle, ${colors[0]}${Math.round((0.3 - index * 0.08) * 255).toString(16).padStart(2, '0')}, ${colors[1]}${Math.round((0.1 - index * 0.03) * 255).toString(16).padStart(2, '0')})`,
            borderRadius: '50%',
            filter: 'blur(40px)',
            transform: 'scale(0.8)',
          }}
        />
      ))}

      {/* Menu button */}
      <button
        ref={menuButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto fixed top-6 p-3 transition-all duration-300 hover:opacity-80"
        style={{
          [position]: '24px',
          zIndex: 50,
          background: 'rgba(10, 10, 20, 0.8)',
          border: `2px solid ${menuButtonColor}`,
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <Plus size={24} color={menuButtonColor} strokeWidth={1.5} />
      </button>

      {/* Menu items container */}
      {isOpen && (
        <div
          ref={itemsContainerRef}
          className={`fixed top-20 pointer-events-auto flex flex-col gap-6 ${itemsAlignment}`}
          style={{
            [position]: '24px',
            zIndex: 45,
          }}
        >
          {items.map((item, index) => (
            <a
              key={`menu-item-${index}`}
              href={item.link}
              className="menu-item group flex items-center gap-3 opacity-0"
              style={{
                transform: 'translateY(10px)',
              }}
              aria-label={item.ariaLabel || item.label}
            >
              {displayItemNumbering && (
                <span
                  className="text-sm font-bold transition-colors duration-300 group-hover:text-white"
                  style={{ color: accentColor }}
                >
                  0{index + 1}
                </span>
              )}
              <div className="flex items-center gap-2">
                {item.icon && (
                  <div className="relative w-6 h-6">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span
                  className="text-base font-medium transition-colors duration-300 whitespace-nowrap"
                  style={{
                    color: menuButtonColor,
                  }}
                >
                  {item.label}
                </span>
              </div>
            </a>
          ))}

          {displaySocials && (
            <div className="flex gap-4 mt-4 pl-6">
              {/* Social links would go here */}
            </div>
          )}
        </div>
      )}

      {/* Logo display (optional) */}
      {logoUrl && isOpen && (
        <div
          className="fixed pointer-events-none opacity-20 transition-opacity duration-500"
          style={{
            [position]: '24px',
            bottom: '24px',
            width: '80px',
            height: '80px',
            position: 'relative' as const,
          }}
        >
          <Image
            src={logoUrl}
            alt="Logo"
            fill
            className="object-contain animate-spin-slow"
            style={{
              animationDuration: '20s',
            }}
          />
        </div>
      )}
    </div>
  );
}
