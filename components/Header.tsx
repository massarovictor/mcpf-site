import React, { useState, useEffect } from "react";
import { Theme } from "../types";
import { NAV_ITEMS } from "../constants";
import { List, X, Sun, Moon } from "phosphor-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-6"
      >
        <div
          className={cn(
            "pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isScrolled
              ? "w-[90%] max-w-5xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-full border border-white/20 shadow-glass py-3 px-6"
              : "w-[95%] max-w-6xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg rounded-full border border-white/10 shadow-sm py-4 px-8",
          )}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-10">
            <img
              src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
              alt="EEEP"
              className={cn(
                "transition-all duration-500",
                isScrolled ? "h-8 w-auto" : "h-10 w-auto",
              )}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group",
                    isActive
                      ? "text-primary-700 dark:text-primary-300"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary-500/10 dark:bg-primary-400/10 rounded-full border border-primary-500/20 dark:border-primary-400/20"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10 group-hover:scale-105 inline-block transition-transform">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3 relative z-10">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-md transition-all border border-white/10 text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === Theme.LIGHT ? (
                <Moon size={18} weight="regular" />
              ) : (
                <Sun size={18} weight="regular" />
              )}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-3 pointer-events-auto">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/30"
              aria-label="Toggle Theme"
            >
              {theme === Theme.LIGHT ? (
                <Moon size={18} weight="regular" />
              ) : (
                <Sun size={18} weight="regular" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-900 dark:text-white hover:bg-white/20 rounded-full transition-all active:scale-95"
              aria-label="Toggle Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X size={24} weight="regular" />
              ) : (
                <List size={24} weight="regular" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-4 right-4 z-40 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl flex flex-col gap-2 origin-top"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "block text-lg font-semibold p-4 rounded-2xl transition-all",
                    location.pathname === item.path
                      ? "bg-primary-500/10 text-primary-700 dark:text-primary-300"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
