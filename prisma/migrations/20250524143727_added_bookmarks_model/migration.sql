-- CreateTable
CREATE TABLE `bookmarks` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `PostID` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `bookmarks_UserID_idx`(`UserID`),
    INDEX `bookmarks_PostID_idx`(`PostID`),
    UNIQUE INDEX `bookmarks_UserID_PostID_key`(`UserID`, `PostID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_PostID_fkey` FOREIGN KEY (`PostID`) REFERENCES `posts`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;
