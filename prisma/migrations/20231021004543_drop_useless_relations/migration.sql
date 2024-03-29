/*
 Warnings:
 
 - You are about to drop the column `reviewRequestId` on the `Candidature` table. All the data in the column will be lost.
 
 */
-- DropForeignKey
ALTER TABLE "Candidature" DROP CONSTRAINT IF EXISTS "Candidature_reviewRequestId_fkey";
-- AlterTable
-- AddForeignKey
ALTER TABLE "ReviewRequest"
ADD CONSTRAINT "ReviewRequest_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;