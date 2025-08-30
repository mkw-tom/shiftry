/*
  Warnings:

  - You are about to drop the column `name` on the `SubmittedShift` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubmittedShift" DROP COLUMN "name",
ADD COLUMN     "memo" TEXT;
