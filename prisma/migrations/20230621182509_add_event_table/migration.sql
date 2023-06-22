-- CreateEnum
CREATE TYPE "Event" AS ENUM ('VIEW', 'LIKED');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_candidatureId_fkey";

-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "event" "Event" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature"("id") ON DELETE SET NULL ON UPDATE CASCADE;
