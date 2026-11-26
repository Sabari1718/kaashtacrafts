import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;
    
    const allFiles = files.length > 0 ? files : (singleFile ? [singleFile] : []);
    
    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadToCloudinary = async (f: File) => {
      const buffer = Buffer.from(await f.arrayBuffer());
      return new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'kaashtacrafts_products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
    };

    const uploadPromises = allFiles.map(f => uploadToCloudinary(f));
    const results = await Promise.all(uploadPromises);
    const urls = results.map(res => res.secure_url);

    return NextResponse.json({ success: true, urls });
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
