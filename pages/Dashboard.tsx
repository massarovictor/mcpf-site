import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { ChatMessage, Course, NewsItem, TimelineEvent, Attachment } from '../types';
import { generateStudyAssistantResponse } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PaperPlaneTilt, Robot, BookOpen, Clock, WarningCircle, Sparkle, Plus, Trash, PencilSimple, FileText, Calendar, Link as LinkIcon, Download, X } from 'phosphor-react';
import { useData } from '../contexts/DataContext';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../contexts/ToastContext';

const DATA_ACTIVITY = [
  { name: 'Seg', hours: 4 },
  { name: 'Ter', hours: 6 },
  { name: 'Qua', hours: 5 },
  { name: 'Qui', hours: 8 },
  { name: 'Sex', hours: 3 },
  { name: 'Sab', hours: 5 },
  { name: 'Dom', hours: 2 },
];

const DATA_GRADES = [
  { subject: 'IA', score: 85 },
  { subject: 'Bio', score: 92 },
  { subject: 'Fil', score: 78 },
  { subject: 'Art', score: 95 },
];

export const Dashboard: React.FC = () => {
  const { courses, news, addCourse, updateCourse, deleteCourse, addNews, updateNews, deleteNews, isLoadingNews } = useData();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'news'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Eu sou o Lumi 🤖. Como posso ajudar nos seus estudos hoje?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Management State
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [currentNews, setCurrentNews] = useState<Partial<NewsItem>>({ type: 'news', timeline: [], attachments: [] });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const responseText = await generateStudyAssistantResponse(input);
    const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  // Course Handlers
  const handleSaveCourse = async () => {
    if (!currentCourse.title || !currentCourse.category) {
      addToast('Preencha os campos obrigatórios', 'error');
      return;
    }
    const success = currentCourse.id
      ? await updateCourse(currentCourse as Course)
      : await addCourse(currentCourse as Omit<Course, 'id'>);

    if (success) {
      addToast(currentCourse.id ? 'Curso atualizado!' : 'Curso criado!', 'success');
      setIsEditingCourse(false);
      setCurrentCourse({});
    } else {
      addToast('Erro ao salvar curso', 'error');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      const success = await deleteCourse(id);
      if (success) addToast('Curso excluído', 'success');
      else addToast('Erro ao excluir curso', 'error');
    }
  };

  // News Handlers
  const handleSaveNews = async () => {
    if (!currentNews.title || !currentNews.summary) {
      addToast('Preencha os campos obrigatórios', 'error');
      return;
    }
    const success = currentNews.id
      ? await updateNews(currentNews as NewsItem)
      : await addNews(currentNews as Omit<NewsItem, 'id'>);

    if (success) {
      addToast(currentNews.id ? 'Notícia atualizada!' : 'Notícia criada!', 'success');
      setIsEditingNews(false);
      setCurrentNews({ type: 'news', timeline: [], attachments: [] });
    } else {
      addToast('Erro ao salvar notícia', 'error');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      const success = await deleteNews(id);
      if (success) addToast('Notícia excluída', 'success');
      else addToast('Erro ao excluir notícia', 'error');
    }
  };

  const addTimelineEvent = () => {
    const newEvent: TimelineEvent = { date: new Date().toISOString().split('T')[0], title: 'Novo Evento' };
    setCurrentNews(prev => ({ ...prev, timeline: [...(prev.timeline || []), newEvent] }));
  };

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    const newTimeline = [...(currentNews.timeline || [])];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setCurrentNews(prev => ({ ...prev, timeline: newTimeline }));
  };

  const removeTimelineEvent = (index: number) => {
    setCurrentNews(prev => ({ ...prev, timeline: prev.timeline?.filter((_, i) => i !== index) }));
  };

  const addAttachment = () => {
    const newAttachment: Attachment = { name: 'Novo Anexo', url: '', type: 'link' };
    setCurrentNews(prev => ({ ...prev, attachments: [...(prev.attachments || []), newAttachment] }));
  };

  const updateAttachment = (index: number, field: keyof Attachment, value: string) => {
    const newAttachments = [...(currentNews.attachments || [])];
    // @ts-ignore
    newAttachments[index] = { ...newAttachments[index], [field]: value };
    setCurrentNews(prev => ({ ...prev, attachments: newAttachments }));
  };

  const removeAttachment = (index: number) => {
    setCurrentNews(prev => ({ ...prev, attachments: prev.attachments?.filter((_, i) => i !== index) }));
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 max-w-6xl">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <GlassButton
          variant={activeTab === 'overview' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </GlassButton>
        <GlassButton
          variant={activeTab === 'courses' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('courses')}
        >
          Gerenciar Cursos
        </GlassButton>
        <GlassButton
          variant={activeTab === 'news' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('news')}
        >
          Gerenciar Notícias e Editais
        </GlassButton>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-250px)] min-h-[800px]">
          {/* Left Column: Stats & Schedule */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard className="p-6 flex items-center gap-4 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none shadow-lg shadow-primary-900/20 hover:-translate-y-1 transition-transform cursor-default">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <BookOpen size={28} weight="regular" />
                </div>
                <div>
                  <p className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">Cursos Ativos</p>
                  {isLoading ? <Skeleton className="h-8 w-12 bg-white/20" /> : <h3 className="text-3xl font-bold">{courses.length}</h3>}
                </div>
              </GlassCard>
              <GlassCard className="p-6 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-transform cursor-default">
                <div className="p-3 bg-accent-50 dark:bg-accent-900/20 text-accent-600 rounded-2xl">
                  <Clock size={28} weight="regular" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Horas Estudadas</p>
                  {isLoading ? <Skeleton className="h-8 w-16" /> : <h3 className="text-3xl font-bold text-slate-900 dark:text-white">32h</h3>}
                </div>
              </GlassCard>
              <GlassCard className="p-6 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-transform cursor-default">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl">
                  <WarningCircle size={28} weight="regular" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pendências</p>
                  {isLoading ? <Skeleton className="h-8 w-8" /> : <h3 className="text-3xl font-bold text-slate-900 dark:text-white">2</h3>}
                </div>
              </GlassCard>
            </div>

            {/* Charts Area */}
            <div className="grid md:grid-cols-2 gap-6 flex-grow">
              <GlassCard className="flex flex-col border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock size={18} weight="regular" className="text-primary-600" /> Atividade Semanal
                  </h3>
                </div>
                <div className="flex-grow w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DATA_ACTIVITY}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.1} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="hours" stroke="#03805E" strokeWidth={3} dot={{ r: 4, fill: '#03805E', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#03805E', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard className="flex flex-col border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkle size={18} weight="regular" className="text-accent-500" /> Desempenho
                  </h3>
                </div>
                <div className="flex-grow w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DATA_GRADES}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.1} />
                      <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} itemStyle={{ color: '#0f172a', fontWeight: 'bold' }} />
                      <Bar dataKey="score" fill="#F49650" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Right Column: AI Assistant */}
          <div className="lg:col-span-1 h-full">
            <GlassCard className="h-full flex flex-col shadow-xl shadow-primary-900/5 border-primary-100 dark:border-primary-900/30 overflow-hidden">
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-gradient-to-r from-primary-50 to-white dark:from-slate-900 dark:to-slate-900">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
                    <Robot size={24} weight="regular" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Lumi AI</h3>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wide">Assistente Virtual</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50 custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`
                      max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                      ${msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-none shadow-primary-600/20'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none border border-slate-200 dark:border-slate-700'
                      }
                    `}>
                      {msg.text}
                      <p className={`text-[10px] mt-2 opacity-70 ${msg.role === 'user' ? 'text-right text-primary-100' : 'text-slate-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua dúvida..."
                    className="flex-grow px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-950 border-transparent focus:bg-white dark:focus:bg-slate-900 border focus:border-primary-500 outline-none text-sm transition-all text-slate-900 dark:text-white shadow-inner placeholder:text-slate-400"
                  />
                  <GlassButton
                    type="submit"
                    size="sm"
                    className="!p-0 w-12 h-12 rounded-xl bg-primary-700 hover:bg-primary-600 shadow-lg shadow-primary-600/20 flex items-center justify-center shrink-0"
                    disabled={!input.trim() || isTyping}
                    icon={PaperPlaneTilt}
                  />
                </form>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Cursos</h2>
            <GlassButton onClick={() => { setCurrentCourse({}); setIsEditingCourse(true); }} icon={Plus}>
              Novo Curso
            </GlassButton>
          </div>

          {isEditingCourse ? (
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-lg font-bold">{currentCourse.id ? 'Editar Curso' : 'Novo Curso'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                  placeholder="Título do Curso"
                  value={currentCourse.title || ''}
                  onChange={e => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                />
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                  value={currentCourse.category || ''}
                  onChange={e => setCurrentCourse({ ...currentCourse, category: e.target.value as any })}
                >
                  <option value="">Selecione a Categoria</option>
                  <option value="Gestão e Negócios">Gestão e Negócios</option>
                  <option value="Recursos Naturais">Recursos Naturais</option>
                  <option value="Informação e Comunicação">Informação e Comunicação</option>
                </select>
                <input
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                  placeholder="Duração (ex: 3 anos)"
                  value={currentCourse.duration || ''}
                  onChange={e => setCurrentCourse({ ...currentCourse, duration: e.target.value })}
                />
                <input
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                  placeholder="Nível (ex: Técnico Integrado)"
                  value={currentCourse.level || ''}
                  onChange={e => setCurrentCourse({ ...currentCourse, level: e.target.value })}
                />
                <input
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent md:col-span-2"
                  placeholder="URL da Imagem"
                  value={currentCourse.image || ''}
                  onChange={e => setCurrentCourse({ ...currentCourse, image: e.target.value })}
                />
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent md:col-span-2"
                  placeholder="Descrição"
                  rows={4}
                  value={currentCourse.description || ''}
                  onChange={e => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <GlassButton variant="ghost" onClick={() => setIsEditingCourse(false)}>Cancelar</GlassButton>
                <GlassButton onClick={handleSaveCourse}>Salvar</GlassButton>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <GlassCard key={course.id} className="p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{course.category}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <GlassButton size="sm" variant="ghost" onClick={() => { setCurrentCourse(course); setIsEditingCourse(true); }} icon={PencilSimple}>Editar</GlassButton>
                    <GlassButton size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteCourse(course.id)} icon={Trash}>Excluir</GlassButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Notícias e Editais</h2>
            <GlassButton onClick={() => { setCurrentNews({ type: 'news', timeline: [], attachments: [] }); setIsEditingNews(true); }} icon={Plus}>
              Nova Publicação
            </GlassButton>
          </div>

          {isEditingNews ? (
            <GlassCard className="p-6 space-y-6">
              <h3 className="text-lg font-bold">{currentNews.id ? 'Editar Publicação' : 'Nova Publicação'}</h3>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Tipo de Publicação</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={currentNews.type === 'news'}
                        onChange={() => setCurrentNews({ ...currentNews, type: 'news' })}
                      />
                      Notícia
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={currentNews.type === 'edital'}
                        onChange={() => setCurrentNews({ ...currentNews, type: 'edital' })}
                      />
                      Edital
                    </label>
                  </div>
                </div>

                <input
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent md:col-span-2"
                  placeholder="Título"
                  value={currentNews.title || ''}
                  onChange={e => setCurrentNews({ ...currentNews, title: e.target.value })}
                />
                <input
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                  placeholder="Categoria (ex: Eventos, Editais)"
                  value={currentNews.category || ''}
                  onChange={e => setCurrentNews({ ...currentNews, category: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                  value={currentNews.date || ''}
                  onChange={e => setCurrentNews({ ...currentNews, date: e.target.value })}
                />
                <input
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent md:col-span-2"
                  placeholder="URL da Imagem de Capa"
                  value={currentNews.image || ''}
                  onChange={e => setCurrentNews({ ...currentNews, image: e.target.value })}
                />
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent md:col-span-2"
                  placeholder="Resumo"
                  rows={2}
                  value={currentNews.summary || ''}
                  onChange={e => setCurrentNews({ ...currentNews, summary: e.target.value })}
                />
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent md:col-span-2"
                  placeholder="Conteúdo Completo (Markdown suportado)"
                  rows={6}
                  value={currentNews.content || ''}
                  onChange={e => setCurrentNews({ ...currentNews, content: e.target.value })}
                />
              </div>

              {/* Timeline & Attachments - Available for all types */}
              {currentNews.type === 'edital' && (
                <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {/* Timeline */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold flex items-center gap-2"><Clock size={16} weight="regular" /> Linha do Tempo</h4>
                    <GlassButton size="sm" variant="outline" onClick={addTimelineEvent} icon={Plus}>Adicionar Evento</GlassButton>
                    </div>
                    <div className="space-y-3">
                      {(currentNews.timeline || []).map((event, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          <div className="grid gap-2 flex-grow">
                            <input
                              type="date"
                              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:border-primary-500"
                              value={event.date}
                              onChange={e => updateTimelineEvent(idx, 'date', e.target.value)}
                            />
                            <input
                              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:border-primary-500"
                              placeholder="Título do Evento"
                              value={event.title}
                              onChange={e => updateTimelineEvent(idx, 'title', e.target.value)}
                            />
                            <input
                              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:border-primary-500"
                              placeholder="Descrição (opcional)"
                              value={event.description || ''}
                              onChange={e => updateTimelineEvent(idx, 'description', e.target.value)}
                            />
                          </div>
                          <button onClick={() => removeTimelineEvent(idx)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash size={16} weight="regular" />
                          </button>
                        </div>
                      ))}
                      {(!currentNews.timeline || currentNews.timeline.length === 0) && (
                        <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                          Nenhum evento na linha do tempo.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold flex items-center gap-2"><FileText size={16} weight="regular" /> Anexos (Links)</h4>
                    <GlassButton size="sm" variant="outline" onClick={addAttachment} icon={Plus}>Adicionar Link</GlassButton>
                    </div>
                    <div className="space-y-3">
                      {(currentNews.attachments || []).map((att, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          <div className="grid gap-2 flex-grow">
                            <input
                              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:border-primary-500"
                              placeholder="Nome do Arquivo/Link"
                              value={att.name}
                              onChange={e => updateAttachment(idx, 'name', e.target.value)}
                            />
                            <input
                              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:border-primary-500"
                              placeholder="URL do Link"
                              value={att.url}
                              onChange={e => updateAttachment(idx, 'url', e.target.value)}
                            />
                            <select
                              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:border-primary-500"
                              value={att.type}
                              onChange={e => updateAttachment(idx, 'type', e.target.value as any)}
                            >
                              <option value="pdf">PDF</option>
                              <option value="link">Link</option>
                              <option value="other">Outro</option>
                            </select>
                          </div>
                          <button onClick={() => removeAttachment(idx)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash size={16} weight="regular" />
                          </button>
                        </div>
                      ))}
                      {(!currentNews.attachments || currentNews.attachments.length === 0) && (
                        <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                          Nenhum anexo.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <GlassButton variant="ghost" onClick={() => setIsEditingNews(false)}>Cancelar</GlassButton>
                <GlassButton onClick={handleSaveNews}>Salvar Publicação</GlassButton>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map(item => (
                <GlassCard key={item.id} className="p-4 flex flex-col justify-between">
                  <div className="flex gap-4">
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.type === 'edital' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.type === 'edital' ? 'EDITAL' : 'NOTÍCIA'}
                        </span>
                        <span className="text-xs text-slate-500">{item.date}</span>
                      </div>
                      <h3 className="font-bold text-base line-clamp-2">{item.title}</h3>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <GlassButton size="sm" variant="ghost" onClick={() => { setCurrentNews(item); setIsEditingNews(true); }} icon={PencilSimple}>Editar</GlassButton>
                    <GlassButton size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteNews(item.id)} icon={Trash}>Excluir</GlassButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
