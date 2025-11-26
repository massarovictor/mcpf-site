import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        // Base Glass Styles
        "group relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-glass dark:shadow-none",
        // Hover Effects (Optional)
        hoverEffect &&
          "transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-900/50 hover:shadow-glass-lg hover:scale-[1.01] hover:border-white/30",
        className,
      )}
      {...props}
    >
      {/* Shine Effect Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

      {children}
    </motion.div>
  );
};
