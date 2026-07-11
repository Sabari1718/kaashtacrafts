import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      pincode: user.pincode || "",
      addresses: user.addresses || []
    });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address, city, pincode, addresses } = await req.json();

    await connectToDatabase();
    
    // If addresses are passed, update them. Otherwise just update the legacy profile fields.
    const updateData: any = { name, phone, address, city, pincode };
    if (addresses !== undefined) {
      updateData.addresses = addresses;
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
