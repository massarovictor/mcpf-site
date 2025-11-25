import React from 'react';
import { Link } from 'react-router-dom';
import { LiquidBackground } from '../components/LiquidBackground';
import { GlassButton } from '../components/GlassButton';
import { GlassCard } from '../components/GlassCard';
import { House, MagnifyingGlass } from 'phosphor-react';
import { motion } from 'framer-motion';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <LiquidBackground className="absolute inset-0 !min-h-full" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <GlassCard className="p-12 md:p-16 text-center rounded-3xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <span className="text-8xl md:text-9xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">
                404
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Página Não Encontrada
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
              A página que você procura não existe ou foi movida.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/">
                <GlassButton variant="primary" size="lg" icon={House}>
                  Voltar para Início
                </GlassButton>
              </Link>
              <Link to="/courses">
                <GlassButton variant="secondary" size="lg" icon={MagnifyingGlass}>
                  Ver Cursos
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
};





