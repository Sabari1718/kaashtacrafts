"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag, Search, Filter, Loader2, Heart, Star,
  Check, Sparkles, X, SlidersHorizontal, RotateCcw, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description?: string;
  inStock: boolean;
  featured?: boolean;
  rating?: number;
  numReviews?: number;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#F7F3EB] dark:bg-[#12100E]">
        <Loader2 className="w-10 h-10 animate-spin text-[#C69A4B]" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [priceRange, setPriceRange] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("Newest");
  
  // Slide-in Filter Drawer State (Replaces permanent sidebar)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Prevent body scrolling when filter drawer is open
  useEffect(() => {
    if (isFilterDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterDrawerOpen]);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  // Filtering Logic
  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesRating = (product.rating || 0) >= minRating;
    
    let matchesPrice = true;
    if (priceRange === "Under500") matchesPrice = product.price < 500;
    else if (priceRange === "500to1000") matchesPrice = product.price >= 500 && product.price <= 1000;
    else if (priceRange === "Over1000") matchesPrice = product.price > 1000;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  // Sorting Logic
  filteredProducts = filteredProducts.sort((a, b) => {
    if (sortBy === "PriceLowToHigh") return a.price - b.price;
    if (sortBy === "PriceHighToLow") return b.price - a.price;
    if (sortBy === "RatingHighToLow") return (b.rating || 0) - (a.rating || 0);
    return 0; 
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange("All");
    setMinRating(0);
    setSortBy("Newest");
    router.push("/products");
  };

  const activeFiltersCount = 
    (selectedCategory !== "All" ? 1 : 0) +
    (priceRange !== "All" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <main className="flex flex-col w-full min-h-screen bg-paper dark:bg-[#12100E] text-[#21150F] dark:text-[#F7F3EB] pt-6 pb-24 font-sans transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Top Header & Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white/80 dark:bg-[#1E1510]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xs border border-[#E0D3BE] dark:border-[#2C2018]">
          <div>
            <div className="flex items-center gap-2 text-[#C69A4B] text-[11px] font-bold uppercase tracking-[0.2em] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C69A4B]" />
              <span>Artisan Catalogue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-[#21150F] dark:text-[#F7F3EB] tracking-tight">
              Curated Wooden Masterpieces
            </h1>
            <p className="text-[#7A6E63] dark:text-[#A09285] text-xs sm:text-sm mt-0.5 font-medium">
              Showing {filteredProducts.length} handcrafted pieces {selectedCategory !== "All" && `in ${selectedCategory}`}
            </p>
          </div>
          
          {/* Controls: Search, Filter Button & Sort */}
          <div className="flex flex-wrap w-full md:w-auto items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64 lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6E63] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search pieces..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/products?search=${encodeURIComponent(searchQuery)}${selectedCategory !== 'All' ? `&category=${selectedCategory}` : ''}`);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-[#E0D3BE] dark:border-[#2C2018] bg-[#F7F3EB]/60 dark:bg-[#140F0C] focus:outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 text-[#21150F] dark:text-[#F7F3EB] placeholder:text-[#7A6E63]/70 text-xs sm:text-sm transition-all shadow-2xs"
              />
            </div>

            {/* Filter & Sort Trigger Button */}
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#21150F] hover:bg-[#38251C] dark:bg-[#C69A4B] dark:hover:bg-[#DEB96A] text-[#F7F3EB] dark:text-[#21150F] text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-[#C69A4B] dark:bg-[#21150F] text-[#21150F] dark:text-[#F7F3EB] text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#F7F3EB]/80 dark:bg-[#140F0C] px-3.5 py-2 rounded-full border border-[#E0D3BE] dark:border-[#2C2018] shadow-2xs text-xs sm:text-sm">
              <span className="text-[#7A6E63] text-xs hidden sm:inline font-medium">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="bg-transparent font-bold text-[#21150F] dark:text-[#F7F3EB] focus:outline-none cursor-pointer text-xs dark:[&>option]:bg-[#1E1510]"
              >
                <option value="Newest">Newest Arrivals</option>
                <option value="PriceLowToHigh">Price: Low to High</option>
                <option value="PriceHighToLow">Price: High to Low</option>
                <option value="RatingHighToLow">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Quick Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                router.push(`/products?category=${encodeURIComponent(category)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
              }}
              className={`filter-chip px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                selectedCategory === category
                  ? "filter-chip-active"
                  : "filter-chip-inactive bg-white/80 dark:bg-[#1E1510]/80 text-[#7A6E63] dark:text-[#A09285] border border-[#E0D3BE] dark:border-[#2C2018]"
              }`}
            >
              {category}
            </button>
          ))}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>

        {/* Full-Width Balanced Product Grid (NO PERMANENT SIDEBAR) */}
        <div className="w-full">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center bg-white/70 dark:bg-[#1E1510]/70 rounded-3xl border border-[#E0D3BE] dark:border-[#2C2018] shadow-2xs">
              <Loader2 className="w-10 h-10 text-[#C69A4B] animate-spin mb-4" />
              <p className="text-[#7A6E63] font-medium text-sm">Gathering Masterpieces...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const productId = product.id || (product as any)._id;
                const isSaved = isInWishlist(productId);
                const origPrice = product.originalPrice || Math.floor(product.price * 1.5);
                const discount = Math.round(((origPrice - product.price) / origPrice) * 100);

                return (
                  <div
                    key={productId}
                    className="product-card-luxury dark:bg-[#1E1510] group flex flex-col"
                  >
                    {/* Product Image Frame */}
                    <Link
                      href={`/products/${productId}`}
                      className="block relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-[#EDE5D8] to-[#E0D3BE] dark:from-[#261D15] dark:to-[#1E1510]"
                    >
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#21150F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#21150F] text-[#DEB96A] text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full tracking-wider uppercase shadow-xs">
                          −{discount}%
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                          toast.success(isInWishlist(productId) ? "Removed from Wishlist" : "Saved to Wishlist");
                        }}
                        aria-label="Toggle Wishlist"
                        className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-white/90 dark:bg-[#1E1510]/90 backdrop-blur w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:scale-110 shadow-xs transition-all z-10 cursor-pointer border border-[#E0D3BE]/50"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-[#21150F] dark:text-[#F7F3EB] hover:text-red-500"}`} />
                      </button>
                      
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-[#21150F]/65 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="bg-white dark:bg-[#1E1510] px-4 py-1.5 rounded-full font-bold text-[#21150F] dark:text-[#F7F3EB] tracking-widest text-[10px] uppercase shadow-md">Sold Out</span>
                        </div>
                      )}
                    </Link>

                    {/* Content Details */}
                    <div className="p-3.5 sm:p-4.5 flex flex-col flex-grow">
                      <div className="text-[9px] sm:text-[9.5px] font-bold tracking-[0.2em] uppercase text-[#C69A4B] mb-1">
                        {product.category}
                      </div>

                      <Link href={`/products/${productId}`}>
                        <h3 className="font-playfair font-bold text-xs sm:text-[15px] text-[#21150F] dark:text-[#F7F3EB] leading-tight mb-1.5 line-clamp-1 group-hover:text-[#38251C] dark:group-hover:text-[#DEB96A] transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Star className="w-3 h-3 fill-[#C69A4B] text-[#C69A4B]" />
                        <span className="text-[11px] font-bold text-[#21150F] dark:text-[#F7F3EB]">
                          {product.rating || 4.9}
                        </span>
                        <span className="text-[10px] text-[#7A6E63]">
                          ({product.numReviews || 24})
                        </span>
                      </div>
                      
                      {/* Price & Add to Cart */}
                      <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-[#E0D3BE]/60 dark:border-[#2C2018]/60">
                        <div>
                          <span className="font-playfair font-bold text-sm sm:text-base text-[#21150F] dark:text-[#F7F3EB]">
                            ₹{product.price}
                          </span>
                          {origPrice && (
                            <span className="ml-1.5 text-[10px] sm:text-[11px] text-[#7A6E63] line-through">
                              ₹{origPrice}
                            </span>
                          )}
                          <p className="text-[8.5px] text-emerald-600 dark:text-emerald-400 font-semibold">Free Delivery</p>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                            toast.success(`${product.name} added to cart`);
                          }}
                          disabled={!product.inStock}
                          aria-label="Add to cart"
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#21150F] hover:bg-[#38251C] dark:bg-[#C69A4B] dark:hover:bg-[#DEB96A] disabled:bg-stone-200 dark:disabled:bg-stone-800 disabled:text-stone-400 text-[#F7F3EB] dark:text-[#21150F] flex items-center justify-center transition-all shadow-xs hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-white/70 dark:bg-[#1E1510]/70 rounded-3xl border border-[#E0D3BE] dark:border-[#2C2018] shadow-2xs">
              <div className="w-14 h-14 bg-[#EDE5D8]/60 dark:bg-[#2C2018] rounded-full flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-[#7A6E63]" />
              </div>
              <h3 className="text-lg font-bold font-playfair text-[#21150F] dark:text-[#F7F3EB] mb-1.5">No matching pieces</h3>
              <p className="text-[#7A6E63] max-w-sm mb-5 text-xs">
                Try adjusting your filters or search query to find your desired woodcraft.
              </p>
              <button 
                onClick={clearFilters}
                className="bg-[#21150F] hover:bg-[#38251C] text-[#F7F3EB] px-5 py-2 rounded-full font-bold text-xs transition-colors shadow-xs cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SLIDE-IN FILTER DRAWER (REPLACES PERMANENT SIDEBAR)
          ══════════════════════════════════════════════ */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsFilterDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-[#F7F3EB] dark:bg-[#1A1410] h-full shadow-2xl flex flex-col z-50 overflow-hidden border-l border-[#E0D3BE] dark:border-[#2C2018] animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E0D3BE] dark:border-[#2C2018] flex items-center justify-between bg-white/60 dark:bg-[#21150F]/60">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C69A4B]" />
                <h2 className="text-lg font-bold font-playfair text-[#21150F] dark:text-[#F7F3EB]">Filter &amp; Refine</h2>
              </div>
              <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A6E63] hover:text-[#21150F] hover:bg-[#EDE5D8] dark:hover:bg-[#2C2018] transition-colors"
                aria-label="Close Filter Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Filter Options */}
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C69A4B] mb-3">
                  Product Category
                </h3>
                <div className="flex flex-col gap-1.5">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        router.push(`/products?category=${encodeURIComponent(category)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
                      }}
                      className={`text-left flex items-center gap-3 text-xs sm:text-sm py-2 px-3 rounded-xl transition-all cursor-pointer ${
                        selectedCategory === category 
                          ? "bg-[#21150F] text-[#F7F3EB] dark:bg-[#C69A4B] dark:text-[#21150F] font-bold" 
                          : "text-[#7A6E63] dark:text-[#A09285] hover:bg-[#EDE5D8]/50 dark:hover:bg-[#2C2018]/50"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedCategory === category ? "border-[#C69A4B] bg-[#C69A4B] text-[#21150F]" : "border-[#E0D3BE] dark:border-[#2C2018]"}`}>
                        {selectedCategory === category && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[#E0D3BE]/60 dark:bg-[#2C2018]/60"></div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C69A4B] mb-3">
                  Price Bracket
                </h3>
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: "All", label: "Any Price" },
                    { id: "Under500", label: "Under ₹500" },
                    { id: "500to1000", label: "₹500 - ₹1000" },
                    { id: "Over1000", label: "Over ₹1000" }
                  ].map(range => (
                    <button
                      key={range.id}
                      onClick={() => setPriceRange(range.id)}
                      className={`text-left flex items-center gap-3 text-xs sm:text-sm py-2 px-3 rounded-xl transition-all cursor-pointer ${
                        priceRange === range.id 
                          ? "bg-[#21150F] text-[#F7F3EB] dark:bg-[#C69A4B] dark:text-[#21150F] font-bold" 
                          : "text-[#7A6E63] dark:text-[#A09285] hover:bg-[#EDE5D8]/50 dark:hover:bg-[#2C2018]/50"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${priceRange === range.id ? "border-[#C69A4B]" : "border-[#E0D3BE] dark:border-[#2C2018]"}`}>
                        {priceRange === range.id && <div className="w-2 h-2 rounded-full bg-[#C69A4B]"></div>}
                      </div>
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[#E0D3BE]/60 dark:bg-[#2C2018]/60"></div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C69A4B] mb-3">
                  Minimum Rating
                </h3>
                <div className="flex flex-col gap-1.5">
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                      className={`flex items-center gap-2 text-xs sm:text-sm py-2 px-3 rounded-xl transition-all cursor-pointer ${
                        minRating === rating 
                          ? "bg-[#21150F] text-[#F7F3EB] dark:bg-[#C69A4B] dark:text-[#21150F] font-bold" 
                          : "text-[#7A6E63] dark:text-[#A09285] hover:bg-[#EDE5D8]/50 dark:hover:bg-[#2C2018]/50"
                      }`}
                    >
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-[#C69A4B] text-[#C69A4B]' : 'text-stone-300 dark:text-stone-700'}`} />
                        ))}
                      </div>
                      <span className="text-xs">&amp; Up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#E0D3BE] dark:border-[#2C2018] bg-white/80 dark:bg-[#21150F]/80 flex items-center gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 px-4 rounded-xl border border-[#E0D3BE] dark:border-[#2C2018] text-[#21150F] dark:text-[#F7F3EB] text-xs font-bold uppercase tracking-wider hover:bg-[#EDE5D8] transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#21150F] hover:bg-[#38251C] dark:bg-[#C69A4B] dark:hover:bg-[#DEB96A] text-[#F7F3EB] dark:text-[#21150F] text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer text-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
