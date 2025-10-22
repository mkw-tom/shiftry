-- CreateTable
CREATE TABLE "StaffPreference" (
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "weeklyAvailability" JSONB NOT NULL,
    "weekMin" INTEGER NOT NULL,
    "weekMax" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffPreference_pkey" PRIMARY KEY ("userId","storeId")
);

-- AddForeignKey
ALTER TABLE "StaffPreference" ADD CONSTRAINT "StaffPreference_userId_storeId_fkey" FOREIGN KEY ("userId", "storeId") REFERENCES "UserStore"("userId", "storeId") ON DELETE CASCADE ON UPDATE CASCADE;
