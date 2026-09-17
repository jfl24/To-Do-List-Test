-- AlterTable
ALTER TABLE "Tache" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Tache_userId_idx" ON "Tache"("userId");
