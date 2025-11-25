import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../lib/utils';

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ElementType;
  isLoading?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps & { isLoading?: boolean }> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon: Icon,
  isLoading,
  disabled,
  ...props
}) => {

  const variants = {
    primary: "bg-primary-600/90 hover:bg-primary-500 text-white border border-primary-500/30 shadow-glow focus-visible:ring-primary-400/60",
    secondary: "bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-md shadow-sm hover:shadow-md",
    accent: "bg-accent-500/90 hover:bg-accent-400 text-white border border-accent-400/30 shadow-glow-accent focus-visible:ring-accent-400/60",
    ghost: "bg-white/20 dark:bg-slate-800/20 hover:bg-white/40 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 border border-slate-200/40 dark:border-slate-700/40 backdrop-blur-sm shadow-sm hover:shadow-md",
    outline: "bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg font-semibold",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        "relative group flex items-center justify-center gap-2 rounded-full transition-all duration-300 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant] || variants.primary,
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          <span className="relative z-10">{children}</span>
        </>
      )}

      {/* Glossy Shine for Primary/Accent */}
      {!isLoading && !disabled && (variant === 'primary' || variant === 'accent') && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20 pointer-events-none" />
      )}
    </motion.button>
  );
};
