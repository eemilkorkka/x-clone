export type User = {
    UserID: number;
    Username: string;
    DisplayName: string;
    Website: string | null;
    Location: string | null;
    ProfilePicture: string;
    CoverPicture: string | null;
    Bio: string | null;
    followers: { followerId: number, followingId: number }[];
    following: { followerId: number, followingId: number }[];
}