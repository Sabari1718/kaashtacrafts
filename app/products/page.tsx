"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Search, Filter, Loader2, Heart, Star, ChevronDown, Check, Sparkles, ArrowRight } from "lucide-react";
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
      <div className="flex items-center justify-center min-h-screen bg-[#F7F5F0] dark:bg-[#14100E]">
        <Loader2 className="w-10 h-10 animate-spin text-[#C49A50]" />
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
  
  // Mobile Filter Sidebar State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Sync state if URL changes
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
    // Newest is default
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

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] pt-6 pb-24 font-sans transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
        
        {/* Top Header & Search Bar (Editorial Style) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white/70 dark:bg-[#1E1713]/70 backdrop-blur-md p-5 md:p-6 rounded-3xl shadow-xs border border-[#EAE1D2] dark:border-[#2E241E] transition-colors duration-300">
          <div>
            <div className="flex items-center gap-2 text-[#C49A50] text-xs font-bold uppercase tracking-[0.16em] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Artisan Catalog</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] tracking-tight">
              Curated Wooden Masterpieces
            </h1>
            <p className="text-[#82786E] dark:text-[#A39A90] text-xs sm:text-sm mt-0.5">
              Showing {filteredProducts.length} handcrafted pieces
            </p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82786E] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search collection..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/products?search=${encodeURIComponent(searchQuery)}${selectedCategory !== 'All' ? `&category=${selectedCategory}` : ''}`);
                  }
                }}
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#EAE1D2] dark:border-[#2E241E] bg-white/80 dark:bg-[#14100E] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 text-[#241812] dark:text-[#F7F5F0] placeholder:text-[#82786E]/70 text-xs sm:text-sm transition-all shadow-2xs"
              />
            </div>
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center justify-center p-2.5 rounded-full bg-[#241812] dark:bg-[#C49A50] text-[#F7F5F0] dark:text-[#241812]"
              aria-label="Open Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Sidebar Filters (Desktop) & Mobile Drawer */}
          <aside className={`
            ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-[#F7F5F0] dark:bg-[#14100E] p-6 overflow-y-auto' : 'hidden md:block w-64 shrink-0'}
            md:sticky md:top-28 md:bg-transparent md:p-0 md:z-auto
          `}>
            {isMobileFilterOpen && (
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="text-xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0]">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-[#82786E] font-bold p-2 text-lg">✕</button>
              </div>
            )}

            <div className="bg-white/80 dark:bg-[#1E1713]/80 p-6 rounded-3xl shadow-xs border border-[#EAE1D2] dark:border-[#2E241E] flex flex-col gap-7 transition-colors duration-300">
              
              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#C49A50] mb-3.5">
                  Category
                </h3>
                <div className="flex flex-col gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        router.push(`/products?category=${encodeURIComponent(category)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
                      }}
                      className={`text-left flex items-center gap-3 text-xs sm:text-sm py-1.5 transition-colors cursor-pointer ${
                        selectedCategory === category ? "text-[#241812] dark:text-[#C49A50] font-bold" : "text-[#82786E] dark:text-[#A39A90] hover:text-[#241812] dark:hover:text-[#F7F5F0]"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedCategory === category ? "border-[#C49A50] bg-[#C49A50] text-[#241812]" : "border-[#EAE1D2] dark:border-[#2E241E]"}`}>
                        {selectedCategory === category && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[#EAE1D2]/80 dark:bg-[#2E241E]/80"></div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#C49A50] mb-3.5">Price Bracket</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "All", label: "Any Price" },
                    { id: "Under500", label: "Under ₹500" },
                    { id: "500to1000", label: "₹500 - ₹1000" },
                    { id: "Over1000", label: "Over ₹1000" }
                  ].map(range => (
                    <button
                      key={range.id}
                      onClick={() => setPriceRange(range.id)}
                      className={`text-left flex items-center gap-3 text-xs sm:text-sm py-1.5 transition-colors cursor-pointer ${
                        priceRange === range.id ? "text-[#241812] dark:text-[#C49A50] font-bold" : "text-[#82786E] dark:text-[#A39A90] hover:text-[#241812] dark:hover:text-[#F7F5F0]"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${priceRange === range.id ? "border-[#C49A50]" : "border-[#EAE1D2] dark:border-[#2E241E]"}`}>
                        {priceRange === range.id && <div className="w-2 h-2 rounded-full bg-[#C49A50]"></div>}
                      </div>
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[#EAE1D2]/80 dark:bg-[#2E241E]/80"></div>

              {/* Customer Reviews */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#C49A50] mb-3.5">Rating</h3>
                <div className="flex flex-col gap-2">
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                      className={`flex items-center gap-2 text-xs sm:text-sm py-1.5 transition-colors cursor-pointer ${
                        minRating === rating ? "font-bold text-[#241812] dark:text-[#C49A50]" : "text-[#82786E] dark:text-[#A39A90] hover:text-[#241812] dark:hover:text-[#F7F5F0]"
                      }`}
                    >
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-[#C49A50] text-[#C49A50]' : 'text-stone-300 dark:text-stone-700'}`} />
                        ))}
                      </div>
                      <span className="text-xs">& Up</span>
                    </button>
                  ))}
                </div>
              </div>

              {(searchQuery || selectedCategory !== "All" || priceRange !== "All" || minRating > 0) && (
                <button 
                  onClick={clearFilters}
                  className="w-full py-2.5 bg-[#EAE1D2]/50 dark:bg-[#2E241E] text-[#65452F] dark:text-[#C49A50] font-bold text-xs rounded-xl hover:bg-[#EAE1D2] dark:hover:bg-[#38261C] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}

            </div>
          </aside>

          {/* Right Main Grid */}
          <div className="flex-grow w-full">
            
            {/* Sort Dropdown */}
            <div className="flex justify-end items-center mb-6 z-20 relative">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-[#1E1713]/80 px-4 py-2 rounded-full border border-[#EAE1D2] dark:border-[#2E241E] shadow-2xs text-xs sm:text-sm transition-colors">
                <span className="text-[#82786E] dark:text-[#A39A90] font-medium">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-[#241812] dark:text-[#F7F5F0] focus:outline-none cursor-pointer appearance-none pr-5 relative dark:[&>option]:bg-[#1E1713]"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23C49A50%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .2em top 55%', backgroundSize: '.65em auto' }}
                >
                  <option value="Newest">Newest Arrivals</option>
                  <option value="PriceLowToHigh">Price: Low to High</option>
                  <option value="PriceHighToLow">Price: High to Low</option>
                  <option value="RatingHighToLow">Avg. Customer Review</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="py-32 flex flex-col items-center justify-center bg-white/70 dark:bg-[#1E1713]/70 rounded-3xl border border-[#EAE1D2] dark:border-[#2E241E] shadow-2xs">
                <Loader2 className="w-10 h-10 text-[#C49A50] animate-spin mb-4" />
                <p className="text-[#82786E] font-medium text-sm">Gathering Masterpieces...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const productId = product.id || (product as any)._id;
                  const isSaved = isInWishlist(productId);

                  return (
                    <div
                      key={productId}
                      className="group flex flex-col bg-white/85 dark:bg-[#1E1713]/85 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border border-[#EAE1D2] dark:border-[#2E241E] hover:border-[#C49A50]"
                    >
                      <Link href={`/products/${productId}`} className="block relative aspect-[4/5] w-full overflow-hidden bg-[#EAE1D2]/30 dark:bg-[#2E241E]/30">
                        <Image 
                          src={product.image} 
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        {/* Rating Badge */}
                        {product.rating ? (
                          <div className="absolute bottom-3.5 left-3.5 bg-white/95 dark:bg-[#1E1713]/95 backdrop-blur px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                            <span className="text-xs font-bold text-[#241812] dark:text-[#F7F5F0]">{product.rating.toFixed(1)}</span>
                            <Star className="w-3 h-3 fill-[#C49A50] text-[#C49A50]" />
                            <span className="text-[10px] text-[#82786E] ml-1">({product.numReviews})</span>
                          </div>
                        ) : null}
                        
                        {/* Wishlist Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product);
                            toast.success(isInWishlist(productId) ? "Removed from Wishlist" : "Added to Wishlist");
                          }}
                          className="absolute top-3.5 right-3.5 bg-white/90 dark:bg-[#1E1713]/90 backdrop-blur p-2.5 rounded-full hover:scale-110 shadow-xs transition-all z-10 cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-[#82786E] hover:text-red-500"}`} />
                        </button>
                        
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-[#241812]/50 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="bg-white dark:bg-[#1E1713] px-5 py-2 rounded-full font-bold text-[#241812] dark:text-[#F7F5F0] tracking-widest text-[11px] uppercase shadow-md">Sold Out</span>
                          </div>
                        )}
                      </Link>

                      <div className="p-5 flex flex-col flex-grow">
                        <Link href={`/products/${productId}`} className="flex flex-col mb-4 group-hover:text-[#65452F] dark:group-hover:text-[#C49A50] transition-colors">
                          <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#C49A50] mb-1">{product.category}</div>
                          <h3 className="text-base font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] leading-snug mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#241812] dark:text-[#F7F5F0]">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs font-medium text-[#82786E] line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </Link>
                        
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                            toast.success(`${product.name} added to cart`);
                          }}
                          disabled={!product.inStock}
                          className="mt-auto w-full bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] disabled:bg-stone-200 dark:disabled:bg-stone-800 disabled:text-stone-400 text-[#F7F5F0] dark:text-[#241812] py-2.5 rounded-xl text-xs font-bold tracking-wide transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> 
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center bg-white/70 dark:bg-[#1E1713]/70 rounded-3xl border border-[#EAE1D2] dark:border-[#2E241E] shadow-2xs">
                <div className="w-16 h-16 bg-[#EAE1D2]/50 dark:bg-[#2E241E] rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-[#82786E]" />
                </div>
                <h3 className="text-xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-2">No matching pieces</h3>
                <p className="text-[#82786E] max-w-sm mb-6 text-xs sm:text-sm">
                  Try adjusting your filters or search query to find your desired woodcraft.
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] px-6 py-2.5 rounded-full font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
