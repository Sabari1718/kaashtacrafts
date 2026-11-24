import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        await connectToDatabase();
        const cleanEmail = credentials.email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanEmail });

        if (!user) throw new Error("No user found with this email");
        if (user.otp !== credentials.otp.trim()) throw new Error("Invalid verification code");
        if (user.otpExpiry && new Date() > user.otpExpiry) throw new Error("Verification code has expired");

        // Clear OTP on success
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true;
      }

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
