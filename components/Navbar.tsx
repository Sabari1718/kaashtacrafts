"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, Heart, Search, Moon, Sun, ArrowRight, User, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
    setShowSuggestions(false);
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const suggestions = searchQuery.trim() 
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/", isActive: pathname === "/" },
    { name: "Shop All", href: "/products", isActive: pathname.startsWith("/products") },
    { name: "My Orders", href: "/my-orders", isActive: pathname.startsWith("/my-orders") },
  ];

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col bg-[#F7F5F0]/95 dark:bg-[#14100E]/95 backdrop-blur-md border-b border-[#EAE1D2]/80 dark:border-[#2E241E]/80 transition-colors duration-300">
      <div className="flex w-full items-center justify-between px-3 sm:px-6 lg:px-8 pt-1 pb-0 gap-2 sm:gap-3 max-w-[1440px] mx-auto">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden shadow-xs ring-1 ring-[#EAE1D2] dark:ring-[#2E241E] group-hover:ring-[#C49A50] transition-all duration-300">
            <Image
              src="/logo.jpeg"
              alt="KaashtaCrafts"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold font-playfair tracking-tight text-[#241812] dark:text-[#F7F5F0] transition-colors leading-tight">
              Kaashta Crafts
            </span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#82786E] dark:text-[#A39A90] font-sans font-medium -mt-0.5 hidden sm:block">
              Artisanal Woodcraft
            </span>
          </div>
        </Link>

        {/* Middle Section: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-grow max-w-md lg:max-w-lg px-4 relative" ref={searchContainerRef}>
          <form onSubmit={handleSearch} className="flex w-full items-center bg-white/80 dark:bg-[#1E1713]/80 rounded-full overflow-hidden border border-[#EAE1D2] dark:border-[#2E241E] focus-within:border-[#C49A50] focus-within:ring-2 focus-within:ring-[#C49A50]/20 transition-all shadow-xs relative z-10 h-8.5">
            <div className="pl-3.5 text-[#82786E] dark:text-[#A39A90]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input 
              type="text" 
              placeholder="Search handcrafted pieces, decor, gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-transparent px-2.5 py-1 text-xs sm:text-sm text-[#241812] dark:text-[#F7F5F0] placeholder:text-[#82786E]/70 dark:placeholder:text-[#A39A90]/60 outline-none"
            />
          </form>

          {/* Desktop Suggestions Dropdown */}
          {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-[#F7F5F0] dark:bg-[#1E1713] rounded-2xl shadow-xl border border-[#EAE1D2] dark:border-[#2E241E] z-50 flex flex-col overflow-hidden max-h-80 overflow-y-auto">
              {suggestions.map((p) => (
                <Link 
                  href={`/products/${p.id || p._id}`} 
                  key={p.id || p._id}
                  onClick={() => {
                    setShowSuggestions(false);
                    setSearchQuery("");
                  }} 
                  className="flex items-center gap-3.5 p-3 hover:bg-white/80 dark:hover:bg-[#2E241E]/60 border-b border-[#EAE1D2]/60 dark:border-[#2E241E]/60 last:border-0 transition-colors"
                >
                  <div className="w-10 h-10 relative shrink-0 rounded-lg overflow-hidden bg-stone-200">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="text-xs font-bold text-[#241812] dark:text-[#F7F5F0] line-clamp-1">{p.name}</span>
                    <span className="text-[11px] text-[#82786E] dark:text-[#A39A90]">{p.category} • ₹{p.price}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C49A50]" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Navigation Links & Action Icons */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          
          {/* Desktop Nav Links - Luxury Segmented Capsule */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-[#EAE1D2]/50 dark:bg-[#1E1713]/80 rounded-full border border-[#EAE1D2] dark:border-[#2E241E] shadow-2xs">
            {navLinks.map((link) => {
              const active = link.isActive;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 select-none cursor-pointer ${
                    active
                      ? "bg-[#241812] text-[#F7F5F0] dark:bg-[#C49A50] dark:text-[#241812] shadow-sm ring-1 ring-[#C49A50]/40 scale-[1.02]"
                      : "text-[#241812]/75 dark:text-[#F7F5F0]/75 hover:text-[#241812] dark:hover:text-[#F7F5F0] hover:bg-white/80 dark:hover:bg-[#2E241E] hover:shadow-xs hover:scale-[1.02]"
                  }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C49A50] dark:bg-[#241812] animate-pulse shrink-0" />
                  )}
                  <span>{link.name}</span>
                  {!active && (
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#C49A50] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full origin-center" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:border-l lg:border-[#EAE1D2] dark:lg:border-[#2E241E] lg:pl-6">
            
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-[#241812] dark:text-[#F7F5F0] hover:bg-white/80 dark:hover:bg-[#2E241E] transition-all cursor-pointer"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#C49A50]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#65452F]" />
                )}
              </button>
            )}

            {/* Wishlist Icon */}
            <Link 
              href="/wishlist" 
              className="relative p-2 rounded-full text-[#241812] dark:text-[#F7F5F0] hover:bg-white/80 dark:hover:bg-[#2E241E] transition-all group"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8] group-hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C49A50] text-[#241812] text-[10px] font-extrabold flex items-center justify-center rounded-full shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link 
              href="/cart" 
              className="relative p-2 rounded-full text-[#241812] dark:text-[#F7F5F0] hover:bg-white/80 dark:hover:bg-[#2E241E] transition-all group"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8] group-hover:text-[#C49A50] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#241812] dark:bg-[#C49A50] text-[#F7F5F0] dark:text-[#241812] text-[10px] font-extrabold flex items-center justify-center rounded-full shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User Session Profile / Login CTA */}
            {session ? (
              <div className="relative flex items-center ml-1" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)} 
                  className="focus:outline-none relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full ring-2 ring-[#EAE1D2] dark:ring-[#2E241E] hover:ring-[#C49A50] overflow-hidden shrink-0 transition-all cursor-pointer"
                >
                  <Image 
                    src={session.user?.image || "https://ui-avatars.com/api/?name=" + session.user?.name} 
                    alt="Profile" 
                    fill
                    className="object-cover"
                  />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-48 bg-[#F7F5F0] dark:bg-[#1E1713] rounded-2xl shadow-xl border border-[#EAE1D2] dark:border-[#2E241E] py-2 flex flex-col z-50">
                    <div className="px-4 py-2.5 border-b border-[#EAE1D2] dark:border-[#2E241E] mb-1">
                      <p className="text-[10px] text-[#82786E] dark:text-[#A39A90] font-semibold uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-[#241812] dark:text-[#F7F5F0] truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-[#82786E] dark:text-[#A39A90] truncate mt-0.5">{session.user?.email}</p>
                    </div>
                    <Link 
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#241812] dark:text-[#F7F5F0] hover:bg-white/80 dark:hover:bg-[#2E241E] hover:text-[#C49A50] transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/my-orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#241812] dark:text-[#F7F5F0] hover:bg-white/80 dark:hover:bg-[#2E241E] hover:text-[#C49A50] transition-colors"
                    >
                      My Orders
                    </Link>
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-white/80 dark:hover:bg-[#2E241E] transition-colors border-t border-[#EAE1D2]/60 dark:border-[#2E241E]/60 mt-1 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => signIn("google")}
                className="ml-1 px-4 sm:px-5 py-1.5 sm:py-2 bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] text-[#F7F5F0] dark:text-[#241812] text-xs font-bold tracking-wider rounded-full shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-[#241812] dark:text-[#F7F5F0] hover:bg-white/80 dark:hover:bg-[#2E241E] transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[1.8] text-[#C49A50]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.8]" />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="lg:hidden w-full px-4 pb-3.5 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white/95 dark:bg-[#1A130F]/95 rounded-2xl p-2.5 border border-[#EAE1D2] dark:border-[#2E241E] shadow-xl flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = link.isActive;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center justify-between transition-all ${
                    active
                      ? "bg-[#241812] text-[#F7F5F0] dark:bg-[#C49A50] dark:text-[#241812] shadow-sm"
                      : "text-[#241812]/80 dark:text-[#F7F5F0]/80 hover:bg-[#EAE1D2]/60 dark:hover:bg-[#2E241E]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#C49A50] dark:bg-[#241812]" />}
                    {link.name}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${active ? "text-[#C49A50] dark:text-[#241812]" : "text-[#82786E]"}`} />
                </Link>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Mobile Search Bar */}
      <div className="md:hidden w-full px-3 pb-1.5 relative" ref={mobileSearchRef}>
        <form onSubmit={handleSearch} className="flex w-full items-center bg-white/90 dark:bg-[#1E1713]/90 rounded-full overflow-hidden border border-[#EAE1D2] dark:border-[#2E241E] focus-within:border-[#C49A50] shadow-2xs">
          <div className="pl-3 text-[#82786E]">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input 
            type="text" 
            placeholder="Search handcrafted pieces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full bg-transparent px-2.5 py-1 text-xs text-[#241812] dark:text-[#F7F5F0] placeholder:text-[#82786E]/70 outline-none"
          />
        </form>

        {/* Mobile Suggestions Dropdown */}
        {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-[#F7F5F0] dark:bg-[#1E1713] rounded-2xl shadow-xl border border-[#EAE1D2] dark:border-[#2E241E] z-50 flex flex-col overflow-hidden max-h-72 overflow-y-auto">
            {suggestions.map((p) => (
              <Link 
                href={`/products/${p.id || p._id}`} 
                key={p.id || p._id}
                onClick={() => {
                  setShowSuggestions(false);
                  setSearchQuery("");
                }} 
                className="flex items-center gap-3 p-2.5 hover:bg-white/80 dark:hover:bg-[#2E241E] border-b border-[#EAE1D2]/60 dark:border-[#2E241E]/60 last:border-0 transition-colors"
              >
                <div className="w-9 h-9 relative shrink-0 rounded-lg overflow-hidden bg-stone-200">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="text-xs font-bold text-[#241812] dark:text-[#F7F5F0] line-clamp-1">{p.name}</span>
                  <span className="text-[10px] text-[#82786E]">{p.category} • ₹{p.price}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[#C49A50]" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
