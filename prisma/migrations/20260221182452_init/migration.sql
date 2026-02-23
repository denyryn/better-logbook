/*
  Warnings:

  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Logbook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LogbookTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logbook" DROP CONSTRAINT "Logbook_positionId_fkey";

-- DropForeignKey
ALTER TABLE "LogbookTag" DROP CONSTRAINT "LogbookTag_logbookId_fkey";

-- DropForeignKey
ALTER TABLE "LogbookTag" DROP CONSTRAINT "LogbookTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_userId_fkey";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "Logbook";

-- DropTable
DROP TABLE "LogbookTag";

-- DropTable
DROP TABLE "Position";

-- DropTable
DROP TABLE "Tag";

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position" (
    "id" TEXT NOT NULL,
    "role" TEXT,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logbook" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "logbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logbook_tag" (
    "logbookId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "logbook_tag_pkey" PRIMARY KEY ("logbookId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_name_key" ON "company"("name");

-- CreateIndex
CREATE INDEX "logbook_positionId_logDate_idx" ON "logbook"("positionId", "logDate");

-- CreateIndex
CREATE UNIQUE INDEX "logbook_positionId_logDate_key" ON "logbook"("positionId", "logDate");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE INDEX "logbook_tag_tagId_idx" ON "logbook_tag"("tagId");

-- AddForeignKey
ALTER TABLE "position" ADD CONSTRAINT "position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position" ADD CONSTRAINT "position_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logbook" ADD CONSTRAINT "logbook_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logbook_tag" ADD CONSTRAINT "logbook_tag_logbookId_fkey" FOREIGN KEY ("logbookId") REFERENCES "logbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logbook_tag" ADD CONSTRAINT "logbook_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
