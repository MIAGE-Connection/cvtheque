/*
 Warnings:
 
 - Added the required column `title` to the `Candidature` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "Candidature"
ADD COLUMN "title" TEXT;
UPDATE "Candidature"
SET "title" = 'Développeur web'
WHERE "title" IS NULL;
ALTER TABLE "Candidature"
ALTER COLUMN "title"
SET NOT NULL;