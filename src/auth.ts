// At the top of your file, e.g. `src/auth.ts`
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { User } from "./db/models/user.model";
import connectDB from "./db/connectDB";
import loginSchema from "./lib/zod/loginSchema";

// Ensure environment variables are present
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials in environment variables.");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        await connectDB();

        let user = await User.findOne({ email: profile.email });

        if (!user) {
          user = await User.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            socialProviderId: profile.sub,
          });
        }

        return {
          _id: user._id.toString(), // Include _id to match User type
          id: user._id.toString(), // Use MongoDB _id for session tracking
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),

    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;

          const validated = loginSchema.safeParse(credentials);
          if (!validated.success) return null;

          await connectDB();

          const user = await User.findOne({ email: validated.data.email });
          if (!user || !user.password) return null;

          const isMatch = await bcrypt.compare(
            validated.data.password,
            user.password
          );
          if (!isMatch) return null;

          const plainUser = {
            _id: user._id.toString(), // Include _id to match User type
            id: user._id.toString(), // Required for session
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };

          return plainUser;
        } catch (error) {
          console.error("Credentials login error:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user = token.user as any;
      }
      return session;
    },
  },

  trustHost: true,
});
