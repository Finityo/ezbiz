import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo = ({ className, size = 'md', showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <svg 
        viewBox="0 0 120 40" 
        className={cn(sizeClasses[size], "text-primary")}
        fill="currentColor"
      >
        {/* Growth bars */}
        <rect x="2" y="28" width="6" height="8" rx="1" />
        <rect x="10" y="22" width="6" height="14" rx="1" />
        <rect x="18" y="16" width="6" height="20" rx="1" />
        
        {/* Upward arrow */}
        <path d="M28 8 L36 16 L32 16 L32 20 L28 20 L28 16 L24 16 Z" />
        
        {/* Arrow curve connecting to bars */}
        <path d="M24 18 Q20 18 18 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      
      {showText && (
        <span className={cn(
          "font-bold tracking-tight",
          size === 'sm' && "text-lg",
          size === 'md' && "text-2xl", 
          size === 'lg' && "text-3xl"
        )}>
          Finityo
        </span>
      )}
    </div>
  );
};

export default Logo;