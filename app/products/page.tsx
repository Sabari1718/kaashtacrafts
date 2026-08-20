"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Search, Filter, Loader2, Heart, Star, ChevronDown, Check } from "lucide-react";
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-amber-700" />
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
    // Newest is default (assuming ID or DB order is newest first)
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
    <main className="flex flex-col w-full min-h-screen bg-stone-50 dark:bg-[#121212] pt-6 pb-24 font-sans transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
        
        {/* Top Search & Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-[#181818] p-4 md:p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 transition-colors duration-300">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-playfair text-stone-900 dark:text-stone-100 tracking-tight transition-colors">
              Shop Premium Woodworks
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">{filteredProducts.length} products found</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/products?search=${encodeURIComponent(searchQuery)}${selectedCategory !== 'All' ? `&category=${selectedCategory}` : ''}`);
                  }
                }}
                className="w-full pl-11 pr-4 py-3 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white dark:focus:bg-[#181818] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-all text-sm"
              />
            </div>
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center justify-center p-3 rounded-full bg-stone-900 dark:bg-stone-800 text-white"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Sidebar Filters (Desktop) & Mobile Drawer */}
          <aside className={`
            ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-white dark:bg-[#121212] p-6 overflow-y-auto' : 'hidden md:block w-64 shrink-0'}
            md:sticky md:top-28 md:bg-transparent md:p-0 md:z-auto
          `}>
            {isMobileFilterOpen && (
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="text-xl font-bold font-playfair dark:text-stone-100">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-stone-500 dark:text-stone-400 font-bold p-2">✕</button>
              </div>
            )}

            <div className="bg-white dark:bg-[#181818] p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 flex flex-col gap-8 transition-colors duration-300">
              
              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 mb-4 flex items-center justify-between">
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
                      className={`text-left flex items-center gap-3 text-sm py-1.5 transition-colors ${
                        selectedCategory === category ? "text-amber-700 dark:text-amber-500 font-bold" : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedCategory === category ? "border-amber-700 dark:border-amber-500 bg-amber-700 dark:bg-amber-500 text-white" : "border-stone-300 dark:border-stone-700"}`}>
                        {selectedCategory === category && <Check className="w-3 h-3" />}
                      </div>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-stone-100 dark:bg-stone-800"></div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 mb-4">Price</h3>
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
                      className={`text-left flex items-center gap-3 text-sm py-1.5 transition-colors ${
                        priceRange === range.id ? "text-amber-700 dark:text-amber-500 font-bold" : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${priceRange === range.id ? "border-amber-700 dark:border-amber-500" : "border-stone-300 dark:border-stone-700"}`}>
                        {priceRange === range.id && <div className="w-2 h-2 rounded-full bg-amber-700 dark:bg-amber-500"></div>}
                      </div>
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-stone-100 dark:bg-stone-800"></div>

              {/* Customer Reviews */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 mb-4">Customer Reviews</h3>
                <div className="flex flex-col gap-2">
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                      className={`flex items-center gap-2 text-sm py-1.5 transition-colors ${
                        minRating === rating ? "font-bold text-amber-700 dark:text-amber-500" : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                      }`}
                    >
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200 dark:text-stone-700'}`} />
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
                  className="w-full py-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold text-sm rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}

            </div>
          </aside>

          {/* Right Main Grid */}
          <div className="flex-grow w-full">
            
            {/* Sort Dropdown */}
            <div className="flex justify-end items-center mb-6 z-20 relative">
              <div className="flex items-center gap-2 bg-white dark:bg-[#181818] px-4 py-2 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm text-sm transition-colors">
                <span className="text-stone-500 dark:text-stone-400 font-medium">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-stone-900 dark:text-stone-100 focus:outline-none cursor-pointer appearance-none pr-6 relative dark:[&>option]:bg-[#181818]"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a8a29e%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .2em top 55%', backgroundSize: '.65em auto' }}
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
              <div className="py-32 flex flex-col items-center justify-center bg-white dark:bg-[#181818] rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm transition-colors">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-stone-500 dark:text-stone-400 font-medium">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-white dark:bg-[#181818] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 dark:border-stone-800"
                  >
                    <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      {/* Rating Badge */}
                      {product.rating ? (
                        <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-[#181818]/95 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{product.rating.toFixed(1)}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] text-stone-400 dark:text-stone-500 ml-1">({product.numReviews})</span>
                        </div>
                      ) : null}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                          toast.success(isInWishlist(product.id) ? "Removed from Wishlist" : "Added to Wishlist");
                        }}
                        className="absolute top-4 right-4 bg-white/90 dark:bg-[#181818]/90 backdrop-blur p-2.5 rounded-full hover:bg-white dark:hover:bg-[#202020] shadow-sm transition-all z-10 group/heart"
                      >
                        <Heart className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-stone-400 dark:text-stone-500 group-hover/heart:text-red-500"}`} />
                      </button>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-stone-900/40 dark:bg-stone-900/60 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="bg-white dark:bg-[#181818] px-6 py-2.5 rounded-full font-bold text-stone-900 dark:text-stone-100 tracking-widest text-xs uppercase shadow-xl">Sold Out</span>
                        </div>
                      )}
                    </Link>

                    <div className="p-5 flex flex-col flex-grow">
                      <Link href={`/products/${product.id}`} className="flex flex-col mb-4 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                        <div className="text-[10px] font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-1">{product.category}</div>
                        <h3 className="text-lg font-bold font-playfair text-stone-900 dark:text-stone-100 leading-tight mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm font-medium text-stone-400 dark:text-stone-500 line-through">
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
                        className="mt-auto w-full bg-stone-100 dark:bg-stone-800 hover:bg-amber-800 dark:hover:bg-amber-700 disabled:bg-stone-100 dark:disabled:bg-stone-800 disabled:text-stone-400 dark:disabled:text-stone-600 text-stone-900 dark:text-stone-300 hover:text-white dark:hover:text-white py-3 rounded-xl text-sm font-bold tracking-wide transition-colors flex justify-center items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" /> 
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center bg-white dark:bg-[#181818] rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm transition-colors">
                <div className="w-20 h-20 bg-stone-50 dark:bg-[#121212] rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-stone-400 dark:text-stone-500" />
                </div>
                <h3 className="text-2xl font-bold font-playfair text-stone-900 dark:text-stone-100 mb-2">No matching products</h3>
                <p className="text-stone-500 dark:text-stone-400 max-w-sm mb-8 text-sm">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-stone-900 dark:bg-stone-700 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-stone-800 dark:hover:bg-stone-600 transition-colors shadow-lg"
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
