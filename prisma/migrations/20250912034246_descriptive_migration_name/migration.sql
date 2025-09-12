-- CreateTable
CREATE TABLE "public"."Election" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "voters" TEXT[],
    "results" JSONB NOT NULL,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);
