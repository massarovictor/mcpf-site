import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { LiquidBackground } from '../components/LiquidBackground';
import { motion } from 'framer-motion';
import { Target, Heart, Lightning, Flask, Monitor, Book, Globe, Leaf, Microphone, Briefcase, Wheelchair, Trophy, GraduationCap, Users } from 'phosphor-react';

export const About: React.FC = () => {
  const labs = [
    { name: "Química", icon: <Flask size={20} weight="regular" />, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    { name: "Física", icon: <Lightning size={20} weight="regular" />, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
    { name: "Biologia", icon: <Leaf size={20} weight="regular" />, color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
    { name: "Matemática", icon: <Target size={20} weight="regular" />, color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
    { name: "Informática", icon: <Monitor size={20} weight="regular" />, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
    { name: "Línguas", icon: <Globe size={20} weight="regular" />, color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20" },
    { name: "Gestão", icon: <Briefcase size={20} weight="regular" />, color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" },
    { name: "Práticas Agrícolas", icon: <Leaf size={20} weight="regular" />, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
  ];

  const facilities = [
    { name: "Auditório", icon: <Microphone size={20} weight="regular" /> },
    { name: "Biblioteca", icon: <Book size={20} weight="regular" /> },
    { name: "Acessibilidade", icon: <Wheelchair size={20} weight="regular" /> },
    { name: "Quadra Poliesportiva", icon: <Trophy size={20} weight="regular" /> },
  ];

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
              <span>Institucional</span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="section-title text-5xl md:text-7xl leading-[1.1] mb-8"
            >
              Escola de <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">Oportunidades</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal"
            >
              A EEEP Professora Maria Célia Pinheiro Falcão atua na educação profissional com o compromisso de excelência, inovação e inclusão social.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl space-y-32">
        {/* Vision Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="order-2 md:order-1 space-y-8">
            <div className="p-10 bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800 relative shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="absolute -left-1 top-10 w-1.5 h-24 bg-primary-500 rounded-r-full"></div>
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap size={24} weight="regular" className="text-primary-700 dark:text-primary-400" />
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Nossa Visão</h3>
              </div>
              <p className="text-xl italic text-slate-600 dark:text-slate-300 leading-relaxed font-normal relative z-10">
                "Somos uma escola de oportunidades, comprometida com a formação integral de nossos alunos, preparando-os para a vida e para um futuro de realizações."
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-accent-50 dark:bg-accent-900/10 border border-accent-100 dark:border-accent-900/20">
                <div className="mt-1 text-accent-600"><Trophy size={20} weight="regular" /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Maior IDEB da CREDE 11</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Referência em qualidade de ensino e resultados acadêmicos.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20">
                <div className="mt-1 text-primary-600"><Users size={20} weight="regular" /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Top 100 Brasil em Equidade</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Reconhecimento nacional pelo trabalho inclusivo e igualitário.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-1 md:order-2 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-accent-500 rounded-[2.5rem] rotate-3 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-700"></div>
            <img
              src="/20211202_130856.jpg"
              alt="Fachada da Escola"
              loading="lazy"
              className="relative rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-800 aspect-[4/3] object-cover transform group-hover:-translate-y-2 transition-transform duration-700"
            />
            <div className="absolute -bottom-6 -left-6 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-xs hidden md:block">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Localização</p>
              <p className="font-bold text-slate-900 dark:text-white text-lg">Pereiro, Ceará</p>
            </div>
          </div>
        </div>

        {/* Infrastructure Section */}
        <div>
          <div className="text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="pill pill-accent bg-accent-50 dark:bg-accent-900/20 border-accent-100 dark:border-accent-900/30 text-accent-600 dark:text-accent-400">Estrutura</span>
            </motion.div>
            <h2 className="section-title mb-4">Infraestrutura Padrão MEC</h2>
            <div className="section-divider mb-6"></div>
            <p className="section-subtitle max-w-2xl mx-auto">
              Ambientes modernos e equipados para garantir a excelência no ensino prático e teórico.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {labs.map((lab, index) => (
              <GlassCard key={index} className="p-6 flex flex-col items-center text-center gap-4 hover:scale-[1.02] transition-transform duration-300">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${lab.color} group-hover:scale-110 transition-transform duration-300`}>
                  {lab.icon}
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">Lab. de {lab.name}</span>
              </GlassCard>
            ))}
            {/* Additional Facilities */}
            {facilities.map((item, index) => (
              <GlassCard key={`fac-${index}`} className="p-6 flex flex-col items-center text-center gap-4 hover:scale-[1.02] transition-transform duration-300">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{item.name}</span>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Pillars */}
        <div className="pb-20">
          <div className="text-center mb-20">
            <h2 className="section-title mb-4">Nossos Pilares</h2>
            <div className="section-divider"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard className="p-8 text-center hover:border-primary-500 transition-all duration-500 group border-transparent shadow-lg shadow-slate-200/50 dark:shadow-none bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50">
              <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-700 dark:text-primary-400 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary-900/5">
                <Target size={36} weight="regular" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-4 text-slate-900 dark:text-white group-hover:text-primary-700 transition-colors">Excelência Profissional</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4">Cursos técnicos alinhados às demandas atuais do mercado em Gestão, TI e Recursos Naturais.</p>
            </GlassCard>

            <GlassCard className="p-8 text-center hover:border-accent-500 transition-all duration-500 group border-transparent shadow-lg shadow-slate-200/50 dark:shadow-none bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 transform md:-translate-y-4">
              <div className="w-20 h-20 bg-accent-50 dark:bg-accent-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-accent-600 dark:text-accent-400 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-accent-900/5">
                <Heart size={36} weight="regular" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-4 text-slate-900 dark:text-white group-hover:text-accent-600 transition-colors">Formação Integral</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4">Desenvolvimento pleno do estudante: intelectual, físico, emocional, social e cultural.</p>
            </GlassCard>

            <GlassCard className="p-8 text-center hover:border-primary-500 transition-all duration-500 group border-transparent shadow-lg shadow-slate-200/50 dark:shadow-none bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Lightning size={36} weight="regular" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-4 text-slate-900 dark:text-white group-hover:text-primary-700 transition-colors">Realização</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4">Foco no projeto de vida do aluno e na construção de um futuro promissor e autônomo.</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </LiquidBackground>
  );
};
