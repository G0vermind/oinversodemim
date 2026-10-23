import fs from "fs";
import path from "path";

interface RawPoemData {
  titulo: string;
  conteudo: string;
}

const poemsRaw: RawPoemData[] = [
  // Ciclo 1: O Adolescente (Estudante)
  {
    titulo: "Poema Adolescente",
    conteudo: `Um poeta cria versos
Delirantes e precisos
Navega seus universos
Mais distantes e perdidos

Construindo sua obra
Da arte que brota bruta
Com o talento que lhe sobra
Aflora a flor e gera a fruta

Enxerga o oculto brilho das letras
Códigos de um repente que lampeja
Sabe sentir o gosto das palavras
Doces às vezes, noutras amargas

Cheira o perfume da rima
Lúdica em sua rara essência
Torna perene a obra prima
Nascida em plena adolescência

Toca o extremo de todos os versos
Com seus poderes singulares
E ouve a harmonia das estrofes
Nos mais remotos lugares

Com todos os seus sentidos
Aborda inteira a poesia
Deusa dos saberes escondidos
Na plenitude da utopia

Faz de um poema adolescente
A emoção viril e terna
Que há contida em toda a gente
Por essa vida e pela eterna.`,
  },
  {
    titulo: "A Manhã",
    conteudo: `Quando a manta clara da manhã cair
Em cima das cabeças dos cristãos (que'stão) aqui
E o sol queimar essa pele, esse romã
Há de ficar extasiado de alegria
Há de ficar embriagado pela utopia
Dessa manhã

A gente fica, a gente arrisca
Um tanto quanto entorpecido e sem aviso
Iluminado, ofuscado e como um animal
Indefeso e mais que surpreso, sem ação
Entre raios, flechas e balas de luz
Dessa manhã

A manhã de agora
A manhã de outr(a)ora
A manhã de ainda
Amanhã.`,
  },
  {
    titulo: "Estrelas",
    conteudo: `São as estrelas que brilham
Iluminando os cenários
São multidões reunidas
E corações solitários

Necessitamos "ouvir"
E aprender com as estrelas
A oração de luzir
A nossa luz verdadeira

Pois, é preciso entender
Que somos todos estrelas
Iluminando o momento
De nossas vidas inteiras`,
  },
  {
    titulo: "Canção Espacial",
    conteudo: `Lá no espaço sideral
Encontro a alegria
De um mundo de sensações
Entre estrelas, entre astros
Maravilhosos...
Navegando o meu coração

Lá no espaço sideral
A alma se eleva além da dor
A canção é de paz e amor
Pura e simples como so(o)u
E na calma a alma voa
Numa nota à toa...

Lá no espaço eu me encontro mais
Vejo o infinito bem de perto
Todas as cousas são sinais
Sinto a beleza do único verso
Essas palavras são normais
A poesia emana do universo

Lá no espaço sideral
Viaja meu sonho mais distante
A luz da estrela é terna guia
Na utopia desse instante
Sinto um momento de alegria
Que pa(i)ra no tempo
Fulgurante.`,
  },
  {
    titulo: "Felicidade",
    conteudo: `Fé
Fel
L(ú)cida
Feliz
idade.`,
  },
  {
    titulo: "Solidão",
    conteudo: `Só
Sol
lida
Sólida
Solidão`,
  },
  {
    titulo: "Razão",
    conteudo: `Meu "grito"! (minha vingança)

Parado no ar
nos bares
nas praças
nas ruas
da vida!

Meu "sonho" (minha lembrança)

Preso na mente
no desejo oprimido
pela falta
de liberdade!

Meu "Deus" (minha esperança)

Procurado
Ansiado
Idealizado
Como uma fantasia
Própria dos que carecem
de fé!`,
  },
  {
    titulo: "Sentidos",
    conteudo: `Tudo que digo / Tudo que penso
Toda a essência de meu sentimento
Toda a sentença da minha palavra

Flui pela boca, olhos e dedos
Por tudo que escrevo
Flui pelo corpo que é só o que tenho

Todos os sentidos / Toda emoção
Toda a minha verdadeira ambição
Todo o desejo de me ser

Flui pelo sangue, pela minha carne
Por tudo que existe
Flui pela alma que nunca me (a)cabe`,
  },
  {
    titulo: "De Qualquer Maneira",
    conteudo: `De qualquer maneira a gente VIVE
E a vida é pura aventura
Às vezes se ganha; às vezes se perde
Quem por essa vida se procura

De qualquer maneira a gente AMA
E o amor é arte ou desastre
Para quem se guia pelo coração
Que ainda sangra de saudade

De qualquer maneira a gente LUTA
E a luta vai nos ensinando
Que nunca nada é fácil
E do suor do rosto brota a lágrima

De qualquer maneira a gente MORRE
E a morte é a última sentença
Dessa aventura de ânsia incessante
Em que estamos sós na imensidão.`,
  },
  {
    titulo: "Um Dia",
    conteudo: `Um dia a gente diz
Que um dia será feliz
Um dia a gente pensa:
Que um dia a gente vença
Um dia a gente luta
Pelo que no outro dia se desfruta
Um dia a gente descobre
Que um dia a gente morre
Um dia a gente sente
Que todo dia morre a gente
Um dia, de repente
A gente entende tudo diferente
Um dia nasce da mesma mina
Que o outro dia termina.`,
  },
  {
    titulo: "Carnaval",
    conteudo: `CLÁUSULA PRIMEIRA
Todo calor que invade o corpo
No pleno êxtase da alegria
É pura festa e manifesta
Fogo e folia
Todo suor que evade do corpo
Em pleno humor da euforia
Encanta um povo que canta
Toda utopia

CLÁUSULA SEGUNDA
Em meio ao povo, o fogo arde!
A carne vale / a alma evade
Fantasias encobrem semblantes
Alquimias de tons semelhantes
A multidão é uma só mistura
Como se fosse a união mais pura

CLÁUSULA TERCEIRA
A carne vale tanta energia
Magia de corpos em dança
Que desafia a sanidade
E ressuscita a esperança
A carne vale toda anarquia
Folia e sensualidade
Que contagia a raça
E proclama a nova idade

CLÁUSULA ÚLTIMA
Corações alegres
Em corpos entorpecidos
Mentes dispersas
Em almas lancinantes
Desses felizes amantes
Do reino perdido do sonho
Que a alegria seja natural
Como a utopia do carnaval`,
  },
  {
    titulo: "Estação",
    conteudo: `Que tal um gole de café
À noite na estação?
Que tal sentar e conversar
Sem preocupação?

O ontem vai passando
E o trem já vem chegando
Pra me levar pra longe
Distante dos meus sonhos.`,
  },
  {
    titulo: "A Última Sentença",
    conteudo: `Olhares ferozes me acompanham
Na dura caminhada pela vida
Sorrisos algozes me agonizam
Destroem a esperança retraída

Realizo no espaço que me resta
A loucura de me ser e sobreviver
O destino já avisa o fim da festa
Que consigo com os amigos refazer

É a última sentença que me aflige
Aquela que me diz que vou morrer
Tendo sido só aquilo que se finge
Esta morte não me deixa adormecer`,
  },
  {
    titulo: "Personagem Oculto",
    conteudo: `Pálido é esse meu semblante,
Às vezes me sinto tão distante
De tudo e até de mim mesmo
Ou do que sobrou de mim
Após imergir na dor.

Personagem oculto
Desprovido de alegria
Ou de qualquer fantasia
Que me faça prosseguir sadio
Em meio a esse manicômio
Anônimo e desconcertante.

Não me apressam sonhos de vida
Nem "sociedades alternativas"
Sempre me propus a ser o mesmo
Graças ao mesmo orgulho
Que me mantém solitário.

Um cara discreto e confuso
Profuso no raso paladar de sua mente
A divagar inocente
Pelas orlas dos acontecimentos
Tentando encontrar um fim.`,
  },

  // Ciclo 2: O Profissional
  {
    titulo: "Remanescente",
    conteudo: `Captei a palavra oculta
Encerrada na boca que grita
Os clamores que ninguém escuta
E cravei em minha obra escrita

As imagens dos traumas de vida
Todas as coisas somadas em mim
Remanescente de abjeta ferida
Que me corta a alma sem fim

Do amor, já gozei o pecado
Sentir e sofrer tudo em transe
Sempre mais amador que amado
A paixão me fez fora de alcance

Não sou mais a pessoa de antes
Nem serei o que sempre quis ser
Hoje trago o olhar mais distante
E só espero da vida - o saber.`,
  },
  {
    titulo: "Trem da Insensatez",
    conteudo: `O que me move, me comove
E me remove do real
É esse trem sem senso ou censo
Nem lenço acenando em pensamento

No mesmo ritmo rútilo e rústico
Seguindo o sentido lógico e lúdico
No meio dos trilhos brilhos de metal
Fazendo a fumaça d' outro gás letal

O trem já partiu; será que tem volta?
Quem sabe a resposta?
Se tinha saudade ficou para trás
Ficou na estação no meio da gente...

Mas gente não conta
passa da conta
Passa-se à frente.
A máquina é fria
a fornalha está quente
Comendo carvão.

No meio da noite
só se ouve o apito
Em pleno meio-dia
com sol a pino
O trem viaja pela insensatez
Das coisas do mundo
De todos vocês.`,
  },
  {
    titulo: "Sobre Nós",
    conteudo: `Há tanto que nos consome
Não só a dor
Nem só a fome
A ambição nefasta nos afasta
da essência do próprio ser.

A vaidade atroz tem grande poder
Sobre nós.

Que a nossa condição humana
de alma divina
e intenção profana
segue indecisa entre o limite
sempre imprecisa do que existe.

A verdade é o fascínio que a vida exerce
Sobre nós.`,
  },
  {
    titulo: "Ser Vil",
    conteudo: `Eu não sirvo pra você
Eu não sirvo pra ser forte
Eu não sirvo para a festa
Eu não sirvo pra ter grana
Eu não sirvo para a foto
Meu sorriso é amarelo

Eu não sirvo para a sorte
Eu não sirvo pra vitória
Eu não sirvo para a vaga
Eu não sirvo pra ter fama
Eu não sirvo para a glória
Meu silêncio incomoda

Eu não sirvo para a arte
Eu não sirvo pra ciência
Eu não sirvo para o time
Eu não sirvo pra ser lindo
Eu não sirvo para a crença
Meu segredo me condena

Eu não sirvo pra piada
Eu não sirvo para a roupa
Eu não sirvo para o baile
Eu não sirvo pra viagem
Eu não sirvo pra ser lido
Meu soneto é ruim.`,
  },
  {
    titulo: "Removendo Tubarões",
    conteudo: `Onde anda a competência?
Que valor ainda lhe resta?
O que foi feito da decência?
Será que há alguém que presta?

Eu vejo esses tubarões
Alimentando-se vorazes
Do que foi feito com esmero
Por aqueles que são capazes

E os magníficos pavões
A se mostrar na sala ampla
Para exibir suas plumagens
Sem nada além dessa estampa

São gestos finos dos canalhas
E toda a espécie que os valha
A comungar nessa orgia

Quem sabe possa haver um dia
Em meio a essa sacanagem
Alguma cena inusitada

A turma da carga pesada
Devidamente equipada
A remover os tubarões.
(Ao amigo Jaime Ferreira)`,
  },
  {
    titulo: "Aroma e Sabor",
    conteudo: `Quero sentir o gosto da vida
Envolvida pela boca e saborosa
Saber o sabor da comida
Posta à mesa tão generosa
Combinando sabor e aroma
De amizade que nunca se compra

Quero a delícia do meu paladar
Porque ainda temos muito para ser e para dar
Quando na vida a gente se encontra
Mesmo que tudo concorra contra
Posso entender que ninguém é doente
Porque se vive diferente.
(Ao amigo Marcio Evaristo)`,
  },
  {
    titulo: "Doutorado",
    conteudo: `"Nessa terra de doutores
magníficos reitores,
leva-se a sério a comédia..."
(Antonio Carlos Belchior)

Eu já estudei um bocado
Meti a minha cara nos livros
Vivendo para ser e saber
Buscando o que não queria
Hoje penso diferente
O saber está dentro da gente
Cabe a gente se encontrar

Não me iludo com títulos e cargos
Que não passam de fardos pesados
E não podem nos realizar
Refletindo dessa maneira
Percebi que a vida inteira
Caminhei em sentido errado
Iludido em meu "doutorado"

Tudo que me era valioso
Escorreu-me entre os dedos
Cego que fui pela vaidade
Agora já não mais lamento
É o tempo do conhecimento
Aquele que me interessa
Por isso não há mais pressa

É tempo de recomeçar...`,
  },
  {
    titulo: "Morte",
    conteudo: `Amanhã...
Quantos amanhãs nos separam
da tua morada abstrata
A tua crueldade é notável
Desconcertantemente me toma
de curiosidade

E se eu morresse amanhã?
Antes de poder
Olhar-me novamente no espelho
Antes de poder
Escrever outro poema
Que morte absurda!`,
  },
  {
    titulo: "Mediocridade",
    conteudo: `Se Deus existir
Que me proteja
Daquilo que mais me aflige...
Se Deus permitir
Que nunca seja
Aquilo que não se corrige...

Deus, tende piedade
Dos seres sem esperança
Deus, afastai de mim a vaidade
Das horas de ignorância

Livrai-nos de nossas fraquezas
Vivendo para o amanhã
Só não nos deixeis cair na desgraça
Da vida medíocre e vã.`,
  },
  {
    titulo: "Apocalipse",
    conteudo: `Apesar dos pesares
De pensares e de passares
Por tudo na vida
Passa a tempo o teu momento
No labirinto em que se encontram
As metas e as cousas
Que não duram para sempre

Os anjos guardam segredos
Cerrados nas nossas cabeças
Aquilo do qual te escondes
E segues sem saber para onde
No sacro-ofício dos dias
Que passam velozes e aflitos
Por tua pequena existência

Somos apenas centelhas
Centenas, milhares, milhões
Creados pela mão divina
Mas perdidos pela ambição
Na busca por coisas vãs
Em meio ao ocaso flagrante
De um iminente amanhã.`,
  },
  {
    titulo: "Bar",
    conteudo: `Anoiteceu
O sol se pôs
Em nosso coração

Em volta da mesa
Amigos, cervejas
Comunhão

Amanheceu
O sol nasceu
Da escuridão

Em volta da mesa
Garrafas, tristezas
Solidão`,
  },
  {
    titulo: "O Inverso de Mim",
    conteudo: `Era uma vez um estudante
Que acreditava em ideais
Era uma vez um professor
Que ensinava suas crenças
Era uma vez um engenheiro
Que construía poesias
Era uma vez um sonhador
Que passeava nas estrelas
Era uma vez um solitário
Que pensava ser eterno
Era uma vez alguém ingênuo
Que era o inverso de si mesmo
Era uma vez um homem simples
Daqueles que a gente logo esquece.`,
  },
  {
    titulo: "Plenitude",
    conteudo: `Desse medo que esconde a raiva, vem a tristeza
Dessa dor que brota em minha alma, sou prisioneiro
Mas, minha face sem disfarce é repleta de beleza
Quando o oculto se revela, o "eu" se livra do cativeiro

Quero me libertar das coisas do mundo dos outros
Prefiro viver na solidão que na passiva dependência
Tento me encontrar, como a alma perdida no corpo
Pois, só assim posso gozar a plenitude da existência

Busco sentir a paixão em tudo que fizer nessa vida
Tenho essa sede de ser e de viver pleno e original
Para trilhar o caminho dessa estrada mais comprida
Resgatar no fundo de mim a fonte da energia vital

Contemplar a natureza e suas forças colossais
Mergulhado na harmonia dos acordes do silêncio
Transformar a dor da alma em poemas viscerais
Atingir outro estágio, dimensão: espaço e tempo.
(À minha amiga Vera)`,
  },
  {
    titulo: "Arte e Vida",
    conteudo: `"Em baixo desse céu azul anil
Existem a terra e o mar também azuis
E o colorido vivo das pessoas
Que habitam a solitude do planeta
Na arte, na alegria e na tristeza
Na poesia viva e na beleza."

Todas as formas de arte têm pressa
Urgência em tocar profundo na gente
No meio do mundo e das coisas banais
Mostrando que a vida de fato é expressa
Na intensa emoção e no brilho da mente
Nas coisas que nos são essenciais

Vivemos o tempo que é permitido
Nos raros momentos em que somos livres
É quando a obra supera a expectativa
A arte que brota no chão proibido
Nos traz a esperança de sermos felizes
E a gente resgata a alma ainda viva

Não creio que a arte imite "essa vida"
Por estar mais além do que se pode limitar
Não há compromissos com o mundo real
A arte é a vida ao extremo expandida
A vida é a arte sem um mundo a mitigar
Não há arte sem vida, nem esse mundo é real.`,
  },

  // Ciclo 3: O Poeta
  {
    titulo: "A Palavra por Encanto",
    conteudo: `Por enquanto eu tenho a fala
E com ela tenho toda a magia da voz
Que se expande em ondas de som
Desde um canto a outro canto
do poema

Por encanto eu recebo a palavra
E com ela me vem todo o poder da criação
Que se estampa nos tipos dos meus versos
Desde um canto a outro canto
do poema

Por espanto eu escrevo a poesia
E com ela vibra toda fúria da emoção
Que me toma a alma e me contagia
Desde um canto a outro canto
do poema

Portanto eu cometo a loucura
E com ela eu vivo a utopia da vida
Que se expressa nas v(e)ias da lida
Desde um canto a outro canto
do poema

Por isso eu vivo
E para isso eu vim viver.`,
  },
  {
    titulo: "Ode aos Poetas",
    conteudo: `"O homem é a semente
de o(n)de brota o invento
Engenho e arte da mente
Criando a cada momento
O poema futuro..."

Esses poetas marginais
Como artistas visionários
Criam seus mundos magistrais
Da força de seus imaginários

Esses autores viscerais
Sempre autênticos em sua arte
Com suas frases geniais
Mostram a nossa oculta face

Vida longa aos que fazem tanto
Pela condição humana em nós
Para sempre a palavra por encanto
E com ela a eterna magia da voz

Esses notáveis menestréis
Raros e sensíveis cantadores
Mesmo entre algozes cruéis
Cantam a vida e seus amores

Esses profetas do cotidiano
Cronistas das emoções baratas
Pela veia de artista soberano
Revelam a vida em palavras

"Por enquanto eu tenho a fala
E com ela tenho toda a magia da voz
Por encanto, tenho o dom da palavra
E o infinito diante de nós."`,
  },
  {
    titulo: "Plectro",
    conteudo: `Captei a palavra oculta
Encerrada na boca que grita
Outros clamores ou dores
Amor, já gozei seu pecado
Encantado - tudo era transe
Depois, quase morri de saudade

Dediquei meu poema (a)verso
O meu dom da palavra escrita
Sem saber se seria entendido
Só o sonho, sinal e espectro
Desse plectro grafado em sangue
Mostra em mim a plena beleza

Revelei minha alma aflita
Na presença de seres algozes
Que calaram silêncio hediondo
Hoje trago o amargo da culpa
Por aquilo que ainda não fiz
No ocaso dos dias sem fim.`,
  },
  {
    titulo: "Divagações",
    conteudo: `O poeta cria os versos
delirantes não objetivos
rebuscados ou concisos
Na busca da perfeição
Abre seu coração
para sentir as palavras
cálidas como feridas da alma
daquele que é creador
Como se fosse por amor
ou outra loucura qualquer
que se faça por uma mulher
na divina comédia da vida
Essa estrada tão comprida
que habita em todos nós
Desse rio se faz a foz
de todas as intenções
Das guerras e revoluções
Sangue de gente e estrelas
Como agitadas bandeiras
de velhos ideais
Desgastados por muitos carnavais
Diluídos em falsas alegorias
Inspirados em vã utopia
de um futuro melhor.`,
  },
  {
    titulo: "As Modernas Águas de Netuno",
    conteudo: `Brisa do Atlântico pacífica
Vento do mar assanha meus cabelos
Quando eu percorro o teu litoral
E piso na areia branca tropicana
E banho-me na espuma fina parafina

Onda, como ira oceânica
Revolta e agitada vem assim:
Num balé, num balanço, merengue de sal
Despejar sua fúria fria sobre mim
Que me deixo levar do princípio ao sim

E a bela morena que passa com graça
Não me nota e segue dançando ao andar
Sacode e balança seu corpo na dança
na reviravolta da onda que avança
Nessa pele dourada e onde a água alcança

E o sol astro rei da coroa de fogo
Queima e doura a pele colorida do povo
Profusão de desejos sobre a areia da praia
Su(r)focada de gente, barulho e toalha
Da paisagem que vibra e a vida se espalha

Quando a lua rainha dos seres noturnos
Aparece serena ascendendo do mar
Ilumina a procela concedida por Deus Uno
E adormecem milhões de espécies no mundo
Das modernas águas de Netuno`,
  },
  {
    titulo: "Essência",
    conteudo: `Meu pensar nunca me engana
Pois minha mente não se profana
Ante as "facilidades" de consumo
Faço um poema, de certo maldito
Que comovente, embora mal escrito
Revela a essência do que assumo
Pois não adianta me fingir "feliz"
Fazer aquilo que nada me diz
É no silêncio que apareço e sumo

Meu cantar não se completa
Pois a minha alma de poeta
Busca o "algo" mais profundo
Por isso, essa solidão constante
Que me preserva bem distante
Das cousas vãs que há no mundo
Sigo vida a dentro, mundo a fora
Com a única certeza do agora
Viver é "saber" cada segundo.`,
  },
  {
    titulo: "Outra Poesia",
    conteudo: `Hoje eu quero fazer
Outra poesia
Que fale de alegria
Das coisas boas da vida

Hoje eu quero a vida
Completa sem barreira
Aquela verdadeira
Sem o tom formal

Hoje quero um beijo
Um bem que eu mereça
Quero que aconteça
Algo de bom e justo

Hoje quero o suor na pele
O gozo dos humanos
Esquecer dos anos
Que me marcaram tanto

Hoje eu quero o canto
Quero uma vida feliz
E como alguém me diz
Eu quero a liberdade

Hoje eu quero ser
Alegre por inteiro
Sendo o verdadeiro
Poeta que me quero.`,
  },
  {
    titulo: "Alimento da Alma",
    conteudo: `Há no tempo
Um tempo que não envelhece
E no pensamento uma prece

Há no tempo
Um momento que decide
Por onde se anda e se vive

Há no coração
Uma incontida paixão
Que os anos não vão levar

Há no coração
Sangrante de saudade
Uma emoção ao fim da tarde

Há na poesia
Uma meta inatingível
Quase tristeza e quase alegria

Há na poesia
Coração, cabeça e tempo
A Criação de um novo alento.

Os breves sentimentos
Que servem de alimento da alma`,
  },
  {
    titulo: "Metamorfose",
    conteudo: `Hoje eu estou só...
Como sempre estive na verdade
Tudo que fiz me trouxe até aqui
De agora em diante, quem sabe?

Hoje eu não tenho certezas
Nada mais é definitivo pra mim
Tentarei aprender com a vida
As coisas das quais sempre fugi.

Hoje eu só sinto saudades
Daqueles que não soube fazer feliz
Mas, é preciso ter muita coragem
Para recomeçar sozinho.

Hoje eu compreendi
Que toda mudança exige sofrer
Até o ponto de não mais aceitar
A repetição dos erros.

Hoje eu serei verdadeiro
Não para os outros, mas para mim
Devo perder o medo de ousar
E fazer o que for preciso.`,
  },
  {
    titulo: "Legado (Poema do Galinheiro)",
    conteudo: `Não me faças chorar pelos cantos
Ao ouvir o lamento dolente de um blues
Nem me sejas a lâmina a cortar os meus pulsos
A sangrar no afã dos prazeres que aos seres seduz

Quando a arte me abstrai do peso desse mundo
Em profundo silêncio, sozinho me entrego
E mergulho a esmo em mim mesmo, bem fundo
Nas entranhas da alma, quase triste, me apego

Como essas palavras forjadas a ferro
Não passam de penas em um galinheiro
Nossas grandes certezas, quando vistas de perto
São frágeis ilusões de sabor passageiro

É assim que a sentença, por fim, se completa
Na dor definitiva e de intensa presença
Que pra sempre habita na alma do poeta
Condenado a viver em sua (e)terna doença.
(inspirado no "galinheiro" do amigo Helder Coelho)`,
  },
  {
    titulo: "A Alma do Poema",
    conteudo: `Quando a tristeza é mais forte e presente
e me sinto fragilizado, quase sem esperança
Recorro à poesia que me ajuda a sobreviver
e renascer na exuberância da beleza dos versos

Como um poeta que descobre universos
livre de toda dor que se lhe impõe esse mundo
Seguindo o rumo que traçou entre as estrelas
para viver eternamente na euforia do poema

Em sendo a vida, na sua essência extrema
um imenso mar onde a tormenta é constante
Mesmo entre as dores e clamores, sofrida
a alma vibra a vida que em mim se descobre

Nenhum espelho revela a face oculta e nobre
que está além do que a luz pode em mim captar
No triste olhar que guarda o inverso de mim
se encerra o segredo que nunca irei revelar.`,
  },
  {
    titulo: "O Silêncio",
    conteudo: `Nada está consumado
Até que a morte venha!
Até que a dor nos contenha!
Os olhos permanecem abertos
Atentos ao que está por vir...
Atentos para refletir:
O amor, o trabalho e a vida

Não existem certezas absolutas
Por isso, sigamos por essa estrada
Por isso, deixemos nossas pegadas
Como sinais da nossa existência
Para que sejamos sempre lembrados
Para que alcancemos a eternidade
Em nosso silêncio eloqüente.`,
  },
  {
    titulo: "Dilema",
    conteudo: `Nenhum poema vale a pena
Se não valer a pena sonhar
Mas, a alma não é pequena
Como diria Pessoa ao poetar

Poesia real-mente imaginada
Que é criada na cabeça
Mas, nascida do coração

O poema não pode mudar nada
Nem é feito para esse fim
Vem da emoção indomada
E transborda intenso assim

Poesia ex-pressa em palavras
A fugaz alegria incontida
Ou a fúria da dor que não cessa

Não se pode abolir o poema
A poesia permeia essa vida
Por maior que seja o dilema
Só a obra não é esquecida`,
  },
  {
    titulo: "Poema Derradeiro",
    conteudo: `A B C, além desse jardim
Letra "Z" - não creias ser o fim
Temos uma VIDA azul ou colorida
Uma avenida por onde transitar

1 2 3, até que chegue a "N"
Somos NATURAIS e temos um limite
Porém, não acredites ser fácil atingir
Todo objetivo se encontra por aí

X Y Z, as variáveis confundem
Precisas entender que nada é PRECISO
Decidas sob as incertezas tão certas
Quão repletas existem pela frente

Porque na vida sempre é assim,
Tudo o que não tem começo nem FIM
Que morra em você ou viva em mim
Estará sempre por RECOMEÇAR.`,
  },

  // Ciclo 4: O Amador (Apaixonado)
  {
    titulo: "Ilusão do Amor",
    conteudo: `É do amor que nasce a loucura
De querer outra pessoa
Tanto, tanto, tanto
Tanto que não tem cura

Arde a paixão como chama
Nega-se tudo que é certo
Quando se quer estar perto
Do afeto de quem se ama

Todo amor é eterno
Enquanto dura a ilusão
Depois, a visão do inferno
É o que resta da relação

Amor vive em meras palavras
Efêmeras folhas ao vento
Ao fim, só tristeza e sofrimento
Nos cortam como navalhas

É dessa dor que morre a ilusão
De acreditar em um final feliz
E assim é que se aprende a lição
Todo o amor deixa a sua cicatriz.`,
  },
  {
    titulo: "Objeto Não Identificado",
    conteudo: `Você é o objeto
Não identificado
Que pairou na minha frente
E deu rumo diferente
Às minhas aspirações
Como cometa fulgurante
Que iluminou minha vida
Você é a mulher e a luz
A flor do jardim e a estrela
A poesia verdadeira
Que emana de dentro de mim
Você é a bandeira
De todos meus ideais
Você é a alegria
De todos meus carnavais
Você é tudo o que eu quero
O resto ficou para trás
Você é a plena ciência
Do que eu espero da vida
Meu axioma de certeza resoluta
Meu postulado de verdade absoluta
Minha luta e minha conquista
Minha criatura bonita
Você é o meu enigma
Meu sigma, meu alfa, meu beta
É a sentença completa
"Eu amo você".`,
  },
  {
    titulo: "Divina Comédia",
    conteudo: `Do desejo se fez o prazer
Desses corpos noturnos de amor
De suor se banharam inteiros
Entre beijos de bocas ardentes
Dessa noite se fez o céu e o inferno
profanando o sagrado e os segredos

Entre pêlos e poros brotou o humor
Da pele sensível e da língua sedenta
Para o beijo tornar-se um milagre
Da fusão de almas apaixonadas
E do êxtase veio a contemplação
Desses corpos sem roupa e sem medo

Esse instante em fim restou eterno
Ante o poder e a ira infinda dos deuses
Fez-se a glória fugaz de seres humanos
Que além daquilo a que se destinam
Como dois animais meros mortais
Gozar da divina comédia da vida`,
  },
  {
    titulo: "Elegia Sensual",
    conteudo: `Quem dera sentir a alegria
Que outrora a gente sentia
E não se sabia por que
Tudo nos trazia prazer.

A tua mão que passeava
E afagava meus cabelos
Os teus pêlos arrepiados
Pela voz de meus apelos.

E assim sem medos ou receios
As minhas mãos enternecidas
Corriam soltas nessas carícias
A deslizar pelos teus seios.

A tua boca em minha boca
Não proferia qualquer palavra
A tua língua me entendia
Pela saliva que provava.

E no momento mais extremo
Dessa paixão incontrolada
O meu prazer me escorria
Pelo teu corpo que adorava.`,
  },
  {
    titulo: "Sem Você (o dia seguinte)",
    conteudo: `Hoje quando acordei
Eu me senti tão sozinho
Mais só do que sei que sou
Só, como só fora antes
No tempo da saudade.

Sem você,
Tudo me parece ausente
Não há como ser indiferente
Ao amor que ainda me comove.

Sem você,
Nada me dá prazer na vida
Não há vitórias ou conquistas
Que me façam esquecer você.

Sem você,
Sempre estarei perdido
Nesse escuro onde me procuro
Na ausência de sua luz.

Sem você,
Nunca sentirei a alegria
Nem o raro sabor do silêncio
Que um dia pude saber.

Hoje quando adormecer
Não haverá mais sonhos
Apenas a amarga tristeza
Será a fiel companheira
Até o fim dos meus dias.`,
  },
  {
    titulo: "Meu Grande Amor Eterno",
    conteudo: `Oh! meu amor, meu grande amor
onde será que anda você agora?

Não sei se você ainda me escuta
quando grito seu nome no escuro
Será que ainda te devo desculpas
ou viverei condenado pelo futuro.

Oh! meu grande amor eterno
Será que é esse o tempo para durar?

Drogado e louco a transar com as putas
tento aplacar a dor nesse desejo obscuro
Mas, só tristeza encontro nessas fugas
porque me perco no prazer que procuro.

Oh meu amor, meu eterno amor
O que não tem fim pode ainda me acabar.

"Eterno, é tudo aquilo
que dura uma fração de segundo,
mas com tamanha intensidade,
que se petrifica,
e nenhuma força jamais o resgata"
(Carlos Drummond de Andrade)`,
  },
  {
    titulo: "Vazio",
    conteudo: `Nenhuma manhã que me acalma a alma.
Vivo perdido nesse vazio onde nada se enxerga
Além de poucos metros para o nada

No apartamento, oitavo andar, abro a vidraça...
Enquanto a minha vida passa
Sem esperar por mim.

Tento escrever algo que me valha a (dura) pena
O poema se confunde na inefável paisagem
solitária e distante.
Só, eu busco você nos desencontros calados de
minha mente
Como um cego a tatear as migalhas da luz do
seu sorriso.

E mais uma vez me acho perdido, no vão das
palavras...
Mas, tudo parece ser em vão.
A sua ausência está sempre presente
Nos meus sonhos, em meus pensamentos e no
meu coração.

Sem você, não há sabor em saber a vida
A minha alma de sonhar-te anda perdida
A vagar na escuridão de mim.

E a dor da saudade sufoca o grito
A saudade é como um infinito
Vazio.
(Colagens de citações de Emerson Damasceno, Antonio Carlos Gomes Belchior e Florbela Espanca)`,
  },
  {
    titulo: "Poema de Sangue",
    conteudo: `Fiz um poema grafado com meu sangue
Na noite mais longa do dia mais triste
Essa elegia me escorreu pelos dedos
Como o fluido que corre na veia aberta

Um poema febril de dor e de abandono
De sonhos desfeitos e amores perdidos
Que me corta a carne e derrama o sangue
Ao sair das estranhas entranhas da alma

Um poema nascido em extrema tristeza
Sem rima e sem beleza, apenas ausência
Da pessoa que amo à paixão que encerra
Como o grito na noite que ninguém escuta.`,
  },
  {
    titulo: "Obsessão",
    conteudo: `Tu chamas de obsessão
O puro amor que te ofereço
Não entendes que essa paixão
É como o sol em que me aqueço

O meu amor te enoja
Porque é um sonho antigo
E te sentes vitoriosa
Por me ver assim sofrido

Teu ódio é como veneno
Escorrendo em tua boca
Um sentimento pequeno
Que carregas a vida toda

Te julgas acima dos outros
Com ironia e arrogância
Esqueces o destino dos tolos
De sucumbir na ganância

Mas esta que assim se mostra
Não é a mesma mulher que amo
Alguma coisa te foi imposta
Para que sejas outro ser humano

Um dia talvez, quem sabe?
Possas voltar a ser quem eras
Livrar-se dessa fútil vaidade
Sepultar as ilusões efêmeras

Guardarei dentro de mim
Este amor "obcecado" e vão
Para que um dia vejas, em fim
Que não se vive sem paixão`,
  },
  {
    titulo: "Vontade de Deus",
    conteudo: `Talvez tenha que ser assim
Como um amor platônico
Você sempre longe de mim
Comum sofrimento irônico

Talvez não tenha mesmo jeito
Seja essa a minha sina
Essa dor que dilacera o peito
Pois meu amor nunca termina

Talvez seja isso que Deus queira
Em sua divina vontade
Quando as paixões viram fogueira
E queimam nossa vaidade.`,
  },
  {
    titulo: "Virtual",
    conteudo: `Onde anda o amor?
Para onde ele vai quando tudo acaba?
Quando resta uma imensa dor
O amor será uma simples palavra?

O amor está aqui, presente
flutuando no espaço e no tempo
O amor está dentro da gente
ansiando pelo exato momento

O amor está nas palavras soltas
e nas frases ainda por serem ditas
Escondido no meio das cousas
revelando-se sutil em suas pistas

Há amor na amizade sincera
aquela que surge sem se perceber
Que brota de onde não se espera
e tem o encanto de acontecer

O amor está na distância
e na ânsia de encontrar
Amor sobrevive na ausência
a sua existência é elementar

O amor não pertence a ninguém
"passa" de pessoa em pessoa
O amor nunca se vai e não vem
Está nos corações e além, sobrevoa!

O amor nunca morre ou se perde
não é um sentimento desse porte
Não se tem o amor que se pede
O amor é que nos tem até a morte.`,
  },
  {
    titulo: "A Chama do Amor",
    conteudo: `Um homem não é uma ilha
Por isso, não deve viver isolado
Mas é preciso saber da armadilha
Na qual se morre apaixonado

O amor não é para amadores
Suas dores são fortes demais
Padecem os comuns sofredores
O amor é coisa de profissionais

Nesse jogo sutil não há piedade
As armas são cruéis e violentas
Corações partidos pela metade
Agonizam em suas mortes lentas

Mesmo assim, o amor vale a pena
Pois, só se vive quando se ama
Apenas o amor que nos condena
É que faz acender a nossa chama.`,
  },
  {
    titulo: "Simone",
    conteudo: `Quando o coração aperta de saudade
Vem a vontade incontrolável de falar
seu nome
Mas, é preciso aceitar outra realidade
E ser mais forte que esta dor que me
consome

Se eu procuro pensar mais em mim
Você aparece, me comove, e depois
some
Ainda que o mundo te afaste assim
Não levará o sonho vivido em você,
Simone.

“Ó! meu pobre,
meu grande amor distante,
Nem sabes tu o bem
que faz à gente
Haver sonhado...
e ter vivido o sonho!”
(Mário Quintana)`,
  },
  {
    titulo: "Despedida",
    conteudo: `Tenho um coração que sangra
Morrendo aos poucos de saudade
E uma imensa solidão me apanha
Sempre ao escurecer da tarde

Nenhuma dor é mais intensa
Que a de perder a quem se ama
Nada mais na vida compensa
A agonia de ser sem esperança

A minha sina é ser assim
A vida me ensina a cada dia
Nunca nada foi fácil para mim
Quisera eu saber a alegria

Os anos passam pela janela
Por onde vejo tudo o que perdi
Toda a beleza do sorriso dela
Do qual jamais me esqueci

Eu sei que tudo isso é triste
Como são dias e noites vazios
E essa lembrança que resiste
Em meu corpo em calafrios

No desespero do meu desejo
Dentro de mim agora e sempre
Ainda que distante eu a vejo
Quem sabe noutra vida diferente

Adeus meu grande amor eterno
Que sejas tudo o que mereces
Enquanto eu sofro nesse inferno
Todos os dias em que me esqueces.`,
  },
];

async function main() {
  console.log("Iniciando importação completa de 'O Inverso de Mim' (2005)...");

  const jsonPath = path.join(__dirname, "..", "content", "obras", "o-inverso-de-mim.json");
  interface ExistingDataFaixas {
    faixas?: Array<{
      titulo: string;
      arquivoUrl: string;
      duracao: number;
      letra?: string;
      capaUrl?: string;
    }>;
  }
  let existingData: ExistingDataFaixas = {};
  if (fs.existsSync(jsonPath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    } catch {}
  }

  const poemas = poemsRaw.map((p, idx) => {
    const estrofes = p.conteudo.split(/\n\n+/);
    return {
      titulo: p.titulo,
      ordem: idx + 1,
      publicadoEm: "2005-08-15",
      conteudo: p.conteudo,
      timestamps: estrofes.map((_, sIdx) => ({
        estrofeIndex: sIdx,
        segundos: sIdx * 30,
      })),
    };
  });

  const faixas = existingData.faixas && existingData.faixas.length > 0
    ? existingData.faixas
    : [
        {
          titulo: "Tema de O Inverso de Mim",
          arquivoUrl: "/audio/demo.wav",
          duracao: 210,
          letra: "Era uma vez um estudante que acreditava em ideais...\nEra uma vez um engenheiro que construía poesias...",
          capaUrl: "/art/o-inverso-de-mim.jpg",
        },
        {
          titulo: "Canção Espacial Acústica",
          arquivoUrl: "/audio/demo.wav",
          duracao: 195,
          letra: "Lá no espaço sideral encontro a alegria...\nA luz da estrela é terna guia na utopia desse instante.",
          capaUrl: "/art/o-inverso-de-mim.jpg",
        },
      ];

  const obraFinal = {
    titulo: "O Inverso de Mim",
    sentimento: "Existência",
    descricao: "A obra seminal de Heldemarcio Ferreira (2005). Uma travessia autobiográfica dividida nos quatro ciclos da existência: O Adolescente, O Profissional, O Poeta e O Amador.",
    capaUrl: "/capas/o-inverso-de-mim.jpg",
    ebookCapaUrl: "/capas/o-inverso-de-mim.jpg",
    audioCapaUrl: "/art/o-inverso-de-mim.jpg",
    ebookUrl: "/ebooks/o-inverso-de-mim.pdf",
    preco: 0,
    estoqueFisico: 18,
    linkVendaFisica: "",
    createdAt: "2005-08-15",
    palavrasDoAutor: `Este livro retrata algumas das fases mais significativas de minha vida: A adolescência com todos os ideais, o profissional e a dedicação à carreira, a opção pela poesia e pelo sentimento, e o amor que é arte ou desastre para quem é "amador". Repleto de influências de pessoas e situações que, de uma forma ou de outra, marcaram a minha existência e das quais não poderei esquecer.

É uma obra pessoal e intimista, na qual as minhas referências sentimentais são expostas de forma poética, sem qualquer restrição ou receio em relação às mais diversas e possíveis interpretações. E, por tratar de sentimentos e reflexões existenciais, a obra assume uma dimensão de caráter universal, a despeito de ser focada em uma pessoa em particular.

Acredito que possa haver uma "certa" identificação do leitor com a forma de abordagem de temas bastante comuns alusivos à solidão, paixão, amor, tristeza e outros que compõem o universo de sensações e percepções do mundo. Não tenho a menor pretensão de que este livro alcance qualquer nível de projeção ou que venha a ser reconhecido como obra de valor literário.

Trata-se apenas, e principalmente, de um registro da minha existência até o momento atual, através da sensibilidade e da paixão que dedico à poesia.

Desse modo, o livro representa a realização de um sonho antigo que agora compartilho com os amigos e com o público em geral que aprecia a poesia. É um resgate daquilo que me dá grande prazer nessa vida: o ato de escrever sobre o que sinto.`,
    apresentacao: `A produção poética é um gesto de sensibilidade corajosa que exige do autor a decisão de se expor. Uma decisão que nem todos ousam.

São poucos aqueles que se abrem, mostrando, mesmo que eventualmente sob linguagem metafórica, o seu 'eu', o seu modo de ver e sentir o mundo, de viver pessoas e gozar sentimentos.

Muitos, por timidez ou egoísmo, se fecham em copas, mantendo para si a arte que a alma guarda. Alguns mantêm os sonhos sob grilhões, impedindo mesmo que brotem as palavras e, com elas, a luz que embala o espírito e estimula a vida.

Este, graças a Deus, não é o caso de Heldemarcio Ferreira, que faz seu debut na literatura artística com o magnífico 'O inverso de mim' – um livro que reúne poemas de rara beleza, descortinando sua 'opção pela poesia' num caminho que se iniciou n'O adolescente, passando pel'O profissional e se deliciou n'O poeta até chegar a'O apaixonado.

O livro de estréia de Heldemarcio Ferreira revela a sensibilidade e o talento daqueles cujo mergulho no universo da poesia foi incontrolável. O poeta que sempre viveu na alma de Heldemarcio rasgou a roupa do engenheiro, ganhando vida para entregar ao mundo um grande artista da palavra. Com o 'O inverso de mim', Heldemarcio Ferreira carimbou o passaporte que, para deleite dos apaixonados pela poesia, vai levá-lo a viagens cada vez mais profundas no maravilhoso universo da literatura artística.

por Alexandre Santos
Membro da Academia de Letras e Artes do Nordeste Brasileiro e da Academia Brasileira de Autores Solidaristas.`,
    prefacio: `Dedico esta obra a Simone Souza por tudo que ela representou em minha vida. Não somente pelo seu amor de antes ou pelo seu ódio de agora; mas, sobretudo, pelo fato de ter sido por todo esse tempo o inverso de mim.

Agradeço a todos aqueles que contribuíram e me inspiraram para a realização desta obra: amigos, patrocinadores, familiares, entre outros, e ao Criador pelas grandes surpresas que nos proporciona ao longo dessa viagem fascinante que é a vida.`,
    posfacio: `“Porque quem ama nunca sabe o que ama
Nem sabe porque ama, nem o que é amar...
Amar é a primeira inocência,
E toda a inocência é não pensar...”
(Fernando Pessoa)

Fortuna Crítica:
• "A poesia como uma forma de descobrir o mundo e a si mesmo" — Sébastien Joachin (Crítico literário)
• "O Inverso de Mim. Ofício da necessidade imperiosa de expressão pelo verso. Poesia de afetuosa imagem que aporta na alma." — Marcos D’Morais (Poeta)
• "Palavras vivas e falantes, que nos revelam vontades, segredos, desejos e verdades: é como são-nos elas desenhadas por Heldemarcio, com muito virtuosismo, verso a verso e, se se constroem assim, delas gostemos!" — Artur Freire (Cronista e assessor editorial)
• "O filósofo Hegel nos ensina que se engana quem espera que no final do trabalho de análise/construção do espírito você encontrará a Filosofia, porque esta não existe fora da elaboração. Assim também a Poesia. Se a procurarmos no trabalho final ela pode não ser encontrada. Mas ela - Filosofia / Poesia - está na busca, na árdua e real caminhada." — Celso Marconi (Jornalista)`,
    poemas,
    faixas,
  };

  fs.writeFileSync(jsonPath, JSON.stringify(obraFinal, null, 2), "utf-8");
  console.log(`\n✓ Sucesso! 'O Inverso de Mim' atualizada com ${poemas.length} poemas e seção editorial completa.`);
}

main().catch(console.error);
