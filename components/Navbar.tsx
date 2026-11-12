"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, Heart, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCart } from "../app/context/CartContext";
import { useWishlist } from "../app/context/WishlistContext";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setAllProducts(data);
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/products`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const suggestions = searchQuery.trim() 
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col bg-[#fcfaf7]/95 dark:bg-[#0c0a09]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-850 shadow-xs transition-colors duration-300">
      <div className="flex w-full items-center justify-between px-4 md:px-8 lg:px-12 py-3 gap-4">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.jpeg"
          alt="KaashtaCrafts Logo"
          width={44}
          height={44}
          className="rounded-md"
        />
        <h1 className="text-2xl md:text-3xl font-semibold font-sans tracking-tight text-stone-900 dark:text-stone-100 transition-colors">
          Kaashta Crafts
        </h1>
      </Link>

      {/* Middle Section: Search Bar */}
      <div className="hidden md:flex flex-grow max-w-3xl px-8 relative" ref={searchContainerRef}>
        <form onSubmit={handleSearch} className="flex w-full items-center bg-gray-100 dark:bg-stone-800/50 rounded-lg overflow-hidden border border-transparent dark:border-stone-700 focus-within:border-blue-500 dark:focus-within:border-amber-500 focus-within:bg-white dark:focus-within:bg-[#121212] transition-all shadow-inner relative z-10">
          <div className="pl-4 text-gray-500 dark:text-stone-400">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search for Products, Brands and More"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full bg-transparent px-4 py-2.5 outline-none text-gray-800 dark:text-stone-200 placeholder:text-gray-500 dark:placeholder:text-stone-500 text-sm"
          />
        </form>

        {/* Desktop Suggestions Dropdown */}
        {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
          <div className="absolute top-full left-8 right-8 mt-2 bg-white dark:bg-[#181818] rounded-lg shadow-xl border border-stone-100 dark:border-stone-800 z-50 flex flex-col overflow-hidden max-h-80 overflow-y-auto">
            {suggestions.map((p) => (
              <Link 
                href={`/products/${p.id || p._id}`} 
                key={p.id || p._id}
                onClick={() => {
                  setShowSuggestions(false);
                  setSearchQuery("");
                }} 
                className="flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-[#1f1f1f] border-b border-stone-50 dark:border-stone-800/50 last:border-0 transition-colors"
              >
                <div className="w-10 h-10 relative shrink-0">
                  <Image src={p.image} alt={p.name} fill className="rounded-md object-cover bg-stone-100 dark:bg-stone-800" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-200 line-clamp-1">{p.name}</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">{p.category} • ₹{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Right Section: Links + Icons */}
      <div className="flex items-center gap-4 md:gap-8">
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-gray-700 dark:text-stone-300">
          <Link href="/" className="hover:text-amber-800 dark:hover:text-amber-500 transition-colors">Home</Link>
          <Link href="/products" className="hover:text-amber-800 dark:hover:text-amber-500 transition-colors">Shop All</Link>
          <Link href="/my-orders" className="hover:text-amber-800 dark:hover:text-amber-500 transition-colors">My Orders</Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4 md:border-l md:border-stone-200 md:pl-8 dark:border-stone-700">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-stone-800 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-500 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" /> : <Moon className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />}
            </button>
          )}

          <Link href="/wishlist" className="relative p-2 text-stone-800 dark:text-stone-300 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative p-2 text-stone-800 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-500 transition-colors">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-amber-800 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          
          {session ? (
            <div className="relative flex items-center ml-1 md:ml-2" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="focus:outline-none relative z-50 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 overflow-hidden shrink-0"
              >
                <Image 
                  src={session.user?.image || "https://ui-avatars.com/api/?name=" + session.user?.name} 
                  alt="Profile" 
                  fill
                  className="object-cover hover:opacity-80 transition-opacity"
                />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-44 bg-white dark:bg-stone-900 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-stone-100 dark:border-stone-800 py-1 flex flex-col z-50">
                  <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 mb-1">
                    <p className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase tracking-wider mb-1">Account</p>
                    <p className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">{session.user?.name}</p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">{session.user?.email}</p>
                  </div>
                  <Link 
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left px-4 py-3 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:text-amber-700 dark:hover:text-amber-500 transition-colors uppercase tracking-wider border-b border-stone-50 dark:border-stone-800/50"
                  >
                    My Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => signIn("google")}
              className="ml-1 md:ml-2 px-4 md:px-5 py-1.5 md:py-2 bg-stone-900 dark:bg-amber-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full hover:bg-stone-800 dark:hover:bg-amber-700 transition-colors"
            >
              Login
            </button>
          )}

          <button className="md:hidden p-2 ml-1 text-gray-800 dark:text-stone-200">
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>
      </div>
      </div>
      
      {/* Mobile Search Bar (shows below navbar on small screens) */}
      <div className="md:hidden w-full px-4 pb-3 relative" ref={mobileSearchRef}>
        <form onSubmit={handleSearch} className="flex w-full items-center bg-gray-100 dark:bg-stone-800/50 rounded-md overflow-hidden relative z-10 border border-transparent dark:border-stone-700">
          <div className="pl-3 text-gray-500 dark:text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search for Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full bg-transparent px-3 py-2 outline-none text-gray-800 dark:text-stone-200 placeholder:text-gray-500 dark:placeholder:text-stone-500 text-sm"
          />
        </form>

        {/* Mobile Suggestions Dropdown */}
        {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-[#181818] rounded-lg shadow-xl border border-stone-100 dark:border-stone-800 z-50 flex flex-col overflow-hidden max-h-80 overflow-y-auto">
            {suggestions.map((p) => (
              <Link 
                href={`/products/${p.id || p._id}`} 
                key={p.id || p._id}
                onClick={() => {
                  setShowSuggestions(false);
                  setSearchQuery("");
                }} 
                className="flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 border-b border-stone-50 dark:border-stone-800/50 last:border-0 transition-colors"
              >
                <div className="w-10 h-10 relative shrink-0">
                  <Image src={p.image} alt={p.name} fill className="rounded-md object-cover bg-stone-100" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-200 line-clamp-1">{p.name}</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">{p.category} • ₹{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
