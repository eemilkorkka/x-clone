/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `verification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "SignupVerification" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "verificationCode" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignupVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SignupVerification_email_key" ON "SignupVerification"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_key" ON "verification"("identifier");
