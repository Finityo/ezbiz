import { useState, useRef, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  tiltMax?: number; // Maximum tilt angle in degrees
  scale?: number; // Scale on hover
  glare?: boolean; // Enable glare effect
}

const TiltCard = ({
  children,
  className = '',
  onClick,
  tiltMax = 10,
  scale = 1.02,
  glare = true,
}: TiltCardProps) => {
  const [transform, setTransform] = useState('');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation based on mouse position
    const rotateX = ((y - centerY) / centerY) * -tiltMax;
    const rotateY = ((x - centerX) / centerX) * tiltMax;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);
    
    // Update glare position
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('');
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        'relative overflow-hidden cursor-pointer transition-shadow duration-300',
        className
      )}
      style={{
        transform: transform || 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Glare effect overlay */}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
      
      {/* Card content with 3D depth */}
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </Card>
  );
};

export default TiltCard;
