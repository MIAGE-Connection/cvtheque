-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_candidatureId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
