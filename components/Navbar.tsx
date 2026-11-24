"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, Heart, Search, Moon, Sun, ArrowRight, User, X, Sparkles } from "lucide-react";
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
        if (Array.isArray(data)) setAllProducts(data);
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
    <nav className="sticky top-0 z-50 flex w-full flex-col bg-[#F8F5EF]/92 dark:bg-[#140F0C]/92 backdrop-blur-xl border-b border-[#E5D8C5]/70 dark:border-[#2D221A]/70 shadow-[0_4px_24px_-4px_rgba(36,23,16,0.03)] transition-colors duration-300">
      
      {/* 🌟 Editorial Micro-Banner (Brand Promise) */}
      <div className="w-full bg-[#241710] dark:bg-[#1A120D] text-[#EFE7DA] py-1 px-4 text-center border-b border-[#38251C]">
        <p className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.16em] uppercase flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-[#C69A4B] animate-pulse" />
          <span>Complimentary Insured Delivery on Orders Over ₹999</span>
          <span className="hidden sm:inline text-[#C69A4B]">•</span>
          <span className="hidden sm:inline text-[#C69A4B]">Heirloom Wooden Artistry</span>
        </p>
      </div>

      <div className="flex w-full items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5 gap-2 sm:gap-4 max-w-[1440px] mx-auto">

        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-sm ring-1 ring-[#E5D8C5] dark:ring-[#2D221A] group-hover:ring-[#C69A4B] transition-all duration-300">
            <Image
              src="/logo.jpeg"
              alt="KaashtaCrafts"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold font-playfair tracking-tight text-[#241710] dark:text-[#F8F5EF] group-hover:text-[#38251C] dark:group-hover:text-[#C69A4B] transition-colors leading-tight">
              Kaashta Crafts
            </span>
            <span className="text-[8px] uppercase tracking-[0.22em] text-[#7D7368] dark:text-[#A3968A] font-sans font-semibold -mt-0.5 hidden sm:block">
              Artisanal Woodcraft • Est. 2024
            </span>
          </div>
        </Link>

        {/* Middle Section: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-grow max-w-md lg:max-w-lg px-2 relative" ref={searchContainerRef}>
          <form onSubmit={handleSearch} className="flex w-full items-center bg-white/85 dark:bg-[#1D1510]/85 rounded-full overflow-hidden border border-[#E5D8C5] dark:border-[#2D221A] focus-within:border-[#C69A4B] focus-within:ring-2 focus-within:ring-[#C69A4B]/20 transition-all shadow-2xs relative z-10 h-9">
            <div className="pl-3.5 text-[#7D7368] dark:text-[#A3968A]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Search handcrafted pieces, decor, gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-transparent px-3 py-1 text-xs sm:text-sm text-[#241710] dark:text-[#F8F5EF] placeholder:text-[#7D7368]/70 dark:placeholder:text-[#A3968A]/60 outline-none font-sans"
            />
          </form>

          {/* Desktop Suggestions Dropdown */}
          {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
            <div className="absolute top-full left-2 right-2 mt-2 bg-[#F8F5EF] dark:bg-[#1D1510] rounded-2xl shadow-2xl border border-[#E5D8C5] dark:border-[#2D221A] z-50 flex flex-col overflow-hidden max-h-80 overflow-y-auto">
              {suggestions.map((p) => (
                <Link
                  href={`/products/${p.id || p._id}`}
                  key={p.id || p._id}
                  onClick={() => {
                    setShowSuggestions(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-3.5 p-3 hover:bg-white/80 dark:hover:bg-[#261D17]/80 border-b border-[#E5D8C5]/50 dark:border-[#2D221A]/50 last:border-0 transition-colors"
                >
                  <div className="w-10 h-10 relative shrink-0 rounded-lg overflow-hidden bg-[#EFE7DA] dark:bg-[#261D17]">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="text-xs font-bold text-[#241710] dark:text-[#F8F5EF] line-clamp-1">{p.name}</span>
                    <span className="text-[11px] text-[#7D7368] dark:text-[#A3968A]">{p.category} • ₹{p.price}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C69A4B]" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Navigation Links & Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">

          {/* Desktop Nav Links - Luxury Segmented Capsule */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-[#EFE7DA]/60 dark:bg-[#1D1510]/80 rounded-full border border-[#E5D8C5] dark:border-[#2D221A] shadow-2xs">
            {navLinks.map((link) => {
              const active = link.isActive;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 select-none cursor-pointer ${active
                    ? "bg-[#241710] text-[#F8F5EF] dark:bg-[#C69A4B] dark:text-[#241710] shadow-sm ring-1 ring-[#C69A4B]/40 scale-[1.02]"
                    : "text-[#241710]/75 dark:text-[#F8F5EF]/75 hover:text-[#241710] dark:hover:text-[#F8F5EF] hover:bg-white/80 dark:hover:bg-[#261D17] hover:shadow-2xs hover:scale-[1.02]"
                    }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C69A4B] dark:bg-[#241710] animate-pulse shrink-0" />
                  )}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:border-l lg:border-[#E5D8C5] dark:lg:border-[#2D221A] lg:pl-5">

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-[#241710] dark:text-[#F8F5EF] hover:bg-white/80 dark:hover:bg-[#261D17] transition-all cursor-pointer border border-transparent hover:border-[#E5D8C5] dark:hover:border-[#2D221A]"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#C69A4B]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#38251C]" />
                )}
              </button>
            )}

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full text-[#241710] dark:text-[#F8F5EF] hover:bg-white/80 dark:hover:bg-[#261D17] transition-all group border border-transparent hover:border-[#E5D8C5] dark:hover:border-[#2D221A]"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8] group-hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C69A4B] text-[#241710] text-[10px] font-extrabold flex items-center justify-center rounded-full shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-[#241710] dark:text-[#F8F5EF] hover:bg-white/80 dark:hover:bg-[#261D17] transition-all group border border-transparent hover:border-[#E5D8C5] dark:hover:border-[#2D221A]"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8] group-hover:text-[#C69A4B] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#241710] dark:bg-[#C69A4B] text-[#F8F5EF] dark:text-[#241710] text-[10px] font-extrabold flex items-center justify-center rounded-full shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Session Profile / Login CTA */}
            {session ? (
              <div className="relative flex items-center ml-1" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="focus:outline-none relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full ring-2 ring-[#E5D8C5] dark:ring-[#2D221A] hover:ring-[#C69A4B] overflow-hidden shrink-0 transition-all cursor-pointer"
                >
                  <Image
                    src={session.user?.image || "https://ui-avatars.com/api/?name=" + session.user?.name}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-52 bg-[#F8F5EF] dark:bg-[#1D1510] rounded-2xl shadow-2xl border border-[#E5D8C5] dark:border-[#2D221A] py-2 flex flex-col z-50">
                    <div className="px-4 py-2.5 border-b border-[#E5D8C5] dark:border-[#2D221A] mb-1">
                      <p className="text-[10px] text-[#7D7368] dark:text-[#A3968A] font-semibold uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-[#241710] dark:text-[#F8F5EF] truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-[#7D7368] dark:text-[#A3968A] truncate mt-0.5">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#241710] dark:text-[#F8F5EF] hover:bg-white/80 dark:hover:bg-[#261D17] hover:text-[#C69A4B] transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/my-orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#241710] dark:text-[#F8F5EF] hover:bg-white/80 dark:hover:bg-[#261D17] hover:text-[#C69A4B] transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-white/80 dark:hover:bg-[#261D17] transition-colors border-t border-[#E5D8C5]/60 dark:border-[#2D221A]/60 mt-1 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="ml-1 px-4 sm:px-5 py-1.5 sm:py-2 bg-[#241710] hover:bg-[#38251C] dark:bg-[#C69A4B] dark:hover:bg-[#DFB76C] text-[#F8F5EF] dark:text-[#241710] text-xs font-bold tracking-wider uppercase rounded-full shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-[#241710] dark:text-[#F8F5EF] hover:bg-white/80 dark:hover:bg-[#261D17] transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[1.8] text-[#C69A4B]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.8]" />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="lg:hidden w-full px-4 pb-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white/95 dark:bg-[#1D1510]/95 rounded-2xl p-2.5 border border-[#E5D8C5] dark:border-[#2D221A] shadow-xl flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = link.isActive;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center justify-between transition-all ${active
                    ? "bg-[#241710] text-[#F8F5EF] dark:bg-[#C69A4B] dark:text-[#241710] shadow-sm"
                    : "text-[#241710]/80 dark:text-[#F8F5EF]/80 hover:bg-[#EFE7DA]/60 dark:hover:bg-[#261D17]"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#C69A4B] dark:bg-[#241710]" />}
                    {link.name}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${active ? "text-[#C69A4B] dark:text-[#241710]" : "text-[#7D7368]"}`} />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Search Bar */}
      <div className="md:hidden w-full px-3 pb-2 relative" ref={mobileSearchRef}>
        <form onSubmit={handleSearch} className="flex w-full items-center bg-white/90 dark:bg-[#1D1510]/90 rounded-full overflow-hidden border border-[#E5D8C5] dark:border-[#2D221A] focus-within:border-[#C69A4B] shadow-2xs h-8.5">
          <div className="pl-3 text-[#7D7368]">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search handcrafted pieces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full bg-transparent px-2.5 py-1 text-xs text-[#241710] dark:text-[#F8F5EF] placeholder:text-[#7D7368]/70 outline-none"
          />
        </form>

        {/* Mobile Suggestions Dropdown */}
        {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-[#F8F5EF] dark:bg-[#1D1510] rounded-2xl shadow-xl border border-[#E5D8C5] dark:border-[#2D221A] z-50 flex flex-col overflow-hidden max-h-72 overflow-y-auto">
            {suggestions.map((p) => (
              <Link
                href={`/products/${p.id || p._id}`}
                key={p.id || p._id}
                onClick={() => {
                  setShowSuggestions(false);
                  setSearchQuery("");
                }}
                className="flex items-center gap-3 p-2.5 hover:bg-white/80 dark:hover:bg-[#261D17] border-b border-[#E5D8C5]/60 dark:border-[#2D221A]/60 last:border-0 transition-colors"
              >
                <div className="w-9 h-9 relative shrink-0 rounded-lg overflow-hidden bg-[#EFE7DA] dark:bg-[#261D17]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="text-xs font-bold text-[#241710] dark:text-[#F8F5EF] line-clamp-1">{p.name}</span>
                  <span className="text-[10px] text-[#7D7368]">{p.category} • ₹{p.price}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[#C69A4B]" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
