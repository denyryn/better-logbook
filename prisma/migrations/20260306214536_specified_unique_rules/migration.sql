/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "company_name_key";

-- DropIndex
DROP INDEX "logbook_projectId_logDate_idx";

-- CreateIndex
CREATE UNIQUE INDEX "company_userId_name_key" ON "company"("userId", "name");

-- CreateIndex
CREATE INDEX "logbook_projectId_logDate_deletedAt_idx" ON "logbook"("projectId", "logDate", "deletedAt");
