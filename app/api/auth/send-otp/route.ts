import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await connectToDatabase();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // OTP expires in 10 minutes
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    // Upsert user (Create if not exists)
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: email.split("@")[0],
        email,
        cart: [],
        wishlist: [],
        otp,
        otpExpiry,
      });
      await user.save();
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    // -------------------------------------------------------------
    // IMPORTANT: MOCK SEND EMAIL FOR DEVELOPMENT
    // -------------------------------------------------------------
    console.log(`\n\n[OTP SYSTEM] ✉️ Sending OTP ${otp} to ${email}\n\n`);

    // In production, you would use Nodemailer or Resend here:
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: email,
    //   subject: 'Your Login OTP - Kaashta Crafts',
    //   html: `<p>Your OTP code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
    // });
    
    // For demo purposes, we will return the OTP in the response
    // Remove this in real production!
    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully",
      // Only for local testing! Remove in prod.
      developmentOtp: otp 
    });

  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
