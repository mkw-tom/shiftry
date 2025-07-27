/*
  Warnings:

  - A unique constraint covering the columns `[userId,roleId]` on the table `UserJobRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserJobRole_userId_roleId_key" ON "UserJobRole"("userId", "roleId");
