export type FileType = "IMAGE" | "VIDEO";

export type File = {
    id: number;
    tweetId: number;
    url: string;
    fileType: FileType;
    createdAt: Date;
}