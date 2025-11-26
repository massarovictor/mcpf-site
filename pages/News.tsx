import React, { useMemo, useState } from "react";
import { useData } from "../contexts/DataContext";
import { GlassCard } from "../components/GlassCard";
import { GlassButton } from "../components/GlassButton";
import { LiquidBackground } from "../components/LiquidBackground";
import {
  Calendar,
  MagnifyingGlass,
  Tag,
  Funnel,
  X,
  ArrowRight,
} from "phosphor-react";
import { NewsItem } from "../types";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { formatDateForDisplay, getDateTimestamp } from "../lib/date";

export const News: React.FC = () => {
  const { news } = useData();
  const [filter, setFilter] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const fallbackImage =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80";

  const categories = [
    "Todas",
    ...Array.from(new Set(news.map((item) => item.category))),
  ];

  const sortedNews = useMemo(
    () =>
      [...news].sort(
        (a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date),
      ),
    [news],
  );

  const filteredNews = sortedNews.filter((item) => {
    const matchesCategory = filter === "Todas" || item.category === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <LiquidBackground className="pb-24">
      {/* Centralized Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden flex items-center justify-center min-h-[50vh]">
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pill pill-primary mb-8 bg-white/80 dark:bg-slate-900/80"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              <span>Mural da Escola</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="section-title text-5xl md:text-7xl leading-[1.1] mb-8"
            >
              Notícias &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">
                Editais
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="section-subtitle max-w-3xl mx-auto"
            >
              Acompanhe os processos seletivos, eventos culturais e conquistas
              acadêmicas.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl py-20">
        {/* Filters & Search */}
        <GlassCard className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-24 z-30 p-4 rounded-full">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "pill whitespace-nowrap transition-all duration-300",
                  filter === cat
                    ? "pill-primary"
                    : "pill-neutral hover:bg-white/90 dark:hover:bg-slate-900/90",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <MagnifyingGlass
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-700 dark:text-primary-300 drop-shadow-sm pointer-events-none z-10"
              size={20}
              weight="bold"
            />
            <input
              type="text"
              placeholder="Buscar notícia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 shadow-sm text-sm font-medium"
            />
          </div>
        </GlassCard>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <GlassCard
                key={item.id}
                className="flex flex-col h-full hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors group cursor-pointer"
                onClick={() => setSelectedNews(item)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 pill pill-primary bg-white/80 dark:bg-slate-900/70">
                    <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                    {item.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                    <Calendar size={14} weight="regular" />
                    <span>{formatDateForDisplay(item.date)}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 flex-grow">
                    {item.summary}
                  </p>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 mb-6">
                <MagnifyingGlass size={40} weight="regular" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-slate-500">
                Tente ajustar seus termos de busca ou filtros.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhes da notícia */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full overflow-hidden max-h-[85vh] flex flex-col">
            <div className="relative h-64 shrink-0">
              <img
                src={selectedNews.image || fallbackImage}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = fallbackImage;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
              <div className="absolute top-6 left-6 flex gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${selectedNews.type === "edital" ? "bg-primary-600" : "bg-accent-500"}`}
                >
                  <Tag size={12} className="text-white" />
                  {selectedNews.type === "edital"
                    ? "EDITAL"
                    : selectedNews.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-white-800 shadow-sm">
                  {formatDateForDisplay(selectedNews.date)}
                </span>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-6 right-6 p-2 rounded-full dark:bg-black dark:bg-white/20 bg-white/20 hover:bg-white text-white dark:hover:text-gray-400 hover:text-gray-900 shadow-lg backdrop-blur-sm transition-all"
                aria-label="Fechar"
              >
                <X size={20} weight="regular" />
              </button>
              <div className="absolute bottom-6 left-6 right-6 ">
                <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight text-white">
                  {selectedNews.title}
                </h2>
              </div>
            </div>

            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar space-y-8">
              {/* Header Info */}
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 pb-6 border-b border-slate-100 dark:border-slate-800">
                <Calendar size={16} weight="regular" />
                <span>
                  Publicado em {formatDateForDisplay(selectedNews.date)}
                </span>
                {selectedNews.type === "edital" && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-primary-600 font-bold">
                      Processo Seletivo
                    </span>
                  </>
                )}
              </div>

              {/* Main Content */}
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedNews.summary}
                </p>
                {selectedNews.content && (
                  <div className="mt-4 whitespace-pre-wrap text-slate-600 dark:text-slate-400 leading-relaxed">
                    {selectedNews.content}
                  </div>
                )}
              </div>

              {/* Timeline & Attachments Sections - Show if data exists */}
              {((selectedNews.timeline && selectedNews.timeline.length > 0) ||
                (selectedNews.attachments &&
                  selectedNews.attachments.length > 0)) && (
                <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  {/* Timeline */}
                  {selectedNews.timeline &&
                    selectedNews.timeline.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold font-display flex items-center gap-2 text-slate-900 dark:text-white">
                          <div className="p-2 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                            <Calendar size={20} weight="regular" />
                          </div>
                          Cronograma
                        </h3>
                        <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
                          {selectedNews.timeline.map((event, idx) => (
                            <div key={idx} className="relative">
                              <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-primary-600 border-2 border-white dark:border-slate-950"></div>
                              <span className="text-xs font-bold text-primary-600 dark:text-primary-400 block mb-1">
                                {formatDateForDisplay(event.date)}
                              </span>
                              <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                                {event.title}
                              </h4>
                              {event.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Attachments */}
                  {selectedNews.attachments &&
                    selectedNews.attachments.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold font-display flex items-center gap-2 text-slate-900 dark:text-white">
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Tag size={20} weight="regular" />
                          </div>
                          Arquivos & Anexos
                        </h3>
                        <div className="space-y-3">
                          {selectedNews.attachments.map((att, idx) => (
                            <a
                              key={idx}
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
                            >
                              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-400 group-hover:text-primary-500 transition-colors shadow-sm">
                                <ArrowRight size={18} weight="regular" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-bold font-display text-sm text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                  {att.name}
                                </h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                  {att.type}
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              <div className="flex justify-end pt-6">
                <GlassButton
                  variant="ghost"
                  size="md"
                  onClick={() => setSelectedNews(null)}
                >
                  Fechar
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </LiquidBackground>
  );
};
