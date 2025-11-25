import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsItem, Course } from '../types';
import { NEWS as INITIAL_NEWS, COURSES as INITIAL_COURSES } from '../constants';
import { hasSupabase } from '../services/supabaseClient';
import { fetchNews, createNews, updateNewsRemote, deleteNewsRemote } from '../services/newsService';
import { fetchCourses, createCourse, updateCourseRemote, deleteCourseRemote } from '../services/coursesService';

interface DataContextType {
  news: NewsItem[];
  courses: Course[];
  addNews: (item: Omit<NewsItem, 'id'>) => Promise<boolean>;
  updateNews: (item: NewsItem) => Promise<boolean>;
  deleteNews: (id: string) => Promise<boolean>;
  addCourse: (item: Omit<Course, 'id'>) => Promise<boolean>;
  updateCourse: (item: Course) => Promise<boolean>;
  deleteCourse: (id: string) => Promise<boolean>;
  resetData: () => Promise<void>;
  isRemote: boolean;
  isLoadingNews: boolean;
  lastError: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseEnabled = hasSupabase;

  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(supabaseEnabled);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(supabaseEnabled);
  const [lastError, setLastError] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    if (supabaseEnabled) {
      const loadRemote = async () => {
        setIsLoadingNews(true);
        setIsLoadingCourses(true);
        const [newsRes, coursesRes] = await Promise.all([fetchNews(), fetchCourses()]);

        if (newsRes.error || !newsRes.data) {
          setLastError(newsRes.error ?? 'Erro ao carregar notícias do Supabase');
          setNews(INITIAL_NEWS);
        } else {
          setNews(newsRes.data);
        }

        if (coursesRes.error || !coursesRes.data) {
          setLastError(coursesRes.error ?? 'Erro ao carregar cursos do Supabase');
          setCourses(INITIAL_COURSES);
        } else {
          setCourses(coursesRes.data);
        }
        setIsLoadingNews(false);
        setIsLoadingCourses(false);
      };
      loadRemote();
    } else {
      try {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem('school_news');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setNews(parsed);
        }
      } catch (error) {
        console.error('Failed to parse news from localStorage:', error);
      }
      try {
        if (typeof window === 'undefined') return;
        const savedCourses = localStorage.getItem('school_courses');
        if (savedCourses) {
          const parsed = JSON.parse(savedCourses);
          if (Array.isArray(parsed)) setCourses(parsed);
        }
      } catch (error) {
        console.error('Failed to parse courses from localStorage:', error);
      }
    }
  }, [supabaseEnabled]);

  // Save to LocalStorage whenever state changes (local-only)
  useEffect(() => {
    if (supabaseEnabled) return;
    try {
      localStorage.setItem('school_news', JSON.stringify(news));
    } catch (error) {
      console.error('Failed to save news to localStorage:', error);
    }
  }, [news, supabaseEnabled]);

  // Save courses locally quando não remoto
  useEffect(() => {
    if (supabaseEnabled) return;
    try {
      localStorage.setItem('school_courses', JSON.stringify(courses));
    } catch (error) {
      console.error('Failed to save courses to localStorage:', error);
    }
  }, [courses, supabaseEnabled]);

  const addNews = async (item: Omit<NewsItem, 'id'>) => {
    setLastError(null);
    if (supabaseEnabled) {
      const { data, error } = await createNews(item);
      if (error || !data) {
        setLastError(error ?? 'Erro ao criar notícia');
        return false;
      }
      setNews(prev => [data, ...prev]);
      return true;
    }

    const newItem: NewsItem = {
      ...item,
      id: Date.now().toString(),
    };
    setNews(prev => [newItem, ...prev]);
    return true;
  };

  const updateNews = async (updatedItem: NewsItem) => {
    setLastError(null);
    if (supabaseEnabled) {
      const { data, error } = await updateNewsRemote(updatedItem);
      if (error || !data) {
        setLastError(error ?? 'Erro ao atualizar notícia');
        return false;
      }
      setNews(prev => prev.map(item => item.id === data.id ? data : item));
      return true;
    }
    setNews(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    return true;
  };

  const deleteNews = async (id: string) => {
    setLastError(null);
    if (supabaseEnabled) {
      const { error } = await deleteNewsRemote(id);
      if (error) {
        setLastError(error);
        return false;
      }
      setNews(prev => prev.filter(item => item.id !== id));
      return true;
    }
    setNews(prev => prev.filter(item => item.id !== id));
    return true;
  };

  const resetData = async () => {
    setLastError(null);
    if (supabaseEnabled) {
      setIsLoadingNews(true);
      const { data, error } = await fetchNews();
      if (error || !data) {
        setLastError(error ?? 'Erro ao recarregar notícias');
        setNews(INITIAL_NEWS);
      } else {
        setNews(data);
      }
      setIsLoadingNews(false);
      return;
    }

    setNews(INITIAL_NEWS);
    setCourses(INITIAL_COURSES);
    try {
      localStorage.removeItem('school_news');
      localStorage.removeItem('school_courses');
    } catch (error) {
      console.error('Failed to reset localStorage:', error);
    }
  };

  const addCourse = async (item: Omit<Course, 'id'>) => {
    setLastError(null);
    if (supabaseEnabled) {
      const { data, error } = await createCourse(item);
      if (error || !data) {
        setLastError(error ?? 'Erro ao criar curso');
        return false;
      }
      setCourses(prev => [data, ...prev]);
      return true;
    }

    const newItem: Course = { ...item, id: Date.now().toString() };
    setCourses(prev => [newItem, ...prev]);
    return true;
  };

  const updateCourse = async (item: Course) => {
    setLastError(null);
    if (supabaseEnabled) {
      const { data, error } = await updateCourseRemote(item);
      if (error || !data) {
        setLastError(error ?? 'Erro ao atualizar curso');
        return false;
      }
      setCourses(prev => prev.map(c => c.id === data.id ? data : c));
      return true;
    }
    setCourses(prev => prev.map(c => c.id === item.id ? item : c));
    return true;
  };

  const deleteCourse = async (id: string) => {
    setLastError(null);
    if (supabaseEnabled) {
      const { error } = await deleteCourseRemote(id);
      if (error) {
        setLastError(error);
        return false;
      }
      setCourses(prev => prev.filter(c => c.id !== id));
      return true;
    }
    setCourses(prev => prev.filter(c => c.id !== id));
    return true;
  };

  return (
    <DataContext.Provider value={{ news, courses, addNews, updateNews, deleteNews, addCourse, updateCourse, deleteCourse, resetData, isRemote: supabaseEnabled, isLoadingNews, lastError }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
