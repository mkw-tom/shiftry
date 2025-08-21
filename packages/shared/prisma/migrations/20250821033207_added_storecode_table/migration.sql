-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserStore" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "StoreCode" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "code_enc" TEXT NOT NULL,
    "codeKeyVersion_hash" TEXT NOT NULL DEFAULT 'K1',
    "codeKeyVersion_enc" TEXT NOT NULL DEFAULT 'K1',
    "rotatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreCode_storeId_key" ON "StoreCode"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreCode_code_hash_key" ON "StoreCode"("code_hash");

-- AddForeignKey
ALTER TABLE "StoreCode" ADD CONSTRAINT "StoreCode_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
