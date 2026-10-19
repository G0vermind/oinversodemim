# O Inverso de Mim

Plataforma literária e acústica dedicada às poesias e trilhas sonoras do autor Heldemarcio Ferreira. O projeto prioriza uma experiência contemplativa, tipografia editorial (estilo Kinpaku / Dark Academia), áudio contínuo e leitura imersiva livre de distrações.

---

## 1. Instalação e Execução

### Pré-requisitos
* Node.js 20+
* Gerenciador de pacotes `pnpm` (ou `npm`)

### Instalação das dependências
```bash
pnpm install
```

### Configuração do Banco de Dados
O projeto utiliza Prisma com SQLite para desenvolvimento local:

```bash
# Executa as migrations no banco local
pnpm exec prisma migrate dev

# Popula o banco com os dados iniciais
pnpm exec prisma db seed
```

### Executar em Desenvolvimento
```bash
pnpm run dev
```
Acesse `http://localhost:3000`.

### Verificação de Tipos, Linter e Build
```bash
# Checagem de tipos TypeScript
pnpm exec tsc --noEmit

# Análise de lint (ESLint 9 com regras de React 19)
pnpm run lint

# Build de produção otimizado com Turbopack
pnpm run build
```

---

## 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (veja `.env.example`):

```ini
# URL do banco de dados (SQLite local em dev, PostgreSQL em produção)
DATABASE_URL="file:./dev.db"

# URL pública da aplicação para metadados e SEO
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Provedor analítico ('none' por padrão, ou 'vercel')
NEXT_PUBLIC_ANALYTICS="none"
```

---

## 3. Principais Decisões Técnicas

* **Next.js 16 (App Router com Turbopack):** Páginas estáticas pré-renderizadas (`SSG`), rotas dinâmicas compiladas via `generateStaticParams` e divisão clara entre Server Components e Client Components.
* **Design System & Temas (Inspirado em impeccable.style):**
  * Dois temas equilibrados (Claro e Escuro) com tokens semânticos (`fundo`, `superficie`, `linha`, `texto`, `texto-suave`, `destaque`).
  * Contraste com conformidade estrita aos padrões WCAG AA e AAA.
  * Transição de tema instantânea sem flash via script inline no `<head>` e sincronização com `useSyncExternalStore`.
  * Tipografia editorial clássica com `Cormorant Garamond` (títulos) e `EB Garamond` (leitura poética).
* **Tocador de Áudio Global:**
  * Um único elemento `<audio>` montado persistentemente no layout principal, mantendo a música tocando continuamente durante a navegação entre todas as páginas e poemas.
  * Painel de letra estática acessível com restauração de foco e atalho `Esc`.
* **Modo de Leitura Zen:**
  * Coluna centralizada em largura tipográfica confortável (~65ch).
  * Oculta cabeçalho e rodapé temporariamente para leitura sem distrações.
  * Barra de progresso de rolagem no topo e saída rápida com a tecla `Esc`.
* **Pedidos de Exemplares e Contato:**
  * Foco em difusão cultural e doações de livros físicos para bibliotecas comunitárias, públicas, escolas e leitores interessados.
* **Privacidade Absoluta:**
  * Zero cookies de rastreamento e sem coleta de dados pessoais sem consentimento.

---

## 4. Hospedagem e Considerações de Produção

* **Plataforma de Hospedagem (Vercel / Outros):**
  * O plano *Vercel Hobby* é restrito a uso não comercial pessoal. Caso o autor ou o projeto venha a comercializar produtos ou serviços no futuro, deve-se utilizar um plano que permita uso comercial (ex: Vercel Pro ou provedor independente como VPS/Docker).
* **Banco de Dados em Produção:**
  * O arquivo SQLite (`dev.db`) é destinado a ambiente local. Para produção na Vercel ou contêineres sem disco persistente, configure um banco relacional gerenciado (ex: Neon PostgreSQL, Supabase ou Turso) atualizando o provedor no `prisma/schema.prisma` e a variável `DATABASE_URL`.
* **Armazenamento de Áudio:**
  * As faixas de áudio demonstrativas residem atualmente em `public/audio/`. Para um catálogo sonoro extenso com arquivos de estúdio em alta resolução, recomenda-se hospedar as faixas em um serviço de armazenamento de objetos / CDN dedicado (ex: AWS S3, Cloudflare R2 ou Vercel Blob) para economizar banda e otimizar o tempo de carregamento.
