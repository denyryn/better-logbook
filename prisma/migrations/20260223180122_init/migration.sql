/*
  Warnings:

  - You are about to drop the column `companyId` on the `project` table. All the data in the column will be lost.
  - Added the required column `positionId` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_companyId_fkey";

-- DropIndex
DROP INDEX "project_companyId_idx";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "companyId",
ADD COLUMN     "positionId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "project_positionId_idx" ON "project"("positionId");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
