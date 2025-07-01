-- CreateTable
CREATE TABLE `followers` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `FollowerID` INTEGER NOT NULL,
    `FollowingID` INTEGER NOT NULL,

    INDEX `followers_FollowerID_idx`(`FollowerID`),
    INDEX `followers_FollowingID_idx`(`FollowingID`),
    UNIQUE INDEX `followers_FollowerID_FollowingID_key`(`FollowerID`, `FollowingID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `followers` ADD CONSTRAINT `followers_FollowerID_fkey` FOREIGN KEY (`FollowerID`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `followers` ADD CONSTRAINT `followers_FollowingID_fkey` FOREIGN KEY (`FollowingID`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;
