import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    await connectToDatabase();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // OTP expires in 10 minutes
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    // Upsert user (Create if not exists)
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = new User({
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
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
    // Send Real Email via Nodemailer (Gmail SMTP)
    // -------------------------------------------------------------
    let emailSent = false;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Kaashta Crafts" <${process.env.EMAIL_USER}>`,
          to: cleanEmail,
          subject: `${otp} is your Kaashta Crafts verification passcode`,
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #1E140E; color: #F7F5F0; border-radius: 16px; overflow: hidden; border: 1px solid #38261C;">
              <div style="background-color: #241812; padding: 28px 24px; text-align: center; border-bottom: 1px solid #38261C;">
                <h1 style="margin: 0; color: #F7F5F0; font-size: 24px; letter-spacing: 1px;">Kaashta Crafts</h1>
                <p style="margin: 4px 0 0; color: #C49A50; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Artisanal Woodcraft • Coimbatore</p>
              </div>
              <div style="padding: 36px 28px; text-align: center;">
                <p style="margin: 0 0 12px; font-size: 14px; color: #EAE1D2;">Welcome to Kaashta Crafts.</p>
                <p style="margin: 0 0 24px; font-size: 13px; color: #A39A90; line-height: 1.5;">Use the verification passcode below to sign in to your account, manage your cart, and curate your wishlist:</p>
                
                <div style="display: inline-block; background-color: #150D09; border: 1.5px dashed #C49A50; border-radius: 12px; padding: 14px 28px; margin-bottom: 24px;">
                  <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #C49A50;">${otp}</span>
                </div>
                
                <p style="margin: 0; font-size: 12px; color: #82786E;">This code will expire in <strong>10 minutes</strong>. If you did not request this code, you can safely ignore this email.</p>
              </div>
              <div style="background-color: #150D09; padding: 16px 24px; text-align: center; border-top: 1px solid #38261C; font-size: 11px; color: #6E645A;">
                © ${new Date().getFullYear()} Kaashta Crafts. Coimbatore, Tamil Nadu, India.
              </div>
            </div>
          `,
        });
        emailSent = true;
      } catch (mailErr) {
        console.error("Nodemailer send error:", mailErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: emailSent ? "Verification code sent to your email!" : "Verification code generated",
      emailSent,
      // Fallback OTP for testing if mail server is delayed
      developmentOtp: emailSent ? undefined : otp 
    });

  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
