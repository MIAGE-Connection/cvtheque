-- AlterTable
ALTER TABLE "Candidature" ADD COLUMN     "reviewRequestId" TEXT;

-- CreateTable
CREATE TABLE "ReviewRequest" (
    "id" TEXT NOT NULL,
    "candidatureId" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "reviewerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_reviewRequestId_fkey" FOREIGN KEY ("reviewRequestId") REFERENCES "ReviewRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRequest" ADD CONSTRAINT "ReviewRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
