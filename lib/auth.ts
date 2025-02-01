import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "./mongodb"
import { MongoDBAdapter } from "@auth/mongodb-adapter"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      // Check if email is verified and ends with @tec.mx
      const isAllowed = user?.email?.endsWith("@tec.mx") && profile?.email_verified;
      return isAllowed;
    },
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}