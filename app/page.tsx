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
    bgGradient: "from-[#2A150C] via-[#3D1E10] to-[#1A0B06]",
    badgeBg: "bg-[#C99A45]/20 text-[#E6C477] border-[#C99A45]/40",
    btnGradient: "from-[#E6C477] via-[#C99A45] to-[#B88528]",
    glowColor: "rgba(201,154,69,0.35)",
  },
  {
    tag: "🌿 SANCTUARY COLLECTION • NATURE'S TOUCH",
    title: "Bring Nature Into Your Living Space.",
    subtitle: "Warm botanical candle pillars, sculptural wooden clocks, and hand-chiseled teak sanctuary decor made to last generations.",
    btnText: "Shop Home Decor",
    href: "/products?category=Home Decor",
    image: "/home-decor.jpg",
    bgGradient: "from-[#1B281E] via-[#2A3D2D] to-[#121B14]",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    btnGradient: "from-[#52B788] via-[#2D6A4F] to-[#1B4332] text-white",
    glowColor: "rgba(82,183,136,0.35)",
  },
  {
    tag: "🔥 LIMITED EDITION • 100% FOOD-SAFE TEAK",
    title: "Timeless Dining Sculptures & Platters.",
    subtitle: "Turn everyday dining into ritual with hand-turned organic acacia bowls, spice jars, and artisan serving platters.",
    btnText: "Explore Culinary Art",
    href: "/products?category=Kitchen",
    image: "/kitchen.jpg",
    bgGradient: "from-[#3B1713] via-[#521C16] to-[#240A07]",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    btnGradient: "from-[#F4A261] via-[#E76F51] to-[#C84B31] text-white",
    glowColor: "rgba(231,111,81,0.35)",
  },
];

/* ─── MARQUEE ITEMS ─── */
const marqueeItems = [
  "Sustainably Harvested Teak",
  "Master Tamil Woodcarvers",
  "Natural Beeswax Finish",
  "Zero Chemical Dyes",
  "Heirloom Grade Quality",
  "Ethical Forest Stewardship",
  "Pan-India Delivery",
  "2,500+ Homes Adorned",
];

export default function Home() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

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
    <main className="flex flex-col w-full overflow-x-hidden bg-white dark:bg-[#12100E]">

      {/* ══════════════════════════════════════════════
          1. CATEGORY NAVIGATION BAR (MAJOR LUXURY REDESIGN)
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-white dark:bg-[#1A1410]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-[#C99A45]/20 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-2 sm:px-6 py-2 sm:py-2.5 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-max mx-auto justify-start sm:justify-center">
            {categories.map((cat, idx) => (
              <Link
                href={cat.href}
                key={idx}
                className="group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white dark:bg-[#1E130E] border-2 border-[#E0D3BE] dark:border-[#38251A] hover:border-[#C99A45] hover:bg-[#21130E] dark:hover:bg-[#21130E] shadow-sm hover:shadow-[0_10px_25px_-3px_rgba(33,19,14,0.4),0_0_15px_rgba(201,154,69,0.4)] hover:-translate-y-1.5 active:translate-y-0 transition-all duration-250 ease-out cursor-pointer overflow-hidden"
              >
                {/* Active/Hover Gold Accent Bar on Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E6C477] via-[#C99A45] to-[#E6C477] opacity-0 group-hover:opacity-100 transition-opacity duration-250 shadow-[0_0_8px_#C99A45]" />

                {/* Scaled Icon Image */}
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl overflow-hidden ring-1.5 sm:ring-2 ring-[#E0D3BE] dark:ring-[#38251A] group-hover:ring-[#E6C477] group-hover:scale-115 transition-all duration-250 shrink-0 shadow-xs">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-125 transition-transform duration-500 ease-out" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col leading-none">
                  <span className="text-[11.5px] sm:text-[12.5px] font-black text-[#21130E] dark:text-[#F7F3EB] group-hover:text-[#F7F3EB] dark:group-hover:text-[#E6C477] transition-colors tracking-tight font-sans">
                    {cat.name}
                  </span>
                  <span className="text-[8px] sm:text-[8.5px] text-[#7A6E63] dark:text-[#A09285] group-hover:text-[#E6C477] dark:group-hover:text-[#E6C477] tracking-wider uppercase mt-0.5 sm:mt-1 font-extrabold transition-colors font-sans">
                    {cat.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. PROMOTIONAL BANNER CAROUSEL (SPLIT LAYOUT: LEFT TEXT, RIGHT PHOTO)
             Single full-width rich banner with smooth transitions
          ══════════════════════════════════════════════ */}
      <section className="w-full py-3 sm:py-6 bg-white dark:bg-[#12100E] border-b border-stone-200/70 dark:border-[#2C2018]/40">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 relative group">
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
                  className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#E0D3BE]/60 dark:border-[#2C2018]/80 bg-gradient-to-r ${banner.bgGradient} flex flex-col md:flex-row items-center justify-between min-h-[360px] md:min-h-[390px]`}
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
          3. MARQUEE TRUST STRIP
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-[#21150F] border-y border-[#38251C] py-3.5 overflow-hidden">
        <div className="marquee-track gap-0">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center gap-6 px-6 shrink-0">
              <span className="label-luxury text-[#DEB96A] whitespace-nowrap text-[9px]">{item}</span>
              <span className="w-1 h-1 rounded-full bg-[#C69A4B]/40 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. PRODUCT SHOWCASE — "BEST OF KAASHTA CRAFTS"
             Editorial Asymmetric Luxury Grid
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-white dark:bg-[#12100E] py-8 sm:py-14 md:py-16">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-8">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 mb-6 sm:mb-10">
            <div>
              <p className="label-luxury text-[#7A4513] dark:text-[#DEB96A] font-extrabold mb-1.5 sm:mb-2.5">Handcrafted Treasures</p>
              <h2 className="heading-display text-2xl sm:text-4xl md:text-[46px] text-[#21150F] dark:text-[#F7F3EB] leading-[1.15]">
                Best of{" "}
                <span className="text-gold-gradient font-black">Kaashta Crafts</span>
              </h2>
            </div>

            {/* Filter Pills with Horizontal Scroll on Mobile & Wrap on Desktop */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
              {["All", "Desk Accessories", "Home Decor", "Kitchen", "Stationery"].map(cat => {
                const isActive = selectedFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedFilter(cat)}
                    className={`relative px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-[12px] font-black tracking-wider uppercase whitespace-nowrap cursor-pointer transition-all duration-200 flex items-center gap-1.5 sm:gap-2 font-sans shrink-0 ${
                      isActive
                        ? "bg-[#21130E] text-white dark:text-[#E6C477] border-2 border-[#C99A45] shadow-[0_6px_22px_rgba(33,19,14,0.4),0_0_16px_rgba(201,154,69,0.5)] -translate-y-0.5 sm:-translate-y-1"
                        : "bg-white dark:bg-[#1E130E] text-[#21130E] dark:text-[#EDE4D6] border-2 border-[#E0D3BE] dark:border-[#38251A] hover:border-[#C99A45] hover:bg-[#21130E] hover:text-white dark:hover:bg-[#21130E] dark:hover:text-[#E6C477] hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:shadow-[0_8px_20px_-3px_rgba(33,19,14,0.35),0_0_12px_rgba(201,154,69,0.35)]"
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-[#E6C477] to-[#C99A45] shadow-[0_0_8px_#C99A45] animate-pulse" />
                    )}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LUXURY PRODUCT GRID — 2 column on mobile with perfect gap, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
            {filteredProducts.slice(0, 8).map((product, idx) => {
              const pid = product.id || (product as any)._id;
              const isSaved = isInWishlist(pid);
              const origPrice = product.originalPrice || Math.floor(product.price * 1.5);
              const disc = Math.round(((origPrice - product.price) / origPrice) * 100);

              return (
                <div
                  key={pid}
                  className="product-card-luxury dark:bg-[#1E1510] group flex flex-col"
                >
                  {/* IMAGE */}
                  <Link href={`/products/${pid}`} className="relative block overflow-hidden bg-gradient-to-b from-[#EDE5D8] to-[#E0D3BE] dark:from-[#261D15] dark:to-[#1E1510]" style={{ aspectRatio: "4/5" }}>
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
                      <span className="bg-[#F7F3EB]/95 backdrop-blur-sm text-[#21150F] text-[11px] font-bold tracking-widest uppercase px-5 py-2 rounded-full border border-[#E0D3BE]/50 flex items-center gap-1.5">
                        View Details <ArrowUpRight className="w-3 h-3 text-[#C69A4B]" />
                      </span>
                    </div>

                    {/* Discount badge */}
                    {disc > 0 && (
                      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#21150F] text-[#DEB96A] text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full tracking-widest uppercase shadow-sm">
                        −{disc}%
                      </div>
                    )}

                    {/* Wishlist */}
                    <button
                      onClick={e => handleWishlist(e, product)}
                      aria-label="Wishlist"
                      className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-[#1E1510]/90 backdrop-blur flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm border border-[#E0D3BE]/40 cursor-pointer z-10"
                    >
                      <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-[#38251C] hover:text-red-500"}`} />
                    </button>
                  </Link>

                  {/* DETAILS */}
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <p className="label-luxury text-[#7A4513] dark:text-[#DEB96A] font-extrabold text-[8.5px] sm:text-[9px] mb-1 sm:mb-1.5">{product.category}</p>
                    <Link href={`/products/${pid}`}>
                      <h3 className="font-playfair font-bold text-xs sm:text-[15px] text-[#21150F] dark:text-[#F7F3EB] line-clamp-1 mb-1 sm:mb-1.5 leading-tight group-hover:text-[#38251C] dark:group-hover:text-[#DEB96A] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Stars */}
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#C69A4B] text-[#C69A4B]" />
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#21150F] dark:text-[#F7F3EB]">{product.rating || 4.9}</span>
                      <span className="text-[9px] sm:text-[10px] text-[#7A6E63]">({product.numReviews || 38})</span>
                    </div>

                    {/* Price + Cart */}
                    <div className="mt-auto flex items-center justify-between pt-2 sm:pt-3 border-t border-[#E0D3BE]/60 dark:border-[#2C2018]/60">
                      <div>
                        <div className="flex items-baseline gap-1 sm:gap-1.5">
                          <span className="font-sans font-black text-sm sm:text-xl text-[#21130E] dark:text-[#F7F3EB] tracking-tight">
                            ₹{product.price}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#7A6E63] line-through">
                            ₹{origPrice}
                          </span>
                        </div>
                        <p className="text-[8.5px] sm:text-[9.5px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-0.5">Free Delivery</p>
                      </div>
                      <button
                        onClick={e => handleAddToCart(e, product)}
                        aria-label="Add to cart"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#21130E] hover:bg-[#38251A] dark:bg-[#C99A45] dark:hover:bg-[#E6C477] text-[#F7F3EB] dark:text-[#21130E] flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
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
          <div className="mt-14 flex flex-col items-center gap-3">
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
      <section className="w-full bg-white dark:bg-[#1A1410] py-10 sm:py-20 md:py-28 border-t border-stone-100 dark:border-[#2C2018]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-8">

          <div className="text-center mb-8 sm:mb-14">
            <p className="label-luxury text-[#7A4513] dark:text-[#DEB96A] font-extrabold mb-2 sm:mb-3">Curated Living Concept</p>
            <h2 className="heading-display text-2xl sm:text-4xl md:text-5xl text-[#21150F] dark:text-[#F7F3EB]">
              Elevate Every Corner
            </h2>
            <p className="text-[#5C4D42] dark:text-[#A09285] text-xs sm:text-sm mt-2 sm:mt-3 max-w-md mx-auto font-medium">
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
      <section className="w-full bg-[#21150F] py-8 sm:py-14 border-y border-[#38251C]">
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
      <section className="w-full bg-white dark:bg-[#12100E] py-10 sm:py-20 md:py-28 border-t border-stone-100 dark:border-[#2C2018]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-8">
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
