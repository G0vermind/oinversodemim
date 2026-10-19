import { PrismaClient } from '@prisma/client';
import { mockPerfilAutor, mockObras } from '../lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpando registros anteriores...');
  await prisma.faixaAudio.deleteMany();
  await prisma.poema.deleteMany();
  await prisma.obra.deleteMany();
  await prisma.perfilAutor.deleteMany();

  console.log('Inserindo autor...');
  await prisma.perfilAutor.create({
    data: {
      nome: mockPerfilAutor.nome,
      chavePix: mockPerfilAutor.chavePix,
      carteiraStellar: mockPerfilAutor.carteiraStellar,
    },
  });

  console.log('Inserindo obras, poemas e faixas...');
  for (const obra of mockObras) {
    await prisma.obra.create({
      data: {
        titulo: obra.titulo,
        slug: obra.slug,
        descricao: obra.descricao,
        capaUrl: obra.capaUrl,
        preco: obra.preco,
        linkVendaFisica: obra.linkVendaFisica,
        estoqueFisico: obra.estoqueFisico,
        poemas: {
          create: (obra.poemas ?? []).map((p) => ({
            titulo: p.titulo,
            conteudo: p.conteudo,
            ordem: p.ordem,
            publicadoEm: new Date(p.publicadoEm),
          })),
        },
        faixas: {
          create: (obra.faixas ?? []).map((f) => ({
            titulo: f.titulo,
            arquivoUrl: f.arquivoUrl,
            duracao: f.duracao,
            letra: f.letra,
          })),
        },
      },
    });
  }

  console.log('Seed realizado com sucesso a partir de lib/mock-data.ts!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
