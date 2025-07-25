/*
  Warnings:

  - Added the required column `current_plan` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cancel_requested_at" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_plan" TEXT NOT NULL,
ADD COLUMN     "delete_scheduled_at" TIMESTAMP(3),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "isTrial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trial_end_notification_sent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "next_billing_date" DROP NOT NULL,
ALTER COLUMN "trial_end_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "groupId" DROP NOT NULL;
