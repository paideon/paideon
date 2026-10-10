// packages/ui/src/components/effects/AmbientEmbers.tsx
'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useState, useId } from 'react';

import { cn } from '../../utilities/cn';

export interface AmbientEmbersProps {
  count?: number;
  className?: string;
}

interface Ember {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// Global styles for keyframes – injected once
let stylesInjected = false;
const injectStyles = () => {
  if (typeof document === 'undefined' || stylesInjected) return;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes kcc-ember-rise {
      0% {
        transform: translateY(0) scale(1);
        opacity: 0;
      }
      20% {
        opacity: 0.6;
      }
      80% {
        opacity: 0.4;
      }
      100% {
        transform: translateY(-100px) scale(0.5);
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .kcc-ember {
        animation: none !important;
        opacity: 0.15 !important;
      }
    }
  `;
  document.head.appendChild(style);
  stylesInjected = true;
};

export function AmbientEmbers({ count = 20, className }: AmbientEmbersProps) {
  const [embers, setEmbers] = useState<Ember[]>([]);
  const prefersReduced = useReducedMotion();
  const idPrefix = useId();

  useEffect(() => {
    injectStyles();
    if (prefersReduced) return;

    const newEmbers = Array.from({ length: count }).map((_, i) => ({
      id: `${idPrefix}-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 5,
    }));
    setEmbers(newEmbers);
  }, [count, prefersReduced, idPrefix]);

  if (prefersReduced) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 pointer-events-none',
          'bg-gradient-radial-gold opacity-15',
          className,
        )}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden',
        className,
      )}
    >
      {embers.map((ember) => (
        <div
          key={ember.id}
          className="absolute rounded-full text-gold-base bg-current/40 kcc-ember"
          style={{
            left: `${ember.x}%`,
            top: `${ember.y}%`,
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            animation: `kcc-ember-rise ${ember.duration}s ease-in-out infinite`,
            animationDelay: `${ember.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
