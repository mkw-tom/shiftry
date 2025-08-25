-- AlterTable
ALTER TABLE "ShiftPosition" ADD COLUMN     "absolute" JSONB,
ADD COLUMN     "count" INTEGER,
ADD COLUMN     "priority" JSONB,
ADD COLUMN     "weeks" TEXT[];
