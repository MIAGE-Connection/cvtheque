-- CreateEnum
CREATE TYPE "LangLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'FLUENT', 'NATIVE');

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "level" "LangLevel" NOT NULL,
    "candidatureId" TEXT,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature"("id") ON DELETE SET NULL ON UPDATE CASCADE;
