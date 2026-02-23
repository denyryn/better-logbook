/*
  Warnings:

  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Logbook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Position` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[positionId,logDate]` on the table `Logbook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `logDate` to the `Logbook` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Logbook" DROP CONSTRAINT "Logbook_positionId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP CONSTRAINT "Company_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Company_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Company_id_seq";

-- AlterTable
ALTER TABLE "Logbook" DROP CONSTRAINT "Logbook_pkey",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "logDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "positionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Logbook_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Logbook_id_seq";

-- AlterTable
ALTER TABLE "Position" DROP CONSTRAINT "Position_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "companyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Position_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Position_id_seq";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogbookTag" (
    "logbookId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "LogbookTag_pkey" PRIMARY KEY ("logbookId","tagId")
);

-- CreateIndex
CREATE INDEX "LogbookTag_tagId_idx" ON "LogbookTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Logbook_positionId_logDate_idx" ON "Logbook"("positionId", "logDate");

-- CreateIndex
CREATE UNIQUE INDEX "Logbook_positionId_logDate_key" ON "Logbook"("positionId", "logDate");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logbook" ADD CONSTRAINT "Logbook_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogbookTag" ADD CONSTRAINT "LogbookTag_logbookId_fkey" FOREIGN KEY ("logbookId") REFERENCES "Logbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogbookTag" ADD CONSTRAINT "LogbookTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
