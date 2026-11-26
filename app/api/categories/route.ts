import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Category from '../../../models/Category';

const DEFAULT_CATEGORIES = ["Desk Accessories", "Home Decor", "Kitchen", "Stationery"];

export async function GET() {
  try {
    await connectToDatabase();
    let categories = await Category.find({}).sort({ order: 1, createdAt: 1 });

    if (!categories || categories.length === 0) {
      const seedDocs = DEFAULT_CATEGORIES.map((name, index) => ({
        name,
        order: index
      }));
      try {
        await Category.insertMany(seedDocs);
        categories = await Category.find({}).sort({ order: 1, createdAt: 1 });
      } catch {
        categories = await Category.find({}).sort({ order: 1, createdAt: 1 });
      }
    }

    const list = categories.length > 0 ? categories.map(c => c.name) : DEFAULT_CATEGORIES;
    return NextResponse.json({ success: true, categories: list, raw: categories });
  } catch (error: any) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ success: true, categories: DEFAULT_CATEGORIES }, { status: 200 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { categories } = body;

    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: "categories must be an array of names" }, { status: 400 });
    }

    const cleanList = categories.filter((c: string) => c && c.trim().toLowerCase() !== "all");

    const bulkOps = cleanList.map((name: string, index: number) => ({
      updateOne: {
        filter: { name: name.trim() },
        update: { $set: { name: name.trim(), order: index } },
        upsert: true,
      }
    }));

    if (bulkOps.length > 0) {
      await Category.bulkWrite(bulkOps);
    }

    const updated = await Category.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, categories: updated.map(c => c.name) });
  } catch (error: any) {
    console.error("Failed to update categories order:", error);
    return NextResponse.json({ error: error.message || "Failed to update categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const trimmed = name.trim();
    const count = await Category.countDocuments();
    const newCat = await Category.findOneAndUpdate(
      { name: trimmed },
      { $setOnInsert: { name: trimmed, order: count } },
      { upsert: true, new: true }
    );

    const all = await Category.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, category: newCat, categories: all.map(c => c.name) });
  } catch (error: any) {
    console.error("Failed to add category:", error);
    return NextResponse.json({ error: error.message || "Failed to add category" }, { status: 500 });
  }
}
