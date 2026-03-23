/*
  Warnings:

  - Made the column `role` on table `position` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "position" ALTER COLUMN "role" SET NOT NULL;
