# EEEP Professora Maria Célia Pinheiro Falcão

<div align="center">
  <img src="public/logo-light.svg" alt="EEEP Logo" width="200" />
  
  <p><strong>Website Institucional da Escola Estadual de Educação Profissional</strong></p>
  <p>Uma experiência premium e moderna com design "Liquid Glass" inspirado em iOS 26</p>
</div>

## 🎨 Sobre o Design

O site utiliza técnicas avançadas de **Glassmorphism** com React e Tailwind CSS, criando uma experiência visual fluida e moderna:

- ✨ Background animado com "orbes" (Meshed Gradients)
- 🪟 Componentes translúcidos com efeito de vidro
- 🎭 Micro-animações suaves com Framer Motion
- 🌓 Dark/Light mode totalmente integrado
- 📱 Design responsivo em todos os dispositivos

## 🚀 Tecnologias

- **React 19** com TypeScript
- **Tailwind CSS** - Design system personalizado
- **Framer Motion** - Animações fluidas
- **Phosphor Icons** - Iconografia moderna
- **Supabase** - Backend e autenticação
- **Vite** - Build tool ultrarrápido

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone [url-do-repo]
cd eeep-profa.-maria-célia-pinheiro-falcão
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `env.example` para `.env` e preencha as credenciais:

```bash
cp env.example .env
```

Variáveis necessárias:
- `VITE_SUPABASE_URL` - URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `VITE_INSTAGRAM_TOKEN` (opcional) - Token do Instagram Graph API

4. **Execute em desenvolvimento**
```bash
npm run dev
```

O site estará disponível em `http://localhost:3001`

## 🏗️ Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

### Deploy

O projeto está otimizado para deploy em:
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

Exemplo de deploy no Vercel:
```bash
npm install -g vercel
vercel --prod
```

## 📁 Estrutura do Projeto

```
├── components/          # Componentes reutilizáveis
│   ├── GlassCard.tsx   # Card com efeito glass
│   ├── GlassButton.tsx # Botão estilizado
│   ├── LiquidBackground.tsx # Background animado
│   ├── Header.tsx      # Cabeçalho flutuante
│   └── Footer.tsx      # Rodapé
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página inicial
│   ├── About.tsx       # Sobre a escola
│   ├── Courses.tsx     # Cursos técnicos
│   ├── News.tsx        # Notícias e editais
│   ├── Contact.tsx     # Contato
│   ├── Admin.tsx       # Painel administrativo
│   └── NotFound.tsx    # Página 404
├── contexts/           # Contextos React
│   ├── DataContext.tsx # Gerenciamento de dados
│   ├── AuthContext.tsx # Autenticação
│   └── ToastContext.tsx # Notificações
├── services/           # Serviços e APIs
│   └── instagramService.ts # Integração Instagram
├── public/             # Assets estáticos
│   ├── sitemap.xml     # Sitemap para SEO
│   └── robots.txt      # Instruções para crawlers
└── lib/                # Utilitários
    └── utils.ts        # Helpers (cn, etc)
```

## 🎯 Funcionalidades

### Área Pública
- ✅ Página inicial com destaques e eixos tecnológicos
- ✅ Informações institucionais
- ✅ Catálogo de cursos com filtros
- ✅ Blog de notícias e editais
- ✅ Formulário de contato
- ✅ Feed do Instagram integrado

### Painel Administrativo
- ✅ Autenticação segura via Supabase
- ✅ Gerenciamento de notícias e editais
- ✅ Gerenciamento de cursos
- ✅ Interface com Liquid Glass style

## 🎨 Design System

### Componentes Base
- `GlassCard` - Container translúcido com blur
- `GlassButton` - Botão com variants (primary, secondary, ghost, accent)
- `LiquidBackground` - Background animado

### Cores
- **Primary**: Verde institucional (`#16a34a`)
- **Accent**: Teal complementar (`#14b8a6`)
- **Slate**: Tons de cinza para texto e backgrounds

### Tipografia
- **Display**: Títulos grandes (Hero sections)
- **Headings**: Títulos de seção e cards
- **Body**: Texto corrido e descrições

## 🔒 Segurança

- Autenticação via Supabase
- Rotas protegidas no admin
- Sanitização de inputs
- CSP headers (configurar no hosting)

## 📊 SEO

- ✅ Meta tags otimizadas
- ✅ Open Graph tags
- ✅ Structured data (JSON-LD)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Lazy loading de imagens

## 🎭 Performance

- ✅ Code splitting (React.lazy)
- ✅ Lazy loading de imagens
- ✅ Suspense boundaries
- ✅ CSS minificado e otimizado
- ✅ Tree shaking automático

## 👨‍💻 Desenvolvimento

**Desenvolvido por:** Massaro Victor  
**Design:** Liquid Glass (iOS 26 Inspired)  
**Ano:** 2025

## 📝 Licença

© 2025 EEEP Professora Maria Célia Pinheiro Falcão. Todos os direitos reservados.

---

<div align="center">
  Feito com ❤️ para a comunidade escolar de Pereiro-CE
</div>
