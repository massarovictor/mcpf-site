import React from 'react';
import { cn } from '../lib/utils';

interface LiquidBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ className, children }) => {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950", className)}>
      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 hidden md:block">
        {/* Primary Blob - Top Left */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-400/30 dark:bg-primary-600/20 mix-blend-multiply dark:mix-blend-screen filter blur-[80px] animate-blob opacity-70" />
        
        {/* Accent Blob - Top Right */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-400/30 dark:bg-accent-600/20 mix-blend-multiply dark:mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000 opacity-70" />
        
        {/* Secondary Blob - Bottom Left */}
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-400/30 dark:bg-purple-600/20 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000 opacity-70" />
        
        {/* Center/Random Blob */}
        <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 mix-blend-multiply dark:mix-blend-screen filter blur-[60px] animate-blob animation-delay-6000 opacity-50" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};





