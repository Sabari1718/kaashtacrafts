import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { productIds } = body;

    if (!Array.isArray(productIds)) {
      return NextResponse.json({ error: "productIds must be an array" }, { status: 400 });
    }

    const bulkOps = productIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      }
    }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    return NextResponse.json({ success: true, message: "Products reordered successfully" });
  } catch (error: any) {
    console.error("Failed to reorder products:", error);
    return NextResponse.json({ error: error.message || "Failed to reorder products" }, { status: 500 });
  }
}
