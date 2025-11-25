import { NavItem, Course, FacultyMember, NewsItem } from './types';

// ==============================================================================
// CONFIGURAÇÃO DO INSTAGRAM
// Defina VITE_INSTAGRAM_ACCESS_TOKEN no .env.local (token do Graph API).
// Se deixar vazio, o site mostrará imagens ilustrativas automaticamente.
// ==============================================================================
export const INSTAGRAM_ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN ?? '';
export const INSTAGRAM_PROFILE = import.meta.env.VITE_INSTAGRAM_PROFILE || 'eeepmariacelia'; // usado para o link "Seguir"

export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', path: '/' },
  { label: 'A Escola', path: '/about' },
  { label: 'Cursos', path: '/courses' },
  { label: 'Notícias', path: '/news' },
  { label: 'Contato', path: '/contact' },
];

export const COURSES: Course[] = [
  // Eixo Gestão e Negócios
  {
    id: '1',
    title: 'Técnico em Administração',
    category: 'Gestão e Negócios',
    description: 'Formação completa para processos organizacionais, rotinas de RH, planejamento financeiro e gestão de projetos.',
    duration: '3 Anos',
    level: 'Ensino Médio Integrado',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80',
    modules: ['Gestão de Pessoas e DP', 'Finanças e Custos', 'Marketing, Vendas e CRM', 'Logística e Operações', 'Projeto Integrador e Empreendedorismo'],
    opportunities: ['Assistente administrativo/financeiro', 'Suporte em RH e DP', 'Analista de processos júnior', 'Empreendedor de pequenos negócios']
  },
  {
    id: '2',
    title: 'Técnico em Comércio',
    category: 'Gestão e Negócios',
    description: 'Estratégias de vendas, relacionamento com cliente, marketing digital e gestão de varejo e e-commerce.',
    duration: '3 Anos',
    level: 'Ensino Médio Integrado',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    modules: ['Experiência do Cliente e CRM', 'Marketing Digital e Conteúdo', 'E-commerce e Marketplace', 'Gestão de Compras e Estoques', 'Operações de Varejo e Visual Merchandising'],
    opportunities: ['Consultor comercial', 'Analista de e-commerce', 'Planejamento de varejo', 'Inside sales e pré-vendas']
  },
  {
    id: '3',
    title: 'Técnico em Finanças',
    category: 'Gestão e Negócios',
    description: 'Controle financeiro, análise de investimentos, contabilidade aplicada e planejamento tributário.',
    duration: '3 Anos',
    level: 'Ensino Médio Integrado',
    image: 'https://images.unsplash.com/photo-1554224155-9727b53c8128?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    modules: ['Matemática Financeira e Planilhas', 'Contabilidade e Demonstrativos', 'Orçamento e Custos', 'Crédito, Investimentos e Risco', 'Tributação e Compliance'],
    opportunities: ['Assistente financeiro/tesouraria', 'Crédito e cobrança', 'Controle de custos', 'Suporte contábil e fiscal']
  },
  // Eixo Recursos Naturais
  {
    id: '4',
    title: 'Técnico em Agronegócio',
    category: 'Recursos Naturais',
    description: 'Gestão da cadeia produtiva, sustentabilidade, cooperativismo e tecnologias aplicadas ao campo.',
    duration: '3 Anos',
    level: 'Ensino Médio Integrado',
    image: 'https://images.unsplash.com/photo-1625246333195-09d9b630df0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    modules: ['Gestão da Produção e Custos', 'Sustentabilidade e Meio Ambiente', 'Logística e Cadeia de Suprimentos', 'Tecnologias e Inovação do Campo', 'Cooperativismo e Comercialização'],
    opportunities: ['Gestão rural', 'Consultoria produtiva', 'Operação de cadeias agroindustriais', 'Empreendimentos agrícolas']
  },
  {
    id: '5',
    title: 'Técnico em Fruticultura',
    category: 'Recursos Naturais',
    description: 'Cultivo, manejo de pomares, irrigação, pós-colheita e qualidade orientada ao mercado.',
    duration: '3 Anos',
    level: 'Ensino Médio Integrado',
    image: 'https://images.unsplash.com/photo-1602367369328-74a477195f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    modules: ['Propagação e Viveiros', 'Manejo de Pomares e Solo', 'Irrigação e Fertirrigação', 'Pós-colheita e Qualidade', 'Mercado, Certificação e Comercialização'],
    opportunities: ['Gestão de pomares', 'Consultoria técnica', 'Produção e classificação de frutas', 'Agroindústria e certificação']
  },
  // Eixo Informação e Comunicação
  {
    id: '6',
    title: 'Desenvolvimento de Sistemas',
    category: 'Informação e Comunicação',
    description: 'Programação web/mobile, banco de dados, APIs e práticas modernas de engenharia de software.',
    duration: '3 Anos',
    level: 'Ensino Médio Integrado',
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    modules: ['Lógica e Algoritmos', 'Front-end e UX', 'Banco de Dados e SQL', 'Back-end e APIs', 'DevOps, Cloud e Deploy'],
    opportunities: ['Dev júnior web/mobile', 'Suporte a sistemas', 'Automação de processos', 'Empreendedorismo digital']
  },
  {
    id: '7',
    title: 'Redes de Computadores',
    category: 'Informação e Comunicação',
    description: 'Infraestrutura de redes, servidores, segurança da informação, conectividade e cloud.',
    duration: '3 Anos',
    level: 'Ensino Médio Integrado',
    image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    modules: ['Fundamentos de Redes', 'Cabeamento e Wireless', 'Servidores e Virtualização', 'Segurança da Informação', 'Cloud e Monitoramento'],
    opportunities: ['Suporte de redes', 'Administração de servidores', 'Segurança básica', 'Implantação de infraestrutura']
  },
];

export const FACULTY: FacultyMember[] = [
  {
    id: '1',
    name: 'Núcleo Gestor',
    role: 'Direção e Coordenação',
    specialty: 'Gestão Escolar',
    bio: 'Liderança comprometida com o sucesso educacional.',
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'
  },
  {
    id: '2',
    name: 'Corpo Docente Técnico',
    role: 'Professores da Base Técnica',
    specialty: 'Formação Profissional',
    bio: 'Especialistas do mercado preparando alunos para a prática.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1376&q=80'
  },
  {
    id: '3',
    name: 'Corpo Docente Base Comum',
    role: 'Professores da Base Comum',
    specialty: 'Formação Propedêutica',
    bio: 'Foco na excelência acadêmica e preparação para o ENEM.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  }
];

export const NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Processo Seletivo 2026',
    date: '10 Dez 2025',
    summary: 'Edital aberto para ingresso nos cursos técnicos em Administração, Informática e Recursos Naturais. Confira as vagas disponíveis e prazos.',
    category: 'Admissão',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    featured: true,
    type: 'edital',
    content: `Estão abertas as inscrições para o Processo Seletivo de novos alunos para o ano letivo de 2026. A EEEP Professora Maria Célia Pinheiro Falcão oferta vagas para os seguintes cursos técnicos integrados ao ensino médio:

- Administração: 45 vagas
- Comércio: 45 vagas
- Informática: 45 vagas
- Agronegócio: 45 vagas

As inscrições devem ser realizadas presencialmente na secretaria da escola, de 10 a 20 de dezembro, das 8h às 16h. O candidato deve apresentar histórico escolar do ensino fundamental, RG, CPF e comprovante de residência.

A prova de seleção ocorrerá no dia 15 de janeiro de 2026. O resultado preliminar será divulgado no dia 20 de janeiro.`
  },
  {
    id: '2',
    title: 'Feira de Ciências e Cultura',
    date: '25 Nov 2025',
    summary: 'Alunos apresentam projetos inovadores integrando tecnologia e sustentabilidade. Evento aberto à comunidade escolar.',
    category: 'Eventos',
    image: 'https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    featured: false,
    type: 'news'
  },
  {
    id: '3',
    title: 'Destaque no SPAECE',
    date: '15 Out 2025',
    summary: 'EEEP Maria Célia conquista premiação por desempenho em Língua Portuguesa e Matemática, superando metas estaduais.',
    category: 'Conquistas',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    featured: false,
    type: 'news'
  },
  {
    id: '4',
    title: 'Renovação do Laboratório de Informática',
    date: '05 Set 2025',
    summary: 'Escola recebe 40 novos computadores de última geração para os cursos de TI e Redes, modernizando o ensino prático.',
    category: 'Infraestrutura',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    featured: false,
    type: 'news'
  },
  {
    id: '5',
    title: 'Parceria com Empresas Locais',
    date: '20 Ago 2025',
    summary: 'Novos convênios garantem vagas de estágio para alunos dos cursos de Gestão e Comércio no comércio de Pereiro.',
    category: 'Parcerias',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    featured: false,
    type: 'news'
  },
  {
    id: '6',
    title: 'Semana da Arte Moderna',
    date: '12 Jul 2025',
    summary: 'Projetos interdisciplinares de Linguagens e Códigos celebram a cultura brasileira com exposições e apresentações.',
    category: 'Cultura',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    featured: false,
    type: 'news'
  }
];
