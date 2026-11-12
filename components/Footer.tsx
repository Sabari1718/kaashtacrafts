"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Sparkles, ArrowRight, ShieldCheck, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#241812] text-[#F7F5F0] pt-16 pb-12 px-6 sm:px-10 border-t border-[#38261C] transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        
        {/* Top Section: Brand & Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#38261C]/80">
          
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-[#C49A50]/40">
                <Image src="/logo.jpeg" alt="KaashtaCrafts" fill className="object-cover" />
              </div>
              <span className="text-2xl font-bold font-playfair tracking-tight text-[#F7F5F0]">
                Kaashta Crafts
              </span>
            </Link>
            <p className="text-sm text-[#82786E] leading-relaxed max-w-sm mb-6 font-sans">
              Handcrafted in India from sustainably harvested seasoned hardwoods. Every piece carries the warmth of natural grain and the soul of hereditary artisanal mastery.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C49A50] font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preserving Traditional Indian Woodcraft</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#C49A50] mb-1">
              Curated Collections
            </span>
            <Link href="/products?category=Desk Accessories" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] transition-colors">Executive Desk Suite</Link>
            <Link href="/products?category=Home Decor" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] transition-colors">Sacred & Home Decor</Link>
            <Link href="/products?category=Kitchen" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] transition-colors">Artisanal Dining</Link>
            <Link href="/products?category=Stationery" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] transition-colors">Stationery & Blocks</Link>
            <Link href="/products" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] transition-colors">All Masterpieces</Link>
          </div>

          {/* Customer Sanctuary */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#C49A50] mb-1">
              Collector Care
            </span>
            <Link href="/my-orders" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] transition-colors">Track Your Order</Link>
            <Link href="/wishlist" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] transition-colors">Saved Wishlist</Link>
            <Link href="/cart" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] transition-colors">Shopping Bag</Link>
            <Link href="/profile" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] transition-colors">Account Settings</Link>
          </div>

          {/* Workshop & Standards */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#C49A50] mb-1">
              The Guild
            </span>
            <span className="text-xs text-[#82786E] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C49A50] shrink-0" />
              Tamil Nadu, India
            </span>
            <span className="text-xs text-[#82786E] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C49A50] shrink-0" />
              Zero-Breakage Guarantee
            </span>
            <span className="text-xs text-[#82786E] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C49A50] shrink-0" />
              kaashtacrafts@gmail.com
            </span>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#82786E]">
          <p>© {new Date().getFullYear()} Kaashta Crafts. Pure Artisanal Woodcraft. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#F7F5F0] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#F7F5F0] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#F7F5F0] transition-colors cursor-pointer">Authenticity Certificate</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
