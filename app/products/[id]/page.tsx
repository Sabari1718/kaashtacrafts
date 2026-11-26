"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Send, ArrowLeft, Loader2, Star, ShieldCheck, Trash2, ShoppingBag, Truck, Award, Sparkles, Check, Eye, X, ChevronLeft, ChevronRight, Layers } from "lucide-react";
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
  usageImages?: string[];
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
        fetchProduct(resolvedParams.id);
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
      <div className="flex items-center justify-center min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] transition-colors duration-300">
        <Loader2 className="w-10 h-10 animate-spin text-[#C49A50]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] transition-colors duration-300">
        <h1 className="text-2xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-4">Masterpiece Not Found</h1>
        <Link href="/products" className="text-[#C49A50] hover:underline text-sm font-semibold">Explore Catalog</Link>
      </div>
    );
  }

  // Calculate discount percentage
  const originalPrice = product.originalPrice || Math.floor(product.price * 1.4);
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  
  // Combine single image and images array safely
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const usageImages = product.usageImages && product.usageImages.length > 0 ? product.usageImages : [];

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] font-sans pb-24 md:pb-16 transition-colors duration-300">
      
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between p-4 sticky top-0 bg-[#F7F5F0]/90 dark:bg-[#14100E]/90 backdrop-blur-md z-40 border-b border-[#EAE1D2] dark:border-[#2E241E]">
        <button onClick={() => router.back()} className="p-2 bg-white dark:bg-[#1E1713] rounded-full border border-[#EAE1D2] dark:border-[#2E241E]" aria-label="Go Back">
          <ArrowLeft className="w-4 h-4 text-[#241812] dark:text-[#F7F5F0]" />
        </button>
        <button onClick={handleShare} className="p-2 bg-white dark:bg-[#1E1713] rounded-full border border-[#EAE1D2] dark:border-[#2E241E]" aria-label="Share">
          <Send className="w-4 h-4 text-[#241812] dark:text-[#F7F5F0]" />
        </button>
      </div>

      <div className="max-w-[1300px] mx-auto w-full pt-4 md:pt-10 px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        
        {/* Left Column: Product Image & Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-square bg-[#EAE1D2]/30 dark:bg-[#2E241E]/30 rounded-3xl overflow-hidden border border-[#EAE1D2] dark:border-[#2E241E] shadow-xs group">
            <Image 
              src={activeImage || product.image} 
              alt={product.name} 
              fill 
              className="object-cover transition-opacity duration-300"
              priority
            />
            
            {/* Wishlist & Share Floating Icons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-10">
              <button 
                onClick={() => {
                  if (product) {
                    toggleWishlist(product);
                    const isNowWishlisted = !isInWishlist(product.id || (product as any)._id);
                    if (isNowWishlisted) {
                      toast.success("Added to Private Wishlist ❤️");
                    } else {
                      toast.success("Removed from Wishlist");
                    }
                  }
                }}
                className="w-10 h-10 bg-white/90 dark:bg-[#1E1713]/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xs hover:scale-110 transition-all cursor-pointer"
                aria-label="Wishlist Toggle"
              >
                <Heart className={`w-4 h-4 ${product && isInWishlist(product.id || (product as any)._id) ? 'fill-red-500 text-red-500' : 'text-[#82786E]'}`} />
              </button>
              <button 
                onClick={handleShare}
                className="hidden md:flex w-10 h-10 bg-white/90 dark:bg-[#1E1713]/90 backdrop-blur-md rounded-full items-center justify-center shadow-xs hover:scale-110 transition-all cursor-pointer"
                aria-label="Share Piece"
              >
                <Send className="w-4 h-4 text-[#82786E]" />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {galleryImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === img ? 'border-[#C49A50] ring-2 ring-[#C49A50]/20 scale-102' : 'border-[#EAE1D2] dark:border-[#2E241E] opacity-75 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Gallery image ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Meta, Pricing, Guarantees & CTAs */}
        <div className="flex flex-col">
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#C49A50]">
              {product.category}
            </span>
            <span className="text-[#82786E]">•</span>
            <span className="text-xs text-[#82786E] flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#C49A50]" />
              100% Solid Seasoned Wood
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-3 leading-tight">
            {product.name}
          </h1>
          
          {/* Rating Pill */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center bg-[#241812] text-[#F7F5F0] dark:bg-[#C49A50] dark:text-[#241812] px-2.5 py-0.5 rounded-full text-xs font-bold">
              <span>{product.rating ? product.rating.toFixed(1) : "4.9"}</span>
              <Star className="w-3 h-3 ml-1 fill-current" />
            </div>
            <span className="text-xs text-[#82786E] font-medium">
              {product.numReviews || 38} Verified Collector Reviews
            </span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl sm:text-4xl font-bold font-sans text-[#241812] dark:text-[#F7F5F0]">
              ₹{product.price}
            </span>
            <span className="text-base text-[#82786E] line-through">
              ₹{originalPrice}
            </span>
            <span className="text-xs font-bold text-[#C49A50] bg-[#EAE1D2]/50 dark:bg-[#2E241E] px-2 py-0.5 rounded-md">
              {discountPercentage}% OFF
            </span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-6 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Free Cushioned Shipping Across India
          </p>

          {/* The Kaashta Trust Banner */}
          <div className="bg-white/80 dark:bg-[#1E1713]/80 p-4 rounded-2xl mb-6 border border-[#EAE1D2] dark:border-[#2E241E] flex items-start gap-3.5 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-[#C49A50] shrink-0 mt-0.5" />
            <div className="text-xs text-[#82786E] dark:text-[#A39A90] leading-relaxed">
              <span className="font-bold text-[#241812] dark:text-[#F7F5F0]">100% Genuine Timber Guarantee.</span> Cold-pressed natural oil polish, non-toxic food-safe wax finish, and zero-breakage replacement assurance.
            </div>
          </div>

          {/* Product Description */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C49A50] mb-2">
              The Artisan Design
            </h3>
            <p className="text-[#241812]/80 dark:text-[#F7F5F0]/80 leading-relaxed text-sm">
              {product.description || "Crafted with handpicked timber, this bespoke piece infuses timeless warmth and dignity into your living space. Hand-turned and hand-planed by Kaashta Crafts master woodcarvers."}
            </p>
            
            <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs border-t border-[#EAE1D2]/80 dark:border-[#2E241E]/80 pt-3">
              <span className="text-[#82786E]">Curated Guild:</span>
              <span className="text-[#241812] dark:text-[#F7F5F0] font-semibold">{product.category}</span>
              <span className="text-[#82786E]">Availability:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Ready to Ship</span>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex gap-3 mt-auto pt-4 border-t border-[#EAE1D2] dark:border-[#2E241E]">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] py-3.5 rounded-full font-bold text-sm tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-[#C49A50] hover:bg-[#D4AF37] text-[#241812] py-3.5 rounded-full font-bold text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Buy Now ₹{product.price}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ways to Style & Use Gallery (Lifestyle Inspiration) */}
      {usageImages.length > 0 && (
        <section className="max-w-[1300px] mx-auto w-full px-4 sm:px-8 mt-12 sm:mt-16 pt-10 border-t border-[#EAE1D2] dark:border-[#2E241E]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C49A50] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C49A50]" />
                Ways to Style & Use • Lifestyle Inspiration
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0]">
                See How to Use & Style This Piece
              </h2>
              <p className="text-xs sm:text-sm text-[#82786E] dark:text-[#A39A90] mt-1.5 max-w-2xl leading-relaxed">
                Explore real setups and aesthetic inspiration on how you can place and use this handcrafted piece in your home, desk, kitchen, or study space.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 bg-white/80 dark:bg-[#1E1713]/80 border border-[#EAE1D2] dark:border-[#2E241E] px-4 py-2 rounded-full text-xs font-bold text-[#65452F] dark:text-[#C49A50] shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-[#C49A50]" />
              <span>{usageImages.length} Styling {usageImages.length === 1 ? 'Idea' : 'Ideas'}</span>
            </div>
          </div>

          {/* Cards Grid (Responsive up to 10 photos) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
            {usageImages.map((img: string, idx: number) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="group relative aspect-4/5 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#EAE1D2]/30 dark:bg-[#2E241E]/30 border border-[#EAE1D2] dark:border-[#2E241E] cursor-pointer shadow-2xs hover:shadow-xl hover:border-[#C49A50] transition-all duration-300"
              >
                <Image
                  src={img}
                  alt={`${product.name} styling idea ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-40 group-hover:opacity-85 transition-opacity duration-300" />
                
                <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 shadow-xs">
                  Style {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-[11px] font-semibold tracking-wide">View Full Photo</span>
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox / Zoom Modal */}
          {lightboxIndex !== null && (
            <div 
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
              onClick={() => setLightboxIndex(null)}
            >
              <div 
                className="relative max-w-4xl w-full h-[75vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>

                {usageImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : usageImages.length - 1))}
                      className="absolute left-2 sm:left-4 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
                      aria-label="Previous Photo"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setLightboxIndex((prev) => (prev !== null && prev < usageImages.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 sm:right-4 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
                      aria-label="Next Photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden">
                  <Image
                    src={usageImages[lightboxIndex]}
                    alt={`Styling view ${lightboxIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white/90 border border-white/10 shadow-lg">
                  Styling Idea {lightboxIndex + 1} of {usageImages.length}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1300px] mx-auto w-full px-4 sm:px-8 mt-16 pt-12 border-t border-[#EAE1D2] dark:border-[#2E241E] mb-12 relative group/swiper">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#C49A50]">Complementary Creations</span>
              <h2 className="text-2xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0]">You May Also Cherish</h2>
            </div>
          </div>
          
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={16}
            slidesPerView={2}
            freeMode={true}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="pb-4"
          >
            {relatedProducts.map((p: any) => (
              <SwiperSlide key={p._id || p.id}>
                <Link 
                  href={`/products/${p._id || p.id}`} 
                  className="group flex flex-col h-full bg-white/80 dark:bg-[#1E1713]/80 p-3 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] hover:border-[#C49A50] shadow-xs hover:shadow-sm transition-all duration-300"
                >
                  <div className="relative aspect-square bg-[#EAE1D2]/30 dark:bg-[#2E241E]/30 rounded-xl overflow-hidden mb-3">
                    <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-[#241812] dark:text-[#F7F5F0] line-clamp-1 text-sm group-hover:text-[#65452F] dark:group-hover:text-[#C49A50] transition-colors">{p.name}</h3>
                  <p className="text-[#C49A50] font-bold mt-1 text-sm">₹{p.price}</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="max-w-[1300px] mx-auto w-full px-4 sm:px-8 pb-12">
        <h2 className="text-2xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-6 border-b border-[#EAE1D2] dark:border-[#2E241E] pb-3">
          Collector Reflections & Reviews
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Write a Review Card */}
          <div className="lg:col-span-1 bg-white/80 dark:bg-[#1E1713]/80 p-6 rounded-3xl border border-[#EAE1D2] dark:border-[#2E241E] h-fit shadow-xs">
            <h3 className="text-base font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-1">Review this creation</h3>
            <p className="text-xs text-[#82786E] mb-4">Share your tactile experience with other collectors</p>
            
            <form onSubmit={submitReview} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C49A50] mb-2">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-[#C49A50] text-[#C49A50]' : 'text-stone-300 dark:text-stone-700'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C49A50] mb-2">Your Thoughts</label>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How does the wood finish and grain feel in person?"
                  rows={4}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E] bg-[#F7F5F0]/60 dark:bg-[#14100E] text-xs text-[#241812] dark:text-[#F7F5F0] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 resize-none transition-all"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingReview}
                className="w-full bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] disabled:bg-stone-400 text-[#F7F5F0] dark:text-[#241812] py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                {isSubmittingReview ? "Submitting..." : session ? "Submit Review" : "Login to Review"}
              </button>
            </form>
          </div>

          {/* Display Reviews */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="text-center py-12 bg-white/70 dark:bg-[#1E1713]/70 rounded-3xl border border-[#EAE1D2] dark:border-[#2E241E]">
                <p className="text-xs sm:text-sm text-[#82786E]">No reviews yet. Be the first to share reflections on this piece.</p>
              </div>
            ) : (
              product.reviews.map((review: any, idx: number) => (
                <div key={idx} className="bg-white/80 dark:bg-[#1E1713]/80 p-5 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] shadow-2xs relative group transition-all">
                  {session?.user?.email === review.user && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="absolute top-4 right-4 p-1.5 text-[#82786E] hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete your review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-8 h-8 bg-[#EAE1D2] dark:bg-[#2E241E] text-[#65452F] dark:text-[#C49A50] rounded-full flex items-center justify-center font-bold text-xs">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#241812] dark:text-[#F7F5F0] text-xs">{review.name}</h4>
                      <p className="text-[10px] text-[#82786E]">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#C49A50] text-[#C49A50]' : 'text-stone-300 dark:text-stone-700'}`} />
                    ))}
                  </div>
                  
                  <p className="text-[#241812]/80 dark:text-[#F7F5F0]/80 text-xs sm:text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Actions */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F7F5F0]/95 dark:bg-[#14100E]/95 backdrop-blur-md border-t border-[#EAE1D2] dark:border-[#2E241E] p-3 flex gap-2.5 z-40 shadow-lg">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-[#241812] text-[#F7F5F0] py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Bag
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-1 bg-[#C49A50] hover:bg-[#D4AF37] text-[#241812] py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
        >
          Buy Now ₹{product.price}
        </button>
      </div>

    </main>
  );
}
