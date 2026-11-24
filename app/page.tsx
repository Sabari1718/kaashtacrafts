"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Heart, Star, Sparkles, Leaf, Flame,
  ArrowRight, Award, ShieldCheck, Truck, ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import { Product } from "./products/page";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/* ─── CATEGORY DATA ─── */
const categories = [
  { name: "Top Offers",       tag: "Curated Drops",    image: "/top-offers.jpg",        href: "/products" },
  { name: "Desk & Office",    tag: "Executive Suite",  image: "/desk-accessories.jpg",  href: "/products?category=Desk Accessories" },
  { name: "Home Decor",       tag: "Sanctuary Pieces", image: "/home-decor.jpg",        href: "/products?category=Home Decor" },
  { name: "Kitchen & Dining", tag: "Culinary Art",     image: "/kitchen.jpg",           href: "/products?category=Kitchen" },
  { name: "Stationery",       tag: "Minimalist Blocks",image: "/stationery.jpg",        href: "/products?category=Stationery" },
  { name: "Gifts & Curios",   tag: "Bespoke Tokens",   image: "/gifts.jpg",             href: "/products" },
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

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAllProducts(data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
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
    <main className="flex flex-col w-full overflow-x-hidden bg-paper dark:bg-[#12100E]">

      {/* ══════════════════════════════════════════════
          1. CATEGORY NAVIGATION BAR
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-[#F7F3EB]/95 dark:bg-[#1A1410]/95 backdrop-blur-md border-b border-[#E0D3BE]/60 dark:border-[#2C2018]/60">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max mx-auto justify-start sm:justify-center">
            {categories.map((cat, idx) => (
              <Link
                href={cat.href}
                key={idx}
                className="cat-pill group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-[#1E1510]/80 border border-[#E0D3BE] dark:border-[#2C2018] hover:border-[#C69A4B]/60 hover:bg-white dark:hover:bg-[#2C2018] shadow-xs"
              >
                <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-[#E0D3BE] dark:ring-[#2C2018] group-hover:ring-[#C69A4B]/50 transition-all shrink-0">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[11px] font-semibold text-[#21150F] dark:text-[#F7F3EB] group-hover:text-[#38251C] dark:group-hover:text-[#DEB96A] transition-colors">{cat.name}</span>
                  <span className="text-[8px] text-[#7A6E63] dark:text-[#A09285] tracking-wide mt-0.5">{cat.tag}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. HERO — CINEMATIC FULL-WIDTH EDITORIAL
          ══════════════════════════════════════════════ */}
      <section className="w-full">
        <div className="relative w-full bg-[#21150F] overflow-hidden" style={{ height: "clamp(420px, 56vw, 540px)" }}>
          <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            effect="fade"
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={true}
            style={{ "--swiper-pagination-color": "#C69A4B", "--swiper-pagination-bullet-inactive-color": "#7A6E63" } as any}
            className="w-full h-full"
          >
            {/* ── Slide 1 ── */}
            <SwiperSlide>
              <div className="relative w-full h-full">
                <Image src="/banner1.jpg" alt="Artisan Woodcraft" fill priority className="object-cover scale-105 animate-reveal-up" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#21150F]/95 via-[#21150F]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21150F]/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 max-w-[640px] pb-8">
                  <div className="label-luxury text-[#DEB96A] mb-4 flex items-center gap-2">
                    <span className="w-6 h-px bg-[#C69A4B]" />
                    Artisanal Heritage Collections
                  </div>
                  <h1 className="heading-display text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-[#F7F3EB] leading-[1.08] mb-3">
                    Artistry in Every Grain.<br />
                    <span className="text-gold-gradient">Soul in Every Curve.</span>
                  </h1>
                  <p className="text-[#E0D3BE]/80 text-[13px] sm:text-sm leading-relaxed mb-6 max-w-xs font-sans font-normal">
                    Sculpted from sustainably seasoned teak and sheesham — designed to bring organic warmth, dignity, and calm into every living space.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/products" className="btn-luxury-primary">
                      Explore Collection <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/products?category=Desk Accessories" className="btn-luxury-ghost">
                      Executive Suite
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* ── Slide 2 ── */}
            <SwiperSlide>
              <div className="relative w-full h-full">
                <Image src="/banner2.jpg" alt="Handcrafted Warmth" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#21150F]/95 via-[#21150F]/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21150F]/75 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 max-w-[640px] pb-8">
                  <div className="label-luxury text-[#DEB96A] mb-4 flex items-center gap-2">
                    <Flame className="w-3 h-3" />
                    Limited Batch Edition
                  </div>
                  <h1 className="heading-display text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-[#F7F3EB] leading-[1.08] mb-3">
                    Handcrafted Warmth<br />
                    <span className="text-gold-gradient">For Your Sanctuary.</span>
                  </h1>
                  <p className="text-[#E0D3BE]/80 text-[13px] sm:text-sm leading-relaxed mb-6 max-w-xs font-sans font-normal">
                    Hand-rubbed with natural botanical oils, preserving the golden richness and authentic tactile feel of real timber.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/products" className="btn-luxury-primary">
                      Shop Collections <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* ── Slide 3 ── */}
            <SwiperSlide>
              <div className="relative w-full h-full">
                <Image src="/banner3.jpg" alt="Dining Sculptures" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#21150F]/95 via-[#21150F]/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21150F]/75 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 max-w-3xl pb-10">
                  <div className="label-luxury text-emerald-400 mb-5 flex items-center gap-2">
                    <Leaf className="w-3 h-3" />
                    100% Food-Safe & Organic
                  </div>
                  <h1 className="heading-display text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-[#F7F3EB] leading-[1.08] mb-3">
                    Dining Sculptures<br />
                    <span className="text-gold-gradient">Carved To Endure.</span>
                  </h1>
                  <p className="text-[#E0D3BE]/80 text-[13px] sm:text-sm leading-relaxed mb-6 max-w-xs font-sans font-normal">
                    Turn everyday hosting into ritual. Hand-turned acacia boards and artisanal platters carved to endure generations.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/products?category=Kitchen" className="btn-luxury-primary">
                      Dining Collection <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          {/* Floating stats — compact for smaller hero */}
          <div className="hidden lg:flex absolute bottom-6 right-8 z-20 items-center gap-4 bg-[#21150F]/80 backdrop-blur-xl border border-[#C69A4B]/20 px-5 py-3 rounded-xl shadow-2xl">
            {[["4.9★", "2,500+ Reviews"], ["100%", "Solid Hardwood"], ["0%", "Chemical Sealants"]].map(([val, lbl], i) => (
              <div key={i} className={`flex flex-col items-center ${i > 0 ? "pl-4 border-l border-[#38251C]" : ""}`}>
                <span className={`font-playfair font-bold text-base ${i === 0 ? "text-[#DEB96A]" : i === 2 ? "text-emerald-400" : "text-[#F7F3EB]"}`}>{val}</span>
                <span className="text-[9px] text-[#7A6E63] mt-0.5 tracking-wide">{lbl}</span>
              </div>
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
      <section className="w-full bg-paper dark:bg-[#12100E] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="label-luxury text-[#C69A4B] mb-3">Handcrafted Treasures</p>
              <h2 className="heading-display text-4xl sm:text-5xl md:text-[52px] text-[#21150F] dark:text-[#F7F3EB] leading-[1.1]">
                Best of{" "}
                <span className="text-gold-gradient">Kaashta Crafts</span>
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {["All", "Desk Accessories", "Home Decor", "Kitchen", "Stationery"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-4 py-2 rounded-full text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    selectedFilter === cat
                      ? "bg-[#21150F] text-[#F7F3EB] dark:bg-[#C69A4B] dark:text-[#21150F] shadow-sm"
                      : "bg-white/70 dark:bg-[#1E1510]/70 text-[#7A6E63] dark:text-[#A09285] border border-[#E0D3BE] dark:border-[#2C2018] hover:border-[#C69A4B]/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* LUXURY PRODUCT GRID — 4 column on large, 2 on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
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
                      <div className="absolute top-3 left-3 bg-[#21150F] text-[#DEB96A] text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest uppercase shadow-sm">
                        −{disc}%
                      </div>
                    )}

                    {/* Wishlist */}
                    <button
                      onClick={e => handleWishlist(e, product)}
                      aria-label="Wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-[#1E1510]/90 backdrop-blur flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm border border-[#E0D3BE]/40 cursor-pointer z-10"
                    >
                      <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-[#38251C] hover:text-red-500"}`} />
                    </button>
                  </Link>

                  {/* DETAILS */}
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="label-luxury text-[#C69A4B] text-[9px] mb-1.5">{product.category}</p>
                    <Link href={`/products/${pid}`}>
                      <h3 className="font-playfair font-bold text-sm sm:text-[15px] text-[#21150F] dark:text-[#F7F3EB] line-clamp-1 mb-1.5 leading-tight group-hover:text-[#38251C] dark:group-hover:text-[#DEB96A] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Stars */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star className="w-3 h-3 fill-[#C69A4B] text-[#C69A4B]" />
                      <span className="text-[11px] font-bold text-[#21150F] dark:text-[#F7F3EB]">{product.rating || 4.9}</span>
                      <span className="text-[10px] text-[#7A6E63]">({product.numReviews || 38})</span>
                    </div>

                    {/* Price + Cart */}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#E0D3BE]/60 dark:border-[#2C2018]/60">
                      <div>
                        <span className="font-playfair font-bold text-base sm:text-lg text-[#21150F] dark:text-[#F7F3EB]">₹{product.price}</span>
                        <span className="ml-1.5 text-[11px] text-[#7A6E63] line-through">₹{origPrice}</span>
                        <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Free Delivery</p>
                      </div>
                      <button
                        onClick={e => handleAddToCart(e, product)}
                        aria-label="Add to cart"
                        className="w-9 h-9 rounded-xl bg-[#21150F] hover:bg-[#38251C] dark:bg-[#C69A4B] dark:hover:bg-[#DEB96A] text-[#F7F3EB] dark:text-[#21150F] flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
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
          5. FULL-BLEED EDITORIAL — PHILOSOPHY QUOTE
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-espresso-grain relative overflow-hidden py-24 md:py-36">
        {/* Gold ambient glow */}
        <div className="absolute top-0 left-1/4 w-[700px] h-56 bg-[#C69A4B]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-40 bg-[#38251C]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative rule */}
        <div className="absolute top-0 left-0 right-0 divider-gold" />
        <div className="absolute bottom-0 left-0 right-0 divider-gold" />

        <div className="max-w-[900px] mx-auto px-6 sm:px-10 text-center relative z-10">
          <p className="label-luxury text-[#DEB96A] mb-8">Our Philosophy</p>
          <blockquote className="heading-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F7F3EB] leading-[1.1] mb-8">
            "Wood carries the memory <br className="hidden sm:block" />
            <span className="heading-editorial text-gold-gradient">of ancient forests."</span>
          </blockquote>
          <p className="text-[#E0D3BE]/75 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            In an age of disposable plastics, we stand for enduring heirloom quality, tactile warmth, and soul. Every piece passes through dozens of meticulous hands — shaping, smoothing, seasoning, and polishing with natural beeswax.
          </p>
          <div className="flex flex-wrap justify-center gap-10 sm:gap-16 pt-8 border-t border-[#38251C]">
            {[["40+", "Master Woodcarvers"], ["100%", "Ethical Foresting"], ["10k+", "Homes Enriched"], ["25+", "Years Heritage"]].map(([val, lbl]) => (
              <div key={lbl} className="flex flex-col items-center">
                <span className="font-playfair font-bold text-3xl sm:text-4xl text-[#DEB96A]">{val}</span>
                <span className="text-[10px] tracking-widest uppercase text-[#7A6E63] mt-1">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. CURATED LIVING — ASYMMETRIC BENTO GRID
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-natural dark:bg-[#1A1410] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">

          <div className="text-center mb-14">
            <p className="label-luxury text-[#C69A4B] mb-3">Curated Living Concept</p>
            <h2 className="heading-display text-4xl sm:text-5xl text-[#21150F] dark:text-[#F7F3EB]">
              Elevate Every Corner
            </h2>
            <p className="text-[#7A6E63] dark:text-[#A09285] text-sm mt-3 max-w-md mx-auto">
              Signature artisan series tailored for the contemporary home and executive workspace.
            </p>
          </div>

          {/* ASYMMETRIC BENTO — large + 2 stacked */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 md:gap-6">

            {/* Large card — 3/5 width */}
            <Link
              href="/products?category=Desk Accessories"
              className="group relative md:col-span-3 h-[480px] md:h-[560px] rounded-3xl overflow-hidden cursor-pointer"
            >
              <Image src="/desk-accessories.jpg" alt="Executive Desk" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#21150F] via-[#21150F]/30 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                <p className="label-luxury text-[#DEB96A] mb-2">Workspace Luxury</p>
                <h3 className="heading-display text-3xl md:text-4xl text-[#F7F3EB] mb-3">The Executive<br />Desk Suite</h3>
                <p className="text-[#E0D3BE]/80 text-sm mb-6 max-w-xs">Solid oak and teak docks, cable organizers, and stationery blocks for calm focus.</p>
                <span className="inline-flex items-center gap-2 label-luxury text-[#DEB96A] group-hover:gap-4 transition-all">
                  Explore Range <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* 2 stacked — 2/5 width */}
            <div className="md:col-span-2 flex flex-col gap-5 md:gap-6">
              <Link href="/products?category=Home Decor" className="group relative h-[260px] md:h-auto md:flex-1 rounded-3xl overflow-hidden cursor-pointer">
                <Image src="/home-decor.jpg" alt="Sacred Living" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21150F] via-[#21150F]/20 to-transparent" />
                <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end">
                  <p className="label-luxury text-[#DEB96A] mb-1.5">Warm Sanctuary</p>
                  <h3 className="heading-display text-xl md:text-2xl text-[#F7F3EB] mb-3">Sacred & Ambient Living</h3>
                  <span className="inline-flex items-center gap-2 label-luxury text-[#DEB96A] group-hover:gap-3 transition-all">
                    Shop Decor <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>

              <Link href="/products?category=Kitchen" className="group relative h-[260px] md:h-auto md:flex-1 rounded-3xl overflow-hidden cursor-pointer">
                <Image src="/kitchen.jpg" alt="Artisanal Kitchen" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21150F] via-[#21150F]/20 to-transparent" />
                <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end">
                  <p className="label-luxury text-[#DEB96A] mb-1.5">Culinary Rituals</p>
                  <h3 className="heading-display text-xl md:text-2xl text-[#F7F3EB] mb-3">Artisanal Kitchen & Serving</h3>
                  <span className="inline-flex items-center gap-2 label-luxury text-[#DEB96A] group-hover:gap-3 transition-all">
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
      <section className="w-full bg-[#21150F] py-14 border-y border-[#38251C]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {[
              { icon: Leaf,       title: "Sustainably Harvested",  sub: "Certified Teak & Sheesham" },
              { icon: Award,      title: "Master Artisans",        sub: "Tamil Nadu Heritage Craft" },
              { icon: Truck,      title: "Insured Delivery",       sub: "Pan-India White Glove" },
              { icon: ShieldCheck,title: "Zero Toxins",            sub: "Natural Beeswax Only" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#38251C] border border-[#C69A4B]/20 flex items-center justify-center shrink-0 text-[#DEB96A]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F7F3EB] leading-tight">{title}</h4>
                  <p className="text-[11px] text-[#7A6E63] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. ARTISAN STORY — SPLIT EDITORIAL SECTION
          ══════════════════════════════════════════════ */}
      <section className="w-full bg-paper dark:bg-[#12100E] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Image with editorial frame */}
            <div className="relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden img-frame-gold shadow-2xl">
                <Image src="/hero_wood.png" alt="Artisan at Work" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21150F]/60 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 bg-[#21150F]/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-[#38251C] flex items-center justify-between">
                  <span className="text-[#E0D3BE] text-xs font-medium">Handcrafted in Tamil Nadu</span>
                  <span className="label-luxury text-[#DEB96A] text-[9px]">Authentic Guild</span>
                </div>
              </div>
              {/* Decorative accent block */}
              <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-2xl bg-[#C69A4B]/15 border border-[#C69A4B]/20 -z-10 hidden lg:block" />
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <p className="label-luxury text-[#C69A4B] mb-5">Behind the Chisel</p>
              <h2 className="heading-display text-4xl sm:text-5xl text-[#21150F] dark:text-[#F7F3EB] mb-6 leading-tight">
                Where Craft Meets <br />
                <span className="heading-editorial text-[#38251C] dark:text-[#DEB96A]">Heirloom</span>
              </h2>
              <p className="text-[#7A6E63] dark:text-[#A09285] text-sm sm:text-base leading-relaxed mb-6">
                Every Kaashta Crafts piece passes through dozens of meticulous hands. From selecting sustainably harvested timber to the final hand-rubbed beeswax finish, we maintain a standard of craft that is increasingly rare in a world of mass production.
              </p>
              <p className="text-[#7A6E63] dark:text-[#A09285] text-sm leading-relaxed mb-10">
                Our artisans are hereditary masters from Tamil Nadu — families who have shaped wood for generations, whose hands hold the memory of a living craft tradition.
              </p>

              <div className="grid grid-cols-3 gap-5 pt-6 border-t border-[#E0D3BE]/60 dark:border-[#2C2018]/60 mb-8">
                {[["40+", "Artisans"], ["100%", "Ethical Wood"], ["10k+", "Homes"]].map(([val, lbl]) => (
                  <div key={lbl}>
                    <span className="font-playfair font-bold text-2xl sm:text-3xl text-[#C69A4B]">{val}</span>
                    <p className="text-[10px] tracking-wider uppercase text-[#7A6E63] mt-1">{lbl}</p>
                  </div>
                ))}
              </div>

              <Link href="/products" className="btn-luxury-primary w-fit">
                Discover All Collections <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
