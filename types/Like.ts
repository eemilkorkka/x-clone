export type Like = {
    id: number;
    userId: string;
    tweetId?: number | null;
    createdAt: Date;
}