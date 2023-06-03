/*
  Warnings:

  - Added the required column `remote` to the `Candidature` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidature" ADD COLUMN     "cityInfo" TEXT,
ADD COLUMN     "remote" BOOLEAN NOT NULL;
