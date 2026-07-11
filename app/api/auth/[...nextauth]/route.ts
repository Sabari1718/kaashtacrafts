import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectToDatabase();
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              cart: [],
              wishlist: [],
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving user to DB:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      try {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: session.user?.email });
        if (dbUser && session.user) {
          (session.user as any).role = dbUser.role;
        }
      } catch (error) {
        console.error("Error fetching user role for session:", error);
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
