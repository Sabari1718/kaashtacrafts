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
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    const mappedProducts = products.map(p => ({
      id: p._id.toString(),
      _id: p._id.toString(),
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
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

    await connectToDatabase();
    
    const newProduct = await Product.create({
      name,
      price: Number(price),
      category,
      image: mainUploadResult.secure_url,
      images: [mainUploadResult.secure_url, ...galleryUrls], // Main image is always first in the gallery array
      inStock: true,
      featured: false
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message || "Failed to create product", details: error }, { status: 500 });
  }
}
