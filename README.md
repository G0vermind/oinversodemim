# O Inverso de Mim

Plataforma literária e acústica dedicada às poesias e trilhas sonoras do autor Heldemarcio Ferreira. O projeto prioriza uma experiência contemplativa, tipografia editorial (estilo *Kinpaku / Dark Academia*), áudio contínuo ininterrupto e leitura poética livre de distrações.

---

## 1. Instalação e Execução

### Pré-requisitos
* Node.js `>= 22.23.4` (LTS seguro)
* Gerenciador de pacotes `pnpm >= 9.0.0`

### Instalação das dependências
```bash
pnpm install
```

### Executar em Desenvolvimento
```bash
pnpm run dev
```
Acesse `http://localhost:3000`.

### Verificação de Tipos, Linter e Testes Automatizados
```bash
# Checagem de tipos estritos TypeScript
pnpm exec tsc --noEmit

# Análise de lint (ESLint 9 com regras de React 19)
pnpm run lint

# Execução da suíte completa de testes automatizados (Vitest)
pnpm test

# Build de produção otimizado com Turbopack (SSG)
pnpm run build
```

### Comandos de Automação Editorial (CLI)
```bash
# Cadastro guiado de nova obra poética com validação Zod
pnpm obra:nova

# Pré-geração e validação de cache dos 14 PDFs editoriais A5
pnpm pdf:pregen
```

---

## 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (consulte o modelo em `.env.example`):

```ini
# URL pública da aplicação para metadados e SEO
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Provedor analítico ('none' por padrão, ou 'vercel')
NEXT_PUBLIC_ANALYTICS="none"

# Gestão Editorial via Keystatic ('local' em dev, ou 'github' em produção)
NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND="local"

# Notificações de Pedidos de Exemplares para Bibliotecas (Opcional - Resend)
# RESEND_API_KEY=""
# RESEND_FROM_EMAIL="O Inverso de Mim <onboarding@resend.dev>"
# CONTACT_NOTIFICATION_EMAIL="contato@heldemarcio.com"
```

---

## 3. Principais Decisões Técnicas & Arquitetura

* **Arquitetura Git-Backed Jamstack (Perenidade dos Textos):**
  * O acervo de obras, poemas e faixas é 100% versionado em arquivos JSON estruturados em `content/obras/*.json`.
  * Não há dependência de banco de dados relacional para leitura: o Next.js App Router compila as páginas de forma puramente estática (`SSG`) via `generateStaticParams`, garantindo carregamento instantâneo via CDN global e zero custos recorrentes de banco.
* **Gestão Editorial com Keystatic (`/keystatic`):**
  * Em desenvolvimento local, edita os arquivos JSON diretamente no disco.
  * Em produção na Vercel, conecta-se via GitHub App e gera commits atômicos diretamente no repositório.
* **Design System & Temas (Inspirado em Kinpaku / Dark Academia):**
  * Dois temas equilibrados (Claro e Escuro) com tokens semânticos (`fundo`, `superficie`, `linha`, `texto`, `texto-suave`, `destaque`).
  * Contraste com conformidade estrita aos padrões de acessibilidade WCAG AAA.
  * Transição instantânea sem flash via script inline no `<head>`.
  * Tipografia editorial clássica com `Cormorant Garamond` (títulos) e `EB Garamond` (leitura poética).
* **Tocador de Áudio Global & Isolamento de Alta Frequência:**
  * Um único elemento `<audio>` montado persistentemente no layout principal, mantendo a música tocando continuamente durante a navegação entre todas as páginas e poemas.
  * Seletores atômicos no Zustand e hook granular `useAudioCurrentTime()`, eliminando qualquer re-renderização desnecessária na casca visual durante a reprodução.
* **Sincronia Estrofe-Áudio & Leitura Zen:**
  * Iluminação suave do verso no tempo exato da declamação sonora (`VerseSyncHighlighter`).
  * Modo Zen com coluna centralizada (~65ch), atalho `Esc` e barra de progresso de leitura.
* **Motor de eBooks em PDF A5 On-Demand:**
  * Geração dinâmica via `@react-pdf/renderer` com cache duplo de latência ultrabaixa (Nível 1 em RAM < 5ms, Nível 2 em Disco < 20ms).
* **Difusão Cultural e Pedidos de Livros Físicos:**
  * Canal oficial de doações de exemplares para bibliotecas públicas, comunitárias e leitores interessados (`/contato`), com validação Zod e proteção anti-spam.

---

## 4. Hospedagem e Considerações de Produção

* **Plataforma de Hospedagem (Vercel):**
  * Deploys contínuos e automáticos disparados por commits na branch `main`.
* **CMS em Produção:**
  * Para liberar o painel `/keystatic` na Vercel para o autor, basta cadastrar as credenciais do GitHub App (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` e `KEYSTATIC_SECRET`).
* **Armazenamento de Áudio:**
  * As faixas sonoras residem em `public/audio/`. Para um catálogo sonoro extenso com arquivos de estúdio em alta resolução, recomenda-se hospedar as faixas em um serviço de armazenamento de objetos / CDN dedicado (ex: Cloudflare R2 ou Vercel Blob) para otimizar o tempo de carregamento inicial.
