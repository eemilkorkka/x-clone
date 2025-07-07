/*
  Warnings:

  - You are about to drop the column `Code` on the `verificationtokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `verificationtokens` DROP COLUMN `Code`,
    ADD COLUMN `PasswordResetCode` INTEGER NULL,
    ADD COLUMN `VerificationCode` INTEGER NULL;
