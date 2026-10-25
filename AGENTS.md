<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Regras de Governança Editorial e Acervo Acústico

### 1. Regra Estrita de Áudio e Trilhas Sonoras (Gerasom)
- **Se não tiver link do Gerasom ou de música real, NÃO se insere áudio.**
- É expressamente proibido inserir arquivos de áudio fictícios, mocks ou genéricos (como `/audio/demo.wav`) em qualquer obra poética.
- Obras que não possuam composições musicais reais ou links oficiais do Gerasom (`https://gerasom.com/...` ou `https://cdn.gerasom.com/...`) devem ter:
  - `"faixas": []`
  - `"audioCapaUrl": null`
- A seção de Discografia (`/musicas`) destina-se exclusivamente a obras com trilhas acústicas autênticas e confirmadas.
