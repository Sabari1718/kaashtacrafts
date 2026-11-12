"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Heart, Sparkles, ArrowRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart(item);
    removeFromWishlist(item.id || item._id);
    toast.success("Moved to shopping bag!");
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] font-sans pb-24 pt-8 transition-colors duration-300">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 w-full">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#C49A50] text-xs font-bold uppercase tracking-[0.16em] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Sanctuary</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-playfair tracking-tight text-[#241812] dark:text-[#F7F5F0]">
            Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[#82786E] dark:text-[#A39A90] mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? "creation" : "creations"} preserved for your collection.
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white/80 dark:bg-[#1E1713]/80 p-12 sm:p-16 rounded-3xl shadow-xs border border-[#EAE1D2] dark:border-[#2E241E] text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EAE1D2]/50 dark:bg-[#2E241E] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-[#82786E]" />
            </div>
            <h2 className="text-2xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-2">Your wishlist is pristine</h2>
            <p className="text-xs sm:text-sm text-[#82786E] mb-6">Discover handcrafted pieces and tap the heart icon to save them here.</p>
            <Link href="/products" className="inline-block bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm">
              Discover Masterpieces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item: any) => {
              const itemId = item.id || item._id;

              return (
                <div key={itemId} className="bg-white/85 dark:bg-[#1E1713]/85 rounded-3xl shadow-xs border border-[#EAE1D2] dark:border-[#2E241E] overflow-hidden group flex flex-col hover:border-[#C49A50] transition-all duration-300">
                  <Link href={`/products/${itemId}`} className="relative aspect-[4/3] block overflow-hidden bg-[#EAE1D2]/30 dark:bg-[#2E241E]/30">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(itemId);
                        toast.success("Removed from wishlist");
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-[#1E1713]/90 backdrop-blur rounded-full flex items-center justify-center text-[#82786E] hover:text-red-500 shadow-xs transition-colors cursor-pointer"
                      title="Remove piece"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </Link>

                  <div className="p-5 flex flex-col flex-grow">
                    <Link href={`/products/${itemId}`} className="group-hover:text-[#65452F] dark:group-hover:text-[#C49A50] transition-colors mb-4">
                      <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#C49A50] block mb-1">{item.category}</span>
                      <h3 className="font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] text-base mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-base font-bold text-[#241812] dark:text-[#F7F5F0]">₹{item.price}</p>
                    </Link>
                    
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="mt-auto w-full bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] text-[#F7F5F0] dark:text-[#241812] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
