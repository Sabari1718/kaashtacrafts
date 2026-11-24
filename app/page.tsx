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
  Leaf, 
  Flame, 
  ArrowRight, 
  TrendingUp, 
  Package,
  Award,
  ShieldCheck,
  Truck,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import { Product } from "./products/page";

// Swiper imports for Carousels
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
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

export default function Home() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");

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
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8F5EF] dark:bg-[#140F0C] text-[#241710] dark:text-[#F8F5EF]">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#C69A4B]/25 border-t-[#C69A4B] animate-spin" />
          <Sparkles className="w-6 h-6 text-[#C69A4B] absolute animate-pulse" />
        </div>
        <p className="font-playfair text-lg tracking-wider text-[#38251C] dark:text-[#DFB76C] font-medium">
          Curating Handcrafted Masterpieces...
        </p>
      </div>
    );
  }

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-[#F8F5EF] dark:bg-[#140F0C] text-[#241710] dark:text-[#F8F5EF] transition-colors duration-300 overflow-x-hidden font-sans">
      
      {/* 🌟 Atmospheric Ambient Lighting Pools */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#EFE7DA]/70 via-[#E5D8C5]/30 to-transparent dark:from-[#261D17]/50 dark:via-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[850px] -right-24 w-[600px] h-[600px] bg-[#EFE7DA]/50 dark:bg-[#261D17]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[1800px] -left-24 w-[600px] h-[600px] bg-[#E5D8C5]/40 dark:bg-[#1D1510]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 2. REFINED CATEGORIES BAR (Warm Ivory & Soft Cream Capsule Strips) */}
      <section className="w-full bg-[#F4EFE6]/90 dark:bg-[#19120E]/90 backdrop-blur-md border-b border-[#E5D8C5]/70 dark:border-[#2D221A]/70 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-1.5 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-max mx-auto justify-start sm:justify-center">
            {categories.map((cat, idx) => (
              <Link 
                href={cat.href} 
                key={idx} 
                className="group flex items-center gap-2 p-1 pr-3 rounded-full bg-white/90 dark:bg-[#1D1510]/90 border border-[#E5D8C5] dark:border-[#2D221A] hover:border-[#C69A4B] dark:hover:border-[#C69A4B] hover:bg-white dark:hover:bg-[#261D17] transition-all duration-300 shadow-2xs hover:shadow-xs hover:scale-[1.02]"
              >
                <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-[#E5D8C5] dark:ring-[#2D221A] group-hover:ring-[#C69A4B] transition-all shrink-0">
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-xs font-semibold tracking-tight text-[#241710] dark:text-[#F8F5EF] group-hover:text-[#38251C] dark:group-hover:text-[#C69A4B] transition-colors leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-[#7D7368] dark:text-[#A3968A] font-medium leading-none">
                    {cat.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HERO SHOWCASE (Cinematic Luxury Furniture Editorial Carousel) */}
      <section className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 pt-2.5 pb-3 md:pb-6">
        <div className="relative w-full rounded-2xl md:rounded-[32px] overflow-hidden bg-[#1E140E] shadow-2xl border border-[#342217]">
          
          {/* Subtle Warm Spotlight */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C69A4B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#65452F]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Visual Swiper */}
          <div className="w-full h-[420px] sm:h-[460px] md:h-[520px] lg:h-[580px] relative">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ 
                clickable: true,
                dynamicBullets: true
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              style={{
                "--swiper-pagination-color": "#C69A4B",
                "--swiper-pagination-bullet-inactive-color": "#7D7368",
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
                    className="object-cover opacity-90 hover:scale-102 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140C07] via-[#1E140E]/85 to-[#1E140E]/30 md:bg-gradient-to-r md:from-[#140C07]/95 md:via-[#1E140E]/75 md:to-transparent" />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-center px-6 py-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl pb-12 sm:pb-10 md:pb-14">
                    <span className="inline-flex items-center gap-1.5 bg-[#C69A4B]/20 backdrop-blur-md text-[#DFB76C] border border-[#C69A4B]/40 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-3 uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 text-[#C69A4B]" />
                      Artisanal Heritage Collections
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-[#F8F5EF] tracking-tight leading-[1.15] sm:leading-[1.10] mb-2.5 sm:mb-4">
                      Artistry in Every Grain. <br/>
                      <span className="italic text-[#C69A4B]">
                        Soul in Every Curve.
                      </span>
                    </h1>
                    <p className="text-[#EFE7DA]/90 text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-7 font-sans line-clamp-2 sm:line-clamp-3 max-w-xl">
                      Thoughtfully sculpted from sustainably seasoned teak and sheesham. Designed to infuse organic warmth, dignity, and calm into modern living spaces.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link 
                        href="/products" 
                        className="bg-gradient-to-r from-[#C69A4B] to-[#DFB76C] hover:from-[#DFB76C] hover:to-[#C69A4B] text-[#1A110B] font-bold px-6 py-3 sm:px-7 sm:py-3.5 rounded-full flex items-center gap-2 shadow-[0_8px_20px_-4px_rgba(198,154,75,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(198,154,75,0.5)] hover:-translate-y-0.5 transition-all text-xs sm:text-sm cursor-pointer tracking-wide"
                      >
                        Explore Masterpieces
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Link>
                      <Link 
                        href="/products?category=Desk Accessories" 
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-[#F8F5EF] border border-white/20 font-semibold px-5 py-3 sm:px-6 sm:py-3.5 rounded-full flex items-center gap-2 transition-all text-xs sm:text-sm hover:-translate-y-0.5 cursor-pointer"
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
                    className="object-cover opacity-90 hover:scale-102 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140C07] via-[#1E140E]/85 to-[#1E140E]/30 md:bg-gradient-to-r md:from-[#140C07]/95 md:via-[#1E140E]/75 md:to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-center px-6 py-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl pb-12 sm:pb-10 md:pb-14">
                    <span className="inline-flex items-center gap-1.5 bg-[#C69A4B]/20 backdrop-blur-md text-[#DFB76C] border border-[#C69A4B]/40 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-3 uppercase tracking-widest">
                      <Flame className="w-3.5 h-3.5 text-[#C69A4B]" />
                      Limited Batch Edition
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-[#F8F5EF] tracking-tight leading-[1.15] sm:leading-[1.10] mb-2.5 sm:mb-4">
                      Handcrafted Warmth <br/>
                      <span className="italic text-[#C69A4B]">
                        For Your Sanctuary.
                      </span>
                    </h2>
                    <p className="text-[#EFE7DA]/90 text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-7 font-sans line-clamp-2 sm:line-clamp-3 max-w-xl">
                      Each piece is hand-rubbed with natural botanical oils, preserving the golden richness and authentic tactile feel of real timber.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link 
                        href="/products" 
                        className="bg-gradient-to-r from-[#C69A4B] to-[#DFB76C] hover:from-[#DFB76C] hover:to-[#C69A4B] text-[#1A110B] font-bold px-6 py-3 sm:px-7 sm:py-3.5 rounded-full flex items-center gap-2 shadow-[0_8px_20px_-4px_rgba(198,154,75,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(198,154,75,0.5)] transition-all text-xs sm:text-sm cursor-pointer tracking-wide"
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
                    className="object-cover opacity-90 hover:scale-102 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140C07] via-[#1E140E]/85 to-[#1E140E]/30 md:bg-gradient-to-r md:from-[#140C07]/95 md:via-[#1E140E]/75 md:to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-center px-6 py-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl pb-12 sm:pb-10 md:pb-14">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-3 uppercase tracking-widest">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                      100% Food-Safe & Organic
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-[#F8F5EF] tracking-tight leading-[1.15] sm:leading-[1.10] mb-2.5 sm:mb-4">
                      Dining Sculptures <br/>
                      <span className="italic text-[#C69A4B]">
                        Carved To Endure.
                      </span>
                    </h2>
                    <p className="text-[#EFE7DA]/90 text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-7 font-sans line-clamp-2 sm:line-clamp-3 max-w-xl">
                      Turn everyday dining and hosting into an unforgettable sensory ritual with hand-turned acacia boards and artisanal platters.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link 
                        href="/products?category=Kitchen" 
                        className="bg-gradient-to-r from-[#C69A4B] to-[#DFB76C] hover:from-[#DFB76C] hover:to-[#C69A4B] text-[#1A110B] font-bold px-6 py-3 sm:px-7 sm:py-3.5 rounded-full flex items-center gap-2 shadow-[0_8px_20px_-4px_rgba(198,154,75,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(198,154,75,0.5)] transition-all text-xs sm:text-sm cursor-pointer tracking-wide"
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
            <div className="hidden lg:flex absolute bottom-6 right-8 z-20 items-center gap-6 bg-[#1A110B]/85 backdrop-blur-xl border border-[#342217] px-7 py-3.5 rounded-2xl shadow-2xl">
              <div className="flex flex-col">
                <span className="text-[#C69A4B] font-bold text-lg leading-tight">4.9 ★</span>
                <span className="text-[#7D7368] text-[11px] font-sans">2,500+ Reviews</span>
              </div>
              <div className="h-8 w-[1px] bg-[#342217]" />
              <div className="flex flex-col">
                <span className="text-[#F8F5EF] font-bold text-lg leading-tight">100%</span>
                <span className="text-[#7D7368] text-[11px] font-sans">Solid Hardwood</span>
              </div>
              <div className="h-8 w-[1px] bg-[#342217]" />
              <div className="flex flex-col">
                <span className="text-emerald-400 font-bold text-lg leading-tight">0%</span>
                <span className="text-[#7D7368] text-[11px] font-sans">Chemical Sealants</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. BRAND CRAFTSMANSHIP HIGHLIGHT STRIP */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#1D1510]/70 backdrop-blur-md border border-[#E5D8C5] dark:border-[#2D221A] shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFE7DA] dark:bg-[#261D17] border border-[#E5D8C5] dark:border-[#2D221A] flex items-center justify-center shrink-0 text-[#C69A4B]">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#241710] dark:text-[#F8F5EF] leading-tight">Hand-Turned Timber</p>
              <p className="text-[10px] text-[#7D7368] dark:text-[#A3968A]">Teak & Acacia Wood</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFE7DA] dark:bg-[#261D17] border border-[#E5D8C5] dark:border-[#2D221A] flex items-center justify-center shrink-0 text-[#C69A4B]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#241710] dark:text-[#F8F5EF] leading-tight">Hereditary Artisans</p>
              <p className="text-[10px] text-[#7D7368] dark:text-[#A3968A]">Master Woodcarvers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFE7DA] dark:bg-[#261D17] border border-[#E5D8C5] dark:border-[#2D221A] flex items-center justify-center shrink-0 text-[#C69A4B]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#241710] dark:text-[#F8F5EF] leading-tight">Insured Shipping</p>
              <p className="text-[10px] text-[#7D7368] dark:text-[#A3968A]">Pan-India Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFE7DA] dark:bg-[#261D17] border border-[#E5D8C5] dark:border-[#2D221A] flex items-center justify-center shrink-0 text-[#C69A4B]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#241710] dark:text-[#F8F5EF] leading-tight">Zero Chemical Dyes</p>
              <p className="text-[10px] text-[#7D7368] dark:text-[#A3968A]">Natural Beeswax Finish</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE CURATED SHOWCASE (Filterable Tabs + Luxury Product Gallery Cards) */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#C69A4B] text-xs font-bold uppercase tracking-[0.2em] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Treasures</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-[#241710] dark:text-[#F8F5EF] tracking-tight">
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
                    ? "bg-[#241710] text-[#F8F5EF] dark:bg-[#C69A4B] dark:text-[#241710] shadow-sm font-bold scale-[1.02]"
                    : "bg-white/80 dark:bg-[#1D1510] text-[#7D7368] dark:text-[#A3968A] border border-[#E5D8C5] dark:border-[#2D221A] hover:border-[#C69A4B]/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - EVERY PRODUCT IS FULLY CLICKABLE & LUXURIOUSLY STYLED */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.slice(0, 8).map((product) => {
            const productId = product.id || (product as any)._id;
            const isSaved = isInWishlist(productId);
            const originalPrice = product.originalPrice || Math.floor(product.price * 1.5);
            const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

            return (
              <div 
                key={productId}
                className="group relative flex flex-col bg-white/90 dark:bg-[#1D1510]/90 rounded-2xl p-3 sm:p-4 border border-[#E5D8C5]/80 dark:border-[#2D221A] hover:border-[#C69A4B]/70 transition-all duration-400 shadow-[0_4px_20px_-4px_rgba(36,23,16,0.04)] hover:shadow-[0_16px_32px_-6px_rgba(36,23,16,0.1)] hover:-translate-y-1.5"
              >
                {/* 🎯 CLICKABLE IMAGE CONTAINER: Navigates straight to Product Details Page */}
                <Link 
                  href={`/products/${productId}`}
                  className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-[#F4EFE6] to-[#EFE7DA] dark:from-[#261D17] dark:to-[#1D1510] mb-3.5 block cursor-pointer"
                >
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out" 
                  />
                  
                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-[#241710] dark:bg-[#C69A4B] text-[#F8F5EF] dark:text-[#241710] text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider z-10">
                      {discountPercent}% OFF
                    </span>
                  )}

                  {/* Elegant "View Details" Pill Hover Reveal */}
                  <div className="absolute inset-0 bg-[#241710]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 z-10">
                    <span className="bg-[#F8F5EF]/95 dark:bg-[#1D1510]/95 backdrop-blur-md text-[#241710] dark:text-[#F8F5EF] text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-[#E5D8C5]/50 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      View Details <ArrowRight className="w-3.5 h-3.5 text-[#C69A4B]" />
                    </span>
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    aria-label="Save to Wishlist"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-[#1D1510]/90 backdrop-blur-md flex items-center justify-center text-[#241710] dark:text-[#F8F5EF] hover:scale-110 active:scale-95 transition-all shadow-xs z-20 cursor-pointer border border-[#E5D8C5]/50 dark:border-[#2D221A]"
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
                  <span className="text-[10px] font-semibold text-[#C69A4B] uppercase tracking-[0.18em] mb-1">
                    {product.category}
                  </span>
                  
                  {/* 🎯 CLICKABLE TITLE: Navigates straight to Product Details Page */}
                  <Link 
                    href={`/products/${productId}`} 
                    className="block group-hover:text-[#38251C] dark:group-hover:text-[#C69A4B] transition-colors"
                  >
                    <h3 className="font-playfair font-bold text-sm sm:text-base text-[#241710] dark:text-[#F8F5EF] line-clamp-1 mb-1.5">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center text-[#C69A4B]">
                      <Star className="w-3.5 h-3.5 fill-[#C69A4B]" />
                    </div>
                    <span className="text-xs font-bold text-[#241710] dark:text-[#F8F5EF]">
                      {product.rating || 4.9}
                    </span>
                    <span className="text-[11px] text-[#7D7368] dark:text-[#A3968A]">
                      ({product.numReviews || 38})
                    </span>
                  </div>

                  {/* Pricing & Add to Cart Action */}
                  <div className="mt-auto pt-2.5 flex items-center justify-between border-t border-[#E5D8C5]/80 dark:border-[#2D221A]/80">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-bold text-[#241710] dark:text-[#F8F5EF]">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-[#7D7368] line-through">
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
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#241710] hover:bg-[#38251C] dark:bg-[#C69A4B] dark:hover:bg-[#DFB76C] text-[#F8F5EF] dark:text-[#241710] flex items-center justify-center transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer hover:scale-105 active:scale-95"
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
            className="inline-flex items-center gap-2.5 bg-[#241710] hover:bg-[#38251C] dark:bg-[#C69A4B] dark:hover:bg-[#DFB76C] text-[#F8F5EF] dark:text-[#241710] font-bold px-8 py-4 rounded-full transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 text-sm cursor-pointer tracking-wide"
          >
            Explore Complete Catalog ({allProducts.length}+ Pieces)
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. EDITORIAL BENTO SPOTLIGHT (Living & Workspace Suites) */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[#C69A4B] text-xs font-bold uppercase tracking-[0.24em]">
            Curated Living Concept
          </span>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#241710] dark:text-[#F8F5EF] mt-1.5">
            Elevate Every Corner
          </h2>
          <p className="text-[#7D7368] dark:text-[#A3968A] text-sm mt-2">
            Signature artisan series tailored for the contemporary home and executive workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <Link 
            href="/products?category=Desk Accessories"
            className="group relative h-[380px] rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-[#E5D8C5] dark:border-[#2D221A] shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
          >
            <Image 
              src="/desk-accessories.jpg" 
              alt="Executive Desk Series" 
              fill 
              className="object-cover group-hover:scale-108 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140C07] via-[#1E140E]/60 to-transparent" />
            <div className="relative z-10">
              <span className="text-[#C69A4B] text-xs font-bold uppercase tracking-wider mb-2 block">
                Workspace Luxury
              </span>
              <h3 className="text-2xl font-playfair font-bold text-[#F8F5EF] mb-2">
                The Executive Desk Suite
              </h3>
              <p className="text-[#EFE7DA]/85 text-xs line-clamp-2 mb-4 font-sans">
                Solid oak and teak docks, cable organizers, and stationery blocks engineered for calm focus.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#DFB76C] group-hover:translate-x-1 transition-transform">
                Shop Workspace →
              </span>
            </div>
          </Link>

          {/* Card 2 */}
          <Link 
            href="/products?category=Home Decor"
            className="group relative h-[380px] rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-[#E5D8C5] dark:border-[#2D221A] shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
          >
            <Image 
              src="/home-decor.jpg" 
              alt="Aesthetic Living" 
              fill 
              className="object-cover group-hover:scale-108 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140C07] via-[#1E140E]/60 to-transparent" />
            <div className="relative z-10">
              <span className="text-[#C69A4B] text-xs font-bold uppercase tracking-wider mb-2 block">
                Warm Sanctuary
              </span>
              <h3 className="text-2xl font-playfair font-bold text-[#F8F5EF] mb-2">
                Sacred & Ambient Living
              </h3>
              <p className="text-[#EFE7DA]/85 text-xs line-clamp-2 mb-4 font-sans">
                Hand-carved tea light lattices, geometric wall sculptures, and tranquil tabletop accents.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#DFB76C] group-hover:translate-x-1 transition-transform">
                Shop Living Decor →
              </span>
            </div>
          </Link>

          {/* Card 3 */}
          <Link 
            href="/products?category=Kitchen"
            className="group relative h-[380px] rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-[#E5D8C5] dark:border-[#2D221A] shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
          >
            <Image 
              src="/kitchen.jpg" 
              alt="Kitchen & Dining" 
              fill 
              className="object-cover group-hover:scale-108 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140C07] via-[#1E140E]/60 to-transparent" />
            <div className="relative z-10">
              <span className="text-[#C69A4B] text-xs font-bold uppercase tracking-wider mb-2 block">
                Culinary Rituals
              </span>
              <h3 className="text-2xl font-playfair font-bold text-[#F8F5EF] mb-2">
                Artisanal Kitchen & Serving
              </h3>
              <p className="text-[#EFE7DA]/85 text-xs line-clamp-2 mb-4 font-sans">
                Food-grade acacia cheese platters, spice cellars, and hand-turned wooden serving trays.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#DFB76C] group-hover:translate-x-1 transition-transform">
                Shop Dining Art →
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* 7. CINEMATIC HERITAGE STORY BANNER */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-8">
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#1E140E] border border-[#342217] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C69A4B]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl relative z-10">
            <span className="text-[#C69A4B] text-xs font-bold tracking-[0.24em] uppercase mb-3 block">
              Behind the Chisel • Our Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-[#F8F5EF] leading-tight mb-4">
              "Wood carries the memory of ancient forests."
            </h2>
            <p className="text-[#EFE7DA]/85 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              In an age of disposable plastics, we stand for enduring heirloom quality, tactile warmth, and soul. Every piece at Kaashta Crafts passes through dozens of meticulous hands—shaping, smoothing, seasoning, and polishing with natural beeswax.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-5 border-t border-[#342217]">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-playfair text-[#DFB76C]">40+</span>
                <p className="text-[#7D7368] text-xs mt-1">Master Woodcarvers</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-playfair text-[#DFB76C]">100%</span>
                <p className="text-[#7D7368] text-xs mt-1">Ethical Foresting</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-playfair text-[#DFB76C]">10k+</span>
                <p className="text-[#7D7368] text-xs mt-1">Spaces Enriched</p>
              </div>
            </div>
          </div>

          <div className="relative w-full sm:w-[380px] lg:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[#C69A4B]/50 shadow-2xl shrink-0">
            <Image 
              src="/hero_wood.png" 
              alt="Artisan Crafting Wood" 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-[#1E140E]/85 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs text-[#F8F5EF]">
              <span>Handcrafted in Tamil Nadu, India</span>
              <span className="text-[#DFB76C] font-bold">Authentic Guild</span>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
