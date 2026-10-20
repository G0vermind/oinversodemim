import fs from 'fs';
import path from 'path';
import { mockObras } from '../lib/mock-data';
import { BIOGRAFIA_DATA } from '../modules/biografia/biografia.data';

const contentDir = path.join(process.cwd(), 'content');
const obrasDir = path.join(contentDir, 'obras');

if (!fs.existsSync(obrasDir)) {
  fs.mkdirSync(obrasDir, { recursive: true });
}

for (const obra of mockObras) {
  const filePath = path.join(obrasDir, obra.slug + '.json');
  const obraData = {
    titulo: obra.titulo,
    sentimento: obra.sentimento || 'Existência',
    descricao: obra.descricao,
    capaUrl: obra.capaUrl,
    preco: obra.preco || 0,
    estoqueFisico: obra.estoqueFisico || 0,
    linkVendaFisica: obra.linkVendaFisica || '',
    createdAt: typeof obra.createdAt === 'string' ? obra.createdAt.split('T')[0] : (obra.createdAt as Date).toISOString().split('T')[0],
    poemas: (obra.poemas || []).map((p, idx) => ({
      titulo: p.titulo,
      ordem: p.ordem || idx + 1,
      publicadoEm: typeof p.publicadoEm === 'string' ? p.publicadoEm.split('T')[0] : (p.publicadoEm as Date).toISOString().split('T')[0],
      conteudo: p.conteudo,
    })),
    faixas: (obra.faixas || []).map(f => ({
      titulo: f.titulo,
      arquivoUrl: f.arquivoUrl,
      duracao: f.duracao,
      letra: f.letra || '',
    })),
  };
  fs.writeFileSync(filePath, JSON.stringify(obraData, null, 2), 'utf-8');
  console.log('Saved obra:', obra.slug);
}

const biografiaPath = path.join(contentDir, 'biografia.json');
const biografiaData = {
  autorNome: BIOGRAFIA_DATA.autor.nome,
  autorTitulo: BIOGRAFIA_DATA.autor.titulo,
  autorLocal: BIOGRAFIA_DATA.autor.local,
  autorEpigrafe: BIOGRAFIA_DATA.autor.epigrafe,
  palavrasAutorOriginal: BIOGRAFIA_DATA.autor.palavrasAutorOriginal,
  manifestoTitulo: BIOGRAFIA_DATA.manifesto.titulo,
  manifestoSubtitulo: BIOGRAFIA_DATA.manifesto.subtitulo,
  manifestoParagrafos: BIOGRAFIA_DATA.manifesto.paragrafos,
};
fs.writeFileSync(biografiaPath, JSON.stringify(biografiaData, null, 2), 'utf-8');
console.log('Saved biografia.json');
