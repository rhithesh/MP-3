-- AlterTable
ALTER TABLE "public"."Election" ALTER COLUMN "voters" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "transactionSignatures" SET DEFAULT ARRAY[]::TEXT[];
