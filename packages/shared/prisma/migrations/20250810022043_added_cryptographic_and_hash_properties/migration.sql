/*
  Warnings:

  - A unique constraint covering the columns `[groupId_hash]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lineId_hash]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "consentAt" TIMESTAMP(3),
ADD COLUMN     "groupId_enc" TEXT,
ADD COLUMN     "groupId_hash" TEXT,
ADD COLUMN     "groupKeyVersion" TEXT DEFAULT 'K1',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "consentAt" TIMESTAMP(3),
ADD COLUMN     "lineId_enc" TEXT,
ADD COLUMN     "lineId_hash" TEXT,
ADD COLUMN     "lineKeyVersion" TEXT DEFAULT 'K1',
ALTER COLUMN "lineId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Store_groupId_hash_key" ON "Store"("groupId_hash");

-- CreateIndex
CREATE UNIQUE INDEX "User_lineId_hash_key" ON "User"("lineId_hash");
