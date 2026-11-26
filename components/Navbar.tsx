"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, Heart, Search, Moon, Sun, ArrowRight, X } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) setShowSuggestions(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) setShowSuggestions(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) setIsMobileMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const suggestions = searchQuery.trim()
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Home", href: "/", isActive: pathname === "/" },
    { name: "Shop All", href: "/products", isActive: pathname.startsWith("/products") },
    { name: "Contact Us", href: "/contact", isActive: pathname.startsWith("/contact") },
    { name: "My Orders", href: "/my-orders", isActive: pathname.startsWith("/my-orders") },
  ];

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <nav className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#0C0A09]/95 backdrop-blur-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-b border-stone-200/80 dark:border-[#C49A50]/20"
          : "bg-white/98 dark:bg-[#0C0A09]/98 backdrop-blur-md border-b border-stone-200/60 dark:border-[#C49A50]/15"
      }`}>
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">

            {/* ── BRAND (CLASSY ULTRA-PREMIUM HERITAGE WOODCRAFT BADGE) ── */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 sm:gap-3.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl bg-[#FCFAF6] dark:bg-[#14100D] border border-[#E5D7C4] dark:border-[#C49A50]/25 shadow-[0_2px_10px_rgba(42,22,13,0.05)] hover:border-[#C69A4B]/80 hover:shadow-[0_4px_18px_rgba(198,154,75,0.2)] hover:scale-102 active:scale-98 transition-all duration-300 shrink-0 cursor-pointer"
            >
              {/* Logo Avatar - Prominent Full Artisan Workshop Badge (Tools on Left & Right Uncropped) */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden ring-1.5 ring-[#C69A4B]/70 shadow-md shrink-0 bg-[#2E1A11]">
                <Image
                  src="/logo.jpg"
                  alt="Kaashta Crafts"
                  fill
                  priority
                  className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Brand Name - Refined, High-End Luxury Typography */}
              <div className="flex flex-col justify-center">
                <span className="font-playfair font-extrabold tracking-tight text-[#22130D] dark:text-[#FAF6EE] text-[16px] sm:text-[21px] leading-tight">
                  Kaashta<span className="text-[#A27223] dark:text-[#E2BA69] font-bold ml-0.5 sm:ml-1">Crafts</span>
                </span>
                <span className="hidden sm:block text-[8px] text-[#8C7B6D] dark:text-[#A3988C] tracking-[0.22em] uppercase font-sans font-semibold -mt-0.5">
                  Crafting Memories in Wood
                </span>
              </div>
            </Link>

            {/* ── DESKTOP SEARCH ── */}
            <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md relative mx-4" ref={searchContainerRef}>
              <form onSubmit={handleSearch} className="flex w-full items-center bg-white/70 dark:bg-[#14100D]/90 rounded-full h-9 border border-[#E0D3BE] dark:border-[#C49A50]/25 focus-within:border-[#C69A4B]/60 focus-within:ring-2 focus-within:ring-[#C69A4B]/12 focus-within:dark:border-[#E2BA69] focus-within:dark:ring-[#E2BA69]/20 transition-all shadow-xs overflow-hidden">
                <Search className="w-3.5 h-3.5 text-[#7A6E63] dark:text-[#A3988C] ml-3.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search masterpieces..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="flex-1 bg-transparent px-3 text-sm text-[#21150F] dark:text-[#FAF6EE] placeholder:text-[#7A6E63]/60 dark:placeholder:text-[#A3988C]/60 outline-none"
                />
              </form>

              {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#14100D] rounded-2xl shadow-2xl border border-stone-200 dark:border-[#C49A50]/30 z-50 overflow-hidden">
                  {suggestions.map(p => (
                    <Link
                      href={`/products/${p.id || p._id}`}
                      key={p.id || p._id}
                      onClick={() => { setShowSuggestions(false); setSearchQuery(""); }}
                      className="flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-[#1E1712] border-b border-stone-100 dark:border-[#C49A50]/15 last:border-0 transition-colors"
                    >
                      <div className="w-9 h-9 relative shrink-0 rounded-lg overflow-hidden bg-stone-100 dark:bg-[#1E1712]">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs font-semibold text-[#21150F] dark:text-[#FAF6EE] line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-[#7A6E63] dark:text-[#A3988C]">{p.category} · ₹{p.price}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-[#C69A4B] dark:text-[#E2BA69] shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ── DESKTOP NAV LINKS (HIGH CONTRAST BOLD HOVER) ── */}
            <div className="hidden lg:flex items-center bg-[#EDE4D6]/70 dark:bg-[#14100D]/90 rounded-full p-1.5 gap-1 border border-[#C99A45]/30 dark:border-[#C49A50]/25 shadow-xs">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 xl:px-4.5 py-1.5 xl:py-2 rounded-full text-[11px] xl:text-[12px] font-black tracking-[0.12em] uppercase transition-all duration-200 flex items-center justify-center font-sans ${
                    link.isActive
                      ? "bg-[#21130E] text-[#F7F3EB] dark:bg-gradient-to-r dark:from-[#C49A50] dark:via-[#D4AF37] dark:to-[#B88636] dark:text-[#0C0A09] dark:border-transparent font-black shadow-[0_4px_14px_rgba(33,19,14,0.35),0_0_15px_rgba(212,175,55,0.4)]"
                      : "text-[#38251A] dark:text-[#D8CFBF] hover:text-white dark:hover:text-[#FAF6EE] hover:bg-[#21130E] dark:hover:bg-[#1E1712] hover:shadow-[0_4px_14px_rgba(33,19,14,0.3),0_0_8px_rgba(201,154,69,0.25)] hover:scale-105 active:scale-95"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.isActive && (
                    <span className="absolute bottom-1 w-3.5 h-[2px] rounded-full bg-gradient-to-r from-[#E6C477] to-[#C99A45] shadow-[0_0_6px_#C99A45]" />
                  )}
                </Link>
              ))}
            </div>

            {/* ── ACTION ICONS (HIGH CONTRAST BOLD HOVER) ── */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Theme */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#21130E] dark:text-[#FAF6EE] border border-transparent dark:border-[#C49A50]/20 dark:bg-[#14100D] hover:border-[#C99A45] hover:bg-[#21130E] hover:text-[#E6C477] dark:hover:bg-[#1E1712] dark:hover:text-[#E2BA69] dark:hover:border-[#E2BA69]/60 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                  aria-label="Toggle Theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4 text-[#E2BA69]" /> : <Moon className="w-4 h-4 stroke-[2.2]" />}
                </button>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#21130E] dark:text-[#FAF6EE] border border-transparent dark:border-[#C49A50]/20 dark:bg-[#14100D] hover:border-[#C99A45] hover:bg-[#21130E] hover:text-red-400 dark:hover:bg-[#1E1712] dark:hover:text-red-400 dark:hover:border-[#E2BA69]/60 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 group"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 stroke-[2.2] group-hover:text-red-400 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-[#C99A45] text-[#21130E] text-[9px] sm:text-[10px] font-black flex items-center justify-center rounded-full shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#21130E] dark:text-[#FAF6EE] border border-transparent dark:border-[#C49A50]/20 dark:bg-[#14100D] hover:border-[#C99A45] hover:bg-[#21130E] hover:text-[#E6C477] dark:hover:bg-[#1E1712] dark:hover:text-[#E2BA69] dark:hover:border-[#E2BA69]/60 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 group"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2] group-hover:text-[#E6C477] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-[#21130E] dark:bg-[#C99A45] text-[#F7F3EB] dark:text-[#21130E] text-[9px] sm:text-[10px] font-black flex items-center justify-center rounded-full shadow-xs ring-1 ring-[#C99A45]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {session ? (
                <div className="relative ml-0.5 sm:ml-1" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-[#C99A45] hover:scale-110 overflow-hidden shadow-xs transition-all duration-200 cursor-pointer"
                  >
                    <Image src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}`} alt="Profile" width={36} height={36} className="object-cover w-full h-full" />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-3 w-52 bg-white dark:bg-[#1E1510] rounded-2xl shadow-2xl border border-stone-200 dark:border-[#2C2018] py-2 z-50">
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
                  className="ml-0.5 sm:ml-1 px-2.5 sm:px-5 py-1.5 sm:py-2 bg-[#21130E] hover:bg-[#C99A45] hover:text-[#21130E] dark:bg-gradient-to-r dark:from-[#C49A50] dark:to-[#D4AF37] dark:hover:from-[#E2BA69] dark:hover:to-[#C49A50] text-[#F7F3EB] dark:text-[#0C0A09] text-[10px] sm:text-[11.5px] font-black tracking-wider sm:tracking-widest uppercase rounded-full shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[#C99A45]/40"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#21150F] dark:text-[#FAF6EE] hover:bg-[#EDE5D8] dark:hover:bg-[#1E1712] transition-all cursor-pointer"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4 text-[#C69A4B]" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ── MOBILE MENU ── */}
          {isMobileMenuOpen && (
            <div ref={mobileMenuRef} className="lg:hidden pb-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="bg-white/95 dark:bg-[#14100D]/95 backdrop-blur-xl rounded-2xl p-2 border border-[#E0D3BE] dark:border-[#C49A50]/25 shadow-xl flex flex-col gap-1 mb-2">
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-[11px] uppercase font-bold tracking-wider flex items-center justify-between transition-all ${
                      link.isActive
                        ? "bg-[#21150F] text-[#F7F3EB] dark:bg-gradient-to-r dark:from-[#C49A50] dark:to-[#D4AF37] dark:text-[#0C0A09] font-black shadow-sm"
                        : "text-[#21150F]/75 dark:text-[#D8CFBF] hover:bg-[#EDE5D8] dark:hover:bg-[#1E1712]"
                    }`}
                  >
                    {link.name}
                    <ArrowRight className="w-3.5 h-3.5 text-[#C69A4B] dark:text-[#E2BA69]" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── MOBILE SEARCH ── */}
          <div className="md:hidden pb-2 relative" ref={mobileSearchRef}>
            <form onSubmit={handleSearch} className="flex items-center bg-white/80 dark:bg-[#14100D]/90 rounded-full h-9 border border-[#E0D3BE] dark:border-[#C49A50]/25 focus-within:border-[#C69A4B]/60 focus-within:dark:border-[#E2BA69] overflow-hidden">
              <Search className="w-3.5 h-3.5 text-[#7A6E63] dark:text-[#A3988C] ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search handcrafted pieces..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="flex-1 bg-transparent px-3 text-xs text-[#21150F] dark:text-[#FAF6EE] placeholder:text-[#7A6E63]/60 dark:placeholder:text-[#A3988C]/60 outline-none"
              />
            </form>
            {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#F7F3EB] dark:bg-[#14100D] rounded-2xl shadow-xl border border-[#E0D3BE] dark:border-[#C49A50]/30 z-50 overflow-hidden">
                {suggestions.map(p => (
                  <Link href={`/products/${p.id || p._id}`} key={p.id || p._id} onClick={() => { setShowSuggestions(false); setSearchQuery(""); }} className="flex items-center gap-3 p-2.5 hover:bg-[#EDE5D8]/60 dark:hover:bg-[#1E1712] border-b border-[#E0D3BE]/40 dark:border-[#C49A50]/15 last:border-0 transition-colors">
                    <div className="w-8 h-8 relative shrink-0 rounded-lg overflow-hidden bg-[#EDE5D8] dark:bg-[#1E1712]">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs font-semibold text-[#21150F] dark:text-[#FAF6EE] line-clamp-1">{p.name}</span>
                      <span className="text-[10px] text-[#7A6E63] dark:text-[#A3988C]">₹{p.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
