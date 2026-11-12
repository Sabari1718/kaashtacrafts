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
  ShieldCheck, 
  Truck, 
  Leaf, 
  Award, 
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
    tag: "Hot Deals", 
    image: "/top-offers.jpg", 
    href: "/products" 
  },
  { 
    name: "Desk & Office", 
    tag: "Executive", 
    image: "/desk-accessories.jpg", 
    href: "/products?category=Desk Accessories" 
  },
  { 
    name: "Home Decor", 
    tag: "Aesthetic", 
    image: "/home-decor.jpg", 
    href: "/products?category=Home Decor" 
  },
  { 
    name: "Kitchen & Dining", 
    tag: "Artisan", 
    image: "/kitchen.jpg", 
    href: "/products?category=Kitchen" 
  },
  { 
    name: "Stationery", 
    tag: "Minimalist", 
    image: "/stationery.jpg", 
    href: "/products?category=Stationery" 
  },
  { 
    name: "Gifts & Curios", 
    tag: "Bespoke", 
    image: "/gifts.jpg", 
    href: "/products" 
  },
];

const testimonials = [
  {
    name: "Vikram Rathore",
    city: "Bangalore",
    review: "The finish on the teak desk organizer is beyond words. You can feel the natural wood grain and subtle beeswax aroma. Truly a masterpiece!",
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
    review: "Pure hardwood, no cheap MDF nonsense. Super solid and premium. Kaashta Crafts has become my go-to for corporate and personal gifting.",
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
    toast.success(`Coupon code ${code} copied to clipboard!`);
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
    toggleWishlist(product);
    if (isInWishlist(product.id)) {
      toast.info(`Removed from wishlist`);
    } else {
      toast.success(`Saved to your wishlist!`);
    }
  };

  const filteredProducts = selectedFilter === "All"
    ? allProducts
    : allProducts.filter(p => p.category?.toLowerCase() === selectedFilter.toLowerCase());

  const trendingProducts = allProducts.slice(0, 8);
  const newArrivals = allProducts.slice(4, 12);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-900 text-stone-200">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
          <Sparkles className="w-8 h-8 text-amber-500 absolute animate-pulse" />
        </div>
        <p className="font-playfair text-xl tracking-wider text-amber-200/90 font-medium animate-pulse">
          Curating Handcrafted Masterpieces...
        </p>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#faf8f5] dark:bg-[#0e0e0e] text-stone-900 dark:text-stone-100 transition-colors duration-300">
      
      {/* 1. TOP ANNOUNCEMENT TICKER (Luxury Marquee Bar) */}
      <div className="w-full bg-gradient-to-r from-stone-950 via-amber-950 to-stone-950 text-amber-200 text-xs py-2.5 px-4 overflow-hidden border-b border-amber-900/40 select-none shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-sans tracking-wide">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-amber-400">HANDCRAFTED IN INDIA</span>
            <span className="hidden md:inline text-stone-400">• 100% Solid Seasoned Hardwood</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-300 hidden sm:inline">Use code</span>
            <button 
              onClick={() => copyPromoCode("KAASHTA10")}
              className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              KAASHTA10
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
            <span className="text-amber-400 font-semibold">10% OFF</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-stone-300">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Free Express Delivery Above ₹999</span>
          </div>
        </div>
      </div>

      {/* 2. REFINED CATEGORIES BAR (Modern Luxury Capsule Story Strips) */}
      <section className="w-full bg-white/90 dark:bg-[#141414]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 sticky top-[69px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-3 md:gap-5 min-w-max mx-auto justify-start sm:justify-center">
            {categories.map((cat, idx) => (
              <Link 
                href={cat.href} 
                key={idx} 
                className="group flex items-center gap-3 p-1.5 pr-4 rounded-full bg-stone-50 dark:bg-stone-900/80 border border-stone-200/70 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all duration-300 shadow-2xs hover:shadow-md"
              >
                <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden ring-2 ring-stone-200 dark:ring-stone-800 group-hover:ring-amber-500 transition-all">
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-semibold tracking-tight text-stone-800 dark:text-stone-200 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium group-hover:text-amber-600 dark:group-hover:text-amber-500">
                    {cat.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HERO SHOWCASE (Cinematic Artisan Split & Carousel) */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-6 md:pt-8 pb-4">
        <div className="relative w-full rounded-3xl overflow-hidden bg-stone-950 shadow-2xl border border-stone-800/80">
          
          {/* Background Ambient Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-800/20 rounded-full blur-3xl pointer-events-none" />

          {/* Swiper Visual Carousel */}
          <div className="w-full h-[380px] sm:h-[450px] md:h-[520px] lg:h-[580px] relative">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ 
                clickable: true,
                dynamicBullets: true
              }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              loop={true}
              style={{
                "--swiper-pagination-color": "#d97706",
                "--swiper-pagination-bullet-inactive-color": "#78716c",
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
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-950/95 via-stone-950/60 to-transparent" />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl">
                    <span className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1.5 rounded-full w-fit mb-3 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Artisanal Heritage Collections
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white tracking-tight leading-[1.15] mb-4">
                      Artistry in Every Grain. <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                        Soul in Every Curve.
                      </span>
                    </h1>
                    <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-sans line-clamp-2 sm:line-clamp-3 max-w-xl">
                      Thoughtfully sculpted from sustainably seasoned teak and sheesham. Designed to infuse organic warmth, dignity, and calm into modern living spaces.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link 
                        href="/products" 
                        className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-600/30 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all text-sm md:text-base"
                      >
                        Explore Masterpieces
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link 
                        href="/products?category=Desk Accessories" 
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-semibold px-5 py-3 rounded-xl flex items-center gap-2 transition-all text-sm md:text-base hover:-translate-y-0.5"
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
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-950/95 via-stone-950/60 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl">
                    <span className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1.5 rounded-full w-fit mb-3 uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      Limited Batch Edition
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white tracking-tight leading-[1.15] mb-4">
                      Handcrafted Warmth <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                        For Your Sanctuary.
                      </span>
                    </h2>
                    <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-sans max-w-xl">
                      Each piece is hand-rubbed with natural botanical oils, preserving the golden richness and authentic tactile feel of real timber.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link 
                        href="/products" 
                        className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all text-sm"
                      >
                        Shop All Collections
                        <ArrowRight className="w-4 h-4" />
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
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-950/95 via-stone-950/60 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl">
                    <span className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-3 py-1.5 rounded-full w-fit mb-3 uppercase tracking-wider">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                      100% Food-Safe & Organic
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white tracking-tight leading-[1.15] mb-4">
                      Dining Sculptures <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                        Carved To Endure.
                      </span>
                    </h2>
                    <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-sans max-w-xl">
                      Turn everyday dining and hosting into an unforgettable sensory ritual with hand-turned acacia boards and artisanal platters.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link 
                        href="/products?category=Kitchen" 
                        className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all text-sm"
                      >
                        Explore Dining Art
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            {/* Floating Glass Stats Bar */}
            <div className="hidden lg:flex absolute bottom-6 right-8 z-20 items-center gap-6 bg-stone-900/80 backdrop-blur-xl border border-white/10 px-6 py-3.5 rounded-2xl shadow-2xl">
              <div className="flex flex-col">
                <span className="text-amber-400 font-bold text-lg leading-tight">4.9 ★</span>
                <span className="text-stone-400 text-[11px]">2,500+ Reviews</span>
              </div>
              <div className="h-8 w-[1px] bg-stone-700" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight">100%</span>
                <span className="text-stone-400 text-[11px]">Solid Hardwood</span>
              </div>
              <div className="h-8 w-[1px] bg-stone-700" />
              <div className="flex flex-col">
                <span className="text-emerald-400 font-bold text-lg leading-tight">0%</span>
                <span className="text-stone-400 text-[11px]">Toxic Chemicals</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE KAASHTA STANDARD (Trust & Value Proposition Grid) */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-500/50 transition-all shadow-xs hover:shadow-md group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">100% Solid Seasoned Wood</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Zero MDF, particle board or cheap ply. Genuine solid hardwood built for lifetimes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-500/50 transition-all shadow-xs hover:shadow-md group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">Organic Botanical Finish</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Polished with food-safe cold pressed plant oils and organic raw beeswax.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-500/50 transition-all shadow-xs hover:shadow-md group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">Safe Cushion Transit</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Eco-cushioned shockproof transit packaging with 100% breakage replacement.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-500/50 transition-all shadow-xs hover:shadow-md group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">Artisan Community</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Directly sustaining traditional Indian woodworking guilds and hereditary crafts.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE CURATED SHOWCASE (Filterable Tabs + Elite Product Cards) */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Handcrafted Treasures</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-stone-900 dark:text-stone-100 tracking-tight">
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
                    ? "bg-amber-600 text-stone-950 shadow-md shadow-amber-600/30 scale-105"
                    : "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid / Swiper */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.slice(0, 8).map((product) => {
            const isSaved = isInWishlist(product.id);
            const originalPrice = product.originalPrice || Math.floor(product.price * 1.5);
            const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

            return (
              <div 
                key={product.id}
                className="group relative flex flex-col bg-white dark:bg-[#141414] rounded-2xl p-3 sm:p-4 border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-500/60 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image Container with Badges & Wishlist Button */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 mb-3">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-108 transition-transform duration-700" 
                  />
                  
                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-amber-600 text-stone-950 text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                      {discountPercent}% OFF
                    </span>
                  )}

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    aria-label="Save to Wishlist"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md flex items-center justify-center text-stone-700 dark:text-stone-300 hover:scale-110 active:scale-95 transition-all shadow-md z-10 cursor-pointer"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        isSaved ? "fill-red-500 text-red-500" : "hover:text-red-500"
                      }`} 
                    />
                  </button>
                </div>

                {/* Product Meta */}
                <div className="flex flex-col flex-grow">
                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                    {product.category}
                  </span>
                  
                  <Link href={`/products/${product.id}`} className="hover:text-amber-600 transition-colors">
                    <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                    </div>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      {product.rating || 4.9}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      ({product.numReviews || 38})
                    </span>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-auto pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800/60">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-bold text-stone-950 dark:text-white">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-stone-400 line-through">
                          ₹{originalPrice}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Free Delivery
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      aria-label="Add to cart"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-amber-600 dark:hover:bg-amber-600 text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group-hover:scale-105"
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
            className="inline-flex items-center gap-2 bg-stone-950 dark:bg-white text-white dark:text-stone-950 font-bold px-8 py-3.5 rounded-full hover:bg-amber-600 dark:hover:bg-amber-400 dark:hover:text-stone-950 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
          >
            Explore Complete Catalog ({allProducts.length}+ Pieces)
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. EDITORIAL BENTO SPOTLIGHT (Living & Workspace Suites) */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">
            Curated Living Concept
          </span>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-stone-900 dark:text-stone-100 mt-2">
            Elevate Every Corner
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-2">
            Signature artisan series tailored for the contemporary home and executive workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <Link 
            href="/products?category=Desk Accessories"
            className="group relative h-[360px] rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-stone-200/60 dark:border-stone-800 shadow-md hover:shadow-2xl transition-all duration-500"
          >
            <Image 
              src="/desk-accessories.jpg" 
              alt="Executive Desk Series" 
              fill 
              className="object-cover group-hover:scale-108 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                Workspace Luxury
              </span>
              <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                The Executive Desk Suite
              </h3>
              <p className="text-stone-300 text-xs line-clamp-2 mb-4 font-sans">
                Solid oak and teak docks, cable organizers, and stationery blocks engineered for calm focus.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                Shop Workspace →
              </span>
            </div>
          </Link>

          {/* Card 2 */}
          <Link 
            href="/products?category=Home Decor"
            className="group relative h-[360px] rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-stone-200/60 dark:border-stone-800 shadow-md hover:shadow-2xl transition-all duration-500"
          >
            <Image 
              src="/home-decor.jpg" 
              alt="Aesthetic Living" 
              fill 
              className="object-cover group-hover:scale-108 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                Warm Sanctuary
              </span>
              <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                Sacred & Ambient Living
              </h3>
              <p className="text-stone-300 text-xs line-clamp-2 mb-4 font-sans">
                Hand-carved tea light lattices, geometric wall sculptures, and tranquil tabletop accents.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                Shop Living Decor →
              </span>
            </div>
          </Link>

          {/* Card 3 */}
          <Link 
            href="/products?category=Kitchen"
            className="group relative h-[360px] rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-stone-200/60 dark:border-stone-800 shadow-md hover:shadow-2xl transition-all duration-500"
          >
            <Image 
              src="/kitchen.jpg" 
              alt="Kitchen & Dining" 
              fill 
              className="object-cover group-hover:scale-108 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                Culinary Rituals
              </span>
              <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                Artisanal Kitchen & Serving
              </h3>
              <p className="text-stone-300 text-xs line-clamp-2 mb-4 font-sans">
                Food-grade acacia cheese platters, spice cellars, and hand-turned wooden serving trays.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                Shop Dining Art →
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* 7. CINEMATIC HERITAGE STORY BANNER */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="relative w-full rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">
          
          <div className="max-w-xl">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3 block">
              Behind the Chisel • Our Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight mb-4">
              "Wood carries the memory of ancient forests."
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              In an age of cheap disposable plastics, we stand for durability, tactile warmth, and soul. Every piece at Kaashta Crafts passes through dozens of meticulous hands—shaping, smoothing, seasoning, and polishing with natural beeswax.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-stone-800">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-playfair text-amber-400">40+</span>
                <p className="text-stone-400 text-xs mt-1">Master Woodcarvers</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-playfair text-amber-400">100%</span>
                <p className="text-stone-400 text-xs mt-1">Ethical Foresting</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-playfair text-amber-400">10k+</span>
                <p className="text-stone-400 text-xs mt-1">Spaces Enriched</p>
              </div>
            </div>
          </div>

          <div className="relative w-full sm:w-[380px] lg:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden ring-2 ring-amber-500/30 shadow-2xl shrink-0">
            <Image 
              src="/hero_wood.png" 
              alt="Artisan Crafting Wood" 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-stone-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs text-stone-200">
              <span>Handcrafted in Tamil Nadu, India</span>
              <span className="text-amber-400 font-bold">Authentic Guild</span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. SOCIAL PROOF & VERIFIED REVIEWS */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-500" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-stone-900 dark:text-stone-100">
            Loved By Over 5,000+ Patrons
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
            Real stories from homes and offices transformed by Kaashta Crafts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-stone-200/80 dark:border-stone-800/80 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed mb-4 italic">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">{t.name}</h4>
                  <span className="text-stone-400">{t.city}</span>
                </div>
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold px-2.5 py-1 rounded-md text-[10px]">
                  {t.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. VIP PROMO CODE PRIVILEGE BANNER */}
      <section className="w-full max-w-7xl mx-auto px-4 pb-14">
        <div className="w-full bg-gradient-to-br from-amber-950 via-stone-950 to-amber-950 rounded-3xl p-8 sm:p-12 text-center text-white border border-amber-600/30 relative overflow-hidden shadow-2xl">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              First Time Collector?
            </span>
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-white mb-3">
              Claim Your ₹150 / 10% Welcome Discount
            </h2>
            <p className="text-stone-300 text-sm mb-6 max-w-md">
              Apply this privilege coupon at checkout to enjoy an instant discount on your first artisanal wooden creation.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <div className="flex items-center gap-2 bg-stone-900/90 border-2 border-dashed border-amber-500/60 px-6 py-3 rounded-2xl">
                <span className="font-mono text-lg font-extrabold tracking-widest text-amber-400">
                  KAASHTA10
                </span>
                <button
                  onClick={() => copyPromoCode("KAASHTA10")}
                  className="ml-3 bg-amber-500 hover:bg-amber-400 text-stone-950 p-2 rounded-xl transition-all cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <Link
                href="/products"
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-amber-600/30 transition-all text-sm"
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
