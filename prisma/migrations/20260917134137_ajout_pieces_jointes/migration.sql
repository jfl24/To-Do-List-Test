-- DropIndex
DROP INDEX "Tache_userId_idx";

-- CreateTable
CREATE TABLE "Piece" (
    "id" SERIAL NOT NULL,
    "cle" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "typeMime" TEXT NOT NULL,
    "taille" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tacheId" INTEGER NOT NULL,

    CONSTRAINT "Piece_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Piece_cle_key" ON "Piece"("cle");

-- CreateIndex
CREATE INDEX "Piece_tacheId_idx" ON "Piece"("tacheId");

-- AddForeignKey
ALTER TABLE "Piece" ADD CONSTRAINT "Piece_tacheId_fkey" FOREIGN KEY ("tacheId") REFERENCES "Tache"("id") ON DELETE CASCADE ON UPDATE CASCADE;
