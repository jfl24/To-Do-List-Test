-- CreateEnum
CREATE TYPE "Status" AS ENUM ('A_FAIRE', 'EN_COURS', 'TERMINE');

-- CreateTable
CREATE TABLE "Tache" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'A_FAIRE',
    "priorite" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tache_pkey" PRIMARY KEY ("id")
);
