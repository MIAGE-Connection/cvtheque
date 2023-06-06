-- AlterTable
ALTER TABLE "Candidature" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "candidatureId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature"("id") ON DELETE SET NULL ON UPDATE CASCADE;
