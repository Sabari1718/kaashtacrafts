"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart(item);
    removeFromWishlist(item.id || item._id);
    toast.success("Moved to cart!");
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-stone-50 font-sans pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full pt-12 md:pt-16">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          Your Wishlist
        </h1>
        <p className="text-stone-500 mb-10">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later.
        </p>

        {wishlistItems.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-200 text-center">
            <Heart className="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Your wishlist is empty</h2>
            <p className="text-stone-500 mb-8">Save items you love to view them later.</p>
            <Link href="/products" className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-stone-800 transition-colors">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item: any) => (
              <div key={item.id || item._id} className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden group flex flex-col">
                <Link href={`/products/${item.id || item._id}`} className="relative aspect-[4/3] block overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(item.id || item._id);
                      toast.success("Removed from wishlist");
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/products/${item.id || item._id}`}>
                    <h3 className="font-bold text-stone-900 mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-amber-800 font-bold mb-4">₹{item.price}</p>
                  </Link>
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="mt-auto w-full bg-stone-100 hover:bg-amber-900 hover:text-white text-stone-900 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
