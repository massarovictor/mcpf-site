import { supabase, hasSupabase } from './supabaseClient';
import { Course } from '../types';

const TABLE = 'courses';

type ServiceResult<T> = { data: T | null; error: string | null };

const adaptCourse = (row: any): Course => ({
  id: row.id,
  title: row.title,
  category: row.category,
  description: row.description,
  duration: row.duration,
  level: row.level,
  image: row.image,
  modules: Array.isArray(row.modules) ? row.modules : [],
  opportunities: Array.isArray(row.opportunities) ? row.opportunities : [],
});

export const fetchCourses = async (): Promise<ServiceResult<Course[]>> => {
  if (!supabase || !hasSupabase) return { data: null, error: 'Supabase não configurado' };

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('title', { ascending: true });

  if (error) return { data: null, error: error.message };
  return { data: (data || []).map(adaptCourse), error: null };
};

export const createCourse = async (
  payload: Omit<Course, 'id'>
): Promise<ServiceResult<Course>> => {
  if (!supabase || !hasSupabase) return { data: null, error: 'Supabase não configurado' };

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...payload })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Nenhum dado retornado' };
  return { data: adaptCourse(data), error: null };
};

export const updateCourseRemote = async (
  payload: Course
): Promise<ServiceResult<Course>> => {
  if (!supabase || !hasSupabase) return { data: null, error: 'Supabase não configurado' };

  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload })
    .eq('id', payload.id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Nenhum dado retornado' };
  return { data: adaptCourse(data), error: null };
};

export const deleteCourseRemote = async (id: string): Promise<ServiceResult<boolean>> => {
  if (!supabase || !hasSupabase) return { data: null, error: 'Supabase não configurado' };

  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) return { data: null, error: error.message };
  return { data: true, error: null };
};
