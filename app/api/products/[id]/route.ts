import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    // In Next.js 15+, params might be a promise depending on the config, 
    // but in Next 14 it's sync. We'll await it just in case if using dynamic APIs.
    // Wait, the prompt says "This version has breaking changes", Next.js 15 might require await params.
    // Let's assume Next.js 14 for now, but handle potential await.
    // To be safe in Next 15: const resolvedParams = await params;
    const resolvedParams = await params;
    
    const product = await Product.findById(resolvedParams.id);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    const mappedProduct = {
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      description: product.description || "Premium handcrafted wooden product.",
      category: product.category,
      image: product.image,
      inStock: product.inStock,
      featured: product.featured,
      originalPrice: product.originalPrice || Math.floor(product.price * 1.5),
      reviews: product.reviews || [],
      rating: product.rating || 0,
      numReviews: product.numReviews || 0
    };
    
    return NextResponse.json(mappedProduct);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const body = await request.json();
    const { name, rating, comment, user } = body;

    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 });
    }

    const product = await Product.findById(resolvedParams.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Add review
    const newReview = {
      user: user || "Anonymous",
      name: name || "Customer",
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    return NextResponse.json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.error("Failed to add review:", error);
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const body = await request.json();
    const { name, price, category, inStock, image, description } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (category !== undefined) updateData.category = category;
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;

    const updatedProduct = await Product.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: {
        id: updatedProduct._id.toString(),
        _id: updatedProduct._id.toString(),
        name: updatedProduct.name,
        price: updatedProduct.price,
        category: updatedProduct.category,
        image: updatedProduct.image,
        inStock: updatedProduct.inStock,
        featured: updatedProduct.featured,
        description: updatedProduct.description,
        reviews: updatedProduct.reviews || [],
        rating: updatedProduct.rating || 0,
        numReviews: updatedProduct.numReviews || 0,
      }
    });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    // If reviewId is provided, delete only that specific review
    if (reviewId) {
      const product = await Product.findById(resolvedParams.id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const initialLength = product.reviews.length;
      product.reviews = product.reviews.filter((review: any) => review._id.toString() !== reviewId);

      if (product.reviews.length === initialLength) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 });
      }

      product.numReviews = product.reviews.length;
      if (product.numReviews > 0) {
        product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;
      } else {
        product.rating = 0;
      }

      await product.save();

      return NextResponse.json({ success: true, message: "Review deleted successfully" });
    }

    // Otherwise, delete the entire product from the database
    const deletedProduct = await Product.findByIdAndDelete(resolvedParams.id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product or review:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
