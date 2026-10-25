# Regras de Áudio e Integração Sonora (Projeto Gerasom)

## Diretriz Primária: Áudio Apenas com Link Real
**Se a obra ou poema não tiver link do Gerasom ou de música real confirmada, NÃO se insere áudio.**

### Diretrizes Específicas:
1. **Nenhum Áudio Mock/Fictício:** Nunca inserir faixas temporárias, arquivos genéricos como `/audio/demo.wav` ou stubs de áudio em arquivos JSON de obras (`content/obras/*.json`).
2. **Campos quando não há áudio:**
   - `"faixas": []`
   - `"audioCapaUrl": null`
3. **Página de Leitura (`/obras/[slug]/ler`):** Quando a obra não possui faixas sonoras, os botões de reprodução e o reprodutor de acompanhamento acústico devem permanecer ocultos, oferecendo uma experiência de leitura limpa e focada.
4. **Discografia Geral (`/musicas`):** Apenas álbuns que de fato contenham faixas com links válidos do Gerasom (`https://cdn.gerasom.com/...` ou `https://gerasom.com/...`) são carregados e listados na discografia.
