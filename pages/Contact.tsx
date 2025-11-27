import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { LiquidBackground } from '../components/LiquidBackground';
import { MapPin, Envelope, Phone, Clock, PaperPlaneTilt, ChatCircle, InstagramLogo, FacebookLogo, YoutubeLogo, MusicNote } from 'phosphor-react';
import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

export const Contact: React.FC = () => {
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const subject = `[Contato Site] ${data.subject || 'Geral'}: ${data.name}`;
    const body = `Nome: ${data.name}\nEmail: ${data.email}\nTelefone: ${data.phone || 'Não informado'}\n\nMensagem:\n${data.message}`;

    window.location.href = `mailto:eeepmariacelia@escola.ce.gov.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    addToast('Abrindo seu cliente de email para envio...', 'info');
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen relative">
      <LiquidBackground className="absolute inset-0 !min-h-full" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-14 sm:pt-32 sm:pb-18 md:pt-44 md:pb-20 overflow-hidden min-h-[65vh] flex items-center">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="pill pill-primary bg-white/80 dark:bg-slate-900/80"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              <span>Fale Conosco</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="section-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
            >
              Vamos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">
                Conversar?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="section-subtitle max-w-3xl mx-auto"
            >
              Estamos prontos para responder suas dúvidas sobre matrículas, parcerias ou visitas ao campus.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl py-20 relative z-10">
        <div className="space-y-32">
          {/* Form Section */}
          <div className="max-w-4xl mx-auto w-full">
            <GlassCard className="p-8 md:p-10 rounded-3xl hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 flex items-center justify-center">
                  <ChatCircle size={24} weight="regular" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Envie sua mensagem</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Preencha os campos abaixo e entraremos em contato.</p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nome Completo</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full px-5 py-3 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm text-slate-900 dark:text-white shadow-sm"
                    placeholder="Digite seu nome"
                    required
                    aria-label="Nome"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email para contato</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-5 py-3 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm text-slate-900 dark:text-white shadow-sm"
                    placeholder="exemplo@email.com"
                    required
                    aria-label="Email"
                  />
                </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Assunto</label>
                <select name="subject" className="w-full px-5 py-3 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-sm text-slate-900 dark:text-white cursor-pointer appearance-none shadow-sm">
                  <option value="" disabled>Selecione o assunto</option>
                      <option>Processo Seletivo</option>
                      <option>Secretaria Escolar</option>
                      <option>Financeiro / Administrativo</option>
                      <option>Parcerias</option>
                      <option>Outros</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Telefone (Opcional)</label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-5 py-3 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm text-slate-900 dark:text-white shadow-sm"
                    placeholder="(00) 00000-0000"
                    aria-label="Telefone"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Mensagem</label>
                  <textarea
                    name="message"
                    rows={5}
                    className="w-full px-5 py-3 rounded-3xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm text-slate-900 dark:text-white resize-none shadow-sm"
                    placeholder="Escreva sua mensagem aqui..."
                    required
                    aria-label="Mensagem"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-1">
                  <GlassButton type="submit" className="w-full md:w-auto px-6 py-2.5 text-sm shadow-lg shadow-primary-900/10 hover:shadow-primary-900/20" size="md" icon={PaperPlaneTilt}>
                    Enviar Mensagem
                  </GlassButton>
                </div>
              </form>
            </GlassCard>
          </div>

          {/* Support Channels Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white mb-6">Canais de Atendimento</h3>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mb-6"></div>
              <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">Escolha a melhor forma de falar com a gente</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-8 flex flex-col items-center text-center gap-4 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 flex items-center justify-center">
                  <MapPin size={28} weight="regular" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-slate-900 dark:text-white text-lg mb-2">Visite-nos</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Av. Futuro 2026, Centro<br />Pereiro - CE, 63460-000</p>
                </div>
              </GlassCard>

              <GlassCard className="p-8 flex flex-col items-center text-center gap-4 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 flex items-center justify-center">
                  <Envelope size={28} weight="regular" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-slate-900 dark:text-white text-lg mb-2">Email</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">eeepmariacelia@escola.ce.gov.br</p>
                  <p className="text-slate-400 text-xs mt-1">Resposta em até 24h úteis</p>
                </div>
              </GlassCard>

              <GlassCard className="p-8 flex flex-col items-center text-center gap-4 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                  <Phone size={28} weight="regular" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-slate-900 dark:text-white text-lg mb-2">Telefone</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">(88) 3421-0000</p>
                  <p className="text-slate-400 text-xs mt-1">Seg. a Sex. das 7h às 17h</p>
                </div>
              </GlassCard>

              <GlassCard className="p-8 flex flex-col items-center text-center gap-4 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <Clock size={28} weight="regular" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-slate-900 dark:text-white text-lg mb-2">Horário</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Seg. a Sex: 7h às 17h</p>
                  <p className="text-slate-400 text-xs mt-1">Exceto feriados</p>
                </div>
              </GlassCard>
            </div>

            <div className="text-center pt-16">
              <h3 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white mb-6">Redes Sociais</h3>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mb-6"></div>
              <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">Acompanhe nosso dia a dia</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href="https://www.instagram.com/eeep_mariacelia/" target="_blank" rel="noopener noreferrer" className="group">
                <GlassCard className="p-8 flex flex-col items-center text-center gap-4 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors rounded-3xl">
                  <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                    <InstagramLogo size={28} weight="regular" />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-slate-900 dark:text-white text-lg mb-1">Instagram</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">@eeep_mariacelia</p>
                  </div>
                </GlassCard>
              </a>

              <a href="https://www.facebook.com/eeepmcpf" target="_blank" rel="noopener noreferrer" className="group">
                <GlassCard className="p-8 flex flex-col items-center text-center gap-4 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors rounded-3xl">
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FacebookLogo size={28} weight="regular" />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-slate-900 dark:text-white text-lg mb-1">Facebook</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">EEEP Maria Célia</p>
                  </div>
                </GlassCard>
              </a>

              <a href="https://www.youtube.com/c/EPMariaC%C3%A9lia" target="_blank" rel="noopener noreferrer" className="group">
                <GlassCard className="p-8 flex flex-col items-center text-center gap-4 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors rounded-3xl">
                  <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <YoutubeLogo size={28} weight="regular" />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-slate-900 dark:text-white text-lg mb-1">YouTube</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Canal Oficial</p>
                  </div>
                </GlassCard>
              </a>

              <a href="https://www.tiktok.com/@eeep_mariacelia" target="_blank" rel="noopener noreferrer" className="group">
                <GlassCard className="p-8 flex flex-col items-center text-center gap-4 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors rounded-3xl">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center">
                    <MusicNote size={28} weight="regular" />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-slate-900 dark:text-white text-lg mb-1">TikTok</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">@eeep_mariacelia</p>
                  </div>
                </GlassCard>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
