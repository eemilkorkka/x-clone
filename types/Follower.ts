import { UserBase, UserProfile } from "./User";

export type Follower = {
    id: number;
    followerId: string;
    followingId: string;
    createdAt: Date;
    follower?: UserProfile;
    following?: UserProfile;
}

export interface UserWithFollowers extends UserBase {
    followers: Follower[];
    following: Follower[];
}