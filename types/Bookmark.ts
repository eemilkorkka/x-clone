export type Bookmark = {
    id: number;
    userId: string;
    tweetId?: number | null;
    createdAt: Date;
}