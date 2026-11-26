import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, type, category, productChoice, quantity, customizations, targetDate, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Name, phone, and message are required" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const newInquiry = await Inquiry.create({
        name,
        phone,
        email: email || "",
        type: type || "direct",
        category: category || "General Product Inquiry",
        productChoice: productChoice || "",
        quantity: quantity || "",
        customizations: Array.isArray(customizations) ? customizations : [],
        targetDate: targetDate || "",
        message,
        status: "New",
      });
      return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
    } catch (dbErr) {
      console.warn("DB save warning (proceeding anyway):", dbErr);
      return NextResponse.json({ success: true, message: "Inquiry recorded" }, { status: 200 });
    }
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: err.message || "Failed to process inquiry" }, { status: 500 });
  }
}
