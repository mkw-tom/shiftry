/*
  Warnings:

  - A unique constraint covering the columns `[storeId,name]` on the table `ShiftPosition` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ShiftPosition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShiftPosition" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShiftPosition_storeId_name_key" ON "ShiftPosition"("storeId", "name");
