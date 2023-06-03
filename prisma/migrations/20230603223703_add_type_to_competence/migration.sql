/*
  Warnings:

  - Changed the type of `type` on the `Competences` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CompetenceType" AS ENUM ('FRONTEND', 'BACKEND', 'DEVOPS', 'MOBILE', 'DESIGN', 'MANAGEMENT', 'MARKETING', 'COMMUNICATION', 'SALES', 'BUSINESS', 'SOFTSKILLS', 'AGILE', 'PROJECT_MANAGEMENT', 'OTHER');

-- AlterTable
ALTER TABLE "Competences" DROP COLUMN "type",
ADD COLUMN     "type" "CompetenceType" NOT NULL;
