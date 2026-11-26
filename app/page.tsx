"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Heart, Star, Sparkles, Leaf, Flame,
  ArrowRight, Award, ShieldCheck, Truck, ArrowUpRight,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import { Product } from "./products/page";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/* ─── CATEGORY DATA ─── */
const categories = [
  { name: "Top Offers",       tag: "Curated Drops",    image: "/top-offers.jpg",        href: "/products" },
  { name: "Desk & Office",    tag: "Executive Suite",  image: "/desk-accessories.jpg",  href: "/products?category=Desk Accessories" },
  { name: "Home Decor",       tag: "Sanctuary Pieces", image: "/home-decor.jpg",        href: "/products?category=Home Decor" },
  { name: "Kitchen & Dining", tag: "Culinary Art",     image: "/kitchen.jpg",           href: "/products?category=Kitchen" },
  { name: "Stationery",       tag: "Minimalist Blocks",image: "/stationery.jpg",        href: "/products?category=Stationery" },
  { name: "Gifts & Curios",   tag: "Bespoke Tokens",   image: "/gifts.jpg",             href: "/products" },
];

/* ─── PROMOTIONAL BANNERS DATA (3 VIBRANT LUXURY SPLIT BANNERS) ─── */
const promoBanners = [
  {
    tag: "✨ ARTISANAL HERITAGE • UP TO 40% OFF",
    title: "Sculpted for Everyday Luxury.",
    subtitle: "Handcrafted executive teak desk suites, organizers, and heritage docking pieces carved by master woodturners.",
    btnText: "Explore Desk Suite",
    href: "/products?category=Desk Accessories",
    image: "/desk-accessories.jpg",
    bgGradient: "from-[#0F0C0A] via-[#1A1410] to-[#0A0806]",
    badgeBg: "bg-[#D4AF37]/15 text-[#F3E5AB] border-[#D4AF37]/40 shadow-xs",
    btnGradient: "from-[#D4AF37] via-[#F5E2B3] to-[#C49A50] text-[#0A0806] font-black shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)]",
    glowColor: "rgba(212,175,55,0.25)",
  },
  {
    tag: "🌿 SANCTUARY COLLECTION • NATURE'S TOUCH",
    title: "Bring Nature Into Your Living Space.",
    subtitle: "Warm botanical candle pillars, sculptural wooden clocks, and hand-chiseled teak sanctuary decor made to last generations.",
    btnText: "Shop Home Decor",
    href: "/products?category=Home Decor",
    image: "/home-decor.jpg",
    bgGradient: "from-[#0A140F] via-[#12221A] to-[#060D0A]",
    badgeBg: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40 shadow-xs",
    btnGradient: "from-[#34D399] via-[#10B981] to-[#059669] text-white font-black shadow-[0_4px_25px_rgba(16,185,129,0.45)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.6)]",
    glowColor: "rgba(16,185,129,0.25)",
  },
  {
    tag: "🔥 LIMITED EDITION • 100% FOOD-SAFE TEAK",
    title: "Timeless Dining Sculptures & Platters.",
    subtitle: "Turn everyday dining into ritual with hand-turned organic acacia bowls, spice jars, and artisan serving platters.",
    btnText: "Explore Culinary Art",
    href: "/products?category=Kitchen",
    image: "/kitchen.jpg",
    bgGradient: "from-[#1A0C0E] via-[#2A1316] to-[#0D0607]",
    badgeBg: "bg-rose-500/20 text-rose-200 border-rose-400/40 shadow-xs",
    btnGradient: "from-[#FB7185] via-[#F43F5E] to-[#BE123C] text-white font-black shadow-[0_4px_25px_rgba(244,63,94,0.45)] hover:shadow-[0_6px_30px_rgba(244,63,94,0.6)]",
    glowColor: "rgba(244,63,94,0.25)",
  },
];

export default function Home() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([
    "Desk Accessories", "Home Decor", "Kitchen", "Stationery"
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    fetch("/api/categories")
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.categories)
          ? data.categories
          : Array.isArray(data?.raw)
          ? data.raw.map((c: any) => c.name)
          : [];
        if (list.length > 0) {
          setCustomCategories(list);
        }
      })
      .catch(console.error);

    fetch("/api/products")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAllProducts(data); })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
        if (typeof window !== "undefined") {
          window.scrollTo(0, 0);
        }
      });
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); e.stopPropagation();
    const pid = product.id || (product as any)._id;
    toggleWishlist(product);
    toast[isInWishlist(pid) ? "info" : "success"](isInWishlist(pid) ? "Removed from wishlist" : "Saved to wishlist!");
  };

  const filteredProducts = selectedFilter === "All"
    ? allProducts
    : allProducts.filter(p => p.category?.toLowerCase() === selectedFilter.toLowerCase());

  // Dynamic order of top categories matching customCategories
  const sortedTopCategories = [
    categories[0], // Top Offers stays first
    ...customCategories.map(cName => {
      return categories.find(c =>
        c.href.toLowerCase().includes(cName.toLowerCase()) ||
        c.name.toLowerCase().includes(cName.toLowerCase())
      );
    }).filter(Boolean),
    ...categories.filter(c => 
      c.name !== "Top Offers" && 
      !customCategories.some(cName => 
        c.href.toLowerCase().includes(cName.toLowerCase()) || 
        c.name.toLowerCase().includes(cName.toLowerCase())
      )
    )
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#C69A4B]/20 border-t-[#C69A4B] animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#C69A4B] animate-pulse" />
        </div>
        <p className="mt-5 heading-editorial text-lg text-[#38251C] dark:text-[#DEB96A]">
          Curating Heirloom Pieces…
        </p>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full overflow-x-hidden bg-white dark:bg-[#0C0A09]">

      {/* ══════════════════════════════════════════════
          1. PROMOTIONAL BANNER CAROUSEL (SPLIT LAYOUT: LEFT TEXT, RIGHT PHOTO)
             Single full-width rich banner with smooth transitions
          ══════════════════════════════════════════════ */}
      <section className="w-full py-3 sm:py-6 bg-white dark:bg-[#0C0A09] border-b border-stone-200/70 dark:border-[#C49A50]/20">
        <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-10 relative group">
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation={{
              prevEl: ".promo-swiper-prev",
              nextEl: ".promo-swiper-next",
            }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            spaceBetween={20}
            slidesPerView={1}
            className="w-full"
          >
            {promoBanners.map((banner, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5),0_0_25px_rgba(212,175,55,0.1)] border border-[#E0D3BE]/80 dark:border-[#D4AF37]/35 bg-gradient-to-r ${banner.bgGradient} flex flex-col md:flex-row items-center justify-between min-h-[360px] md:min-h-[390px]`}
                >
                  {/* Subtle decorative glow circles */}
                  <div
                    className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40"
                    style={{ background: banner.glowColor }}
                  />
                  <div
                    className="absolute -bottom-20 right-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-30"
                    style={{ background: banner.glowColor }}
                  />

                  {/* LEFT CONTENT AREA */}
                  <div className="relative z-10 w-full md:w-[54%] lg:w-[52%] p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center items-start text-left">
                    {/* Badge */}
                    <div className="mb-2.5 sm:mb-4">
                      <span className={`inline-flex items-center gap-1.5 backdrop-blur-md text-[9px] sm:text-[11px] font-extrabold tracking-widest uppercase px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border shadow-sm ${banner.badgeBg}`}>
                        {banner.tag}
                      </span>
                    </div>

                    {/* Headline */}
                    <h2 className="heading-display text-xl sm:text-3xl md:text-[34px] lg:text-[40px] text-white font-extrabold leading-[1.14] mb-2 sm:mb-3 drop-shadow-sm tracking-tight">
                      {banner.title}
                    </h2>

                    {/* Subtitle / Description */}
                    <p className="text-xs sm:text-[14px] text-stone-200/90 leading-relaxed mb-4 sm:mb-6 font-sans font-normal max-w-lg line-clamp-2 sm:line-clamp-none">
                      {banner.subtitle}
                    </p>

                    {/* CTA Button */}
                    <Link
                      href={banner.href}
                      className={`inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-r ${banner.btnGradient} text-stone-900 font-extrabold text-[11px] sm:text-[13px] tracking-wider uppercase transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 hover:shadow-2xl`}
                    >
                      <span>{banner.btnText}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>

                  {/* RIGHT PHOTO AREA (Card with explicit height and clean shadow) */}
                  <div className="relative z-10 w-full md:w-[46%] lg:w-[48%] p-4 sm:p-6 md:p-8 flex items-center justify-center shrink-0">
                    <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[340px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 ring-1 ring-black/40 group/photo">
                      <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                        className="object-cover object-center group-hover/photo:scale-108 transition-transform duration-700 ease-out"
                      />
                      {/* Soft vignette to blend inside banner */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent hidden md:block" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows (Desktop Only) */}
          <button
            aria-label="Previous Banner"
            className="promo-swiper-prev hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-[#21150F]/90 text-[#21150F] dark:text-[#F7F3EB] border border-[#E0D3BE] dark:border-[#38251C] shadow-xl items-center justify-center hover:bg-[#C99A45] hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            aria-label="Next Banner"
            className="promo-swiper-next hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-[#21150F]/90 text-[#21150F] dark:text-[#F7F3EB] border border-[#E0D3BE] dark:border-[#38251C] shadow-xl items-center justify-center hover:bg-[#C99A45] hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* ── CUSTOM LUXURY PROGRESS PILL INDICATORS ── */}
          <div className="flex items-center justify-center gap-2.5 pt-4 pb-1">
            {promoBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => swiperInstance?.slideToLoop(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`relative h-[6px] rounded-full transition-all duration-500 ease-out cursor-pointer ${
                  activeSlideIndex === idx
                    ? "w-10 bg-gradient-to-r from-[#E6C477] via-[#C99A45] to-[#B88528] shadow-[0_0_12px_rgba(201,154,69,0.7),0_1px_3px_rgba(33,19,14,0.3)] ring-1 ring-[#E6C477]/80"
                    : "w-3 bg-[#38251A]/40 dark:bg-[#5A483C]/50 hover:bg-[#C99A45]/60 hover:w-5"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. CATEGORY NAVIGATION BAR (PLACED BELOW BANNER)
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-white dark:bg-[#0C0A09]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-[#D4AF37]/20 shadow-2xs">
        <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-2 sm:py-2.5 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-max mx-auto justify-start sm:justify-center">
            {sortedTopCategories.map((cat: any, idx) => (
              <Link
                href={cat.href}
                key={idx}
                className="group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#FAF7F2] dark:bg-[#14100D] border border-[#E0D3BE] dark:border-[#D4AF37]/25 hover:border-[#C99A45] hover:dark:border-[#D4AF37] hover:bg-white dark:hover:bg-[#1C1612] shadow-xs hover:shadow-[0_10px_25px_-3px_rgba(0,0,0,0.5),0_0_15px_rgba(212,175,55,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all duration-250 ease-out cursor-pointer overflow-hidden"
              >
                {/* Active/Hover Gold Accent Bar on Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-250 shadow-[0_0_8px_#D4AF37]" />

                {/* Scaled Icon Image */}
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl overflow-hidden ring-1.5 sm:ring-2 ring-[#E0D3BE] dark:ring-[#D4AF37]/35 group-hover:ring-[#D4AF37] group-hover:scale-110 transition-all duration-250 shrink-0 shadow-xs">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-120 transition-transform duration-500 ease-out" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col leading-none">
                  <span className="text-[11.5px] sm:text-[12.5px] font-black text-[#21130E] dark:text-[#FAF6EE] group-hover:text-[#8C5819] dark:group-hover:text-[#D4AF37] transition-colors tracking-tight font-sans">
                    {cat.name}
                  </span>
                  <span className="text-[8px] sm:text-[8.5px] text-[#7A6E63] dark:text-[#A3988C] group-hover:text-[#D4AF37] dark:group-hover:text-[#D4AF37] tracking-wider uppercase mt-0.5 sm:mt-1 font-extrabold transition-colors font-sans">
                    {cat.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. PRODUCT SHOWCASE — "BEST OF KAASHTA CRAFTS"
             Editorial Asymmetric Luxury Grid
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-white dark:bg-[#12100E] py-8 sm:py-14 md:py-16">
        <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-10">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 mb-6 sm:mb-10">
            <div>
              <p className="label-luxury text-[#7A4513] dark:text-[#DEB96A] font-extrabold mb-1.5 sm:mb-2.5">Handcrafted Treasures</p>
              <h2 className="heading-display text-2xl sm:text-4xl md:text-[46px] text-[#21150F] dark:text-[#FAF6EE] leading-[1.15]">
                Best of{" "}
                <span className="text-gold-gradient font-black">Kaashta Crafts</span>
              </h2>
            </div>

            {/* Filter Pills with Horizontal Scroll on Mobile & Wrap on Desktop */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-1.5 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
              {["All", ...customCategories].map(cat => {
                const isActive = selectedFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedFilter(cat)}
                    className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-[12px] font-black tracking-wider uppercase whitespace-nowrap cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 font-sans shrink-0 ${
                      isActive
                        ? "bg-[#21130E] text-white dark:bg-gradient-to-r dark:from-[#D4AF37] dark:via-[#F3E5AB] dark:to-[#C5A059] dark:text-[#0A0807] dark:border-transparent font-black shadow-md ring-2 ring-[#C99A45]/30 dark:ring-[#D4AF37]/50"
                        : "bg-white dark:bg-[#14100D] text-[#21130E] dark:text-[#D8CFBF] border-2 border-[#E0D3BE] dark:border-[#D4AF37]/20 hover:border-[#C99A45] hover:dark:border-[#D4AF37] hover:bg-[#21130E] hover:text-white dark:hover:bg-[#1E1712] dark:hover:text-[#FAF6EE] hover:shadow-sm"
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-[#E6C477] to-[#C99A45] dark:from-[#0A0807] dark:to-[#1A1410] shadow-[0_0_8px_#C99A45] animate-pulse" />
                    )}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LUXURY PRODUCT GRID — 2 column on mobile with perfect gap, 4-5 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-5 md:gap-6">
            {filteredProducts.slice(0, 10).map((product, idx) => {
              const pid = product.id || (product as any)._id;
              const isSaved = isInWishlist(pid);
              const origPrice = product.originalPrice || Math.floor(product.price * 1.5);
              const disc = Math.round(((origPrice - product.price) / origPrice) * 100);

              return (
                <div
                  key={pid}
                  className="product-card-luxury group flex flex-col"
                >
                  {/* IMAGE */}
                  <Link href={`/products/${pid}`} className="relative block overflow-hidden bg-gradient-to-b from-[#EDE5D8] to-[#E0D3BE] dark:from-[#181310] dark:to-[#0D0A08] shadow-[inset_0_3px_8px_rgba(0,0,0,0.06)]" style={{ aspectRatio: "4/5" }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#21150F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Hover CTA */}
                    <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-3 group-hover:translate-y-0">
                      <span className="bg-[#F7F3EB]/95 dark:bg-[#14100D]/95 backdrop-blur-sm text-[#21150F] dark:text-[#FAF6EE] text-[11px] font-bold tracking-widest uppercase px-5 py-2 rounded-full border border-[#E0D3BE]/50 dark:border-[#D4AF37]/30 flex items-center gap-1.5 shadow-md">
                        View Details <ArrowUpRight className="w-3 h-3 text-[#C69A4B] dark:text-[#E2BA69]" />
                      </span>
                    </div>

                    {/* Discount badge */}
                    {disc > 0 && (
                      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#21150F] dark:bg-[#0C0A09] text-[#DEB96A] dark:text-[#E2BA69] border border-transparent dark:border-[#D4AF37]/30 text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full tracking-widest uppercase shadow-sm">
                        −{disc}%
                      </div>
                    )}

                    {/* Wishlist */}
                    <button
                      onClick={e => handleWishlist(e, product)}
                      aria-label="Wishlist"
                      className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-[#14100D]/90 backdrop-blur flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm border border-[#E0D3BE]/40 dark:border-[#D4AF37]/30 cursor-pointer z-10"
                    >
                      <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-[#38251C] dark:text-[#D8CFBF] hover:text-red-500"}`} />
                    </button>
                  </Link>

                  {/* DETAILS */}
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <p className="label-luxury text-[#7A4513] dark:text-[#DEB96A] font-extrabold text-[8.5px] sm:text-[9px] mb-1 sm:mb-1.5">{product.category}</p>
                    <Link href={`/products/${pid}`}>
                      <h3 className="font-playfair font-bold text-xs sm:text-[15px] text-[#21150F] dark:text-[#FAF6EE] line-clamp-1 mb-1 sm:mb-1.5 leading-tight group-hover:text-[#38251C] dark:group-hover:text-[#DEB96A] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Stars */}
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#C69A4B] text-[#C69A4B]" />
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#21150F] dark:text-[#FAF6EE]">{product.rating || 4.9}</span>
                      <span className="text-[9px] sm:text-[10px] text-[#7A6E63] dark:text-[#A3988C]">({product.numReviews || 38})</span>
                    </div>

                    {/* Price + Cart */}
                    <div className="mt-auto flex items-center justify-between pt-2 sm:pt-3 border-t border-[#E0D3BE]/60 dark:border-[#D4AF37]/20">
                      <div>
                        <div className="flex items-baseline gap-1 sm:gap-1.5">
                          <span className="font-sans font-black text-sm sm:text-xl text-[#21130E] dark:text-[#FAF6EE] tracking-tight">
                            ₹{product.price}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#7A6E63] dark:text-[#A3988C] line-through">
                            ₹{origPrice}
                          </span>
                        </div>
                        <p className="text-[8.5px] sm:text-[9.5px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-0.5">Free Delivery</p>
                      </div>
                      <button
                        onClick={e => handleAddToCart(e, product)}
                        aria-label="Add to cart"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#21130E] hover:bg-[#38251A] dark:bg-gradient-to-r dark:from-[#D4AF37] dark:to-[#C5A059] dark:hover:from-[#F3E5AB] dark:hover:to-[#D4AF37] text-[#F7F3EB] dark:text-[#0A0807] flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All CTA */}
          <div className="mt-7 sm:mt-8 flex flex-col items-center gap-2">
            <Link
              href="/products"
              className="btn-luxury-primary text-sm"
            >
              View Complete Catalogue ({allProducts.length}+ Pieces) <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[#7A6E63] text-xs">Every piece is handcrafted and unique</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. CURATED LIVING — ASYMMETRIC BENTO GRID
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-white dark:bg-[#1A1410] pt-6 pb-8 sm:pt-8 sm:pb-10 md:pt-9 md:pb-12 border-t border-stone-100 dark:border-[#2C2018]">
        <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-10">

          <div className="text-center mb-6 sm:mb-8">
            <p className="label-luxury text-[#7A4513] dark:text-[#DEB96A] font-extrabold mb-1.5 sm:mb-2">Curated Living Concept</p>
            <h2 className="heading-display text-2xl sm:text-4xl md:text-5xl text-[#21150F] dark:text-[#F7F3EB]">
              Elevate Every Corner
            </h2>
            <p className="text-[#5C4D42] dark:text-[#A09285] text-xs sm:text-sm mt-1 sm:mt-2 max-w-md mx-auto font-medium">
              Signature artisan series tailored for the contemporary home and executive workspace.
            </p>
          </div>

          {/* ASYMMETRIC BENTO — large + 2 stacked */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 sm:gap-5 md:gap-6">

            {/* Large card — 3/5 width */}
            <Link
              href="/products?category=Desk Accessories"
              className="group relative md:col-span-3 h-[300px] sm:h-[420px] md:h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer"
            >
              <Image src="/desk-accessories.jpg" alt="Executive Desk" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#21150F] via-[#21150F]/30 to-transparent" />
              <div className="absolute inset-0 p-5 sm:p-8 md:p-10 flex flex-col justify-end">
                <p className="label-luxury text-[#DEB96A] mb-1 sm:mb-2 text-[9px] sm:text-[10px]">Workspace Luxury</p>
                <h3 className="heading-display text-2xl sm:text-3xl md:text-4xl text-[#F7F3EB] mb-1.5 sm:mb-3">The Executive<br />Desk Suite</h3>
                <p className="text-[#E0D3BE]/80 text-xs sm:text-sm mb-3 sm:mb-6 max-w-xs line-clamp-2 sm:line-clamp-none">Solid oak and teak docks, cable organizers, and stationery blocks for calm focus.</p>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 label-luxury text-[#DEB96A] group-hover:gap-3 transition-all text-[9px] sm:text-[10px]">
                  Explore Range <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </span>
              </div>
            </Link>

            {/* 2 stacked — 2/5 width */}
            <div className="md:col-span-2 flex flex-col gap-3.5 sm:gap-5 md:gap-6">
              <Link href="/products?category=Home Decor" className="group relative h-[190px] sm:h-[260px] md:h-auto md:flex-1 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer">
                <Image src="/home-decor.jpg" alt="Sacred Living" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21150F] via-[#21150F]/20 to-transparent" />
                <div className="absolute inset-0 p-4 sm:p-6 md:p-7 flex flex-col justify-end">
                  <p className="label-luxury text-[#DEB96A] mb-1 text-[9px]">Warm Sanctuary</p>
                  <h3 className="heading-display text-lg sm:text-xl md:text-2xl text-[#F7F3EB] mb-1.5 sm:mb-3">Sacred & Ambient Living</h3>
                  <span className="inline-flex items-center gap-1.5 label-luxury text-[#DEB96A] group-hover:gap-2.5 transition-all text-[9px]">
                    Shop Decor <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>

              <Link href="/products?category=Kitchen" className="group relative h-[190px] sm:h-[260px] md:h-auto md:flex-1 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer">
                <Image src="/kitchen.jpg" alt="Artisanal Kitchen" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21150F] via-[#21150F]/20 to-transparent" />
                <div className="absolute inset-0 p-4 sm:p-6 md:p-7 flex flex-col justify-end">
                  <p className="label-luxury text-[#DEB96A] mb-1 text-[9px]">Culinary Rituals</p>
                  <h3 className="heading-display text-lg sm:text-xl md:text-2xl text-[#F7F3EB] mb-1.5 sm:mb-3">Artisanal Kitchen & Serving</h3>
                  <span className="inline-flex items-center gap-1.5 label-luxury text-[#DEB96A] group-hover:gap-2.5 transition-all text-[9px]">
                    Shop Dining <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. TRUST PILLARS — DARK LUXURY STRIP
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-[#21150F] py-5 sm:py-7 border-y border-[#38251C]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Leaf,       title: "Sustainably Harvested",  sub: "Certified Teak & Sheesham" },
              { icon: Award,      title: "Master Artisans",        sub: "Tamil Nadu Heritage Craft" },
              { icon: Truck,      title: "Insured Delivery",       sub: "Pan-India White Glove" },
              { icon: ShieldCheck,title: "Zero Toxins",            sub: "Natural Beeswax Only" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-2.5 sm:gap-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#38251C] border border-[#C69A4B]/20 flex items-center justify-center shrink-0 text-[#DEB96A]">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#F7F3EB] leading-tight">{title}</h4>
                  <p className="text-[9.5px] sm:text-[11px] text-[#A09285] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. ARTISAN STORY — SPLIT EDITORIAL SECTION
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-white dark:bg-[#12100E] pt-6 pb-8 sm:pt-8 sm:pb-12 md:pt-10 md:pb-14 border-t border-stone-100 dark:border-[#2C2018]">
        <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Image with editorial frame */}
            <div className="relative">
              <div className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden img-frame-gold shadow-2xl">
                <Image src="/hero_wood.png" alt="Artisan at Work" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21150F]/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 bg-[#21150F]/80 backdrop-blur-md px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-[#38251C] flex items-center justify-between">
                  <span className="text-[#E0D3BE] text-[11px] sm:text-xs font-medium">Handcrafted in Tamil Nadu</span>
                  <span className="label-luxury text-[#DEB96A] text-[8.5px] sm:text-[9px]">Authentic Guild</span>
                </div>
              </div>
              {/* Decorative accent block */}
              <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-2xl bg-[#C69A4B]/15 border border-[#C69A4B]/20 -z-10 hidden lg:block" />
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <p className="label-luxury text-[#7A4513] dark:text-[#DEB96A] font-extrabold mb-3 sm:mb-5">Behind the Chisel</p>
              <h2 className="heading-display text-2xl sm:text-4xl md:text-5xl text-[#21150F] dark:text-[#F7F3EB] mb-4 sm:mb-6 leading-tight">
                Where Craft Meets <br />
                <span className="heading-editorial text-[#38251C] dark:text-[#DEB96A]">Heirloom</span>
              </h2>
              <p className="text-[#4A3C33] dark:text-[#A09285] text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium">
                Every Kaashta Crafts piece passes through dozens of meticulous hands. From selecting sustainably harvested timber to the final hand-rubbed beeswax finish, we maintain a standard of craft that is increasingly rare in a world of mass production.
              </p>
              <p className="text-[#4A3C33] dark:text-[#A09285] text-xs sm:text-sm leading-relaxed mb-6 sm:mb-10 font-medium">
                Our artisans are hereditary masters from Tamil Nadu — families who have shaped wood for generations, whose hands hold the memory of a living craft tradition.
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-5 pt-4 sm:pt-6 border-t border-[#E0D3BE]/60 dark:border-[#2C2018]/60 mb-6 sm:mb-8">
                {[["40+", "Artisans"], ["100%", "Ethical Wood"], ["10k+", "Homes"]].map(([val, lbl]) => (
                  <div key={lbl}>
                    <span className="font-playfair font-bold text-xl sm:text-3xl text-[#C69A4B]">{val}</span>
                    <p className="text-[9px] sm:text-[10px] tracking-wider uppercase text-[#7A6E63] mt-0.5 sm:mt-1">{lbl}</p>
                  </div>
                ))}
              </div>

              <Link href="/products" className="btn-luxury-primary w-fit text-xs sm:text-sm">
                Discover All Collections <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
