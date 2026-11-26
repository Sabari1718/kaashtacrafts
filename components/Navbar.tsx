"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, Heart, Search, Moon, Sun, ArrowRight, X, Home, Sparkles, PhoneCall, Package } from "lucide-react";
import { useTheme } from "next-themes";
import { useCart } from "../app/context/CartContext";
import { useWishlist } from "../app/context/WishlistContext";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const marqueeItems = [
  "Master Tamil Woodcarvers",
  "Natural Beeswax Finish",
  "Zero Chemical Dyes",
  "Heirloom Grade Quality",
  "Ethical Forest Stewardship",
  "Pan-India Delivery",
  "2,500+ Homes Adorned",
  "Sustainably Harvested Teak",
];

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setMounted(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAllProducts(data); })
      .catch(console.error);

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchQuery.trim() ? `/products?search=${encodeURIComponent(searchQuery.trim())}` : `/products`);
    setShowSuggestions(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsSearchOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) setShowSuggestions(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) setIsMobileMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { 
    setIsMobileMenuOpen(false); 
    setIsSearchOpen(false);
  }, [pathname]);

  const suggestions = searchQuery.trim()
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Home", href: "/", isActive: pathname === "/", icon: Home },
    { name: "Shop All", href: "/products", isActive: pathname.startsWith("/products"), icon: Sparkles },
    { name: "Contact Us", href: "/contact", isActive: pathname.startsWith("/contact"), icon: PhoneCall },
    { name: "My Orders", href: "/my-orders", isActive: pathname.startsWith("/my-orders"), icon: Package },
  ];

  return (
    <>
      {/* ── TOP ANNOUNCEMENT / MARQUEE TRUST STRIP (ABOVE NAVBAR) ── */}
      <div className="w-full bg-[#0A0807] border-b border-[#D4AF37]/25 py-2 overflow-hidden shadow-xs relative z-50">
        <div className="marquee-track gap-0">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center gap-5 sm:gap-6 px-4 sm:px-6 shrink-0">
              <span className="label-luxury text-[#F3E5AB] font-bold tracking-[0.2em] sm:tracking-[0.22em] text-[9px] sm:text-[9.5px] uppercase whitespace-nowrap">{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] shadow-[0_0_6px_#D4AF37] shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <nav className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#0C0A09]/95 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-stone-200/80 dark:border-[#C49A50]/20"
          : "bg-white/98 dark:bg-[#0C0A09]/98 backdrop-blur-md border-b border-stone-200/60 dark:border-[#C49A50]/15"
      }`}>
        <div className="max-w-[1800px] w-full mx-auto px-3 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-18 lg:h-20 gap-2 sm:gap-4">

            {/* ── LEFT: HAMBURGER (MOBILE) + BRAND LOGO + DESKTOP NAV ICONS ── */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 shrink-0">
              
              {/* Mobile Menu Button on Left (Clean, tactile, easy reach) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[#21150F] dark:text-[#FAF6EE] bg-[#FAF7F2] dark:bg-[#16120E] border border-[#E5D7C4] dark:border-[#C49A50]/25 shadow-xs hover:border-[#C69A4B] active:scale-95 transition-all cursor-pointer shrink-0"
                aria-label="Open navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4 text-[#C69A4B]" /> : <Menu className="w-4.5 h-4.5" />}
              </button>

              {/* BRAND (CLASSY ULTRA-PREMIUM HERITAGE WOODCRAFT BADGE) */}
              <Link
                href="/"
                className="group flex items-center gap-2 sm:gap-2.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl bg-[#FCFAF6] dark:bg-[#14100D] border border-[#E5D7C4] dark:border-[#C49A50]/25 shadow-[0_4px_12px_rgba(42,22,13,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:border-[#C69A4B]/80 hover:shadow-[0_6px_22px_rgba(198,154,75,0.25)] hover:scale-102 active:scale-98 transition-all duration-300 shrink-0 cursor-pointer"
              >
                {/* Logo Avatar */}
                <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden ring-1.5 ring-[#C69A4B]/70 shadow-sm shrink-0 bg-[#2E1A11]">
                  <Image
                    src="/logo.jpg"
                    alt="Kaashta Crafts"
                    fill
                    priority
                    className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Brand Name */}
                <div className="flex flex-col justify-center">
                  <span className="font-playfair font-extrabold tracking-tight text-[#22130D] dark:text-[#FAF6EE] text-[15px] sm:text-[18px] lg:text-[20px] leading-tight">
                    Kaashta<span className="text-[#A27223] dark:text-[#E2BA69] font-bold ml-0.5">Crafts</span>
                  </span>
                  <span className="hidden sm:block text-[7.5px] text-[#8C7B6D] dark:text-[#A3988C] tracking-[0.2em] uppercase font-sans font-semibold -mt-0.5">
                    Crafting Memories in Wood
                  </span>
                </div>
              </Link>

              {/* ── DESKTOP NAV ICONS (RIGHT NEXT TO LOGO, HOVER TOOLTIP LABEL, ACTIVE HIGHLIGHT) ── */}
              <div className="hidden lg:flex items-center gap-2.5 xl:gap-3.5">
                {navLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="group relative flex flex-col items-center justify-center cursor-pointer p-0.5"
                      aria-label={link.name}
                    >
                      {/* The Icon Button */}
                      <div
                        className={`w-10 h-10 xl:w-10.5 xl:h-10.5 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          link.isActive
                            ? "bg-gradient-to-br from-[#21130E] to-[#120B07] text-[#E6C477] dark:from-[#C49A50] dark:via-[#D4AF37] dark:to-[#B88636] dark:text-[#0C0A09] shadow-[0_6px_20px_rgba(33,19,14,0.3),0_0_15px_rgba(201,154,69,0.4)] scale-105 ring-2 ring-[#C99A45]"
                            : "text-[#5C4838] dark:text-[#D8CFBF] bg-[#FAF7F2] dark:bg-[#16120E] border border-stone-200/80 dark:border-[#C49A50]/20 hover:bg-[#21130E] hover:text-[#E6C477] dark:hover:bg-[#1E1712] dark:hover:text-[#E2BA69] hover:shadow-md hover:scale-108 active:scale-95"
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5 xl:w-5 xl:h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      {/* Active Indicator Underneath */}
                      {link.isActive && (
                        <span className="w-2.5 h-[2.5px] rounded-full bg-gradient-to-r from-[#C99A45] via-[#E6C477] to-[#C99A45] shadow-[0_0_8px_#C99A45] mt-1" />
                      )}

                      {/* Name Appears Below On Hover ("over pannuna name kila vara maari venum") */}
                      <div className="absolute top-[108%] left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#21130E] dark:bg-[#1C1612] text-[#F7F3EB] dark:text-[#E2BA69] text-[10.5px] font-black uppercase tracking-wider shadow-xl border border-[#C99A45]/30 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-y-1 translate-y-0 transition-all duration-200 whitespace-nowrap z-50">
                        <span>{link.name}</span>
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#21130E] dark:bg-[#1C1612] border-t border-l border-[#C99A45]/30" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT AREA: NAVBAR SEARCH BAR + ACTION ICONS ── */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

              {/* Desktop Search Bar (Expandable in Navbar) */}
              <div className="hidden md:flex relative items-center justify-end" ref={searchContainerRef}>
                {isSearchOpen ? (
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center w-60 sm:w-72 md:w-80 lg:w-96 bg-[#FAF7F2] dark:bg-[#16120E] rounded-full h-9.5 pl-3.5 pr-2 border-2 border-[#C99A45] shadow-[0_4px_16px_rgba(201,154,69,0.2)] animate-in fade-in slide-in-from-right-3 duration-200 relative"
                  >
                    <Search className="w-4 h-4 text-[#C69A4B] shrink-0 mr-2" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search pieces..."
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      className="flex-1 bg-transparent text-xs sm:text-sm text-[#21150F] dark:text-[#FAF6EE] placeholder:text-[#7A6E63]/70 dark:placeholder:text-[#A3988C]/60 outline-none font-medium"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-[11px] text-[#7A6E63] hover:text-[#21150F] dark:hover:text-[#FAF6EE] font-bold px-1.5 mr-1 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => { setIsSearchOpen(false); setShowSuggestions(false); }}
                      className="w-6 h-6 rounded-full flex items-center justify-center bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-[#21130E] hover:text-white dark:hover:bg-[#C49A50] dark:hover:text-black transition-all cursor-pointer shrink-0"
                      aria-label="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Live Suggestions Dropdown attached directly to the navbar search bar */}
                    {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
                      <div className="absolute top-[115%] left-0 right-0 bg-white dark:bg-[#14100D] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-[#E0D3BE] dark:border-[#C49A50]/30 z-50 overflow-hidden divide-y divide-stone-100 dark:divide-[#C49A50]/15">
                        {suggestions.map(p => (
                          <Link
                            href={`/products/${p.id || p._id}`}
                            key={p.id || p._id}
                            onClick={() => { setShowSuggestions(false); setIsSearchOpen(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 p-3 hover:bg-[#FAF7F2] dark:hover:bg-[#1E1712] transition-colors"
                          >
                            <div className="w-10 h-10 relative shrink-0 rounded-lg overflow-hidden bg-stone-100 dark:bg-[#1E1712] shadow-inner">
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0 text-left">
                              <span className="text-xs font-bold text-[#21150F] dark:text-[#FAF6EE] line-clamp-1">{p.name}</span>
                              <span className="text-[10px] text-[#7A6E63] dark:text-[#A3988C]">{p.category} · ₹{p.price}</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#C69A4B] dark:text-[#E2BA69] shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setIsSearchOpen(true);
                      setTimeout(() => searchInputRef.current?.focus(), 80);
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#21130E] dark:text-[#FAF6EE] border border-stone-200/80 dark:border-[#C49A50]/20 bg-[#FAF7F2] dark:bg-[#14100D] hover:border-[#C99A45] hover:bg-[#21130E] hover:text-[#E6C477] dark:hover:bg-[#1E1712] dark:hover:text-[#E2BA69] dark:hover:border-[#E2BA69]/60 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                    aria-label="Open Search in Navbar"
                    title="Search pieces"
                  >
                    <Search className="w-4 h-4 stroke-[2.2]" />
                  </button>
                )}
              </div>

              {/* Mobile Search Toggle Button */}
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (!isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
                }}
                className={`md:hidden w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  isSearchOpen
                    ? "bg-[#21130E] text-[#E6C477] border-[#C99A45]"
                    : "text-[#21130E] dark:text-[#FAF6EE] bg-[#FAF7F2] dark:bg-[#14100D] border-stone-200/80 dark:border-[#C49A50]/20"
                }`}
                aria-label="Toggle Mobile Search"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>

              {/* Theme Toggle (Hidden on small mobile screens to keep row spacious, accessible in mobile drawer) */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full items-center justify-center text-[#21130E] dark:text-[#FAF6EE] border border-stone-200/80 dark:border-[#C49A50]/20 bg-[#FAF7F2] dark:bg-[#14100D] hover:border-[#C99A45] hover:bg-[#21130E] hover:text-[#E6C477] dark:hover:bg-[#1E1712] dark:hover:text-[#E2BA69] dark:hover:border-[#E2BA69]/60 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                  aria-label="Toggle Theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4 text-[#E2BA69]" /> : <Moon className="w-4 h-4 stroke-[2.2]" />}
                </button>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#21130E] dark:text-[#FAF6EE] border border-stone-200/80 dark:border-[#C49A50]/20 bg-[#FAF7F2] dark:bg-[#14100D] hover:border-[#C99A45] hover:bg-[#21130E] hover:text-red-400 dark:hover:bg-[#1E1712] dark:hover:text-red-400 dark:hover:border-[#E2BA69]/60 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 group"
                aria-label="Wishlist"
              >
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] group-hover:text-red-400 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-[#C99A45] text-[#21130E] text-[9px] sm:text-[10px] font-black flex items-center justify-center rounded-full shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#21130E] dark:text-[#FAF6EE] border border-stone-200/80 dark:border-[#C49A50]/20 bg-[#FAF7F2] dark:bg-[#14100D] hover:border-[#C99A45] hover:bg-[#21130E] hover:text-[#E6C477] dark:hover:bg-[#1E1712] dark:hover:text-[#E2BA69] dark:hover:border-[#E2BA69]/60 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 group"
                aria-label="Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] group-hover:text-[#E6C477] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-gradient-to-r from-[#D4AF37] to-[#C99A45] text-[#0C0A09] text-[9px] sm:text-[10px] font-black flex items-center justify-center rounded-full shadow-xs ring-1 ring-[#21130E]/20">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth / Profile */}
              {session ? (
                <div className="relative ml-0.5 sm:ml-1" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-[#C99A45] hover:scale-110 overflow-hidden shadow-xs transition-all duration-200 cursor-pointer"
                  >
                    <Image src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}`} alt="Profile" width={36} height={36} className="object-cover w-full h-full" />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-3 w-52 bg-white dark:bg-[#1E1510] rounded-2xl shadow-2xl border border-stone-200 dark:border-[#2C2018] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-[#E0D3BE]/60 dark:border-[#2C2018]/60 mb-1">
                        <p className="text-[9px] text-[#7A6E63] font-semibold uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold text-[#21150F] dark:text-[#F7F3EB] truncate">{session.user?.name}</p>
                        <p className="text-[10px] text-[#7A6E63] truncate mt-0.5">{session.user?.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-xs font-semibold text-[#21150F] dark:text-[#FAF6EE] hover:bg-[#EDE5D8] dark:hover:bg-[#1E1712] hover:text-[#C69A4B] transition-colors">My Profile</Link>
                      <Link href="/my-orders" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-xs font-semibold text-[#21150F] dark:text-[#FAF6EE] hover:bg-[#EDE5D8] dark:hover:bg-[#1E1712] hover:text-[#C69A4B] transition-colors">My Orders</Link>
                      <button onClick={() => { setIsProfileOpen(false); signOut(); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-[#EDE5D8] dark:hover:bg-[#1E1712] border-t border-[#E0D3BE]/60 dark:border-[#C49A50]/20 mt-1 cursor-pointer transition-colors">Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="ml-0.5 sm:ml-1 px-3 sm:px-4.5 py-1.5 sm:py-2 bg-gradient-to-r from-[#21130E] to-[#38251A] hover:from-[#C99A45] hover:to-[#B88636] hover:text-[#21130E] dark:from-[#C49A50] dark:via-[#D4AF37] dark:to-[#B88636] text-[#F7F3EB] dark:text-[#0C0A09] text-[10px] sm:text-[11px] font-black tracking-wider uppercase rounded-full shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[#C99A45]/40"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* ── MOBILE SEARCH (SLIDES DOWN ONLY WHEN TOGGLED) ── */}
          {isSearchOpen && (
            <div className="md:hidden pb-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-200 relative" ref={mobileSearchRef}>
              <form onSubmit={handleSearch} className="flex items-center bg-[#FAF7F2] dark:bg-[#16120E] rounded-full h-10 px-3.5 border-2 border-[#C99A45] shadow-md overflow-hidden">
                <Search className="w-4 h-4 text-[#C69A4B] mr-2 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search pieces..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  className="flex-1 bg-transparent px-1 text-xs text-[#21150F] dark:text-[#FAF6EE] placeholder:text-[#7A6E63]/70 dark:placeholder:text-[#A3988C]/60 outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-[11px] text-[#7A6E63] font-bold px-1 mr-1"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setShowSuggestions(false); }}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Mobile suggestions */}
              {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#14100D] rounded-2xl shadow-2xl border border-[#E0D3BE] dark:border-[#C49A50]/30 z-50 overflow-hidden divide-y divide-stone-100 dark:divide-[#C49A50]/15">
                  {suggestions.map(p => (
                    <Link
                      href={`/products/${p.id || p._id}`}
                      key={p.id || p._id}
                      onClick={() => { setShowSuggestions(false); setIsSearchOpen(false); setSearchQuery(""); }}
                      className="flex items-center gap-3 p-2.5 hover:bg-[#FAF7F2] dark:hover:bg-[#1E1712] transition-colors"
                    >
                      <div className="w-9 h-9 relative shrink-0 rounded-lg overflow-hidden bg-stone-100 dark:bg-[#1E1712]">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0 text-left">
                        <span className="text-xs font-bold text-[#21150F] dark:text-[#FAF6EE] line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-[#7A6E63] dark:text-[#A3988C]">{p.category} · ₹{p.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MOBILE MENU DRAWER (LUXURY REDESIGN) ── */}
          {isMobileMenuOpen && (
            <div ref={mobileMenuRef} className="lg:hidden pb-4 pt-1 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="bg-white/98 dark:bg-[#14100D]/98 backdrop-blur-2xl rounded-2xl p-3 border-2 border-[#E0D3BE] dark:border-[#C49A50]/35 shadow-2xl flex flex-col gap-1.5">
                {/* Nav Links */}
                <div className="flex flex-col gap-1">
                  {navLinks.map(link => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-xs uppercase font-extrabold tracking-wider flex items-center justify-between transition-all ${
                          link.isActive
                            ? "bg-gradient-to-r from-[#21130E] to-[#38251A] text-[#F7F3EB] dark:from-[#C49A50] dark:via-[#D4AF37] dark:to-[#B88636] dark:text-[#0C0A09] font-black shadow-md ring-1 ring-[#C99A45]/40"
                            : "text-[#21150F] dark:text-[#D8CFBF] hover:bg-[#FAF7F2] dark:hover:bg-[#1E1712]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${link.isActive ? "bg-white/10 dark:bg-black/10" : "bg-stone-100 dark:bg-stone-800"}`}>
                            <Icon className={`w-4 h-4 ${link.isActive ? "text-[#E6C477] dark:text-[#0C0A09]" : "text-[#C69A4B] dark:text-[#E2BA69]"}`} />
                          </div>
                          <span>{link.name}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#C69A4B] dark:text-[#E2BA69]" />
                      </Link>
                    );
                  })}
                </div>

                {/* Theme Switcher in Mobile Drawer */}
                {mounted && (
                  <div className="pt-2 mt-1 border-t border-stone-200/70 dark:border-[#C49A50]/20 flex items-center justify-between px-2">
                    <span className="text-xs font-bold text-[#7A6E63] dark:text-[#A3988C] uppercase tracking-wider">Appearance</span>
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-[#1E1712] border border-stone-200 dark:border-[#C49A50]/20 text-xs font-bold text-[#21150F] dark:text-[#FAF6EE]"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="w-3.5 h-3.5 text-[#E2BA69]" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3.5 h-3.5 text-[#38251A]" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
