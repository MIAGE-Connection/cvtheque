-- CreateTable
CREATE TABLE "ExperienceAsso" (
    "id" TEXT NOT NULL,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "missions" TEXT[],
    "candidatureId" TEXT,

    CONSTRAINT "ExperienceAsso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExperienceAsso" ADD CONSTRAINT "ExperienceAsso_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature"("id") ON DELETE SET NULL ON UPDATE CASCADE;
