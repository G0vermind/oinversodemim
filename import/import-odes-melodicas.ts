import fs from "fs";
import path from "path";

interface RawPoemData {
  titulo: string;
  gerasomUrl: string;
  conteudo: string;
}

const poemsRaw: RawPoemData[] = [
  {
    titulo: "Ode sem Fim",
    gerasomUrl: "https://gerasom.com/d-8a9614e5-8167-4250-8f3e-0d80ca70451a",
    conteudo: `Já na primeira vez, foi assim
Assimilei os sinais...
Tanta leveza que conta a mina
Feliz do coração que pulsa leve
Trevo da sorte e mapa da mina
Faísca do bem, tão rara e breve.

Já na segunda vez, fiquei a fim
Afinidades demais...
Tudo a seu tempo e sem pressa
Cada tema que flui na conversa
Troca de ideias e vida pregressa
Com a profusão vasta e diversa.

Já na terceira vez, veio a mim
Amizade que apraz...
Tento expressar sem receio
Pura emoção a fluir na sina
Truque imagético do anseio
Para a ode que não termina.`,
  },
  {
    titulo: "Ode ao solitário",
    gerasomUrl: "https://gerasom.com/d-3435a712-8246-4814-a1cb-a3864ace350f",
    conteudo: `Oh! coração dolente e infiel
Ambíguo e solitário à beira da via
Quando a ordem do mundo é cruel
E torna à míngua a esperança que havia
Precários alentos embaixo do céu.
O sol, sólida, solitude...

Oh! Sombra pálida de olhar triste
Seguindo adiante sem rumo e sem meta
Quando a dor a que essa alma resiste
E toma o semblante em torpor do poeta
Acusa-lhe a obra que a gente assiste.
O sol, sólida, solidão...

Quem tudo vê sempre indiferente
Diante da cena, sequer se manifesta
Quando a contenda se resume ao presente
E toda angústia extravasa o que resta
O sol da frieza arde à sua frente.
O sol, sólida, solução.`,
  },
  {
    titulo: "Ecos de Mim",
    gerasomUrl: "https://gerasom.com/d-8dcbbe5a-c5de-4074-9d34-52264d3cb47d",
    conteudo: `Ecos de meu coração tão cético
Nas brutas batidas desritmadas
Embalam o meu peito poético
Alvo das balas de amor atiradas.

A música que sempre me anima
Beleza que tangencia a perfeição
Como o corpo da alma feminina
Que se perpetua na imaginação.

Lembranças, memórias, saudade
Daquilo que fui e me trouxe aqui
Sinais que me delatam a idade
Vivas imagens de tudo que já vi.

Sons que ainda permeiam a mente
Frases proferidas, letras de canções
Gritos de alegria, silêncio eloquente
Palavras simulam sentidos e ações.

A melodia de um dia em plenitude
Ecoa em mim, poeta sem suporte
Só a paixão traduzida na atitude
De se viver comovido até a morte.`,
  },
  {
    titulo: "Ondas Melódicas",
    gerasomUrl: "https://gerasom.com/d-f9fe0abe-b82b-4c2b-a46e-a29108c85298",
    conteudo: `Navegai nos acordes da melodia
Movido pelo leme das quimeras
Sobre mares singulares da utopia
Ao singrares a nau rumo a terras
Com a face úmida de melancolia.

Evolua contra a onda que impacta
Numa turbulência cruel e adversa
Que expande a sua sanha abstracta
Ao combater a tal hidra perversa
Com a quilha que atravessa intacta.

Penetrai as procelas e tempestades
Das sereias e dos monstros terríveis
Ante a fúria de mitos e potestades
Qual presságio de périplos temíveis.
A purgar os pecados e iniquidades.

Atracai em fim, sem ilhas oníricas
Onde os desejos reais são humanos
Sentimentos são as joias mais ricas
Além de toda vastidão dos oceanos
Em cujos sonhos, a ode é mais lírica.`,
  },
  {
    titulo: "Ode dos Poetas",
    gerasomUrl: "https://gerasom.com/d-278544c0-ce2e-432e-bca6-fa6012d037fa",
    conteudo: `O homem é a semente
De o(n)de brota o invento
Engenho e arte da mente
Criando a cada momento
O poema futuro.

Esses poetas marginais
Como artistas visionários
Criam seus mundos magistrais
Da força de seus imaginários.

Esses autores viscerais
Seres autênticos em sua arte
Em meio aos versos geniais
Mostram a nossa oculta face.

Vida longa aos que fazem tanto
Pela condição humana em nós
Para sempre a palavra por encanto
E dela a eterna magia da voz.

Esses notáveis menestréis
Raros e sensíveis cantadores
Mesmo ante algozes cruéis
Cantam a vida e sus amores,

Esses profetas do cotidiano
Cronistas de emoções baratas
Pela veia do artista soberano
Brotam metáforas abstratas.`,
  },
  {
    titulo: "Acordes",
    gerasomUrl: "https://gerasom.com/d-767835ad-a9bf-483b-bbae-90868b5f65c4",
    conteudo: `Acordar pelos acordes matinais
Outro dia que se anuncia como aposta
Na intenção de fé e força viscerais
Se Deus quiser: como o Diabo gosta.

Acorde a tempo, cada momento é uno
A cor de tudo tem conteúdo e brilha
Acorde atento no movimento oportuno
A cor de ser é parecer a maravilha.

Que tudo seja na incerteza do amanhã
A vida aflora, aqui e agora, em nós
Na estrada à frente, a gente é puro afã
Nessa viagem, a cada dia, sem o após.`,
  },
  {
    titulo: "Encanto da Sereia (Odisseia)",
    gerasomUrl: "https://gerasom.com/d-cbeb0ee0-ea0c-43c4-b3b5-e2987a6c4840",
    conteudo: `É a odisseia dos navegantes
Que dá início a tal narrativa
E a travessia dos tripulantes
Seres ufanos de alma cativa.

Embarcados no frágil escaler
Sem astrolábio ou sextante
Para guiar a destino qualquer
Segue à deriva, nau errante.

Enquanto navegar é perigo
Sob desafios, riscos e sinais
Nessa tormenta sem abrigo
Procelas do mar são brutais.

Eis que o encanto da sereia
A miragem os atrai e inebria
Como o prazer corre na veia
Panaceia e sopro de alegria.

Enquanto o mar indiferente
Cobra atenção e reverência
Netuno com o seu tridente
Simbolizando a imponência.

Embarcados num presságio
Tais metáforas foram ditas
Como anúncio de naufrágio
Do “real” em que acreditas.

É o singrar por águas hostis
Ante a vastidão do oceano
Nenhuma ilha, cabo ou país
A encerrar o périplo insano.`,
  },
  {
    titulo: "Antares",
    gerasomUrl: "https://gerasom.com/d-b404c244-4a6d-4324-9579-ae0450bc7a26",
    conteudo: `“Amar um amor casto à distância,
...e alcançar a estrela inatingível”
(Miguel de Cervantes)

Antigas escrituras no papiro
Orientam os versos seculares
Desde o primeiro suspiro...
Até os infindos locos estelares

Por todas as sendas e lugares
Espraia-se em luz e som a poesia
Dançam estrelas, densos quasares
Energia vibra em franca estesia

Assim, por mais que seja distante
Há de pulsar no íntimo “este lar”
Que cada um carrega, habitante
Anima nostra ainda por se revelar

Num breve diálogo com Deus
Sem sacerdotes e suntuosos altares
Ínfimo grão do universo in theus
Alma gigante - estrela de Antares.`,
  },
  {
    titulo: "Alma Nua",
    gerasomUrl: "https://gerasom.com/d-df21e336-4dee-4511-b919-3f0044fc6b89",
    conteudo: `Que nada nos distraia
Nem o aplauso, nem a vaia
Que nada nos iluda
A fé insana que não ajuda
Que tudo seja pleno
Um ser audaz de tom ameno
Que tudo seja claro
De alma nua, eu me declaro!

Que nada vale tanto
Nem o poema e o seu encanto
Que nada é divino
Lágrima e suor regam o destino
Que tudo é passageiro
Até a vida, no sopro derradeiro
Que tudo também continua
Emana a vibração da alma nua.`,
  },
  {
    titulo: "Entusiasta",
    gerasomUrl: "https://gerasom.com/d-323e768c-b79f-4095-9c01-9f3cc4f1ae91",
    conteudo: `Para todo o fim, que haja um começo
E seja intensa a lida em seu propósito
Cada ser carrega em si a dor e o prazer
Viceja a sua aura na árdua aventura...

Viemos das sementes provisórias
Da onde nascemos em desalinho
O ninho dessas infinitas trajetórias
Da ode poética ao voo do passarinho

O pecado original que nos ungiu
Nos fez maior do que o fez Prometeu
Pois, a glória do humano que surgiu
Nos faz gozar no entusiasmo do ateu.`,
  },
  {
    titulo: "Conflito",
    gerasomUrl: "https://gerasom.com/d-ff22f9ea-3d6d-45a3-b533-c372f7a5b1e1",
    conteudo: `Tudo o que tinha a dizer já foi dito
Ainda assim, como teimoso, repito
Frases de mero efeito e nada mais!
Quanto mais da vida eu acumulo
Menos prazer sinto quando simulo
O bem estar dolente dos normais.

Quis encontrar a lógica no absurdo
Permanecer alheio, cego ou surdo
Na letargia de ser inerte aos sinais!
Viver para esse fim seria o cúmulo
De percorrer a rota até meu túmulo
Em meio à horda dos convencionais.

Sob a égide do implacável conflito
Que acompanha o meu ego aflito
De tal sorte, pude ousar algo mais!
Como poeta, a meu ver, dissimulo
Nas palavras que em versos emulo
Lugar comum de anjos e animais.`,
  },
  {
    titulo: "Transcendental",
    gerasomUrl: "https://gerasom.com/d-98b77744-3237-4bd6-8175-3f2e88fc2550",
    conteudo: `Amo você...
Ontem, hoje e para todo o sempre
Estando bem alegre ou triste e mal
Ainda que sejas apenas uma imagem
Uma mulher miragem virtual!

Amo você...
Por aquilo que despertou em mim
Com o torpor de arroubo passional
Uma atração que nunca havia sentido
Um homem perdido do real!

Amo você...
Pelos poemas que escrevo
Da inspiração remota e ancestral
Em todos versos lapidados pela rima
Um amor acima do normal!

Amo você...
Mesmo que esteja ausente
(Na nossa relação transcendental)
Pois, nos imagino ardendo de desejo
E, por um beijo, selo o final.`,
  },
  {
    titulo: "A Lenda",
    gerasomUrl: "https://gerasom.com/d-27b1b707-8b69-41b6-9c69-6dbe46599ff0",
    conteudo: `Todo amor acaba em dor
Nunca vale a pena!
Como uma venda que nos cega
Como uma lenda a que se apega
Todo ser carente e amador
Sempre a mesma cena!

Todo clamor desaba em rancor
Padece em fúria amena!
Como uma senda para o ermo
Como uma fenda ao meio termo
Arrebata e embriaga de torpor
Parece que nos condena!

Mas se o amor chamar, atenda
Acenda e deixe arder o fogo
É a centelha da sorte que acena
Mesmo se for sofrer, entenda
Aprenda que a vida é um jogo
“E a alma não é pequena!”`,
  },
  {
    titulo: "Mortuária",
    gerasomUrl: "https://gerasom.com/d-a1801863-60c4-4666-8b32-5b64c2b1a072",
    conteudo: `Denso é o colossal mistério que a espécie abriga
Em lúgubres paragens desses abismos abissais
Sofre o humano a sucumbir na dúvida mais antiga
Que o aflige desde os seus remotos ancestrais.

Eis o cruel enigma que embala sombrios presságios
Sob o véu nebuloso da anima ad aeternum
Eis o fiel paradigma que embasa os sóbrios adágios
Num viés fervoroso da crença no incomum.

Vê-se a marcha de martírios em febras fanáticas
Quantas vidas desperdiçam o contraditório
A mórbida certeza move a turba por vias erráticas.

Sem se aperceber do inevitável ou do transitório
Que pelos ritos de suas vertentes dogmáticas
Impuseram ao homem o seu padecer expiatório.`,
  },
  {
    titulo: "Quadro Social",
    gerasomUrl: "https://gerasom.com/d-9674a148-8fa9-4821-a4d0-4c0723b2f9ff",
    conteudo: `Avante homens que a contenda é justa
O triunfo é de quem não se assusta
“Uma batalha após a outra”, sem temer
O sacrifício a longo prazo de viver.

No duro fardo da árdua porfia diária
Contra a miséria da existência precária
Esse cenário prevalece sem modéstia
A apatia e a cólera da fulcral moléstia.

Para o status quo, nosso modus vivendi
Daí, o flagelo social e a mora solvendi
Às vezes até se percebe, esse sanatório
Esboço do quadro cruel e civilizatório.

Todos alertas aos conflitos iminentes
Diante das injustiças aos mais carentes
É o clamor dos “humilhados e ofendidos”
Uma revolta sobre os sonhos perdidos.`,
  },
  {
    titulo: "Mundance",
    gerasomUrl: "https://gerasom.com/d-fef930fe-96d7-41e1-a16a-e9d1d7444635",
    conteudo: `“O mundo inteiro está naquela
estrada ali em frente...” (Belchior)

O mundo está além do muro
Da cerca que limita o quintal
Através de passado ou futuro
Seja o moderno ou ancestral.

Vamos dançar, vamos dançar
Para chamar a chuva
Vamos dançar, vamos dançar
Até o sol nascer.

O mundo é casual e impreciso
Nada é divino ou maravilhoso
Sendo inútil o ideal do paraíso
Em meio a esse sítio perigoso.

Vamos dançar, vamos dançar
Para que o corpo aqueça
Vamos dançar, vamos dançar
Até que a alma brilhe.`,
  },
  {
    titulo: "Diante Do Mar",
    gerasomUrl: "https://gerasom.com/d-52d3b25b-e58c-40f1-86a6-9bfaba3044fe",
    conteudo: `Diante do mar
Colhi as estrelas na areia
O sol radionizante no ar
De eflúvios nos incendeia

Diante do mar
Caymmi se fez um rei
Nas cantigas a me embalar
Caí e me inspirei

Diante do mar
Meu corpo se doura na praia
Meus olhos a comparar
Espuma e renda de cambraia

Diante do mar
Dancei a ciranda de Lia
Os pés descalços a preamar
Tocando a vida à revelia

Diante do mar
Antes que o mal aconteça
Serei feliz para amar
Com todo bem que eu mereça

Diante do mar
No horizonte diviso o infinito
Não há quem possa alcançar
A amplidão do que eu acredito.`,
  },
  {
    titulo: "Outro Tempo",
    gerasomUrl: "https://gerasom.com/d-1aa832da-a81f-481d-a3d7-bc3f7f58090e",
    conteudo: `O que foi que aconteceu?
Como isso tudo transcorreu, sem que eu visse?
A criança cresceu no verde vale de lágrimas
- E agora, quem serei eu? É outro tempo.

Por que não estive atento?
Quando mudaram as estações, onde eu estava?
Andei contra a luz e contornei a sombra
- Era orgulho que me guiava o tempo todo.

A quem caberia o engodo?
Por acreditar em mim, sem o destino traçado?
E o passo adiante, para onde me afasto
- Será apenas no tempo, outro espaço.`,
  },
  {
    titulo: "Gaia",
    gerasomUrl: "https://gerasom.com/d-8abb60f2-0e4c-420b-83d3-d6ca6b37b81b",
    conteudo: `Mãe terra, morada fértil da ganância
Nascente natura do criador à criatura
Essa dádiva que alarda além a vida
Da força que gera tanta exuberância.

Gaia por tontos homens profanada
Palco dos conflitos, guerras e rebeliões
De ambições belicosas que devastam
Afastam do humano a sua aura sagrada.

Galés navegam desde o atlântico revolto
Por um sextante ou estrela que oriente
Frente ao pacífico mar, indico o horizonte
A ponte que une o oceano ao barco solto.

América, África, Europa, Ásia e Oceania
Pela cercania incontinente que nos separa
Da rara e nova era em que prospera a paz
Capaz de ser um farol que ilumina e guia.`,
  },
  {
    titulo: "Andaluz",
    gerasomUrl: "https://gerasom.com/d-45e812c3-5f66-48c4-bba5-6b524f0ee63f",
    conteudo: `Por terras de sol e sangue
Segue o bardo caminhante
Avante pela senda que o conduz
De luz é feita a sua sombra...

Pelas trilhas de verso e rima
Obra-prima forjada no instante
Brilhante como a aura que seduz
Traduz com vigor a sua verve.

Para sempre viva em poesia
A estesia utópica e irradiante
Diante de tudo que se expõe à luz
Nos azuis de céu e mar profanos.`,
  },
  {
    titulo: "Branca",
    gerasomUrl: "https://gerasom.com/d-d60f3d69-bcdc-4a10-8b59-1e95385f1baa",
    conteudo: `Lua
Nuvem
Papel
e seda
Branca

Alma
Estrela
Pétala
e lírio
Branco

Raios de luz em clareza alva
Alumbram as cidades grandes
Como a neve em plenos Andes
E os cristais da estrela D'Alva

Aura transparente da inocência
Que a pureza branca tudo encerra
Todas as cores juntas à atmosfera
Sob a luz d'uma transcendência

Que a paz dos “animais” vigore
Acalme o coração no peito aflito
E que novo e antigo sem conflito
Partilhem o amor que nos colore.`,
  },
  {
    titulo: "Escolhas",
    gerasomUrl: "https://gerasom.com/d-d1f0f6be-c399-4bc0-b463-aafb981471b2",
    conteudo: `Saudades do amor que nunca tive
Carência de um ser melancólico
Essa nostalgia do que não se vive
Algo interior em seu teor simbólico.

E de cada escolha que faço e repito:
Sóbrio, sombrio e solitário!
De tudo sendo, em nada me limito
No mapa da vida traço o meu itinerário.

E assim fica o dito pelo não dito:
O feito, o feitio e o feitiço!
Das poucas cousas em que acredito
Na finitude de um mundo em reboliço.`,
  },
  {
    titulo: "É Do Mundo (Drummondiando)",
    gerasomUrl: "https://gerasom.com/d-013f95b1-d714-4b34-8a20-bd2964b32ff0",
    conteudo: `Se o teu verso gauche vencer o tempo
Para durar além da vida
O poema sentimental arderá em glória
Como a cura a (se) provar
A tua assinatura nas paredes da memória...
(É do mundo, é du munde, é Drummond.)

.Se o eco do teu canto alcançar a dor
Pela freima da ferida acesa
A palavra engajada há de bradar direta
Sem remissão nem redenção
A aura da poesia a inundar a vida do poeta.
(É do mundo, é du munde, é Drummond.)`,
  },
  {
    titulo: "Tédio à Controvérsia",
    gerasomUrl: "https://gerasom.com/d-93042397-c5ca-4e14-8f55-bf49de72631d",
    conteudo: `Um debate que não avança
Enredo vicioso e sem saída
Peso fútil do fardo que cansa
A chama que apaga sem vida.

Um fogo que arde sem calor
No ritual de monotonia
Sem significado e sem teor
Feito da faísca da apatia.

Tédio que espraia suas chagas
Em discursos inúteis, amiúde
A controvérsia de ideias vagas
Como dogmas de quem se ilude.

O conflito que nos oprime
Qual o esforço que se esgota
Em resultado que deprime
Ciclo que repete a mesma rota.

Um argumento falacioso
Desprovido de razão sensata
Que se alastra malicioso
Pelo vão da filosofia barata.`,
  },
  {
    titulo: "Dançante",
    gerasomUrl: "https://gerasom.com/d-cc0ffd0e-8ee1-4211-a321-4e9c2ce59668",
    conteudo: `Faça de seu corpo um instrumento
No movimento articulado dos ossos
Siga em frente, de mente liberta
Aberta para as inéditas sensações...

Curta o lance com prazer e dance
Ao seu alcance está a chance de acender
Curta mesmo que se canse e dance
Assim, avance os degraus para ascender.

Faça da sua alma uma espaçonave
Noutro voo suave a bailar nos ócios
Sem o pecado pesado como agrura
Creatura sedenta de tais emoções...

Curta o lance por lazer e dance
A cada nuance, se balance até absorver
Curta o casual freelance e dance
Assim, o relance da graça vai te absolver.`,
  },
  {
    titulo: "Pareidolia",
    gerasomUrl: "https://gerasom.com/d-fc931080-1a89-4521-9478-3f9a0a348c0e",
    conteudo: `A tudo aquilo que está
Para além do lugar-comum
Que se revela ao mirar
Sentidos da mente em zoom

Assim há que se perceber
Na pareidolia das catarses
Cada significado se estender
Nas mensagens e sinapses

Na parede úmida do quarto
As manchas da capilaridade
Esboçam o perfeito retrato
Da mais poética celebridade.

De onde vem tal semelhança?
E qual seu recado subjacente?
Nesses cenários de mudança:
A inusitada nuvem iridescente.`,
  },
  {
    titulo: "A Mulher Deitada no Sofá",
    gerasomUrl: "https://gerasom.com/d-f27a5e9d-0e86-429c-bc54-7071f6eddf6c",
    conteudo: `Da sua íntima saga ferina
Fez-se a comédia e o drama
Sete vidas atrás da cortina
Mil anseios nesse sofá-cama

Noutra tarde que termina
Pela ribalta dos sonhos da dama
Ao bel-prazer da astúcia felina
Que observa o apagar da chama

A cena permanece presa à retina
E se repete como num programa
O dia a dia é o que nos alucina...

E a mulher deitada não reclama
Resignada em ser o que imagina
A vida segue e o gato ri da trama.`,
  },
  {
    titulo: "O Beijo",
    gerasomUrl: "https://gerasom.com/d-25d5120e-e3a2-4391-9e5d-fec51c5df6cb",
    conteudo: `De onde nasce o beijo
que faz o corpo a(s)cender
Daquilo que não vejo
quando cego pelo prazer
Da minha boca à tua boca
há quilômetros de sonhos
e desejos...

Bocas que se unem pelo beijo
como se fossem provar o amor
por inteiro...
Da minha boca à tua boca
há palavras ainda não ditas
de carinho...

Bocas desse mundo que almejo
Salivando à míngua no clamor
derradeiro...

Por fim, agora me despeço
com um longo beijo de poeta
Daqueles que tanto peço
de olhos cerrados e boca aberta.`,
  },
];

async function fetchGerasomAudio(gerasomUrl: string): Promise<string> {
  try {
    const res = await fetch(gerasomUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    if (!res.ok) return gerasomUrl;
    const html = await res.text();
    const audioMatch = html.match(/https:\/\/cdn\.gerasom\.com\/grs\/music\/audio\/[^"']+\.mp3/);
    return audioMatch ? audioMatch[0] : gerasomUrl;
  } catch {
    return gerasomUrl;
  }
}

async function main() {
  console.log("Iniciando importação completa de 'Odes Melódicas'...");
  const resolvedAudios: string[] = [];

  for (let i = 0; i < poemsRaw.length; i++) {
    const p = poemsRaw[i];
    console.log(`Processando [${i + 1}/${poemsRaw.length}] ${p.titulo}...`);
    const audioUrl = await fetchGerasomAudio(p.gerasomUrl);
    resolvedAudios.push(audioUrl);
  }

  const jsonPath = path.join(__dirname, "..", "content", "obras", "odes-melodicas.json");

  const poemas = poemsRaw.map((p, idx) => {
    const estrofes = p.conteudo.split(/\n\n+/);
    return {
      titulo: p.titulo,
      ordem: idx + 1,
      publicadoEm: "2026-01-01",
      conteudo: p.conteudo,
      timestamps: estrofes.map((_, sIdx) => ({
        estrofeIndex: sIdx,
        segundos: sIdx * 30,
      })),
    };
  });

  const faixas = poemsRaw.map((p, idx) => ({
    titulo: p.titulo,
    arquivoUrl: resolvedAudios[idx] || p.gerasomUrl,
    duracao: 180,
    letra: p.conteudo,
    capaUrl: "/art/odes-melodicas.jpg",
  }));

  const obraFinal = {
    titulo: "Odes Melódicas",
    sentimento: "Melancolia",
    descricao: "Coletânea lírica em formato de ópera bufa em parceria com o projeto Gerasom. Poemas compostos sob medida para serem cantados e adornados por melodias acústicas.",
    capaUrl: "/capas/odes-melodicas.png",
    ebookCapaUrl: "/capas/odes-melodicas.png",
    audioCapaUrl: "/art/odes-melodicas.jpg",
    ebookUrl: "/ebooks/odes-melodicas.pdf",
    preco: 0,
    estoqueFisico: 20,
    linkVendaFisica: "",
    createdAt: "2026-01-01",
    palavrasDoAutor: "A obra Odes Melódicas é um compilado de textos novos e antigos em formato de ópera bufa que retrata, de forma literal e sonora, a exaltação e celebração de pessoas, ideais, natureza e eventos. No que concerne à etimologia do termo, de origem grega odés que significa canto, os poemas foram concebidos para serem cantados.",
    apresentacao: "Não há muito há se dizer sobre esta obra, além do que se possa apreciar e concluir por si mesmo. Trata-se de uma coletânea de textos, alguns desses são inéditos e outros já foram publicados anteriormente, mas que agora, após uma “releitura” do autor, recebem novas palavras em benefício de sua sonoridade e ritmo.\n\nAs questões de sonoridade e do ritmo são importantes para atender ao objetivo final do projeto que foi o de emoldurar os poemas com melodias, compostas sob medida, para realçar as mensagens contidas, e proporcionar um maior alcance de público a essa forma de expressão artística. Assim, a valorização estética do conteúdo literário se dá pela possibilidade de agregar o componente musical que permite a inclusão de outros estímulos à sensibilidade do leitor e ouvinte.\n\nNesse contexto, espera-se que a leitura/audição dos poemas “adornados” pelas melodias amplie o alcance imagético e propicie uma experiência estimulante e agradável aos apreciadores da arte literária, para os quais a obra “Odes Melódicas” se destina.",
    prefacio: "Primeiro Movimento: Odes, ondas, ecos e acordes\nSegundo Movimento: Alma da estrela transcendente\nTerceiro Movimento: O ambiente e quem o habita\nQuarto Movimento: Liras contemporâneas",
    poemas,
    faixas,
  };

  fs.writeFileSync(jsonPath, JSON.stringify(obraFinal, null, 2), "utf-8");
  console.log(`\n✓ Sucesso! 'Odes Melódicas' atualizada com ${poemas.length} poemas e ${faixas.length} faixas de áudio CDN.`);
}

main().catch(console.error);
