-- CreateTable
CREATE TABLE "LineStagingGroup" (
    "id" TEXT NOT NULL,
    "groupId_hash" TEXT,
    "groupId_enc" TEXT,
    "groupKeyVersion_hash" TEXT NOT NULL DEFAULT 'K1',
    "groupKeyVersion_enc" TEXT NOT NULL DEFAULT 'K1',
    "platform" TEXT NOT NULL DEFAULT 'line',
    "isRoom" BOOLEAN NOT NULL DEFAULT false,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LineStagingGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineStagingMember" (
    "id" TEXT NOT NULL,
    "stagingGroupId" TEXT NOT NULL,
    "lineId_hash" TEXT,
    "lineId_enc" TEXT,
    "lineKeyVersion_hash" TEXT NOT NULL DEFAULT 'K1',
    "lineKeyVersion_enc" TEXT NOT NULL DEFAULT 'K1',
    "consentAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "pictureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "LineStagingMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LineStagingGroup_groupId_hash_key" ON "LineStagingGroup"("groupId_hash");

-- CreateIndex
CREATE UNIQUE INDEX "LineStagingMember_lineId_hash_key" ON "LineStagingMember"("lineId_hash");

-- CreateIndex
CREATE INDEX "LineStagingMember_stagingGroupId_idx" ON "LineStagingMember"("stagingGroupId");

-- CreateIndex
CREATE INDEX "LineStagingMember_lineId_hash_idx" ON "LineStagingMember"("lineId_hash");

-- CreateIndex
CREATE UNIQUE INDEX "LineStagingMember_stagingGroupId_lineId_hash_key" ON "LineStagingMember"("stagingGroupId", "lineId_hash");

-- AddForeignKey
ALTER TABLE "LineStagingMember" ADD CONSTRAINT "LineStagingMember_stagingGroupId_fkey" FOREIGN KEY ("stagingGroupId") REFERENCES "LineStagingGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
