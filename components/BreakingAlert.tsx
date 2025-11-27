import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Alert } from '../types';
import { fetchActiveAlert } from '../services/alertsService';
import { X, Clock, Link as LinkIcon, Warning } from 'phosphor-react';

const formatRemaining = (endAt?: string | null) => {
  if (!endAt) return '';
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return 'Expirado';
  const mins = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
};

export const BreakingAlert: React.FC = () => {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [remaining, setRemaining] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(100);

  const computeProgress = (start?: string, end?: string) => {
    if (!start || !end) return 100;
    const now = Date.now();
    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();
    if (endMs <= startMs) return 100;
    const pct = ((now - startMs) / (endMs - startMs)) * 100;
    return Math.max(0, Math.min(100, 100 - pct));
  };

  
  useEffect(() => {
    const load = async () => {
      const res = await fetchActiveAlert();
      if (res.data) {
        setAlert(res.data);
        setRemaining(formatRemaining(res.data.endAt));
        setProgress(computeProgress(res.data.startAt, res.data.endAt || undefined));
      }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!alert || !alert.endAt) return;
    const id = window.setInterval(() => {
      setRemaining(formatRemaining(alert.endAt));
      setProgress(computeProgress(alert.startAt, alert.endAt));
    }, 1000);
    return () => window.clearInterval(id);
  }, [alert]);

  if (loading || !alert ) return null;
  if (typeof document === 'undefined') return null;

  const handleClose = () => {
    setAlert(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-[12000] flex items-start justify-center px-4 pt-10 sm:pt-12">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-950/95 border border-white/30 dark:border-slate-800/70 rounded-3xl shadow-[0_20px_80px_rgba(15,23,42,0.35)] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between gap-3 px-6 py-4 bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-inner">
              <Warning size={20} weight="bold" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold opacity-80">Alerta urgente</p>
              <h3 className="text-lg sm:text-xl font-black leading-tight">{alert.title}</h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fechar alerta"
            className="p-2 rounded-full hover:bg-white/15 transition-colors"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">{alert.message}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {alert.endAt && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60">
                <Clock size={14} weight="regular" /> Expira em {remaining || '-'}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold tracking-wide ${
                alert.level === 'urgent'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                  : alert.level === 'warning'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
              }`}
            >
              {alert.level === 'urgent' ? 'Urgente' : alert.level === 'warning' ? 'Aviso' : 'Informativo'}
            </span>
          </div>

          {alert.ctaUrl && alert.ctaLabel && (
            <div className="pt-1">
              <a
                href={alert.ctaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-600/90 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-500/30 border border-white/20 transition-all"
              >
                <LinkIcon size={16} weight="bold" /> {alert.ctaLabel}
              </a>
            </div>
          )}
        </div>

        {alert.endAt && (
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full transition-[width] duration-500 ${
                alert.level === 'urgent'
                  ? 'bg-red-500'
                  : alert.level === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-primary-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

