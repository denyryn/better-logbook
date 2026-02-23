/*
  Warnings:

  - You are about to drop the column `positionId` on the `logbook` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,logDate]` on the table `logbook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `logbook` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "logbook" DROP CONSTRAINT "logbook_positionId_fkey";

-- DropIndex
DROP INDEX "logbook_positionId_logDate_idx";

-- DropIndex
DROP INDEX "logbook_positionId_logDate_key";

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "logbook" DROP COLUMN "positionId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "scopedRole" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_companyId_idx" ON "project"("companyId");

-- CreateIndex
CREATE INDEX "logbook_projectId_logDate_idx" ON "logbook"("projectId", "logDate");

-- CreateIndex
CREATE UNIQUE INDEX "logbook_projectId_logDate_key" ON "logbook"("projectId", "logDate");

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logbook" ADD CONSTRAINT "logbook_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
