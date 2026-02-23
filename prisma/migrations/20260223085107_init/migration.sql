/*
  Warnings:

  - You are about to drop the column `userId` on the `position` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "position" DROP CONSTRAINT "position_userId_fkey";

-- AlterTable
ALTER TABLE "position" DROP COLUMN "userId";
