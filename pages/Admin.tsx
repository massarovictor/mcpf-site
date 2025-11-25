import React, { useMemo, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { LiquidBackground } from '../components/LiquidBackground';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { NewsItem, TimelineEvent } from '../types';
import { SquaresFour, FileText, BookOpen, Gear, Plus, Trash, PencilSimple, SignOut, X, FloppyDisk, WarningCircle, ShieldCheck, Stack, MagnifyingGlass, Funnel, Clock, Calendar, Link as LinkIcon, Download } from 'phosphor-react';
import { Course } from '../types';

export const Admin: React.FC = () => {
  const { news, courses, addNews, updateNews, deleteNews, addCourse, updateCourse, deleteCourse, isRemote, isLoadingNews, lastError } = useData();
  const { signOut, user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'courses'>('dashboard');
  const [newsSearch, setNewsSearch] = useState('');
  const [newsTypeFilter, setNewsTypeFilter] = useState<'todos' | 'news' | 'edital'>('todos');
  const [courseSearch, setCourseSearch] = useState('');

  // Helper function to convert date from "DD de MMM de YYYY" to "YYYY-MM-DD"
  const brazilianToISODate = (dateStr: string): string => {
    try {
      const monthMap: { [key: string]: string } = {
        'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04', 'mai': '05', 'jun': '06',
        'jul': '07', 'ago': '08', 'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
      };
      // Extract day, month, year from format like "23 de nov. de 2025"
      const match = dateStr.match(/(\d+)\s+de\s+(\w+)\.?\s+de\s+(\d{4})/);
      if (match) {
        const [, day, monthStr, year] = match;
        const monthNum = monthMap[monthStr.toLowerCase().substring(0, 3)];
        return `${year}-${monthNum}-${day.padStart(2, '0')}`;
      }
      return dateStr; // Return as is if format doesn't match
    } catch {
      return dateStr;
    }
  };

  // Helper function to convert date from "YYYY-MM-DD" to "DD de MMM de YYYY"
  const isoToBrazilianDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Form state for News
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<NewsItem, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0], // Use ISO format YYYY-MM-DD
    summary: '',
    category: 'Geral',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    featured: false,
    type: 'news',
    content: '',
    timeline: []
  });
  // Form state for Courses
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState<Omit<Course, 'id'>>({
    title: '',
    category: 'Gestão e Negócios',
    description: '',
    duration: '3 Anos',
    level: 'Ensino Médio Integrado',
    image: '',
    modules: [],
    opportunities: []
  });
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; targetId: string | null; type: 'news' | 'course' | null }>({ open: false, targetId: null, type: null });

  const handleOpenForm = (item?: NewsItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        date: brazilianToISODate(item.date), // Convert to ISO for date input
        summary: item.summary,
        category: item.category,
        image: item.image,
        featured: item.featured,
        type: item.type || 'news',
        content: item.content || '',
        timeline: item.timeline || []
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        summary: '',
        category: 'Geral',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        featured: false,
        type: 'news',
        content: '',
        timeline: []
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim() || !formData.date.trim() || !formData.category.trim() || !formData.image.trim()) {
      addToast('Preencha título, resumo, data, categoria e imagem.', 'error');
      return;
    }
    setIsSaving(true);
    // Convert date from ISO to Brazilian format before saving
    const dataToSave = {
      ...formData,
      date: isoToBrazilianDate(formData.date)
    };
    const ok = editingId
      ? await updateNews({ ...dataToSave, id: editingId })
      : await addNews(dataToSave);
    setIsSaving(false);
    if (ok) {
      setIsFormOpen(false);
    }
  };

  const handleOpenCourseForm = (item?: Course) => {
    if (item) {
      setEditingCourseId(item.id);
      setCourseForm({
        title: item.title,
        category: item.category,
        description: item.description,
        duration: item.duration,
        level: item.level,
        image: item.image,
        modules: item.modules || [],
        opportunities: item.opportunities || []
      });
    } else {
      setEditingCourseId(null);
      setCourseForm({
        title: '',
        category: 'Gestão e Negócios',
        description: '',
        duration: '3 Anos',
        level: 'Ensino Médio Integrado',
        image: '',
        modules: [],
        opportunities: []
      });
    }
    setIsCourseFormOpen(true);
  };

  const filteredNews = useMemo(() => {
    const term = newsSearch.toLowerCase().trim();
    return news.filter(item => {
      const matchesSearch = !term || item.title.toLowerCase().includes(term) || item.summary.toLowerCase().includes(term);
      const matchesType = newsTypeFilter === 'todos' ? true : (item.type || 'news') === newsTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [news, newsSearch, newsTypeFilter]);

  const filteredCourses = useMemo(() => {
    const term = courseSearch.toLowerCase().trim();
    return courses.filter(course =>
      !term ||
      course.title.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term) ||
      course.category.toLowerCase().includes(term)
    );
  }, [courses, courseSearch]);

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim() || !courseForm.category.trim() || !courseForm.description.trim() || !courseForm.duration.trim() || !courseForm.level.trim() || !courseForm.image.trim()) {
      addToast('Preencha todos os campos obrigatórios do curso.', 'error');
      return;
    }
    setIsSaving(true);
    const normalizeList = (value: string): string[] =>
      value
        .split('\n')
        .map(v => v.trim())
        .filter(Boolean);

    const payload: Omit<Course, 'id'> = {
      ...courseForm,
      modules: normalizeList((courseForm.modules || []).join('\n')),
      opportunities: normalizeList((courseForm.opportunities || []).join('\n'))
    };

    const ok = editingCourseId
      ? await updateCourse({ ...payload, id: editingCourseId })
      : await addCourse(payload);

    setIsSaving(false);
    if (ok) setIsCourseFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.targetId || !confirmDialog.type) return;
    setIsSaving(true);
    if (confirmDialog.type === 'course') {
      await deleteCourse(confirmDialog.targetId);
    } else {
      await deleteNews(confirmDialog.targetId);
    }
    setIsSaving(false);
    setConfirmDialog({ open: false, targetId: null, type: null });
  };

  const handleDeleteCourse = async (id: string) => {
    setConfirmDialog({ open: true, targetId: id, type: 'course' });
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({ open: true, targetId: id, type: 'news' });
  };

  return (
    <div className="min-h-screen flex relative">
      <LiquidBackground className="absolute inset-0 !min-h-full" />
      {/* Sidebar */}
      <aside className="w-72 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-r border-white/20 dark:border-white/10 hidden lg:flex flex-col fixed h-full z-20 shadow-glass">
        <div className="p-8">
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white tracking-tight">Admin<span className="text-primary-700">Panel</span></h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium px-3 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full w-fit text-slate-600 dark:text-slate-400 border border-white/20 dark:border-white/10">
            <ShieldCheck size={14} className="text-primary-600" />
            <span>{isRemote ? 'Conectado ao Supabase' : 'Modo Local (Demo)'}</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-full font-bold text-sm transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-primary-500/10 text-primary-700 dark:text-primary-400 border border-primary-500/20 shadow-sm translate-x-1' : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <SquaresFour size={20} weight="regular" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-full font-bold text-sm transition-all duration-200 ${activeTab === 'news' ? 'bg-primary-500/10 text-primary-700 dark:text-primary-400 border border-primary-500/20 shadow-sm translate-x-1' : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <FileText size={20} weight="regular" /> Gerenciar Notícias
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-full font-bold text-sm transition-all duration-200 ${activeTab === 'courses' ? 'bg-primary-500/10 text-primary-700 dark:text-primary-400 border border-primary-500/20 shadow-sm translate-x-1' : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <BookOpen size={20} weight="regular" /> Gerenciar Cursos
          </button>
        </nav>
        <div className="p-6 border-t border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-sm font-bold shadow-md">
              {user?.email?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email ?? 'Administrador'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                <p className="text-xs text-slate-500">Online</p>
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-red-600 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100/80 dark:hover:bg-red-900/30 transition-colors text-sm border border-red-200/50 dark:border-red-900/20"
          >
            <SignOut size={18} weight="regular" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-8 md:p-12 min-h-screen overflow-x-hidden relative z-10">
        {lastError && (
          <div className="max-w-6xl mx-auto mb-8 animate-in slide-in-from-top-5">
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/40 shadow-sm">
              <WarningCircle size={20} weight="regular" className="shrink-0" />
              <span className="text-sm font-medium">{lastError}</span>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">Visão Geral</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Bem-vindo de volta ao painel de controle.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="flex items-center gap-6 p-6 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-300 rounded-3xl border-l-4 border-l-primary-500">
                <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 flex items-center justify-center"><FileText size={32} weight="regular" /></div>
                <div>
                  <h3 className="text-4xl font-bold font-display text-slate-900 dark:text-white">{news.length}</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1">Notícias Ativas</p>
                </div>
              </GlassCard>
              <GlassCard className="flex items-center gap-6 p-6 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-300 rounded-3xl border-l-4 border-l-accent-500">
                <div className="w-16 h-16 rounded-full bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 flex items-center justify-center"><BookOpen size={32} weight="regular" /></div>
                <div>
                  <h3 className="text-4xl font-bold font-display text-slate-900 dark:text-white">{courses.length}</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1">Cursos Ofertados</p>
                </div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="flex flex-col gap-4 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all group cursor-pointer h-full p-8 rounded-3xl" onClick={() => setActiveTab('news')}>
                <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 group-hover:scale-110 transition-transform flex items-center justify-center"><FileText size={28} weight="regular" /></div>
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Gerenciar Notícias</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Publicação e edição de notícias, editais e comunicados escolares.</p>
                </div>
                <div className="mt-auto pt-4 flex items-center text-primary-700 dark:text-primary-400 text-sm font-bold group-hover:translate-x-2 transition-transform">
                  Acessar módulo →
                </div>
              </GlassCard>

              <GlassCard className="flex flex-col gap-4 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all group cursor-pointer h-full p-8 rounded-3xl" onClick={() => setActiveTab('courses')}>
                <div className="w-14 h-14 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 group-hover:scale-110 transition-transform flex items-center justify-center"><BookOpen size={28} weight="regular" /></div>
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Gerenciar Cursos</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Cadastro e atualização da grade curricular e informações dos cursos.</p>
                </div>
                <div className="mt-auto pt-4 flex items-center text-accent-600 dark:text-accent-400 text-sm font-bold group-hover:translate-x-2 transition-transform">
                  Acessar módulo →
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Notícias e Editais</h1>
                <p className="text-slate-500 mt-2 text-lg">Gerencie o conteúdo informativo do portal.</p>
              </div>
              <GlassButton size="lg" icon={Plus} onClick={() => handleOpenForm()} variant="primary" className="shadow-lg" disabled={isSaving || isLoadingNews}>
                Nova Publicação
              </GlassButton>
            </div>

            {/* Search and Filter Bar */}
            <GlassCard className="p-4 flex flex-col md:flex-row items-center gap-4 rounded-3xl">
              <div className="relative flex-grow w-full md:w-auto">
                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" size={18} weight="regular" />
                <input
                  type="text"
                  placeholder="Buscar notícias..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none text-sm shadow-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 w-full md:w-auto justify-end flex-wrap">
                <div className="flex items-center gap-2">
                  <Funnel size={16} weight="regular" />
                  <span>Filtrar por: Tipo</span>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: 'Todos', value: 'todos' },
                    { label: 'Notícias', value: 'news' },
                    { label: 'Editais', value: 'edital' },
                  ].map(filter => (
                    <button
                      key={filter.value}
                      onClick={() => setNewsTypeFilter(filter.value as typeof newsTypeFilter)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        newsTypeFilter === filter.value
                          ? 'bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-500/20'
                          : 'bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border border-white/10 hover:bg-white/80 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* News Grid */}
            <div className="grid gap-4">
              {isLoadingNews ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Carregando dados...</span>
                  </div>
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 mb-4">
                    <MagnifyingGlass size={32} weight="regular" />
                  </div>
                  <p className="text-sm">Nenhuma notícia correspondente.</p>
                  <p className="text-xs text-slate-400 mt-1">Ajuste a busca ou filtro.</p>
                </div>
              ) : (
                filteredNews.map(item => (
                  <GlassCard key={item.id} className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all group rounded-3xl">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-sm border border-white/10">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="pill pill-primary text-xs">
                          {item.category}
                        </span>
                        <span className="pill pill-neutral text-xs flex items-center gap-1">
                          <Calendar size={12} /> {item.date}
                        </span>
                      </div>
                      <h3 className="font-bold font-display text-xl text-slate-900 dark:text-white mb-2 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 max-w-3xl">{item.summary}</p>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-white/10 dark:border-white/5 pt-4 md:pt-0 md:pl-6 md:justify-center">
                      <GlassButton variant="ghost" className="flex-1 justify-center hover:bg-primary-500/10 hover:text-primary-700 dark:hover:text-primary-400" icon={PencilSimple} onClick={() => handleOpenForm(item)}>Editar</GlassButton>
                      <GlassButton variant="ghost" className="flex-1 justify-center hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 text-slate-500" icon={Trash} onClick={() => handleDelete(item.id)} disabled={isSaving}>Excluir</GlassButton>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>

            {/* Pagination (kept simple for now) */}
            <div className="flex justify-between items-center text-xs text-slate-500 px-2">
              <span>Mostrando {filteredNews.length} registros</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 rounded-full border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 disabled:opacity-50" disabled>Anterior</button>
                <button className="px-3 py-1 rounded-full border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 disabled:opacity-50" disabled>Próxima</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Cursos Técnicos</h1>
                <p className="text-slate-500 mt-2 text-lg">Gestão do catálogo de cursos ofertados pela escola.</p>
              </div>
              <GlassButton size="lg" icon={Plus} onClick={() => handleOpenCourseForm()} variant="primary" className="shadow-lg" disabled={isSaving}>
                Adicionar Curso
              </GlassButton>
            </div>

            <GlassCard className="p-4 flex flex-col md:flex-row items-center gap-4 rounded-3xl">
              <div className="relative flex-grow w-full md:w-auto">
                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" size={18} weight="regular" />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none text-sm shadow-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Encontrados: {filteredCourses.length}</div>
            </GlassCard>

            <div className="grid gap-4">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 mb-4">
                    <MagnifyingGlass size={32} weight="regular" />
                  </div>
                  <p className="text-sm">Nenhum curso correspondente.</p>
                  <p className="text-xs text-slate-400 mt-1">Ajuste a busca.</p>
                </div>
              ) : (
                filteredCourses.map(course => (
                  <GlassCard key={course.id} className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all group rounded-3xl">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-sm">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="pill pill-primary text-xs uppercase tracking-wide">{course.category}</span>
                      <span className="pill pill-neutral text-xs flex items-center gap-1"><BookOpen size={12} /> {course.duration}</span>
                    </div>
                      <h3 className="font-bold font-display text-xl text-slate-900 dark:text-white mb-2">{course.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 max-w-3xl">{course.description}</p>

                      <div className="flex gap-2 mt-4">
                        {(course.modules || []).slice(0, 3).map((mod, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium">{mod}</span>
                        ))}
                        {(course.modules?.length || 0) > 3 && <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">+{(course.modules?.length || 0) - 3}</span>}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-white/10 dark:border-white/5 pt-4 md:pt-0 md:pl-6 md:justify-center">
                      <GlassButton variant="ghost" className="flex-1 justify-center hover:bg-primary-500/10 hover:text-primary-700 dark:hover:text-primary-400" icon={PencilSimple} onClick={() => handleOpenCourseForm(course)}>Editar</GlassButton>
                      <GlassButton variant="ghost" className="flex-1 justify-center hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 text-slate-500" icon={Trash} onClick={() => handleDeleteCourse(course.id)} disabled={isSaving}>Excluir</GlassButton>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modern Side Drawer for News Form */}
      {isFormOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-900/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={() => setIsFormOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[55%] bg-white dark:bg-slate-950 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
            {/* Header with gradient */}
            <div className="flex-none px-6 sm:px-8 py-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 ring-1 ring-primary-400/20">
                    <FileText size={20} weight="duotone" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {editingId ? 'Editar Publicação' : 'Nova Publicação'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Preencha as informações da publicação
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 ring-1 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-700"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
            </div>

            {/* Content - Scrollable with custom scrollbar */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-600">
              <div className="px-6 sm:px-8 py-6 space-y-6 bg-gradient-to-b from-slate-50/30 to-white dark:from-slate-900/30 dark:to-slate-950">
                {/* Type Selection */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-3">
                    Tipo de Publicação
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer group relative p-4 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md ${formData.type === 'news' ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-950/50 dark:to-primary-900/30 shadow-primary-100 dark:shadow-primary-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-300 dark:hover:border-primary-700'}`}>
                      <input type="radio" name="type" className="hidden" checked={formData.type === 'news'} onChange={() => setFormData({ ...formData, type: 'news' })} />
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm ${formData.type === 'news' ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-200 dark:shadow-primary-900/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-750'}`}>
                          <FileText size={18} weight="duotone" />
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold text-sm leading-tight ${formData.type === 'news' ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>
                            Notícia
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">Artigos e novidades</div>
                        </div>
                      </div>
                    </label>
                    <label className={`cursor-pointer group relative p-4 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md ${formData.type === 'edital' ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-950/50 dark:to-primary-900/30 shadow-primary-100 dark:shadow-primary-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-300 dark:hover:border-primary-700'}`}>
                      <input type="radio" name="type" className="hidden" checked={formData.type === 'edital'} onChange={() => setFormData({ ...formData, type: 'edital' })} />
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm ${formData.type === 'edital' ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-200 dark:shadow-primary-900/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-750'}`}>
                          <FileText size={18} weight="duotone" />
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold text-sm leading-tight ${formData.type === 'edital' ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>
                            Edital
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">Processos seletivos</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                    Título da Publicação
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                    placeholder="Digite um título impactante..."
                    disabled={isSaving}
                  />
                </div>

                {/* Category and Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                      Categoria
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all text-slate-900 dark:text-white cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 appearance-none font-medium"
                        disabled={isSaving}
                      >
                        <option value="Geral">Geral</option>
                        <option value="Admissão">Admissão</option>
                        <option value="Eventos">Eventos</option>
                        <option value="Conquistas">Conquistas</option>
                        <option value="Pedagógico">Pedagógico</option>
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-6 h-6 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <Gear size={14} className="text-primary-600 dark:text-primary-400" weight="duotone" />
                        </div>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                      Data de Publicação
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all text-slate-900 dark:text-white shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 font-medium"
                        disabled={isSaving}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-6 h-6 rounded-md bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                          <Calendar size={14} className="text-accent-600 dark:text-accent-400" weight="duotone" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                    Imagem de Capa (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 text-sm shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                    placeholder="https://exemplo.com/imagem.jpg"
                    disabled={isSaving}
                  />
                  {formData.image && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-100 dark:bg-slate-900 shadow-md ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target as HTMLImageElement).style.opacity = '0.3'}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                    Conteúdo (Markdown)
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    rows={14}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 resize-none font-mono text-sm leading-relaxed shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                    placeholder="# Título da Seção&#10;&#10;Escreva o conteúdo detalhado aqui...&#10;&#10;Use **negrito**, *itálico*, e [links](https://exemplo.com)"
                    disabled={isSaving}
                  ></textarea>
                </div>

                {/* Edital Specific Fields */}
                {formData.type === 'edital' && (
                  <div className="space-y-6 pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-800">
                    {/* Timeline with Attachments */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <Clock size={14} className="text-primary-600 dark:text-primary-400" weight="duotone" />
                          </div>
                          Cronograma do Edital
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, timeline: [...(prev.timeline || []), { date: '', title: '', description: '', url: '' }] }))}
                          className="text-[11px] px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 font-semibold transition-all shadow-sm hover:shadow-md border border-primary-200 dark:border-primary-800"
                        >
                          + Adicionar Evento
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.timeline?.map((event, idx) => (
                          <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
                            <div className="flex items-start gap-2">
                              <div className="flex-1 grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Data</label>
                                  <input
                                    type="date"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all"
                                    value={event.date}
                                    onChange={e => {
                                      const newTimeline = [...(formData.timeline || [])];
                                      newTimeline[idx] = { ...newTimeline[idx], date: e.target.value };
                                      setFormData({ ...formData, timeline: newTimeline });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Título do Evento</label>
                                  <input
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all font-medium"
                                    placeholder="Ex: Inscrições Abertas"
                                    value={event.title}
                                    onChange={e => {
                                      const newTimeline = [...(formData.timeline || [])];
                                      newTimeline[idx] = { ...newTimeline[idx], title: e.target.value };
                                      setFormData({ ...formData, timeline: newTimeline });
                                    }}
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, timeline: prev.timeline?.filter((_, i) => i !== idx) }))}
                                className="mt-6 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                              >
                                <Trash size={15} weight="duotone" />
                              </button>
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Descrição (Opcional)</label>
                              <input
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all"
                                placeholder="Informações adicionais sobre este evento"
                                value={event.description || ''}
                                onChange={e => {
                                  const newTimeline = [...(formData.timeline || [])];
                                  newTimeline[idx] = { ...newTimeline[idx], description: e.target.value };
                                  setFormData({ ...formData, timeline: newTimeline });
                                }}
                              />
                            </div>

                            <div className="relative">
                              <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <LinkIcon size={12} className="text-accent-500" weight="duotone" />
                                Link/Anexo do Evento
                              </label>
                              <input
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-blue-600 dark:text-blue-400 transition-all"
                                placeholder="https://exemplo.com/edital.pdf"
                                value={event.url || ''}
                                onChange={e => {
                                  const newTimeline = [...(formData.timeline || [])];
                                  newTimeline[idx] = { ...newTimeline[idx], url: e.target.value };
                                  setFormData({ ...formData, timeline: newTimeline });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                        {(!formData.timeline || formData.timeline.length === 0) && (
                          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                <Clock size={20} className="text-slate-400" weight="duotone" />
                              </div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Nenhum evento adicionado</p>
                              <p className="text-xs text-slate-400">Clique em "Adicionar Evento" para começar</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Footer with gradient */}
            <div className="flex-none px-6 sm:px-8 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 backdrop-blur-xl">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSaving}
                  className="flex-1 px-5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 font-semibold transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 hover:from-primary-600 hover:via-primary-700 hover:to-primary-600 text-white font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 ring-1 ring-primary-400/30"
                >
                  {isSaving ? (
                    <span>Salvando...</span>
                  ) : (
                    <>
                      <FloppyDisk size={18} weight="bold" />
                      {editingId ? 'Salvar Alterações' : 'Publicar Agora'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Course Drawer (visual consistente com Notícias) */}
      {isCourseFormOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-900/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={() => setIsCourseFormOpen(false)}
          />

          <div className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[55%] bg-white dark:bg-slate-950 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="flex-none px-6 sm:px-8 py-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-500 via-accent-600 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-accent-500/30 ring-1 ring-accent-400/30">
                    <BookOpen size={18} weight="duotone" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {editingCourseId ? 'Editar Curso' : 'Novo Curso'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Cadastre ou atualize informações do curso técnico
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCourseFormOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 ring-1 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-700"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmitCourse} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-600">
              <div className="px-6 sm:px-8 py-6 space-y-6 bg-gradient-to-b from-slate-50/30 to-white dark:from-slate-900/30 dark:to-slate-950">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Título do Curso</label>
                    <input
                      required
                      type="text"
                      value={courseForm.title}
                      onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400"
                      placeholder="Ex: Técnico em Desenvolvimento de Sistemas"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Eixo Tecnológico</label>
                    <div className="relative">
                      <select
                        value={courseForm.category}
                        onChange={e => setCourseForm({ ...courseForm, category: e.target.value as Course['category'] })}
                        className="w-full px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-slate-900 dark:text-white shadow-sm appearance-none cursor-pointer"
                        disabled={isSaving}
                      >
                        <option value="Gestão e Negócios">Gestão e Negócios</option>
                        <option value="Recursos Naturais">Recursos Naturais</option>
                        <option value="Informação e Comunicação">Informação e Comunicação</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <Gear size={16} weight="regular" />
                      </div>
                    </div>
                  </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Duração</label>
                      <input
                        type="text"
                        value={courseForm.duration}
                        onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-slate-900 dark:text-white shadow-sm"
                        placeholder="Ex: 3 Anos"
                        disabled={isSaving}
                      />
                    </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Nível de Ensino</label>
                    <input
                      type="text"
                      value={courseForm.level}
                      onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-slate-900 dark:text-white shadow-sm"
                      placeholder="Ex: Integrado ao Médio"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">URL da Imagem</label>
                    <input
                      type="text"
                      value={courseForm.image}
                      onChange={e => setCourseForm({ ...courseForm, image: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-slate-900 dark:text-white shadow-sm"
                      placeholder="https://..."
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Descrição Completa</label>
                  <textarea
                    required
                    rows={3}
                    value={courseForm.description}
                    onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-slate-900 dark:text-white shadow-sm resize-none"
                    placeholder="Objetivos e perfil do curso..."
                    disabled={isSaving}
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Componentes Curriculares (1 por linha)</label>
                    <textarea
                      rows={5}
                      value={(courseForm.modules || []).join('\n')}
                      onChange={e => setCourseForm({ ...courseForm, modules: e.target.value.split('\n') })}
                      className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-slate-900 dark:text-white shadow-sm font-mono text-sm"
                      placeholder="Ex: Lógica de Programação&#10;Banco de Dados"
                      disabled={isSaving}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Oportunidades de Mercado (1 por linha)</label>
                    <textarea
                      rows={5}
                      value={(courseForm.opportunities || []).join('\n')}
                      onChange={e => setCourseForm({ ...courseForm, opportunities: e.target.value.split('\n') })}
                      className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-slate-900 dark:text-white shadow-sm font-mono text-sm"
                      placeholder="Ex: Desenvolvedor Web&#10;Analista de Suporte"
                      disabled={isSaving}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-none px-6 sm:px-8 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 backdrop-blur-xl">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCourseFormOpen(false)}
                    disabled={isSaving}
                    className="flex-1 px-5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 font-semibold transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-500 via-accent-600 to-accent-500 hover:from-accent-600 hover:via-accent-700 hover:to-accent-600 text-white font-bold shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 ring-1 ring-accent-400/30"
                  >
                    {isSaving ? (
                      <span>Salvando...</span>
                    ) : (
                      <>
                        <FloppyDisk size={18} weight="bold" />
                        {editingCourseId ? 'Salvar Alterações' : 'Publicar Curso'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
      {/* Confirmation modal */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setConfirmDialog({ open: false, targetId: null, type: null })} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                <WarningCircle size={24} weight="regular" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirmar exclusão</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Deseja excluir este {confirmDialog.type === 'course' ? 'curso' : 'item'}? Ele será removido do site.
            </p>
            <div className="flex gap-3">
              <GlassButton variant="ghost" className="flex-1" onClick={() => setConfirmDialog({ open: false, targetId: null, type: null })} disabled={isSaving}>
                Cancelar
              </GlassButton>
              <GlassButton variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20" onClick={handleConfirmDelete} isLoading={isSaving} disabled={isSaving}>
                Excluir
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
