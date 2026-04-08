import { UserProfile } from "./User";

export type Follower = {
    id: number;
    followerId: string;
    followingId: string;
    createdAt: Date;
    follower?: UserProfile;
    following?: UserProfile;
}