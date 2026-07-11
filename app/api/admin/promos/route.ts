import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import PromoCode from '../../../../models/PromoCode';

export async function GET() {
  try {
    await connectToDatabase();
    const promos = await PromoCode.find({}).sort({ createdAt: -1 });
    return NextResponse.json(promos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { code, discountPercentage } = await req.json();
    
    if (!code || !discountPercentage) {
      return NextResponse.json({ error: "Code and discount percentage are required" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Check if code already exists
    const existing = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: "Promo code already exists" }, { status: 400 });
    }

    const newPromo = await PromoCode.create({
      code: code.toUpperCase(),
      discountPercentage: Number(discountPercentage)
    });

    return NextResponse.json({ success: true, promo: newPromo });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create promo code" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    
    await connectToDatabase();
    await PromoCode.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete promo code" }, { status: 500 });
  }
}
