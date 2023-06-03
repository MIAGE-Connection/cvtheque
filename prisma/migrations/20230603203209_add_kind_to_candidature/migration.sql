/*
  Warnings:

  - Added the required column `kind` to the `Candidature` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CandidatureKind" AS ENUM ('STAGE', 'CDI', 'ALTERNANCE');

-- AlterTable
ALTER TABLE "Candidature" ADD COLUMN     "kind" "CandidatureKind" NOT NULL;
