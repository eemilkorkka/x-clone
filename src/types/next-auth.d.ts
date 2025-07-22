import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string
        email: string
        username: string;
        name: string;
        image: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            username: string;
            name: string;
            image: string;
        } & DefaultSession["user"];
        expires: string
        error: string
    }
}