type TweetFile = {
    ID: number;
    PostID: number;
    File_URL: string;
    File_Type: string;
    created_at: string;
}

type TweetUser = {
    Username: string;
    DisplayName: string;
    ProfilePicture: string;
}

type TweetData = {
    ID: number;
    UserID: number;
    Content: string;
    created_at: string;
    users: TweetUser;
    files: TweetFile[];
    likes: {
        UserID: number;
    }[];
    replies: {
        UserID: number;
    }[];
}
