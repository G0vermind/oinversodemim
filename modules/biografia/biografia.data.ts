import fs from 'fs';
import path from 'path';

export interface ObrasMarco {
  ano: string;
  titulo: string;
  slug: string;
  simbolo: string;
  descricao: string;
  significadoSimbólico: string;
}

export interface CriticaDepoimento {
  autor: string;
  papel: string;
  citacao: string;
}

const BIOGRAFIA_STATIC = {
  autor: {
    nome: "Heldemarcio Ferreira",
    titulo: "Poeta, Compositor & Pesquisador Lírico",
    local: "Pernambuco, Brasil (n. 1962)",
    epigrafe: "«A poesia não preenche o silêncio: ela ensina a ouvi-lo.»",
    palavrasAutorOriginal:
      "Este caminho retrata as fases mais significativas de minha vida: a juventude com todos os ideais, a dedicação à carreira, a opção pela poesia e pelo sentimento, e o amor que é arte ou desastre para quem é amador. Trata-se de uma obra pessoal e intimista, sem qualquer restrição ou receio em relação às mais diversas interpretações.",
  },

  manifesto: {
    titulo: "O Silêncio da Palavra & A Densidade Lírica",
    subtitulo: "Um manifesto estético sobre a palavra despojada e a ressonância humana",
    paragrafos: [
      "Escrever não é um ato de acumulação, mas de purificação. No turbilhão veloz do século XXI, a palavra foi inflacionada pelo ruído, desgastada pelo consumo efêmero e privada de seu peso reflexivo. 'O Inverso de Mim' nasce exatamente na contramão dessa pressa: como um convite à desaceleração, à contemplação e ao reencontro com o que não pode ser resumido em slogans.",
      "Para Heldemarcio Ferreira, cada verso é esculpido como quem talha a madeira ou prensa a gravura em calcografia. Há um respeito profundo pelos espaços vazios, pelas pausas sonoras e pela melancolia fértil — aquele estado de ânimo lúcido onde a dor e a beleza coexistem sem artifícios.",
      "Do estudante e engenheiro que construía poesias até a consolidação de sua lírica acústica, a trajetória de Heldemarcio revela uma arte visceral: o trânsito corajoso entre a elegia existencial, o erotismo da alcova e a ópera cantada ao mar e às estrelas.",
    ],
  },

  parceriaGerasom: {
    titulo: "A Fusão Sonora com o Projeto Gerasom",
    subtitulo: "A voz falada e o violão acústico em diálogo contínuo",
    descricao:
      "A experiência de 'O Inverso de Mim' e 'Odes Melódicas' é indissociável de sua dimensão acústica. Em estreita colaboração com o projeto musical Gerasom, as composições foram concebidas no formato de ópera bufa — poemas feitos sob medida para serem cantados e envoltos por cordas de violão, percussões sutis e paisagens sonoras.",
    detalhes: [
      "Gravação acústica pura em estúdio, preservando a respiração e a entonação nobre do verso cantado.",
      "Arranjos compostos sob medida para os ritmos métricos e rimas de cada ode e poema.",
      "Disponibilização pública contínua, permitindo ao leitor imergir tanto pelo olhar quanto pelo ouvido.",
    ],
  },

  marcosCronologicos: [
    {
      ano: "2005",
      titulo: "O Inverso de Mim",
      slug: "o-inverso-de-mim",
      simbolo: "O Coração Radiante & A Trajetória",
      descricao: "Obra seminal de estreia publicada em Recife. Um périplo em 4 atos: O Adolescente, O Profissional, O Poeta e O Amador.",
      significadoSimbólico: "A autodescoberta do poeta que era o inverso de si mesmo, unindo o rigor científico à emoção viril.",
    },
    {
      ano: "2019",
      titulo: "Promíscuos: Poemas da Alcova",
      slug: "promiscuos",
      simbolo: "A Silhueta & O Fogo da Alcova",
      descricao: "Livro de lírica sensual e erótica em 4 atos, investigando a luxúria, o toque de pele e a comunhão animal dos amantes.",
      significadoSimbólico: "A desmistificação do desejo sem hipocrisia, onde o verso profano se faz banquete sensorial.",
    },
    {
      ano: "2026",
      titulo: "Odes Melódicas",
      slug: "odes-melodicas",
      simbolo: "O Violino Barroco & As Quatro Liras",
      descricao: "Ópera bufa lírica concebida com o projeto Gerasom em 4 movimentos orquestrados: Odes, Astros, Ambiente e Liras Contemporâneas.",
      significadoSimbólico: "A apoteose da palavra cantada, celebrando deuses, seres humanos, Caymmi e Drummond.",
    },
  ] as ObrasMarco[],

  depoimentosCriticos: [
    {
      autor: "Alexandre Santos",
      papel: "Academia de Letras e Artes do Nordeste Brasileiro",
      citacao:
        "«A produção poética é um gesto de sensibilidade corajosa que exige do autor a decisão de se expor. Heldemarcio Ferreira carimbou o passaporte que, para deleite dos apaixonados pela poesia, vai levá-lo a viagens cada vez mais profundas no maravilhoso universo da literatura artística.»",
    },
    {
      autor: "Sébastien Joachin",
      papel: "Crítico Literário",
      citacao: "«A poesia como uma forma de descobrir o mundo e a si mesmo.»",
    },
    {
      autor: "Marcos D'Morais",
      papel: "Poeta",
      citacao:
        "«Ofício da necessidade imperiosa de expressão pelo verso. Poesia de afetuosa imagem que aporta na alma.»",
    },
    {
      autor: "Celso Marconi",
      papel: "Jornalista e Ensaísta",
      citacao:
        "«O filósofo Hegel nos ensina que a verdade está na elaboração. Assim também a Poesia: ela está na busca, na árdua e real caminhada.»",
    },
    {
      autor: "Ulisses Aguiar",
      papel: "Escritor e Organizador Literário",
      citacao:
        "«Em matéria de estilística, são sensivelmente curiosos os paralelismos e os cavalgamentos empregados. Metalinguagem que se confirma em toda a tecedura insinuante das composições.»",
    },
  ] as CriticaDepoimento[],

  missaoPublica: {
    titulo: "Compromisso com o Acesso Público e Gratuito",
    descricao:
      "Acreditamos que a poesia deve circular livremente, habitando tanto os aparelhos digitais quanto as estantes das bibliotecas do país.",
    itens: [
      "Doação contínua de exemplares físicos para bibliotecas comunitárias, municipais e escolares de todo o Brasil.",
      "Distribuição gratuita de todos os eBooks em alta resolução (formato A5 editorial para impressão).",
      "Manutenção da plataforma livre de anúncios intrusivos através de mecenato direto voluntário.",
    ],
  },
};

export function getBiografiaData(): typeof BIOGRAFIA_STATIC {
  try {
    const filePath = path.join(process.cwd(), 'content', 'biografia.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      return {
        ...BIOGRAFIA_STATIC,
        autor: {
          ...BIOGRAFIA_STATIC.autor,
          nome: (data.autorNome as string) || BIOGRAFIA_STATIC.autor.nome,
          titulo: (data.autorTitulo as string) || BIOGRAFIA_STATIC.autor.titulo,
          local: (data.autorLocal as string) || BIOGRAFIA_STATIC.autor.local,
          epigrafe: (data.autorEpigrafe as string) || BIOGRAFIA_STATIC.autor.epigrafe,
          palavrasAutorOriginal: (data.palavrasAutorOriginal as string) || BIOGRAFIA_STATIC.autor.palavrasAutorOriginal,
        },
        manifesto: {
          ...BIOGRAFIA_STATIC.manifesto,
          titulo: (data.manifestoTitulo as string) || BIOGRAFIA_STATIC.manifesto.titulo,
          subtitulo: (data.manifestoSubtitulo as string) || BIOGRAFIA_STATIC.manifesto.subtitulo,
          paragrafos: Array.isArray(data.manifestoParagrafos) && data.manifestoParagrafos.length > 0
            ? (data.manifestoParagrafos as string[])
            : BIOGRAFIA_STATIC.manifesto.paragrafos,
        },
      };
    }
  } catch (err) {
    console.error('Falha ao ler content/biografia.json:', err);
  }
  return BIOGRAFIA_STATIC;
}

export const BIOGRAFIA_DATA = getBiografiaData();
