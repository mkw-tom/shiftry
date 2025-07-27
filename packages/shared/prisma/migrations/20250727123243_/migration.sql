/*
  Warnings:

  - You are about to drop the column `storeId` on the `Store` table. All the data in the column will be lost.
  - Made the column `weekEnd` on table `ShiftRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Store_storeId_key";

-- AlterTable
ALTER TABLE "ShiftRequest" ALTER COLUMN "weekEnd" SET NOT NULL;

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "storeId";

-- CreateTable
CREATE TABLE "JobRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "JobRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserJobRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserJobRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftPosition" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "jobRoles" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShiftPosition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobRole_storeId_name_key" ON "JobRole"("storeId", "name");

-- AddForeignKey
ALTER TABLE "JobRole" ADD CONSTRAINT "JobRole_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobRole" ADD CONSTRAINT "UserJobRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobRole" ADD CONSTRAINT "UserJobRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "JobRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftPosition" ADD CONSTRAINT "ShiftPosition_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
