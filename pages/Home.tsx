import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { GlassButton } from "../components/GlassButton";
import { GlassCard } from "../components/GlassCard";
import { LiquidBackground } from "../components/LiquidBackground";
import { useData } from "../contexts/DataContext";
import { getInstagramPosts } from "../services/instagramService";
import { INSTAGRAM_PROFILE } from "../constants";
import {
  ArrowRight,
  InstagramLogo,
  Calendar,
  Briefcase,
  Monitor,
  Trophy,
  TrendUp,
  Users,
  Star,
  Leaf,
  Tag,
  X,
} from "phosphor-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { NewsItem } from "../types";
import { formatDateForDisplay, getDateTimestamp } from "../lib/date";
import { toast } from "sonner";

const FALLBACK_INSTAGRAM = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

interface InstagramPostData {
  imageUrl: string;
  postUrl: string;
}

const InstagramPost = ({
  post,
  index,
}: {
  post: InstagramPostData;
  index: number;
}) => {
  const [imgSrc, setImgSrc] = useState<string>(post.imageUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_INSTAGRAM[index % FALLBACK_INSTAGRAM.length]);
      setIsLoaded(true);
    }
  };

  return (
    <motion.a
      href={post.postUrl}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer block bg-slate-100 dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-500"
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
      )}

      <img
        src={imgSrc}
        alt={`Instagram post ${index + 1}`}
        className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"} group-hover:scale-105`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </motion.a>
  );
};

export const Home: React.FC = () => {
  const { news } = useData();
  const [instagramPosts, setInstagramPosts] = useState<InstagramPostData[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const fallbackImage =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80";
  const sortedNews = useMemo(
    () =>
      [...news].sort(
        (a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date),
      ),
    [news],
  );

  useEffect(() => {
    const fetchInsta = async () => {
      try {
        const posts = await getInstagramPosts();
        if (posts && posts.length > 0) {
          setInstagramPosts(posts);
        } else {
          const fallbackPosts = FALLBACK_INSTAGRAM.map((img) => ({
            imageUrl: img,
            postUrl: `https://www.instagram.com/${INSTAGRAM_PROFILE}/`,
          }));
          setInstagramPosts(fallbackPosts);
        }
      } catch (e) {
        console.error("Failed to load Instagram feed", e);
        const fallbackPosts = FALLBACK_INSTAGRAM.map((img) => ({
          imageUrl: img,
          postUrl: `https://www.instagram.com/${INSTAGRAM_PROFILE}/`,
        }));
        setInstagramPosts(fallbackPosts);
      }
    };
    fetchInsta();
  }, []);

  useEffect(() => {
    const admissionNews = sortedNews
      .slice(0, 3)
      .some((item) => item.category === "Admissão");

    if (admissionNews) {
      toast.info("O processo seletivo do ano está disponível!");
    }
  }, [sortedNews]);

  const HIGHLIGHTS = [
    {
      title: "Top 100 Brasil",
      desc: "Referência nacional em equidade no ensino.",
      icon: <Users size={32} weight="regular" />,
      color: "primary",
    },
    {
      title: "Maior IDEB",
      desc: "Líder em qualidade educacional na CREDE 11.",
      icon: <TrendUp size={32} weight="regular" />,
      color: "accent",
    },
    {
      title: "Escola Olímpica",
      desc: "Alunos premiados em competições do conhecimento.",
      icon: <Trophy size={32} weight="regular" />,
      color: "primary",
    },
    {
      title: "Empregabilidade",
      desc: "Alta taxa de inserção no mercado e universidade.",
      icon: <Star size={32} weight="regular" />,
      color: "accent",
    },
  ];

  return (
    <LiquidBackground className="pb-14">
      {/* Hero Section - Clean & Breathable */}
      <section className="relative pt-40 pb-16 md:pt-52 md:pb-20 min-h-[85vh] flex flex-col items-center justify-center">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-24">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pill pill-primary mb-6 bg-white/80 dark:bg-slate-900/80"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              <span>EEEP Professora Maria Célia Pinheiro Falcão</span>
            </motion.div>

            {/* Main Heading - Large & Impactful */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold font-display text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-8"
            >
              Escola de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">
                Oportunidades
              </span>
            </motion.h1>

            {/* Description - Clean Typography */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal mb-12"
            >
              Comprometida com a formação integral dos alunos e com a construção
              de um futuro de realizações profissionais e acadêmicas.
            </motion.p>

            {/* Actions - Minimalist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
            >
              <Link to="/courses">
                <GlassButton
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto px-10 py-4 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  Conheça Nossos Cursos
                </GlassButton>
              </Link>
            </motion.div>
          </div>

          {/* Highlights - Floating Icons (No Heavy Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {HIGHLIGHTS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex flex-col items-center group"
              >
                <div
                  className={`
                    w-20 h-20 mb-6 rounded-full flex items-center justify-center transition-all duration-500
                    ${
                      item.color === "primary"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 group-hover:scale-110 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30"
                        : "bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 group-hover:scale-110 group-hover:bg-accent-100 dark:group-hover:bg-accent-900/30"
                    }
                  `}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold font-display text-xl text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base max-w-xs mx-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eixos Tecnológicos Section */}
      <section className="container mx-auto px-6 max-w-6xl py-32 relative z-10">
        <div className="text-center mb-20">
          <h2 className="section-title text-center mb-4">Eixos Tecnológicos</h2>
          <div className="section-divider mb-6"></div>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Formação técnica de excelência alinhada às demandas do futuro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gestão e Negócios */}
          <GlassCard className="h-full p-8 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors">
            <div className="w-16 h-16 rounded-full bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 flex items-center justify-center mb-6">
              <Briefcase size={28} weight="regular" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-3">
              Gestão e Negócios
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-sm">
              Liderança e estratégia para formar os gestores do amanhã.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {["Administração", "Comércio", "Finanças"].map((course) => (
                <span key={course} className="pill pill-neutral text-xs">
                  {course}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Recursos Naturais */}
          <GlassCard className="h-full p-8 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors">
            <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6">
              <Leaf size={28} weight="regular" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-3">
              Recursos Naturais
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-sm">
              Sustentabilidade e inovação para o desenvolvimento regional.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {["Agronegócio", "Fruticultura"].map((course) => (
                <span key={course} className="pill pill-neutral text-xs">
                  {course}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Info & Comunicação */}
          <GlassCard className="h-full p-8 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <Monitor size={28} weight="regular" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-3">
              Info & Comunicação
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-sm">
              Tecnologia de ponta e conectividade global.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {["Sistemas", "Redes"].map((course) => (
                <span key={course} className="pill pill-neutral text-xs">
                  {course}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="container mx-auto px-6 max-w-6xl pt-20 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-6">
          <div>
            <h2 className="section-title flex items-center gap-3">
              <InstagramLogo className="text-pink-600" weight="regular" />@
              {INSTAGRAM_PROFILE}
            </h2>
            <p className="section-subtitle mt-2">Acompanhe o nosso dia a dia</p>
          </div>
          <a
            href={`https://www.instagram.com/${INSTAGRAM_PROFILE}/`}
            target="_blank"
            rel="noreferrer"
          >
            <GlassButton variant="secondary" size="md">
              Seguir
            </GlassButton>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {instagramPosts.map((post, index) => (
            <InstagramPost key={`ig-${index}`} post={post} index={index} />
          ))}
        </div>
      </section>

      {/* News Preview */}
      <section className="container mx-auto px-6 max-w-6xl py-32">
        <div className="text-center mb-20">
          <div className="pill pill-primary mb-4 bg-white/80 dark:bg-slate-900/80">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            <span>Blog Escolar</span>
          </div>
          <h2 className="section-title text-center mb-4">Últimas Notícias</h2>
          <div className="section-divider mb-6"></div>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Acompanhe os processos seletivos, eventos culturais e conquistas
            acadêmicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-start">
          {sortedNews.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="group block h-full cursor-pointer"
              onClick={() => setSelectedNews(item)}
            >
              <GlassCard className="h-full overflow-hidden hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 dark:bg-primary-400/10 backdrop-blur-md text-white text-xs font-medium tracking-wide shadow-sm border border-primary-500/20 dark:border-primary-400/20">
                    <span className="w-2 h-2 rounded-full bg-primary-400"></span>
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
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/news">
            <GlassButton variant="ghost" icon={ArrowRight}>
              Ver todas as notícias
            </GlassButton>
          </Link>
        </div>
      </section>

      {/* Modal de detalhes da notícia */}
      {selectedNews &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full overflow-hidden max-h-[90vh] flex flex-col">
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
                  <span className="px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-slate-800 shadow-sm">
                    {formatDateForDisplay(selectedNews.date)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 shadow-lg backdrop-blur-sm transition-all"
                  aria-label="Fechar"
                >
                  <X size={20} weight="regular" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
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
          </div>,
          document.body
        )}
    </LiquidBackground>
  );
};
