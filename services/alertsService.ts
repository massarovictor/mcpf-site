import { supabase, hasSupabase } from './supabaseClient';
import type { Alert } from '../types';

const TABLE = 'alerts';

const mapRowToAlert = (row: any): Alert => ({
  id: row.id,
  title: row.title ?? '',
  message: row.message ?? '',
  level: row.level ?? 'info',
  startAt: row.start_at ?? row.startAt ?? '',
  endAt: row.end_at ?? row.endAt ?? null,
  isActive: Boolean(row.is_active ?? row.isActive ?? false),
  ctaLabel: row.cta_label ?? row.ctaLabel ?? '',
  ctaUrl: row.cta_url ?? row.ctaUrl ?? '',
  createdAt: row.created_at ?? row.createdAt ?? undefined,
});

export async function fetchActiveAlert() {
  if (!supabase || !hasSupabase) return { data: null as Alert | null, error: 'Supabase não configurado' };
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .lte('start_at', now)
    .gte('end_at', now)
    .order('start_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  return { data: data ? mapRowToAlert(data) : null, error: null };
}

export async function fetchAlerts() {
  if (!supabase || !hasSupabase) return { data: [] as Alert[], error: 'Supabase não configurado' };
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data || []).map(mapRowToAlert), error: null };
}

export async function createAlert(alert: Omit<Alert, 'id' | 'createdAt'>) {
  if (!supabase || !hasSupabase) return { data: null as Alert | null, error: 'Supabase não configurado' };
  const payload = {
    title: alert.title,
    message: alert.message,
    level: alert.level,
    start_at: alert.startAt,
    end_at: alert.endAt || null,
    is_active: alert.isActive,
    cta_label: alert.ctaLabel || null,
    cta_url: alert.ctaUrl || null,
  };
  const { data, error } = await supabase.from(TABLE).insert(payload).select('*').single();
  if (error) return { data: null, error: error.message };
  return { data: mapRowToAlert(data), error: null };
}

export async function updateAlert(alert: Alert) {
  if (!supabase || !hasSupabase) return { data: null as Alert | null, error: 'Supabase não configurado' };
  const payload = {
    title: alert.title,
    message: alert.message,
    level: alert.level,
    start_at: alert.startAt,
    end_at: alert.endAt || null,
    is_active: alert.isActive,
    cta_label: alert.ctaLabel || null,
    cta_url: alert.ctaUrl || null,
  };
  const { data, error } = await supabase.from(TABLE).update(payload).eq('id', alert.id).select('*').single();
  if (error) return { data: null, error: error.message };
  return { data: mapRowToAlert(data), error: null };
}

export async function deleteAlert(id: string) {
  if (!supabase || !hasSupabase) return { error: 'Supabase não configurado' };
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}
