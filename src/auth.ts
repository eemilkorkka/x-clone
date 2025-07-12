import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { months } from "./utils/birthDateDropdowns";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
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
          image: user.ProfilePicture,
        }
      }
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/user.birthday.read",
          prompt: "select_account"
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (token.email) {
        const dbUser = await prisma.users.findUnique({
          where: { Email: token.email },
        });

        if (dbUser) {
          token.id = dbUser.UserID.toString();
          token.username = dbUser.Username;
          token.picture = dbUser.ProfilePicture;
          token.email = dbUser.Email;
        }
      }

      if (user) {
        token.email = user.email;
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
          username: token.username as string,
          image: token.picture as string,
        }
      }
    },
    async signIn({ account, profile }) {
      if (account?.provider === "credentials") return true;

      if (account?.provider === "google") {
        if (!profile?.email) return false;

        const user = await prisma.users.findFirst({
          where: {
            Email: profile.email,
          }
        });

        if (!user) {

          const res = await fetch(`https://people.googleapis.com/v1/people/me?personFields=birthdays&access_token=${account.access_token}`);
          const data = await res.json();

          const { year, month, day } = data.birthdays[0].date;

          const newUser = await prisma.users.create({
            data: {
              Name: profile.name || "Google User",
              DisplayName: profile.name || "GoogleUser",
              Email: profile.email,
              BirthDateMonth: months[month - 1],
              BirthDateDay: day.toString(),
              BirthDateYear: year.toString(),
              Username: "user_" + uuidv4().slice(0, 10),
              Password: "",
              ProfilePicture: profile.picture
            }
          });

          account.userId = newUser?.UserID.toString();
        }

        return true;
      }
      return false;
    }
  }
});
