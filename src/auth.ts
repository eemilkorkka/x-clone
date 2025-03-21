import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
const bcrypt = require("bcrypt");
import { months } from "./utils/birthDateDropdowns";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const { handlers, signIn, signOut, auth } = NextAuth({
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
        const user = await prisma.users.findFirst({
          where: {
            OR: [
              { Email: credentials?.email as string },
              { Username: credentials?.username as string }
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
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/user.birthday.read"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          username: token.username as string
        }
      }
    },
    async signIn({ account, profile }) {
      if (account?.provider === "credentials") return true;

      if (account?.provider === "google") {
        if (!profile?.email) return false;

        const res = await fetch(`https://people.googleapis.com/v1/people/me?personFields=birthdays&access_token=${account.access_token}`);
        const data = await res.json();

        const { year, month, day } = data.birthdays[0].date;

        const birthDateMonth = months[month - 1];
        const birthDateDay = day.toString();
        const birthDateYear = year.toString();

        const user = await prisma.users.findFirst({
          where: {
            Email: profile.email,
          }
        });

        if (!user) {
          await prisma.users.create({
            data: {
              Name: profile.name || "Google User",
              DisplayName: profile.nickname || "GoogleUser",
              Email: profile.email,
              BirthDateMonth: birthDateMonth,
              BirthDateDay: birthDateDay,
              BirthDateYear: birthDateYear,
              Username: profile.email.split("@")[0],
              Password: ""
            }
          });
        }
        return true;
      }
      return false; 
    }
  }
});
