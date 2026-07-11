import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import Product from "../../../../models/Product";

// GET wishlist for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    // Fetch full product details for each wishlist item
    const wishlistItemsWithDetails = [];
    for (const productId of user.wishlist) {
      const product = await Product.findById(productId);
      if (product) {
        wishlistItemsWithDetails.push({
          ...product.toObject(),
          id: product._id.toString(),
          _id: product._id.toString()
        });
      }
    }

    return NextResponse.json({ wishlist: wishlistItemsWithDetails });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST (Update) wishlist for the logged-in user
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { wishlist } = await req.json();

    await connectToDatabase();
    // Map the incoming full product items back to simple string array for DB
    const dbWishlist = wishlist.map((item: any) => item.id || item._id);

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { wishlist: dbWishlist } },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
