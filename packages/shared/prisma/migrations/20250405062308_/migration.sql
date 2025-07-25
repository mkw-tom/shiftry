/*
  Warnings:

  - You are about to drop the column `weekEnd` on the `AssignShift` table. All the data in the column will be lost.
  - You are about to drop the column `weekStart` on the `AssignShift` table. All the data in the column will be lost.
  - You are about to drop the column `weekEnd` on the `SubmittedShift` table. All the data in the column will be lost.
  - You are about to drop the column `weekStart` on the `SubmittedShift` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,shiftRequestId]` on the table `SubmittedShift` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AssignShift_storeId_weekStart_key";

-- DropIndex
DROP INDEX "SubmittedShift_userId_storeId_weekStart_key";

-- AlterTable
ALTER TABLE "AssignShift" DROP COLUMN "weekEnd",
DROP COLUMN "weekStart";

-- AlterTable
ALTER TABLE "SubmittedShift" DROP COLUMN "weekEnd",
DROP COLUMN "weekStart";

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedShift_userId_shiftRequestId_key" ON "SubmittedShift"("userId", "shiftRequestId");
