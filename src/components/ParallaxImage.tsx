import { useParallax } from '@/hooks/useParallax';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
  maxOffset?: number;
}

const ParallaxImage = ({ 
  src, 
  alt, 
  className = '', 
  speed = 0.25,
  direction = 'up',
  maxOffset = 100
}: ParallaxImageProps) => {
  const parallaxStyle = useParallax({ speed, direction, maxOffset });

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <img 
        src={src} 
        alt={alt}
        className={className}
        style={parallaxStyle}
      />
    </div>
  );
};

export default ParallaxImage;
