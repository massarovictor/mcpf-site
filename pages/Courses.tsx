import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { LiquidBackground } from '../components/LiquidBackground';
import { motion } from 'framer-motion';
import { MagnifyingGlass, BookOpen, Clock, X, CheckCircle, MapPin } from 'phosphor-react';
import { Course } from '../types';
import { cn } from '../lib/utils';

export const Courses: React.FC = () => {
  const { courses } = useData();
  const [filter, setFilter] = useState('Todos');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState('');
  const categories = ['Todos', 'Gestão e Negócios', 'Recursos Naturais', 'Informação e Comunicação'];
  const fallbackImage = 'https://images.unsplash.com/photo-1500336624523-d727130c3328?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  const filteredCourses = useMemo(() => (
    (filter === 'Todos' ? courses : courses.filter(c => c.category === filter))
      .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
  ), [courses, filter, search]);

  return (
    <LiquidBackground className="pb-24">
      {/* Centralized Hero Section - Liquid Glass Style */}
      <section className="relative pt-40 pb-24 overflow-hidden flex items-center justify-center min-h-[60vh]">
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <div className="flex flex-col items-center">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pill pill-primary mb-8 bg-white/80 dark:bg-slate-900/80"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              <span>Educação Profissional</span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="section-title text-5xl md:text-7xl leading-[1.1] mb-8"
            >
              Cursos Técnicos <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">Integrados</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="section-subtitle max-w-3xl mx-auto"
            >
              Prepare-se para a vida e para um futuro de realizações com nossos cursos de excelência.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl py-20">
        {/* Controls */}
        <GlassCard className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-24 z-30 p-4 rounded-full">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "pill whitespace-nowrap transition-all duration-300",
                  filter === cat
                    ? 'pill-primary'
                    : 'pill-neutral hover:bg-white/90 dark:hover:bg-slate-900/90'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" size={20} weight="regular" />
            <input
              type="text"
              placeholder="Buscar curso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 shadow-sm text-sm font-medium"
            />
          </div>
        </GlassCard>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
          {filteredCourses.map(course => (
            <GlassCard key={course.id} hoverEffect className="group flex flex-col h-full border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute top-4 right-4 pill pill-primary bg-white/80 dark:bg-slate-900/70 text-xs">
                  {course.level}
                </div>
                <div className="absolute bottom-4 left-4 pill pill-primary bg-white/80 dark:bg-slate-900/70 text-xs">
                  <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                  {course.category}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-3 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 flex-grow leading-relaxed">
                  {course.description}
                </p>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <BookOpen size={18} className="text-primary-600" />
                    <span>{course.duration}</span>
                  </div>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    className="text-primary-700 font-bold hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 -mr-2"
                    onClick={() => setSelectedCourse(course)}
                  >
                    Ver detalhes →
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Modal Detalhes do Curso */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative h-64 shrink-0">
              <img
                src={selectedCourse.image || fallbackImage}
                alt={selectedCourse.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-3 py-1.5 rounded-full bg-white/95 text-xs font-bold text-slate-800 shadow-sm border border-white/20">{selectedCourse.category}</span>
                <span className="px-3 py-1.5 rounded-full bg-primary-700 text-xs font-bold text-white shadow-sm">{selectedCourse.level}</span>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 shadow-lg backdrop-blur-sm transition-all"
                aria-label="Fechar"
              >
                <X size={20} weight="regular" />
              </button>
                <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-medium opacity-90 mb-1 tracking-wide flex items-center gap-2"><MapPin size={14} weight="regular" /> EEEP Maria Célia Pinheiro Falcão</p>
                <h2 className="text-3xl md:text-4xl font-bold font-display">{selectedCourse.title}</h2>
              </div>
            </div>

            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-grow">
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedCourse.description}
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="flex items-center gap-3 text-base font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-5 py-3 rounded-xl">
                    <Clock size={20} weight="regular" className="text-primary-600" />
                    <span>{selectedCourse.duration}</span>
                  </div>
                </div>
              </div>

              {selectedCourse.modules && selectedCourse.modules.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle size={20} weight="regular" className="text-primary-600" />
                    Principais Componentes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.modules.map((item, idx) => (
                      <span key={idx} className="px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 text-sm font-semibold border border-primary-100 dark:border-primary-800/50">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedCourse.opportunities && selectedCourse.opportunities.length > 0 && (
                <div className="bg-accent-50 dark:bg-accent-900/10 rounded-2xl p-6 border border-accent-100 dark:border-accent-900/20">
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <BookOpen size={20} weight="regular" className="text-accent-600" />
                    Mercado de Trabalho
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {selectedCourse.opportunities.map((op, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-500"></span>
                        <span>{op}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}


            </div>
          </div>
        </div>
      )}
    </LiquidBackground>
  );
};
