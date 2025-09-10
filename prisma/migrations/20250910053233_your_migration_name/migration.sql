/*
  Warnings:

  - You are about to drop the column `webAuthnUserID` on the `Passkey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Passkey" DROP COLUMN "webAuthnUserID";
