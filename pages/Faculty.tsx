import React from 'react';
import { FACULTY } from '../constants';
import { Card } from '../components/Card';
import { LinkedinLogo, TwitterLogo, Envelope, GraduationCap } from 'phosphor-react';

export const Faculty: React.FC = () => {
  return (
    <div className="pb-24">
      {/* Centralized Hero Section */}
      <section className="relative pt-28 pb-14 sm:pt-32 sm:pb-18 md:pt-44 md:pb-20 overflow-hidden flex items-center justify-center min-h-[65vh]">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-accent-500/5 dark:bg-accent-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 max-w-4xl">
          <div className="animate-in slide-in-from-bottom-10 duration-700 fade-in space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-accent-200 dark:border-accent-900/30 shadow-sm mx-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-500"></span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wide uppercase">Corpo Docente</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Mentes que <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400">Inspiram</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Conheça os educadores, coordenadores e especialistas dedicados a guiar sua jornada acadêmica e profissional.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACULTY.map(member => (
            <Card key={member.id} className="text-center flex flex-col h-full group border-slate-200 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-500" hoverEffect>
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-full relative z-10 border-4 border-white dark:border-slate-800 shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 right-0 z-20 bg-white dark:bg-slate-800 p-2 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm text-primary-600">
                  <GraduationCap size={16} weight="regular" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{member.name}</h3>
              <p className="text-accent-600 dark:text-accent-400 font-bold text-sm uppercase tracking-wider mb-6 bg-accent-50 dark:bg-accent-900/20 py-1 px-3 rounded-full inline-block mx-auto">{member.role}</p>

              <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 italic leading-relaxed flex-grow px-4 relative">
                <span className="absolute top-0 left-0 text-4xl text-slate-200 dark:text-slate-800 font-serif transform -translate-x-2 -translate-y-4">"</span>
                {member.bio}
                <span className="absolute bottom-0 right-0 text-4xl text-slate-200 dark:text-slate-800 font-serif transform translate-x-2 translate-y-4">"</span>
              </p>

              <div className="flex justify-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button className="p-2.5 text-slate-400 hover:text-white hover:bg-[#0077b5] rounded-xl transition-all duration-300"><LinkedinLogo size={20} weight="regular" /></button>
                <button className="p-2.5 text-slate-400 hover:text-white hover:bg-black rounded-xl transition-all duration-300"><TwitterLogo size={20} weight="regular" /></button>
                <button className="p-2.5 text-slate-400 hover:text-white hover:bg-accent-500 rounded-xl transition-all duration-300"><Envelope size={20} weight="regular" /></button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
