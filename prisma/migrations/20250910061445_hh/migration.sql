/*
  Warnings:

  - A unique constraint covering the columns `[userinfo]` on the table `Passkey` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Passkey_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Passkey_userinfo_key" ON "public"."Passkey"("userinfo");
