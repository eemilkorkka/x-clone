-- CreateTable
CREATE TABLE `likes` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `PostID` INTEGER NOT NULL,

    INDEX `likes_UserID_idx`(`UserID`),
    INDEX `likes_PostID_idx`(`PostID`),
    UNIQUE INDEX `likes_UserID_PostID_key`(`UserID`, `PostID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_PostID_fkey` FOREIGN KEY (`PostID`) REFERENCES `posts`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
