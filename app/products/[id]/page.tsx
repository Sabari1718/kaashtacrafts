"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Send, ArrowLeft, Loader2, Star, ShieldCheck, Trash2, ShoppingBag, Truck, Award, Sparkles, Check, Eye, X, ChevronLeft, ChevronRight, Layers, Home, ArrowRight } from "lucide-react";
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
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isMainZoomOpen, setIsMainZoomOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

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
        setActiveImageIndex(0);
        
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

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1 && document.referrer.includes(window.location.host)) {
      router.back();
    } else {
      router.push("/products");
    }
  };

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
  
  // Combine primary image, extra images, and all styling/usage images into a single Amazon-style gallery
  const allProductImages: string[] = Array.from(
    new Set(
      [
        product.image,
        ...(product.images || []),
        ...(product.usageImages || [])
      ].filter(Boolean)
    )
  );

  const nextImage = () => {
    if (allProductImages.length <= 1) return;
    setActiveImageIndex(prev => (prev + 1) % allProductImages.length);
  };
  const prevImage = () => {
    if (allProductImages.length <= 1) return;
    setActiveImageIndex(prev => (prev - 1 + allProductImages.length) % allProductImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      nextImage();
    } else if (diff < -45) {
      prevImage();
    }
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] font-sans pb-24 md:pb-16 transition-colors duration-300">
      
      {/* Mobile Top Navigation Bar (With Smart Back, Logo Home & Share) */}
      <div className="md:hidden flex items-center justify-between px-3.5 py-2.5 sticky top-0 bg-[#F7F5F0]/95 dark:bg-[#14100E]/95 backdrop-blur-md z-40 border-b border-[#EAE1D2] dark:border-[#2E241E]">
        <button 
          onClick={handleGoBack} 
          className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#1E1713] rounded-full border border-[#EAE1D2] dark:border-[#2E241E] text-xs font-bold text-[#241812] dark:text-[#F7F5F0] shadow-xs active:scale-95 transition-all cursor-pointer" 
          aria-label="Go Back"
        >
          <ArrowLeft className="w-4 h-4 text-[#C49A50]" />
          <span>Back</span>
        </button>

        <Link href="/" className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-[#C49A50]/60 bg-[#2E1A11] shrink-0 relative">
            <Image src="/logo.jpg" alt="Kaashta Crafts" fill className="object-contain" />
          </div>
          <span className="font-playfair font-bold text-xs tracking-wider text-[#241812] dark:text-[#F7F5F0]">
            Kaashta Crafts
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link 
            href="/" 
            className="p-1.5 bg-white dark:bg-[#1E1713] rounded-full border border-[#EAE1D2] dark:border-[#2E241E] text-[#241812] dark:text-[#F7F5F0] shadow-xs active:scale-95 transition-all" 
            title="Go to Home"
          >
            <Home className="w-4 h-4 text-[#241812] dark:text-[#F7F5F0]" />
          </Link>
          <button 
            onClick={handleShare} 
            className="p-1.5 bg-white dark:bg-[#1E1713] rounded-full border border-[#EAE1D2] dark:border-[#2E241E] text-[#241812] dark:text-[#F7F5F0] shadow-xs active:scale-95 transition-all cursor-pointer" 
            aria-label="Share"
            title="Share with friends"
          >
            <Send className="w-4 h-4 text-[#241812] dark:text-[#F7F5F0]" />
          </button>
        </div>
      </div>

      {/* Top Breadcrumb & Navigation Trail (Desktop & Tablet) */}
      <div className="max-w-[1300px] mx-auto w-full pt-4 md:pt-8 px-4 sm:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#1E1713] border border-[#EAE1D2] dark:border-[#2E241E] text-[#241812] dark:text-[#F7F5F0] hover:border-[#C49A50] hover:text-[#C49A50] font-bold transition-all shadow-xs cursor-pointer group active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C49A50] group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to All Pieces</span>
          </button>
          
          <span className="hidden sm:inline text-[#82786E]">•</span>
          
          <nav className="hidden sm:flex items-center gap-2 text-xs text-[#82786E] font-medium">
            <Link href="/" className="hover:text-[#241812] dark:hover:text-[#F7F5F0] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-[#C49A50]" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#241812] dark:hover:text-[#F7F5F0] transition-colors">
              Shop All
            </Link>
            <span>/</span>
            <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#241812] dark:hover:text-[#F7F5F0] transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#241812] dark:text-[#F7F5F0] font-semibold line-clamp-1 max-w-[200px] lg:max-w-[320px]">
              {product.name}
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-[#1E1713]/70 border border-[#EAE1D2] dark:border-[#2E241E] text-xs font-semibold text-[#82786E] hover:text-[#241812] dark:hover:text-[#F7F5F0] hover:border-[#C49A50] transition-all"
          >
            <Home className="w-3.5 h-3.5 text-[#C49A50]" />
            <span>Home Page</span>
          </Link>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#C49A50] hover:text-[#D4AF37] transition-colors"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto w-full pt-4 md:pt-6 px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        
        {/* Left Column: Product Image & Gallery (Amazon-Style Carousel with Swipe & Arrows) */}
        <div className="flex flex-col gap-3.5">
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] max-h-[620px] bg-gradient-to-b from-[#EDE5D8] via-[#F4EFE6] to-[#E5DAC8] dark:from-[#211712] dark:via-[#1A120E] dark:to-[#140E0A] rounded-3xl overflow-hidden border-2 border-[#DFCDB7] dark:border-[#38261C] shadow-md group flex items-center justify-center select-none"
          >
            {/* Ambient subtle warm gold glow */}
            <div className="absolute inset-0 bg-radial from-[#C49A50]/10 via-transparent to-transparent pointer-events-none" />

            <Image 
              src={allProductImages[activeImageIndex] || product.image} 
              alt={`${product.name} - View ${activeImageIndex + 1}`} 
              fill 
              className="object-contain p-2 sm:p-4 transition-all duration-300 group-hover:scale-102 cursor-zoom-in"
              priority
              onClick={() => setIsMainZoomOpen(true)}
            />

            {/* Amazon-Style Prev & Next Arrow Buttons */}
            {allProductImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-[#1E1713]/90 hover:bg-white dark:hover:bg-[#1E1713] text-[#241812] dark:text-[#F7F5F0] border border-[#DFCDB7] dark:border-[#38261C] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                  title="Previous photo"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#241812] dark:text-[#F7F5F0]" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-[#1E1713]/90 hover:bg-white dark:hover:bg-[#1E1713] text-[#241812] dark:text-[#F7F5F0] border border-[#DFCDB7] dark:border-[#38261C] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                  title="Next photo"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#241812] dark:text-[#F7F5F0]" />
                </button>
              </>
            )}

            {/* Image counter indicator (e.g. 1 / 8) */}
            {allProductImages.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/15 shadow-sm z-20">
                {activeImageIndex + 1} / {allProductImages.length}
              </div>
            )}

            {/* Click to zoom badge at bottom left */}
            <button
              onClick={() => setIsMainZoomOpen(true)}
              className="absolute bottom-3.5 left-3.5 bg-[#241812]/85 hover:bg-[#241812] backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg z-20"
              title="Click to view full image"
            >
              <Eye className="w-3.5 h-3.5 text-[#C49A50]" />
              <span>Tap to Zoom</span>
            </button>
            
            {/* Wishlist & Share Floating Icons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-20">
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
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 ${
                  product && isInWishlist(product.id || (product as any)._id)
                    ? 'bg-red-50 border-red-300 text-red-500 shadow-red-200/50'
                    : 'bg-white/95 dark:bg-[#1E1713]/95 border-[#DFCDB7] dark:border-[#38261C] text-[#241812] dark:text-[#F7F5F0] hover:border-[#C49A50] hover:text-[#C49A50]'
                }`}
                aria-label="Wishlist Toggle"
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${product && isInWishlist(product.id || (product as any)._id) ? 'fill-red-500 text-red-500' : 'stroke-[2.2]'}`} />
              </button>
              <button 
                onClick={handleShare}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-white/95 dark:bg-[#1E1713]/95 border-2 border-[#DFCDB7] dark:border-[#38261C] text-[#241812] dark:text-[#F7F5F0] hover:border-[#C49A50] hover:text-[#C49A50] rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                aria-label="Share Piece"
                title="Share this creation"
              >
                <Send className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* Amazon-Style Thumbnail Strip (Shows all product & styling photos) */}
          {allProductImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1 scrollbar-hide">
              {allProductImages.map((img: string, idx: number) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-gradient-to-b from-[#EDE5D8] to-[#E0D3BE] dark:from-[#261D15] dark:to-[#1E1510] ${
                      isActive 
                        ? 'border-[#C49A50] ring-2 ring-[#C49A50]/50 scale-105 shadow-md z-10' 
                        : 'border-[#DFCDB7] dark:border-[#38261C] opacity-70 hover:opacity-100 hover:border-[#C49A50]'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`} 
                      fill 
                      className="object-contain p-1" 
                    />
                    {idx > 0 && (
                      <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[9px] font-bold text-white px-1 rounded">
                        #{idx}
                      </span>
                    )}
                  </button>
                );
              })}
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
                  <div className="relative aspect-square bg-white/60 dark:bg-[#1E1713]/60 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                    <Image src={p.image} alt={p.name} fill className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500" />
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

      {/* Back to Home & Explore Full Catalog Banner */}
      <div className="max-w-[1300px] mx-auto w-full px-4 sm:px-8 mt-6 mb-16">
        <div className="bg-gradient-to-r from-[#241812] via-[#38261C] to-[#241812] p-6 sm:p-9 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-[#C49A50]/30 relative overflow-hidden">
          <div className="relative z-10 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C49A50] mb-1.5 block">
              Handcrafted With Tamil Woodcraft Heritage
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-playfair text-[#F7F5F0] mb-2">
              Discover More From Kaashta Crafts
            </h3>
            <p className="text-xs sm:text-sm text-[#E0D3BE] max-w-xl leading-relaxed">
              Shared this piece with family or friends? Explore our full collection of teak desk suites, sacred home decor, and culinary serving boards.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3 shrink-0 justify-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-[#C49A50] hover:bg-[#D4AF37] text-[#241812] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F5F0] border border-white/20 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse All Creations</span>
            </Link>
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

      {/* Main Image Zoom Lightbox */}
      {isMainZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
          onClick={() => setIsMainZoomOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsMainZoomOpen(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
              aria-label="Close Zoom"
            >
              <X className="w-5 h-5" />
            </button>

            {allProductImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-2 sm:left-4 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 sm:right-4 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden">
              <Image
                src={allProductImages[activeImageIndex] || product.image}
                alt={`${product.name} view ${activeImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-5 py-2 rounded-full text-xs font-semibold text-white/90 border border-white/10 shadow-lg">
              {product.name} • View {activeImageIndex + 1} of {allProductImages.length}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
