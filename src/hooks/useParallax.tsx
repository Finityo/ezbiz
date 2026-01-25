import { useState, useEffect } from 'react';

interface ParallaxOptions {
  speed?: number; // 0.1 = slow, 0.5 = medium, 1 = same as scroll
  direction?: 'up' | 'down';
  maxOffset?: number; // Maximum pixels to translate
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.3, direction = 'up', maxOffset = 150 } = options;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const calculatedOffset = scrollY * speed;
      const clampedOffset = Math.min(calculatedOffset, maxOffset);
      
      setOffset(direction === 'up' ? clampedOffset : -clampedOffset);
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction, maxOffset]);

  return {
    transform: `translateY(${offset}px)`,
    willChange: 'transform',
  };
};

export default useParallax;
