import React from 'react';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/logo-ezbiz-final.png';

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
      <div className="bg-white rounded-md overflow-hidden">
        <img 
          src={logoImage} 
          alt="EZ BIZ FILE SERVICE" 
          className={cn(sizeClasses[size], "w-auto object-contain mix-blend-multiply")}
        />
      </div>
    </div>
  );
};

export default Logo;
