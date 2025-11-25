import { supabase, hasSupabase } from './supabaseClient';
import { NewsItem } from '../types';

const TABLE = 'news';

type ServiceResult<T> = { data: T | null; error: string | null };

const adaptNews = (row: any): NewsItem => ({
  id: row.id,
  title: row.title,
  summary: row.summary,
  category: row.category,
  date: row.date,
  image: row.image,
  featured: row.featured ?? false,
  type: row.type || 'news',
  content: row.content,
  timeline: Array.isArray(row.timeline) ? row.timeline : [],
  attachments: Array.isArray(row.attachments) ? row.attachments : [],
});

export const fetchNews = async (): Promise<ServiceResult<NewsItem[]>> => {
  if (!supabase || !hasSupabase) return { data: null, error: 'Supabase não configurado' };

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('date', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: (data || []).map(adaptNews), error: null };
};

export const createNews = async (
  payload: Omit<NewsItem, 'id'>
): Promise<ServiceResult<NewsItem>> => {
  if (!supabase || !hasSupabase) return { data: null, error: 'Supabase não configurado' };

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...payload })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Nenhum dado retornado' };
  return { data: adaptNews(data), error: null };
};

export const updateNewsRemote = async (
  payload: NewsItem
): Promise<ServiceResult<NewsItem>> => {
  if (!supabase || !hasSupabase) return { data: null, error: 'Supabase não configurado' };

  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload })
    .eq('id', payload.id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Nenhum dado retornado' };
  return { data: adaptNews(data), error: null };
};

export const deleteNewsRemote = async (id: string): Promise<ServiceResult<boolean>> => {
  if (!supabase || !hasSupabase) return { data: null, error: 'Supabase não configurado' };

  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) return { data: null, error: error.message };
  return { data: true, error: null };
};
