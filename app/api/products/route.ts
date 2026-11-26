import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/Product';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ order: 1, createdAt: -1 });
    
    const mappedProducts = products.map(p => ({
      id: p._id.toString(),
      _id: p._id.toString(),
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      images: p.images && p.images.length > 0 ? p.images : [p.image],
      usageImages: p.usageImages || [],
      order: p.order ?? 0,
      inStock: p.inStock,
      featured: p.featured,
      reviews: p.reviews || [],
      rating: p.rating || 0,
      numReviews: p.numReviews || 0
    }));
    
    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const category = formData.get('category') as string;
    const galleryFiles = formData.getAll('galleryImages') as File[];
    const usageFiles = formData.getAll('usageImages') as File[];
    const usageUrlsRaw = formData.get('usageUrls') as string | null;

    if (!file || !name || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const uploadToCloudinary = async (f: File) => {
      const buffer = Buffer.from(await f.arrayBuffer());
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'kaashtacrafts_products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      }) as any;
    };

    // Upload main image
    const mainUploadResult = await uploadToCloudinary(file);
    
    // Upload gallery images concurrently
    const galleryUploadPromises = galleryFiles.map(f => uploadToCloudinary(f));
    const galleryResults = await Promise.all(galleryUploadPromises);
    const galleryUrls = galleryResults.map(res => res.secure_url);

    // Upload usage / how-to-use lifestyle images concurrently
    const usageUploadPromises = usageFiles.map(f => uploadToCloudinary(f));
    const usageResults = await Promise.all(usageUploadPromises);
    let allUsageUrls = usageResults.map(res => res.secure_url);

    // If string URLs were passed in addition
    if (usageUrlsRaw) {
      try {
        const parsedUrls = JSON.parse(usageUrlsRaw);
        if (Array.isArray(parsedUrls)) {
          allUsageUrls = [...allUsageUrls, ...parsedUrls.filter((u: any) => typeof u === 'string' && u.trim().length > 0)];
        }
      } catch {
        // comma or newline separated fallback
        const splitUrls = usageUrlsRaw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        allUsageUrls = [...allUsageUrls, ...splitUrls];
      }
    }

    await connectToDatabase();
    
    const newProduct = await Product.create({
      name,
      price: Number(price),
      category,
      image: mainUploadResult.secure_url,
      images: [mainUploadResult.secure_url, ...galleryUrls], // Main image is always first in the gallery array
      usageImages: allUsageUrls,
      inStock: true,
      featured: false
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message || "Failed to create product", details: error }, { status: 500 });
  }
}
