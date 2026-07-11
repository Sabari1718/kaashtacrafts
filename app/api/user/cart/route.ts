import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import Product from "../../../../models/Product";

// GET cart for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    // Fetch full product details for each cart item
    const cartItemsWithDetails = [];
    for (const item of user.cart) {
      const product = await Product.findById(item.productId);
      if (product) {
        cartItemsWithDetails.push({
          ...product.toObject(),
          id: product._id.toString(),
          _id: product._id.toString(),
          quantity: item.quantity
        });
      }
    }

    return NextResponse.json({ cart: cartItemsWithDetails });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST (Update) cart for the logged-in user
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cart } = await req.json();

    await connectToDatabase();
    // Map the incoming full product items back to simple { productId, quantity } for DB
    const dbCart = cart.map((item: any) => ({
      productId: item.id || item._id,
      quantity: item.quantity
    }));

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { cart: dbCart } },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
