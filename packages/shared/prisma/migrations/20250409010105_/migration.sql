-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('MONTHLY', 'WEEKLY');

-- AlterTable
ALTER TABLE "ShiftRequest" ADD COLUMN     "type" "ShiftType" NOT NULL DEFAULT 'WEEKLY';
