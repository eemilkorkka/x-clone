/*
  Warnings:

  - A unique constraint covering the columns `[pinnedTweetId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "pinnedTweetId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "user_pinnedTweetId_key" ON "user"("pinnedTweetId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_pinnedTweetId_fkey" FOREIGN KEY ("pinnedTweetId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
