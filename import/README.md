# Pasta de Importação Rápida de eBooks

Coloque aqui os arquivos PDF das obras poéticas diagramadas (ex: `7-asas-para-a-liberdade.pdf`, `promiscuos.pdf`, `o-inverso-de-mim.pdf`, etc.).

### Como importar tudo automaticamente:
Abra o terminal e execute:
```bash
pnpm ebook:import
```

Ou para importar um arquivo específico:
```bash
pnpm ebook:import import/meu-livro.pdf slug-da-obra
```

### O que o importador faz sozinho em segundos:
1. Lê o PDF e extrai **Palavras do Autor, Apresentação, Prefácio e Posfácio**.
2. Identifica todos os **Poemas**, estrofes e versos.
3. Localiza os links do **Gerasom** e busca na CDN os links diretos dos arquivos `.mp3`.
4. Copia o PDF oficial para `public/ebooks/<slug>.pdf` com botão de download no santuário.
5. Gera ou atualiza o arquivo `content/obras/<slug>.json`.

> **Regra Estrita de Áudio:** Se o livro não contiver links oficiais do Gerasom ou arquivos de música real, **NÃO se insere áudio** (faixas vazias e sem capa de áudio). A obra funcionará em modo leitura pura.
