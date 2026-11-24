"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  ShoppingCart, 
  Loader2, 
  Heart, 
  Star, 
  Sparkles, 
  Truck, 
  Leaf, 
  Check, 
  Copy, 
  Flame, 
  ArrowRight,
  TrendingUp,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import { Product } from "./products/page";

// Swiper imports for Carousels
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const categories = [
  { 
    name: "Top Offers", 
    tag: "Curated Drops", 
    image: "/top-offers.jpg", 
    href: "/products" 
  },
  { 
    name: "Desk & Office", 
    tag: "Executive Suite", 
    image: "/desk-accessories.jpg", 
    href: "/products?category=Desk Accessories" 
  },
  { 
    name: "Home Decor", 
    tag: "Sanctuary Pieces", 
    image: "/home-decor.jpg", 
    href: "/products?category=Home Decor" 
  },
  { 
    name: "Kitchen & Dining", 
    tag: "Culinary Art", 
    image: "/kitchen.jpg", 
    href: "/products?category=Kitchen" 
  },
  { 
    name: "Stationery", 
    tag: "Minimalist Blocks", 
    image: "/stationery.jpg", 
    href: "/products?category=Stationery" 
  },
  { 
    name: "Gifts & Curios", 
    tag: "Bespoke Tokens", 
    image: "/gifts.jpg", 
    href: "/products" 
  },
];

const testimonials = [
  {
    name: "Vikram Rathore",
    city: "Bangalore",
    review: "The finish on the teak desk organizer is beyond words. You can feel the natural wood grain and subtle beeswax aroma. Truly an heirloom piece.",
    rating: 5,
    item: "Executive Desk Suite"
  },
  {
    name: "Ananya Iyer",
    city: "Chennai",
    review: "Bought the wooden wall art and tea-light holders. The packaging was eco-friendly and safe, and the carving detail is unmatched in this price range.",
    rating: 5,
    item: "Artisan Wall Decor"
  },
  {
    name: "Rajesh Sharma",
    city: "Mumbai",
    review: "Pure seasoned hardwood with zero cheap MDF. Super solid and premium tactile weight. Kaashta Crafts has become my standard for corporate gifting.",
    rating: 5,
    item: "Solid Acacia Platters"
  }
];

export default function Home() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success(`Privilege voucher ${code} copied!`);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const pid = product.id || (product as any)._id;
    toggleWishlist(product);
    if (isInWishlist(pid)) {
      toast.info(`Removed from saved pieces`);
    } else {
      toast.success(`Added to your private wishlist!`);
    }
  };

  const filteredProducts = selectedFilter === "All"
    ? allProducts
    : allProducts.filter(p => p.category?.toLowerCase() === selectedFilter.toLowerCase());

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0]">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#C49A50]/30 border-t-[#C49A50] animate-spin" />
          <Sparkles className="w-6 h-6 text-[#C49A50] absolute animate-pulse" />
        </div>
        <p className="font-playfair text-lg tracking-wider text-[#65452F] dark:text-[#C49A50] font-medium">
          Curating Handcrafted Masterpieces...
        </p>
      </div>
    );
  }

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] transition-colors duration-300 overflow-x-hidden font-sans">
      
      {/* 🌟 Atmospheric Ambient Lighting (Editorial Champagne & Antique Gold) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#EAE1D2]/60 via-[#F7F5F0]/20 to-transparent dark:from-[#2E241E]/40 dark:via-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[850px] -right-24 w-[500px] h-[500px] bg-[#EAE1D2]/40 dark:bg-[#2E241E]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[1800px] -left-24 w-[500px] h-[500px] bg-[#EAE1D2]/30 dark:bg-[#241812]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. TOP ANNOUNCEMENT TICKER (Deep Espresso & Antique Gold) */}
      <div className="w-full bg-[#241812] text-[#F7F5F0] text-xs py-2.5 px-4 overflow-hidden border-b border-[#38261C] select-none shadow-xs">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 font-sans tracking-wide">
          <div className="flex items-center gap-2.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#C49A50] animate-pulse" />
            <span className="font-bold text-[#C49A50] uppercase tracking-[0.15em] text-[11px]">HANDCRAFTED IN INDIA</span>
            <span className="hidden md:inline text-[#82786E]">• 100% Solid Seasoned Hardwood</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#82786E] hidden sm:inline">Complimentary Welcome Privilege:</span>
            <button 
              onClick={() => copyPromoCode("KAASHTA10")}
              className="bg-[#38261C] hover:bg-[#4D3528] border border-[#C49A50]/50 text-[#C49A50] px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              KAASHTA10
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
            <span className="text-[#C49A50] font-semibold">10% OFF</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[#82786E]">
            <Truck className="w-3.5 h-3.5 text-[#C49A50]" />
            <span>Free Express Shipping Across India</span>
          </div>
        </div>
      </div>

      {/* 2. REFINED CATEGORIES BAR (Warm Ivory & Soft Champagne Capsule Strips) */}
      <section className="w-full bg-[#F7F5F0]/85 dark:bg-[#14100E]/85 backdrop-blur-md border-b border-[#EAE1D2] dark:border-[#2E241E] sticky top-[69px] z-30 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-3 md:gap-4 min-w-max mx-auto justify-start sm:justify-center">
            {categories.map((cat, idx) => (
              <Link 
                href={cat.href} 
                key={idx} 
                className="group flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/80 dark:bg-[#1E1713]/80 border border-[#EAE1D2] dark:border-[#2E241E] hover:border-[#C49A50] dark:hover:border-[#C49A50] hover:bg-white dark:hover:bg-[#2E241E] transition-all duration-300 shadow-2xs hover:shadow-xs"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#EAE1D2] dark:ring-[#2E241E] group-hover:ring-[#C49A50] transition-all">
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-semibold tracking-tight text-[#241812] dark:text-[#F7F5F0] group-hover:text-[#65452F] dark:group-hover:text-[#C49A50] transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-[#82786E] dark:text-[#A39A90] font-medium">
                    {cat.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HERO SHOWCASE (Cinematic Editorial Split Carousel - Mobile Optimized) */}
      <section className="w-full max-w-[1400px] mx-auto px-4 pt-4 md:pt-8 pb-2 md:pb-4">
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#241812] shadow-xl border border-[#38261C]">
          
          {/* Subtle Warm Spotlight */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C49A50]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#65452F]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Visual Swiper */}
          <div className="w-full h-[460px] sm:h-[480px] md:h-[530px] lg:h-[590px] relative">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ 
                clickable: true,
                dynamicBullets: true
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              style={{
                "--swiper-pagination-color": "#C49A50",
                "--swiper-pagination-bullet-inactive-color": "#82786E",
              } as any}
              className="w-full h-full"
            >
              {/* Slide 1 */}
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image 
                    src="/banner1.jpg" 
                    alt="Master Woodcraft" 
                    fill 
                    priority 
                    className="object-cover opacity-85 hover:scale-102 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C130D]/95 via-[#241812]/80 to-[#241812]/30 md:bg-gradient-to-r md:from-[#241812]/95 md:via-[#241812]/65 md:to-transparent" />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-center px-5 py-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl pb-12 sm:pb-10 md:pb-14">
                    <span className="inline-flex items-center gap-1.5 bg-[#C49A50]/20 backdrop-blur-md text-[#C49A50] border border-[#C49A50]/40 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full w-fit mb-2.5 sm:mb-3 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      Artisanal Heritage Collections
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-[#F7F5F0] tracking-tight leading-[1.18] sm:leading-[1.12] mb-2 sm:mb-4">
                      Artistry in Every Grain. <br/>
                      <span className="text-[#C49A50]">
                        Soul in Every Curve.
                      </span>
                    </h1>
                    <p className="text-[#EAE1D2]/85 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 font-sans line-clamp-2 sm:line-clamp-3 max-w-xl">
                      Thoughtfully sculpted from sustainably seasoned teak and sheesham. Designed to infuse organic warmth, dignity, and calm into modern living spaces.
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                      <Link 
                        href="/products" 
                        className="bg-[#C49A50] hover:bg-[#D4AF37] text-[#241812] font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-xs sm:text-sm cursor-pointer"
                      >
                        Explore Masterpieces
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Link>
                      <Link 
                        href="/products?category=Desk Accessories" 
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-[#F7F5F0] border border-white/20 font-semibold px-4 py-2.5 sm:px-5 sm:py-3 rounded-full flex items-center gap-2 transition-all text-xs sm:text-sm hover:-translate-y-0.5 cursor-pointer"
                      >
                        Executive Desk Suite
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 2 */}
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image 
                    src="/banner2.jpg" 
                    alt="Curated Wooden Decor" 
                    fill 
                    className="object-cover opacity-85 hover:scale-102 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C130D]/95 via-[#241812]/80 to-[#241812]/30 md:bg-gradient-to-r md:from-[#241812]/95 md:via-[#241812]/65 md:to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-center px-5 py-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl pb-12 sm:pb-10 md:pb-14">
                    <span className="inline-flex items-center gap-1.5 bg-[#C49A50]/20 backdrop-blur-md text-[#C49A50] border border-[#C49A50]/40 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full w-fit mb-2.5 sm:mb-3 uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5" />
                      Limited Batch Edition
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-[#F7F5F0] tracking-tight leading-[1.18] sm:leading-[1.12] mb-2 sm:mb-4">
                      Handcrafted Warmth <br/>
                      <span className="text-[#C49A50]">
                        For Your Sanctuary.
                      </span>
                    </h2>
                    <p className="text-[#EAE1D2]/85 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 font-sans line-clamp-2 sm:line-clamp-3 max-w-xl">
                      Each piece is hand-rubbed with natural botanical oils, preserving the golden richness and authentic tactile feel of real timber.
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                      <Link 
                        href="/products" 
                        className="bg-[#C49A50] hover:bg-[#D4AF37] text-[#241812] font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 shadow-lg transition-all text-xs sm:text-sm cursor-pointer"
                      >
                        Shop All Collections
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 3 */}
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image 
                    src="/banner3.jpg" 
                    alt="Kitchen & Dining Art" 
                    fill 
                    className="object-cover opacity-85 hover:scale-102 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C130D]/95 via-[#241812]/80 to-[#241812]/30 md:bg-gradient-to-r md:from-[#241812]/95 md:via-[#241812]/65 md:to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-center px-5 py-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl pb-12 sm:pb-10 md:pb-14">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full w-fit mb-2.5 sm:mb-3 uppercase tracking-wider">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                      100% Food-Safe & Organic
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-[#F7F5F0] tracking-tight leading-[1.18] sm:leading-[1.12] mb-2 sm:mb-4">
                      Dining Sculptures <br/>
                      <span className="text-[#C49A50]">
                        Carved To Endure.
                      </span>
                    </h2>
                    <p className="text-[#EAE1D2]/85 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 font-sans line-clamp-2 sm:line-clamp-3 max-w-xl">
                      Turn everyday dining and hosting into an unforgettable sensory ritual with hand-turned acacia boards and artisanal platters.
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                      <Link 
                        href="/products?category=Kitchen" 
                        className="bg-[#C49A50] hover:bg-[#D4AF37] text-[#241812] font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 shadow-lg transition-all text-xs sm:text-sm cursor-pointer"
                      >
                        Explore Dining Art
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            {/* Floating Glass Stats Bar */}
            <div className="hidden lg:flex absolute bottom-6 right-8 z-20 items-center gap-6 bg-[#241812]/85 backdrop-blur-xl border border-[#38261C] px-6 py-3.5 rounded-2xl shadow-2xl">
              <div className="flex flex-col">
                <span className="text-[#C49A50] font-bold text-lg leading-tight">4.9 ★</span>
                <span className="text-[#82786E] text-[11px]">2,500+ Reviews</span>
              </div>
              <div className="h-8 w-[1px] bg-[#38261C]" />
              <div className="flex flex-col">
                <span className="text-[#F7F5F0] font-bold text-lg leading-tight">100%</span>
                <span className="text-[#82786E] text-[11px]">Solid Hardwood</span>
              </div>
              <div className="h-8 w-[1px] bg-[#38261C]" />
              <div className="flex flex-col">
                <span className="text-emerald-400 font-bold text-lg leading-tight">0%</span>
                <span className="text-[#82786E] text-[11px]">Chemical Sealants</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE CURATED SHOWCASE (Filterable Tabs + FULLY CLICKABLE Product Cards) */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#C49A50] text-xs font-bold uppercase tracking-[0.18em] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Treasures</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-[#241812] dark:text-[#F7F5F0] tracking-tight">
              Best of Kaashta Crafts
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {["All", "Desk Accessories", "Home Decor", "Kitchen", "Stationery"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  selectedFilter === cat
                    ? "bg-[#241812] text-[#F7F5F0] dark:bg-[#C49A50] dark:text-[#241812] shadow-sm font-bold"
                    : "bg-white/80 dark:bg-[#1E1713] text-[#82786E] dark:text-[#A39A90] border border-[#EAE1D2] dark:border-[#2E241E] hover:border-[#C49A50]/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - EVERY PRODUCT IS FULLY CLICKABLE */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.slice(0, 8).map((product) => {
            const productId = product.id || (product as any)._id;
            const isSaved = isInWishlist(productId);
            const originalPrice = product.originalPrice || Math.floor(product.price * 1.5);
            const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

            return (
              <div 
                key={productId}
                className="group relative flex flex-col bg-white/85 dark:bg-[#1E1713]/85 rounded-2xl p-3 sm:p-4 border border-[#EAE1D2] dark:border-[#2E241E] hover:border-[#C49A50] transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-1"
              >
                {/* 🎯 CLICKABLE IMAGE CONTAINER: Navigates straight to Product Details Page */}
                <Link 
                  href={`/products/${productId}`}
                  className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#EAE1D2]/40 dark:bg-[#2E241E]/40 mb-3 block cursor-pointer"
                >
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-108 transition-transform duration-700" 
                  />
                  
                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-[#241812] dark:bg-[#C49A50] text-[#F7F5F0] dark:text-[#241812] text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider z-10">
                      {discountPercent}% OFF
                    </span>
                  )}

                  {/* Elegant "View Details" Pill Hover Reveal */}
                  <div className="absolute inset-0 bg-[#241812]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 z-10">
                    <span className="bg-[#F7F5F0]/95 dark:bg-[#1E1713]/95 backdrop-blur-md text-[#241812] dark:text-[#F7F5F0] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      View Details <ArrowRight className="w-3.5 h-3.5 text-[#C49A50]" />
                    </span>
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    aria-label="Save to Wishlist"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-[#1E1713]/90 backdrop-blur-md flex items-center justify-center text-[#241812] dark:text-[#F7F5F0] hover:scale-110 active:scale-95 transition-all shadow-xs z-20 cursor-pointer"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        isSaved ? "fill-red-500 text-red-500" : "hover:text-red-500"
                      }`} 
                    />
                  </button>
                </Link>

                {/* Product Meta Info */}
                <div className="flex flex-col flex-grow">
                  <span className="text-[10px] font-semibold text-[#C49A50] uppercase tracking-[0.16em] mb-1">
                    {product.category}
                  </span>
                  
                  {/* 🎯 CLICKABLE TITLE: Navigates straight to Product Details Page */}
                  <Link 
                    href={`/products/${productId}`} 
                    className="block group-hover:text-[#65452F] dark:group-hover:text-[#C49A50] transition-colors"
                  >
                    <h3 className="font-bold text-sm sm:text-base text-[#241812] dark:text-[#F7F5F0] line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="flex items-center text-[#C49A50]">
                      <Star className="w-3.5 h-3.5 fill-[#C49A50]" />
                    </div>
                    <span className="text-xs font-bold text-[#241812] dark:text-[#F7F5F0]">
                      {product.rating || 4.9}
                    </span>
                    <span className="text-[11px] text-[#82786E]">
                      ({product.numReviews || 38})
                    </span>
                  </div>

                  {/* Pricing & Add to Cart Action */}
                  <div className="mt-auto pt-2 flex items-center justify-between border-t border-[#EAE1D2]/80 dark:border-[#2E241E]/80">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-bold text-[#241812] dark:text-[#F7F5F0]">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-[#82786E] line-through">
                          ₹{originalPrice}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        Free Delivery
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      aria-label="Add to cart"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] text-[#F7F5F0] dark:text-[#241812] flex items-center justify-center transition-all duration-300 shadow-xs hover:shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] text-[#F7F5F0] dark:text-[#241812] font-bold px-8 py-3.5 rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm cursor-pointer"
          >
            Explore Complete Catalog ({allProducts.length}+ Pieces)
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. EDITORIAL BENTO SPOTLIGHT (Living & Workspace Suites) */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[#C49A50] text-xs font-bold uppercase tracking-[0.2em]">
            Curated Living Concept
          </span>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#241812] dark:text-[#F7F5F0] mt-1.5">
            Elevate Every Corner
          </h2>
          <p className="text-[#82786E] dark:text-[#A39A90] text-sm mt-2">
            Signature artisan series tailored for the contemporary home and executive workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <Link 
            href="/products?category=Desk Accessories"
            className="group relative h-[360px] rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-[#EAE1D2] dark:border-[#2E241E] shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer"
          >
            <Image 
              src="/desk-accessories.jpg" 
              alt="Executive Desk Series" 
              fill 
              className="object-cover group-hover:scale-108 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241812]/90 via-[#241812]/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-[#C49A50] text-xs font-bold uppercase tracking-wider mb-2 block">
                Workspace Luxury
              </span>
              <h3 className="text-2xl font-playfair font-bold text-[#F7F5F0] mb-2">
                The Executive Desk Suite
              </h3>
              <p className="text-[#EAE1D2]/80 text-xs line-clamp-2 mb-4 font-sans">
                Solid oak and teak docks, cable organizers, and stationery blocks engineered for calm focus.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#C49A50] group-hover:translate-x-1 transition-transform">
                Shop Workspace →
              </span>
            </div>
          </Link>

          {/* Card 2 */}
          <Link 
            href="/products?category=Home Decor"
            className="group relative h-[360px] rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-[#EAE1D2] dark:border-[#2E241E] shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer"
          >
            <Image 
              src="/home-decor.jpg" 
              alt="Aesthetic Living" 
              fill 
              className="object-cover group-hover:scale-108 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241812]/90 via-[#241812]/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-[#C49A50] text-xs font-bold uppercase tracking-wider mb-2 block">
                Warm Sanctuary
              </span>
              <h3 className="text-2xl font-playfair font-bold text-[#F7F5F0] mb-2">
                Sacred & Ambient Living
              </h3>
              <p className="text-[#EAE1D2]/80 text-xs line-clamp-2 mb-4 font-sans">
                Hand-carved tea light lattices, geometric wall sculptures, and tranquil tabletop accents.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#C49A50] group-hover:translate-x-1 transition-transform">
                Shop Living Decor →
              </span>
            </div>
          </Link>

          {/* Card 3 */}
          <Link 
            href="/products?category=Kitchen"
            className="group relative h-[360px] rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-[#EAE1D2] dark:border-[#2E241E] shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer"
          >
            <Image 
              src="/kitchen.jpg" 
              alt="Kitchen & Dining" 
              fill 
              className="object-cover group-hover:scale-108 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241812]/90 via-[#241812]/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-[#C49A50] text-xs font-bold uppercase tracking-wider mb-2 block">
                Culinary Rituals
              </span>
              <h3 className="text-2xl font-playfair font-bold text-[#F7F5F0] mb-2">
                Artisanal Kitchen & Serving
              </h3>
              <p className="text-[#EAE1D2]/80 text-xs line-clamp-2 mb-4 font-sans">
                Food-grade acacia cheese platters, spice cellars, and hand-turned wooden serving trays.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#C49A50] group-hover:translate-x-1 transition-transform">
                Shop Dining Art →
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* 7. CINEMATIC HERITAGE STORY BANNER */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-8">
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#241812] border border-[#38261C] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-xl">
          
          <div className="max-w-xl">
            <span className="text-[#C49A50] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
              Behind the Chisel • Our Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-[#F7F5F0] leading-tight mb-4">
              "Wood carries the memory of ancient forests."
            </h2>
            <p className="text-[#EAE1D2]/85 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              In an age of disposable plastics, we stand for enduring heirloom quality, tactile warmth, and soul. Every piece at Kaashta Crafts passes through dozens of meticulous hands—shaping, smoothing, seasoning, and polishing with natural beeswax.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#38261C]">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-playfair text-[#C49A50]">40+</span>
                <p className="text-[#82786E] text-xs mt-1">Master Woodcarvers</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-playfair text-[#C49A50]">100%</span>
                <p className="text-[#82786E] text-xs mt-1">Ethical Foresting</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-playfair text-[#C49A50]">10k+</span>
                <p className="text-[#82786E] text-xs mt-1">Spaces Enriched</p>
              </div>
            </div>
          </div>

          <div className="relative w-full sm:w-[380px] lg:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[#C49A50]/40 shadow-xl shrink-0">
            <Image 
              src="/hero_wood.png" 
              alt="Artisan Crafting Wood" 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-[#241812]/80 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs text-[#F7F5F0]">
              <span>Handcrafted in Tamil Nadu, India</span>
              <span className="text-[#C49A50] font-bold">Authentic Guild</span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. SOCIAL PROOF & VERIFIED REVIEWS */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-1 text-[#C49A50] mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#C49A50]" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-[#241812] dark:text-[#F7F5F0]">
            Loved By Over 5,000+ Patrons
          </h2>
          <p className="text-[#82786E] dark:text-[#A39A90] text-xs sm:text-sm mt-1">
            Real stories from homes and offices transformed by Kaashta Crafts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-white/80 dark:bg-[#1E1713]/80 border border-[#EAE1D2] dark:border-[#2E241E] flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center gap-1 text-[#C49A50] mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C49A50]" />
                  ))}
                </div>
                <p className="text-[#241812]/90 dark:text-[#F7F5F0]/90 text-sm leading-relaxed mb-4 italic font-sans">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE1D2]/80 dark:border-[#2E241E]/80 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#241812] dark:text-[#F7F5F0]">{t.name}</h4>
                  <span className="text-[#82786E]">{t.city}</span>
                </div>
                <span className="bg-[#EAE1D2]/60 dark:bg-[#2E241E] text-[#65452F] dark:text-[#C49A50] font-semibold px-2.5 py-1 rounded-md text-[10px]">
                  {t.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. VIP PROMO CODE PRIVILEGE BANNER */}
      <section className="w-full max-w-[1400px] mx-auto px-4 pb-14">
        <div className="w-full bg-[#241812] rounded-3xl p-8 sm:p-12 text-center text-[#F7F5F0] border border-[#C49A50]/30 relative overflow-hidden shadow-xl">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C49A50]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="bg-[#C49A50]/20 text-[#C49A50] border border-[#C49A50]/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-[0.18em] mb-4">
              First Time Collector?
            </span>
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-[#F7F5F0] mb-3">
              Claim Your 10% Welcome Privilege
            </h2>
            <p className="text-[#EAE1D2]/80 text-sm mb-6 max-w-md">
              Apply this privilege coupon at checkout to enjoy an instant discount on your first artisanal wooden creation.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <div className="flex items-center gap-2 bg-[#1A110D] border-2 border-dashed border-[#C49A50]/60 px-6 py-3 rounded-2xl">
                <span className="font-mono text-lg font-extrabold tracking-widest text-[#C49A50]">
                  KAASHTA10
                </span>
                <button
                  onClick={() => copyPromoCode("KAASHTA10")}
                  className="ml-3 bg-[#C49A50] hover:bg-[#D4AF37] text-[#241812] p-2 rounded-xl transition-all cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <Link
                href="/products"
                className="bg-[#C49A50] hover:bg-[#D4AF37] text-[#241812] font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all text-sm cursor-pointer"
              >
                Start Shopping Now →
              </Link>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
