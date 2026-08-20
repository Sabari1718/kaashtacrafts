"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Send, ArrowLeft, Loader2, Star, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Product as BaseProduct } from "../page";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

interface Product extends BaseProduct {
  reviews?: any[];
  rating?: number;
  numReviews?: number;
  images?: string[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    params.then(p => {
      setResolvedParams(p);
      fetchProduct(p.id);
    });
  }, [params]);

  async function fetchProduct(id: string) {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        setActiveImage(data.image); // Set default active image
        
        try {
          const allRes = await fetch('/api/products');
          if (allRes.ok) {
            const allData = await allRes.json();
            const related = allData
              .filter((p: any) => (p._id !== id && p.id !== id) && (p.category === data.category))
              .slice(0, 8);
            
            // If we don't have enough related products in the same category, pad with others
            if (related.length < 4) {
              const others = allData.filter((p: any) => p._id !== id && p.id !== id && p.category !== data.category).slice(0, 8 - related.length);
              related.push(...others);
            }
            
            setRelatedProducts(related);
          }
        } catch (e) {
          console.error(e);
        }
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      router.push(`/checkout?buyNow=${product.id || (product as any)._id}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name} at KaashtaCrafts!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedParams?.id) return;
    
    if (!session) {
      toast.error("Please login to submit a review");
      router.push("/api/auth/signin");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${resolvedParams.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          user: session.user?.email || "Anonymous",
          name: session.user?.name || "Customer"
        }),
      });

      if (res.ok) {
        toast.success("Review submitted successfully!");
        setReviewComment("");
        setReviewRating(5);
        fetchProduct(resolvedParams.id); // Refresh product data to show new review
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!resolvedParams?.id) return;
    
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/products/${resolvedParams.id}?reviewId=${reviewId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        toast.success("Review deleted successfully!");
        fetchProduct(resolvedParams.id);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete review");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-[#121212] transition-colors duration-300">
        <Loader2 className="w-10 h-10 animate-spin text-amber-700" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 dark:bg-[#121212] transition-colors duration-300">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">Product Not Found</h1>
        <Link href="/products" className="text-amber-700 dark:text-amber-500 hover:underline">Go back to Shop</Link>
      </div>
    );
  }

  // Calculate discount percentage
  const originalPrice = product.originalPrice || Math.floor(product.price * 1.4);
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  
  // Combine single image and images array safely
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <main className="flex flex-col w-full min-h-screen bg-white dark:bg-[#121212] font-sans pb-24 md:pb-0 transition-colors duration-300">
      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between p-4 sticky top-0 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md z-50 transition-colors">
        <button onClick={() => router.back()} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full">
          <ArrowLeft className="w-5 h-5 text-stone-800 dark:text-stone-200" />
        </button>
        <div className="flex gap-3">
          <button onClick={handleShare} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full">
            <Send className="w-5 h-5 text-stone-800 dark:text-stone-200" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full md:py-12 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Product Image Section */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[4/5] md:aspect-square bg-stone-100 dark:bg-stone-900 md:rounded-3xl overflow-hidden group">
            <Image 
              src={activeImage || product.image} 
              alt={product.name} 
              fill 
              className="object-cover transition-opacity duration-300"
              priority
            />
            
            {/* Wishlist & Share Icons (Desktop right side, Mobile right side over image) */}
            <div className="absolute top-4 right-4 flex flex-col gap-3">
              <button 
                onClick={() => {
                  if (product) {
                    toggleWishlist(product);
                    const isNowWishlisted = !isInWishlist(product.id || (product as any)._id);
                    if (isNowWishlisted) {
                      toast.success("Added to Wishlist ❤️");
                    } else {
                      toast.success("Removed from Wishlist");
                    }
                  }
                }}
                className="w-10 h-10 bg-white dark:bg-[#181818] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              >
                <Heart className={`w-5 h-5 ${product && isInWishlist(product.id || (product as any)._id) ? 'fill-red-500 text-red-500' : 'text-stone-600 dark:text-stone-400'}`} />
              </button>
              <button 
                onClick={handleShare}
                className="hidden md:flex w-10 h-10 bg-white dark:bg-[#181818] rounded-full items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              >
                <Send className="w-5 h-5 text-stone-600 dark:text-stone-400" />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0">
              {galleryImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-amber-700 dark:border-amber-500 ring-2 ring-amber-700/20 dark:ring-amber-500/20' : 'border-transparent hover:border-stone-300 dark:hover:border-stone-600'
                  }`}
                >
                  <Image src={img} alt={`Gallery image ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="px-4 md:px-0 flex flex-col pt-4 md:pt-0">
          <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">KaashtaCrafts</p>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2 leading-tight transition-colors">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className={`flex items-center text-white px-2 py-0.5 rounded text-xs font-bold ${product.rating && product.rating >= 4 ? 'bg-green-700 dark:bg-green-600' : product.rating && product.rating >= 2.5 ? 'bg-amber-500' : 'bg-red-500'}`}>
              {product.rating ? product.rating.toFixed(1) : "New"} <Star className="w-3 h-3 ml-1 fill-white" />
            </div>
            <span className="text-stone-400 dark:text-stone-500 text-sm">{product.numReviews || 0} Ratings & Reviews</span>
          </div>

          <div className="flex items-end gap-3 mb-1">
            <span className="text-green-600 dark:text-green-500 text-xl font-bold">↓{discountPercentage}%</span>
            <span className="text-stone-400 dark:text-stone-500 line-through text-xl">₹{originalPrice}</span>
            <span className="text-3xl font-bold text-stone-900 dark:text-stone-100">₹{product.price}</span>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-6">with exclusive offers</p>

          <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-xl mb-8 flex gap-3 border border-stone-100 dark:border-stone-800 transition-colors">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-500 shrink-0" />
            <div className="text-sm text-stone-700 dark:text-stone-300">
              <span className="font-semibold text-stone-900 dark:text-stone-100">Safe and Secure Payments.</span> Easy returns. 100% Authentic products.
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2">Product Details</h3>
            <p className="text-stone-600 leading-relaxed text-sm md:text-base">
              {product.description || "Crafted with premium quality materials, this product brings elegance and durability to your home. Designed by KaashtaCrafts artisans with high attention to detail."}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-stone-500">Category</div>
              <div className="text-stone-900 font-medium">{product.category}</div>
              <div className="text-stone-500">Stock</div>
              <div className="text-emerald-600 font-medium">In Stock</div>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex gap-4 mt-auto pt-4 border-t border-stone-100 dark:border-stone-800 transition-colors">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-stone-900 dark:bg-stone-800 text-white py-4 rounded-md font-bold text-lg uppercase tracking-wide hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors shadow-sm"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-amber-800 dark:bg-amber-700 text-white py-4 rounded-md font-bold text-lg uppercase tracking-wide hover:bg-amber-900 dark:hover:bg-amber-800 transition-colors shadow-md"
            >
              Buy at ₹{product.price}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 mt-16 md:mt-24 border-t border-stone-200 dark:border-stone-800 pt-12 md:pt-16 mb-12 relative group/swiper transition-colors">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair text-stone-900 dark:text-stone-100 mb-8 transition-colors">You may also like</h2>
          
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={16}
            slidesPerView={2}
            freeMode={true}
            navigation={{
              nextEl: '.swiper-button-next-related',
              prevEl: '.swiper-button-prev-related',
            }}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 32 },
            }}
            className="pb-4"
          >
            {relatedProducts.map((p: any) => (
              <SwiperSlide key={p._id || p.id}>
                <Link href={`/products/${p._id || p.id}`} className="group flex flex-col h-full bg-white dark:bg-[#181818] p-2 md:p-3 rounded-2xl hover:shadow-xl border border-transparent hover:border-stone-100 dark:hover:border-stone-800 transition-all duration-300">
                  <div className="relative aspect-[4/5] bg-stone-100 dark:bg-stone-900 rounded-xl overflow-hidden mb-4">
                    <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 line-clamp-1 text-sm md:text-base group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors px-1">{p.name}</h3>
                  <p className="text-amber-800 dark:text-amber-500 font-bold mt-1 text-sm md:text-base px-1">₹{p.price}</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Swiper Navigation Buttons */}
          <button className="swiper-button-prev-related absolute left-0 md:left-4 top-[60%] md:top-[55%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 dark:bg-[#181818]/90 backdrop-blur-sm rounded-full shadow-lg border border-stone-100 dark:border-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-200 z-10 opacity-0 group-hover/swiper:opacity-100 transition-all disabled:opacity-0 hover:bg-stone-900 hover:text-white dark:hover:bg-[#333]">
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button className="swiper-button-next-related absolute right-0 md:right-4 top-[60%] md:top-[55%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 dark:bg-[#181818]/90 backdrop-blur-sm rounded-full shadow-lg border border-stone-100 dark:border-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-200 z-10 opacity-0 group-hover/swiper:opacity-100 transition-all disabled:opacity-0 hover:bg-stone-900 hover:text-white dark:hover:bg-[#333]">
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
          </button>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold font-playfair text-stone-900 dark:text-stone-100 mb-8 border-b border-stone-200 dark:border-stone-800 pb-4 transition-colors">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Write a Review Form */}
          <div className="lg:col-span-1 bg-stone-50 dark:bg-stone-900 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 h-fit transition-colors">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">Review this product</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">Share your thoughts with other customers</p>
            
            <form onSubmit={submitReview} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-8 h-8 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 mt-4">Write your review</label>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="What did you like or dislike?"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#121212] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none transition-colors"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingReview}
                className="w-full bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 disabled:bg-stone-400 dark:disabled:bg-stone-600 text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm"
              >
                {isSubmittingReview ? "Submitting..." : session ? "Submit Review" : "Login to Review"}
              </button>
            </form>
          </div>

          {/* Display Reviews */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="text-center py-12 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 transition-colors">
                <p className="text-stone-500 dark:text-stone-400 font-medium">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              product.reviews.map((review: any, idx: number) => (
                <div key={idx} className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm relative group transition-colors">
                  {session?.user?.email === review.user && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="absolute top-4 right-4 p-2 text-stone-300 dark:text-stone-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete your review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-500 rounded-full flex items-center justify-center font-bold text-lg">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">{review.name}</h4>
                      <p className="text-xs text-stone-400 dark:text-stone-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200 dark:text-stone-700'}`} />
                    ))}
                  </div>
                  
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Actions */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] border-t border-stone-200 dark:border-stone-800 p-2 flex gap-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-stone-900 dark:bg-stone-800 text-white py-3 rounded-md font-bold text-sm uppercase tracking-wide shadow-sm hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
        >
          Add to Cart
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-1 bg-amber-800 dark:bg-amber-700 text-white py-3 rounded-md font-bold text-sm uppercase tracking-wide shadow-md hover:bg-amber-900 dark:hover:bg-amber-800 transition-colors"
        >
          Buy at ₹{product.price}
        </button>
      </div>
    </main>
  );
}
