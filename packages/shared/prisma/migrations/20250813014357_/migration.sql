/*
  Warnings:

  - You are about to drop the column `groupId` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `lineId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Store_groupId_key";

-- DropIndex
DROP INDEX "User_lineId_key";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "groupId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lineId",
DROP COLUMN "role";
