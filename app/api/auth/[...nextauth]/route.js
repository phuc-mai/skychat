import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { connectToDB } from "@mongodb";
import User from "@models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          throw new Error("Invalid Email or Password");
        }

        /* Compare password */
        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid Email or Password");
        }

        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      session.user = { ...session.user, ...sessionUser._doc };

      return session;
    },

    //   async signIn({ account, profile }) {
    //     if (account.provider === "google") {
    //       try {
    //         await connectToDB();

    //         /* Check is the user exist */
    //         let user = await User.findOne({ email: profile.email });

    //         if (!user) {
    //           user = await User.create({
    //             username: profile.name,
    //             email: profile.email,
    //           });
    //         }

    //         return user;
    //       } catch (err) {
    //         console.log("Error checking if user exists: ", err.message);
    //       }
    //     }

    //     return true
    //   },
  },
});

export { handler as GET, handler as POST };
