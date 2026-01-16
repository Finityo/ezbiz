import React from 'react';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/logo-ezbiz-nobg.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo = ({ className, size = 'md', showText = false }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src={logoImage} 
        alt="EZ BIZ FILE SERVICE" 
        className={cn(sizeClasses[size], "w-auto object-contain")}
      />
    </div>
  );
};

export default Logo;
