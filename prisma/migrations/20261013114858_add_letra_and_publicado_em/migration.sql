-- CreateTable
CREATE TABLE "Obra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "capaUrl" TEXT NOT NULL,
    "ebookUrl" TEXT,
    "preco" INTEGER NOT NULL,
    "linkVendaFisica" TEXT,
    "estoqueFisico" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Poema" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "publicadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "obraId" TEXT NOT NULL,
    CONSTRAINT "Poema_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FaixaAudio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "arquivoUrl" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "letra" TEXT,
    "obraId" TEXT NOT NULL,
    CONSTRAINT "FaixaAudio_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PerfilAutor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "chavePix" TEXT NOT NULL,
    "carteiraStellar" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Obra_slug_key" ON "Obra"("slug");

-- CreateIndex
CREATE INDEX "Poema_obraId_idx" ON "Poema"("obraId");

-- CreateIndex
CREATE INDEX "FaixaAudio_obraId_idx" ON "FaixaAudio"("obraId");
