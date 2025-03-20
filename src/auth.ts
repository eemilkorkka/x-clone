import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
const bcrypt = require("bcrypt");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const handlers = NextAuth({
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        username: {},
        password: {}
      },
      async authorize(credentials) {
        console.log(credentials);

        const user = await prisma.users.findFirst({
          where: {
            OR: [
              { Email: credentials?.email },
              { Username: credentials?.username }
            ]
          }
        });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(credentials?.password || "", user?.Password);

        if (!isPasswordCorrect) return null;

        return {
          id: user.UserID.toString(),
          email: user.Email,
          username: user.Username,
        }
      }
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    })
  ],
});

export { handlers as GET, handlers as POST };