
export type UserBase = {
    id: string;
    username?: string | null | undefined;
    image?: string | null | undefined;
    bio?: string | null | undefined;
    website?: string | null | undefined;
    displayUsername?: string | null | undefined;
}

export interface User extends UserBase {
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    twoFactorEnabled: boolean | null;
}

export interface UserProfile extends UserBase {
    _count: {
        posts: number;
        likes: number;
    }
}