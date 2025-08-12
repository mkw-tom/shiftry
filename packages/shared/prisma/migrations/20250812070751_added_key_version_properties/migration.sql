/*
  Warnings:

  - You are about to drop the column `groupKeyVersion` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `lineKeyVersion` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "groupKeyVersion",
ADD COLUMN     "groupKeyVersion_enc" TEXT NOT NULL DEFAULT 'K1',
ADD COLUMN     "groupKeyVersion_hash" TEXT NOT NULL DEFAULT 'K1',
ALTER COLUMN "consentAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lineKeyVersion",
ADD COLUMN     "lineKeyVersion_enc" TEXT NOT NULL DEFAULT 'K1',
ADD COLUMN     "lineKeyVersion_hash" TEXT NOT NULL DEFAULT 'K1',
ALTER COLUMN "consentAt" SET DEFAULT CURRENT_TIMESTAMP;
