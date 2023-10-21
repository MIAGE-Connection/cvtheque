/*
 Warnings:
 
 - You are about to drop the column `reviewRequestId` on the `Candidature` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[candidatureId]` on the table `ReviewRequest` will be added. If there are existing duplicate values, this will fail.
 
 */
-- AlterTable
ALTER TABLE "Candidature" DROP COLUMN IF EXISTS "reviewRequestId";
-- CreateIndex if not exists
CREATE UNIQUE INDEX IF NOT EXISTS "ReviewRequest_candidatureId_key" ON "ReviewRequest"("candidatureId");