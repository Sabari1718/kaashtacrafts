import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import PromoCode from '../../../../models/PromoCode';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    
    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    
    if (!promo) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
    }
    
    if (!promo.isActive) {
      return NextResponse.json({ error: "This promo code is no longer active" }, { status: 400 });
    }
    
    if (promo.expiryDate && new Date() > new Date(promo.expiryDate)) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
    }
    
    if (promo.maxUsage && promo.usageCount >= promo.maxUsage) {
      return NextResponse.json({ error: "This promo code has reached its usage limit" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      discountPercentage: promo.discountPercentage,
      code: promo.code
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to verify promo code" }, { status: 500 });
  }
}
