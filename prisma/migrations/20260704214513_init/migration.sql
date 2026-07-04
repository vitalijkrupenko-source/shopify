-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('PROSPECT', 'CONTACTED', 'REPLIED', 'CALL_BOOKED', 'PILOT', 'CLIENT', 'LOST');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('EMAIL_SENT', 'REPLY_RECEIVED', 'CALL', 'NOTE', 'STAGE_CHANGE');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "googlePlaceId" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "stage" "Stage" NOT NULL DEFAULT 'PROSPECT',
    "pilotStartDate" TIMESTAMP(3),
    "clientSince" TIMESTAMP(3),
    "monthlyFee" DECIMAL(10,2),
    "notes" TEXT NOT NULL DEFAULT '',
    "competitorName" TEXT,
    "competitorReviewCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_googlePlaceId_key" ON "Business"("googlePlaceId");

-- CreateIndex
CREATE INDEX "Snapshot_businessId_date_idx" ON "Snapshot"("businessId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_businessId_date_key" ON "Snapshot"("businessId", "date");

-- CreateIndex
CREATE INDEX "Activity_businessId_createdAt_idx" ON "Activity"("businessId", "createdAt");

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
