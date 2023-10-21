/*
  Warnings:

  - A unique constraint covering the columns `[candidatureId]` on the table `ReviewRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ReviewRequest_candidatureId_key" ON "ReviewRequest"("candidatureId");
