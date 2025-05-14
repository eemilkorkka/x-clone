-- CreateTable
CREATE TABLE `verificationtokens` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(255) NOT NULL,
    `Code` INTEGER NULL,

    UNIQUE INDEX `Email`(`Email`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,
    `DisplayName` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `BirthDateMonth` VARCHAR(255) NOT NULL,
    `BirthDateDay` VARCHAR(255) NOT NULL,
    `BirthDateYear` VARCHAR(255) NOT NULL,
    `Username` VARCHAR(255) NOT NULL,
    `Password` VARCHAR(255) NULL,
    `Location` VARCHAR(255) NULL,
    `Website` VARCHAR(255) NULL,
    `ProfilePicture` VARCHAR(255) NOT NULL DEFAULT 'https://cloud.appwrite.io/v1/storage/buckets/67e599e6001b68a099f7/files/67e59ae30013a907b563/view?project=67e599cf000525d1eb9a',
    `CoverPicture` VARCHAR(255) NULL,
    `Bio` VARCHAR(255) NULL,

    UNIQUE INDEX `Email`(`Email`),
    UNIQUE INDEX `Username`(`Username`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `files` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `PostID` INTEGER NOT NULL,
    `File_URL` VARCHAR(255) NOT NULL,
    `File_Type` ENUM('image', 'video') NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `PostID`(`PostID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `Content` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`PostID`) REFERENCES `posts`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
