import React, { useEffect, useRef, useState } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number; // in ms
  threshold?: number;
}

/**
 * Reusable scroll reveal component that fades in and slides content smoothly
 * Creates a sweet, elegant entrance animation for text, photos, and cards
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 700,
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not available, default to visible immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [threshold]);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'translate-y-7 scale-[0.98]';
        case 'down':
          return '-translate-y-7 scale-[0.98]';
        case 'left':
          return 'translate-x-7';
        case 'right':
          return '-translate-x-7';
        default:
          return 'scale-[0.98]';
      }
    }
    return 'translate-y-0 translate-x-0 scale-100';
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ease-out transform will-change-transform will-change-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};
