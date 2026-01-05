import { FileType } from "@/generated/prisma/enums";

export type File = {
    id: number;
    tweetId: number;
    url: string;
    type: FileType;
    createdAt: Date;
}