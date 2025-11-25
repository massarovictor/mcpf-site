import React from 'react';
import { InstagramLogo, FacebookLogo, YoutubeLogo, Envelope, MapPin, Phone, Lock, MusicNote } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export const Footer: React.FC = () => {
  const { user } = useAuth();
  const authPath = user ? '/admin' : '/login';
  const authLabel = user ? 'Painel' : 'Área Restrita';

  const SocialLink = ({ href, icon: Icon, color }: { href: string, icon: React.ElementType, color: string }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={cn(
        "p-3 rounded-full bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 shadow-glass transition-all duration-300 hover:scale-110 hover:-translate-y-1",
        color
      )}
    >
      <Icon size={20} className="text-slate-700 dark:text-slate-200 group-hover:text-white" />
    </a>
  );

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-white/20 dark:bg-slate-950/30 backdrop-blur-xl">
      {/* Decorative Top Shine */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="container mx-auto px-6 max-w-6xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <img src="/logo-icon.svg" alt="Logo Icon" className="w-12 h-auto" />
              <div className="flex flex-col">
                <span className="font-bold font-display text-lg text-slate-900 dark:text-white leading-tight">
                  EEEP Professora<br/>Maria Célia Pinheiro Falcão
                </span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Formando profissionais de excelência com compromisso, inovação e qualidade técnica para o futuro.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 relative inline-block">
              Institucional
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {['Sobre a Escola', 'Cursos Técnicos', 'Editais e Notícias', 'Fale Conosco'].map((item, i) => (
                <li key={i}>
                  <Link 
                    to={['/about', '/courses', '/news', '/contact'][i]} 
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 relative inline-block">
              Contato
               <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-3">
                <Envelope size={18} weight="regular" className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                <span>eeepmariacelia@escola.ce.gov.br</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} weight="regular" className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                <span>(88) 3421-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} weight="regular" className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                <span>Pereiro, Ceará</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Redes Sociais</h4>
            <div className="flex gap-3">
              <SocialLink href="https://www.instagram.com/eeep_mariacelia/" icon={InstagramLogo} color="hover:bg-pink-600 hover:border-pink-500 hover:text-white" />
              <SocialLink href="https://www.facebook.com/eeepmcpf" icon={FacebookLogo} color="hover:bg-blue-600 hover:border-blue-500 hover:text-white" />
              <SocialLink href="https://www.youtube.com/c/EPMariaC%C3%A9lia" icon={YoutubeLogo} color="hover:bg-red-600 hover:border-red-500 hover:text-white" />
              <SocialLink href="https://www.tiktok.com/@eeep_mariacelia" icon={MusicNote} color="hover:bg-black hover:border-slate-700 hover:text-white" />
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-slate-500 font-medium">
              © 2026 EEEP Professora Maria Célia Pinheiro Falcão. Todos os direitos reservados.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Desenvolvido por <span className="font-semibold text-slate-600 dark:text-slate-400">Massaro Victor</span>
            </p>
          </div>
          <div className="flex gap-6 text-xs text-slate-500 font-medium items-center">
            <a href="#" className="hover:text-primary-600 transition-colors">Política de Privacidade</a>
            <Link to={authPath} className="hover:text-primary-600 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 dark:bg-white/5 border border-white/10 hover:bg-white/40 transition-all">
              <Lock size={10} weight="regular" />
              <span>{authLabel}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
