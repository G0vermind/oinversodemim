import { config, fields, collection, singleton } from '@keystatic/core';

const isExplicitLocal = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === 'local';
const hasGitHubCredentials = Boolean(
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
  process.env.KEYSTATIC_SECRET
);

// Fallback gracefully to 'local' mode during build and when GitHub OAuth is not yet populated
const useGitHub = !isExplicitLocal && hasGitHubCredentials;

export default config({
  storage: useGitHub
    ? {
        kind: 'github',
        repo: {
          owner: 'G0vermind',
          name: 'oinversodemim',
        },
      }
    : { kind: 'local' },
  ui: {
    brand: {
      name: 'O Inverso de Mim — Gestão Editorial',
    },
    navigation: {
      'Catálogo Literário': ['obras'],
      'Autor & Estética': ['biografia'],
    },
  },
  collections: {
    obras: collection({
      label: 'Obras & Livros',
      slugField: 'titulo',
      path: 'content/obras/*',
      format: { data: 'json' },
      schema: {
        titulo: fields.slug({
          name: {
            label: 'Título da Obra',
            description: 'Nome principal do livro ou coletânea lírica',
            validation: { isRequired: true },
          },
          slug: {
            label: 'Slug da URL',
            description: 'Identificador único na URL (ex: o-inverso-de-mim)',
          },
        }),
        sentimento: fields.select({
          label: 'Sentimento Predominante',
          description: 'Classificação temática para navegação no acervo',
          options: [
            { label: 'Existência', value: 'Existência' },
            { label: 'Melancolia', value: 'Melancolia' },
            { label: 'Tempo', value: 'Tempo' },
            { label: 'Veredas', value: 'Veredas' },
          ],
          defaultValue: 'Existência',
        }),
        descricao: fields.text({
          label: 'Sinopse & Apresentação',
          description: 'Texto de apresentação da obra nas páginas e no prefácio do eBook',
          multiline: true,
          validation: { isRequired: true },
        }),
        capaUrl: fields.image({
          label: 'Gravura / Capa Editorial (A5 Proporção)',
          description: 'Carregue a imagem da capa (salva em public/art/)',
          directory: 'public/art',
          publicPath: '/art/',
          validation: { isRequired: true },
        }),
        preco: fields.number({
          label: 'Preço Exemplar Físico (R$)',
          description: '0 para acesso/distribuição gratuita',
          defaultValue: 0,
        }),
        estoqueFisico: fields.integer({
          label: 'Estoque Físico Disponível',
          defaultValue: 10,
        }),
        linkVendaFisica: fields.text({
          label: 'Link para Compra Física (Opcional)',
          description: 'URL externa para livraria ou contato',
        }),
        createdAt: fields.date({
          label: 'Data de Lançamento / Publicação',
          defaultValue: { kind: 'today' },
        }),
        poemas: fields.array(
          fields.object({
            titulo: fields.text({
              label: 'Título do Poema / Canto',
              validation: { isRequired: true },
            }),
            ordem: fields.integer({
              label: 'Ordem no Livro',
              defaultValue: 1,
            }),
            publicadoEm: fields.date({
              label: 'Data do Poema',
              defaultValue: { kind: 'today' },
            }),
            conteudo: fields.text({
              label: 'Versos do Poema',
              description: 'Digite o poema. As quebras de estrofes e versos serão preservadas no eBook PDF A5 e no leitor digital.',
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          {
            label: 'Poemas & Versos (Alimenta automaticamente o eBook PDF e o Leitor Digital)',
            itemLabel: (props) => props.fields.titulo.value || 'Novo Poema',
          }
        ),
        faixas: fields.array(
          fields.object({
            titulo: fields.text({
              label: 'Título da Faixa Acústica',
              validation: { isRequired: true },
            }),
            arquivoUrl: fields.text({
              label: 'URL do Arquivo de Áudio',
              description: 'Ex: link da Gerasom (https://gerasom.com/d-...) ou arquivo estático (/audio/...)',
              validation: { isRequired: true },
            }),
            duracao: fields.integer({
              label: 'Duração em Segundos',
              description: 'Ex: 210 = 3min 30s',
              defaultValue: 180,
            }),
            letra: fields.text({
              label: 'Letra Cantada / Poema Falado (Opcional)',
              multiline: true,
            }),
          }),
          {
            label: 'Trilhas de Áudio / Ópera Bufa (Projeto Gerasom)',
            itemLabel: (props) => props.fields.titulo.value || 'Nova Faixa',
          }
        ),
      },
    }),
  },
  singletons: {
    biografia: singleton({
      label: 'Biografia & Manifesto do Autor',
      path: 'content/biografia',
      format: { data: 'json' },
      schema: {
        autorNome: fields.text({ label: 'Nome do Autor', defaultValue: 'Heldemarcio Ferreira' }),
        autorTitulo: fields.text({ label: 'Título / Epíteto', defaultValue: 'Poeta, Compositor & Pesquisador Lírico' }),
        autorLocal: fields.text({ label: 'Local e Origem', defaultValue: 'Pernambuco, Brasil (n. 1962)' }),
        autorEpigrafe: fields.text({ label: 'Epígrafe', defaultValue: '«A poesia não preenche o silêncio: ela ensina a ouvi-lo.»' }),
        palavrasAutorOriginal: fields.text({
          label: 'Palavras do Autor sobre a Obra',
          multiline: true,
        }),
        manifestoTitulo: fields.text({ label: 'Título do Manifesto', defaultValue: 'O Silêncio da Palavra & A Densidade Lírica' }),
        manifestoSubtitulo: fields.text({ label: 'Subtítulo do Manifesto', defaultValue: 'Um manifesto estético sobre a palavra despojada e a ressonância humana' }),
        manifestoParagrafos: fields.array(
          fields.text({ label: 'Parágrafo do Manifesto', multiline: true }),
          { label: 'Parágrafos do Manifesto', itemLabel: (props) => props.value ? props.value.slice(0, 45) + '...' : 'Parágrafo' }
        ),
      },
    }),
  },
});
