import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { useAuth } from '../contexts/AuthContext';
import { Lock, ArrowLeft, User, Key } from 'phosphor-react';

export const Login: React.FC = () => {
  const { signIn, user, loading, error, isSupabaseEnabled } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const redirectTo = (location.state as { from?: string })?.from || '/admin';
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    await signIn(email, password);
  };

  const loginDisabled = !isSupabaseEnabled || loading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>

      <GlassCard className="w-full max-w-md mx-auto shadow-2xl border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl relative z-10 animate-slide-up p-8">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30 transform rotate-3">
            <Lock size={36} weight="regular" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Área Restrita</h1>
          <p className="text-slate-500 text-base mt-2">Acesse o painel administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Institucional</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} weight="regular" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="admin@escola.com"
                autoComplete="email"
                required
                disabled={loginDisabled}
                aria-label="Email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Senha</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} weight="regular" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={loginDisabled}
                aria-label="Senha"
              />
            </div>
          </div>

          {error && submitted && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 flex items-start gap-3">
              <div className="text-red-600 mt-0.5"><Lock size={16} weight="regular" /></div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
            </div>
          )}

          {!isSupabaseEnabled && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40">
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium text-center">
                ⚠️ Configure as variáveis de ambiente do Supabase para habilitar o login.
              </p>
            </div>
          )}

          <GlassButton className="w-full py-4 text-base shadow-xl shadow-primary-900/20 hover:shadow-primary-900/30 bg-primary-700 hover:bg-primary-600 transition-all hover:-translate-y-1" size="lg" isLoading={loading} disabled={loginDisabled}>
            Entrar no Sistema
          </GlassButton>
        </form>

        <div className="mt-10 text-center pt-8 border-t border-slate-100 dark:border-slate-800">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors group">
            <ArrowLeft size={16} weight="regular" className="group-hover:-translate-x-1 transition-transform" /> Voltar ao site principal
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
