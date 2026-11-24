"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Phone, 
  ArrowRight,
  Award,
  Truck,
  Leaf
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative bg-[#1A110B] text-[#F8F5EF] pt-16 pb-12 px-6 sm:px-10 border-t border-[#342217] overflow-hidden transition-colors duration-300">
      
      {/* Subtle Warm Spotlight Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-40 bg-[#C69A4B]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-48 bg-[#65452F]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto flex flex-col gap-12 relative z-10">
        
        {/* Brand Virtues Strip (4 Pillars of Luxury) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#342217]/80">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#241710] border border-[#C69A4B]/30 flex items-center justify-center shrink-0 text-[#C69A4B]">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5EF]">Sustainably Sourced</h4>
              <p className="text-[11px] text-[#A3968A]">Seasoned Teak & Sheesham</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#241710] border border-[#C69A4B]/30 flex items-center justify-center shrink-0 text-[#C69A4B]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5EF]">Master Handcarved</h4>
              <p className="text-[11px] text-[#A3968A]">Tamil Nadu Artisan Guild</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#241710] border border-[#C69A4B]/30 flex items-center justify-center shrink-0 text-[#C69A4B]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5EF]">White-Glove Transit</h4>
              <p className="text-[11px] text-[#A3968A]">Zero-Breakage Guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#241710] border border-[#C69A4B]/30 flex items-center justify-center shrink-0 text-[#C69A4B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5EF]">100% Food-Grade</h4>
              <p className="text-[11px] text-[#A3968A]">Organic Beeswax Finish</p>
            </div>
          </div>
        </div>

        {/* Top Section: Brand & Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#342217]/80">
          
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-4 group w-fit">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-1 ring-[#C69A4B]/50 shadow-md group-hover:scale-105 transition-transform">
                <Image src="/logo.jpeg" alt="Kaashta Crafts Logo" fill className="object-cover" />
              </div>
              <div>
                <span className="text-2xl font-bold font-playfair tracking-tight text-[#F8F5EF] group-hover:text-[#C69A4B] transition-colors">
                  Kaashta Crafts
                </span>
                <p className="text-[10px] text-[#C69A4B] tracking-[0.24em] uppercase font-sans font-semibold -mt-0.5">Artisanal Woodcraft</p>
              </div>
            </Link>
            
            <p className="text-sm text-[#A3968A] leading-relaxed max-w-sm mb-5 font-sans">
              Handcrafted with pride in Tamil Nadu from sustainably seasoned hardwoods. Every piece carries the organic warmth of real timber grain and hereditary artisanal mastery.
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-[#C69A4B] font-medium tracking-wide bg-[#C69A4B]/10 border border-[#C69A4B]/20 px-3.5 py-1.5 rounded-full w-fit mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#C69A4B]" />
              <span>Preserving Traditional Indian Woodcraft</span>
            </div>

            {/* Social Connect: Instagram */}
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 text-[#F8F5EF] border border-[#C69A4B]/30 hover:border-[#C69A4B] px-4 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer shadow-sm hover:scale-102"
                title="Follow us on Instagram"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-[#A3968A] leading-tight">Follow On</span>
                  <span className="text-xs font-bold text-[#F8F5EF] group-hover:text-[#C69A4B] transition-colors">Instagram</span>
                </div>
              </a>
            </div>
          </div>

          {/* Curated Collections */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C69A4B] mb-1">
              Curated Collections
            </span>
            <Link href="/products?category=Desk Accessories" className="text-sm text-[#EFE7DA]/80 hover:text-[#C69A4B] hover:translate-x-1 transition-all flex items-center gap-1.5">
              <span>Executive Desk Suite</span>
            </Link>
            <Link href="/products?category=Home Decor" className="text-sm text-[#EFE7DA]/80 hover:text-[#C69A4B] hover:translate-x-1 transition-all flex items-center gap-1.5">
              <span>Sacred & Home Decor</span>
            </Link>
            <Link href="/products?category=Kitchen" className="text-sm text-[#EFE7DA]/80 hover:text-[#C69A4B] hover:translate-x-1 transition-all flex items-center gap-1.5">
              <span>Artisanal Dining</span>
            </Link>
            <Link href="/products?category=Stationery" className="text-sm text-[#EFE7DA]/80 hover:text-[#C69A4B] hover:translate-x-1 transition-all flex items-center gap-1.5">
              <span>Stationery & Organizers</span>
            </Link>
            <Link href="/products" className="text-sm text-[#C69A4B] hover:text-[#DFB76C] hover:translate-x-1 transition-all flex items-center gap-1.5 font-medium mt-1">
              <span>All Masterpieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Collector Care */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C69A4B] mb-1">
              Collector Care
            </span>
            <Link href="/my-orders" className="text-sm text-[#EFE7DA]/80 hover:text-[#C69A4B] hover:translate-x-1 transition-all">Track Your Order</Link>
            <Link href="/wishlist" className="text-sm text-[#EFE7DA]/80 hover:text-[#C69A4B] hover:translate-x-1 transition-all">Saved Wishlist</Link>
            <Link href="/cart" className="text-sm text-[#EFE7DA]/80 hover:text-[#C69A4B] hover:translate-x-1 transition-all">Shopping Bag</Link>
            <Link href="/profile" className="text-sm text-[#EFE7DA]/80 hover:text-[#C69A4B] hover:translate-x-1 transition-all">Account Settings</Link>
          </div>

          {/* Connect & Guild Information */}
          <div className="flex flex-col gap-3.5">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C69A4B] mb-1">
              Connect With Us
            </span>
            
            {/* Location */}
            <div className="flex items-start gap-2.5 text-xs text-[#EFE7DA]/90">
              <div className="w-7 h-7 rounded-lg bg-[#C69A4B]/15 flex items-center justify-center shrink-0 mt-0.5 text-[#C69A4B] border border-[#C69A4B]/30">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[#F8F5EF]">Coimbatore</span>
                <span className="text-[#A3968A] text-[11px]">Tamil Nadu, India</span>
              </div>
            </div>

            {/* Phone */}
            <a 
              href="tel:8838098116" 
              className="flex items-center gap-2.5 text-xs text-[#EFE7DA]/90 hover:text-[#C69A4B] transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#C69A4B]/15 group-hover:bg-[#C69A4B] group-hover:text-[#1A110B] flex items-center justify-center shrink-0 text-[#C69A4B] transition-colors border border-[#C69A4B]/30">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#A3968A]">Call / WhatsApp</span>
                <span className="font-mono font-medium text-xs text-[#F8F5EF] group-hover:text-[#C69A4B] transition-colors">+91 88380 98116</span>
              </div>
            </a>

            {/* Email */}
            <a 
              href="mailto:kaashtacrafts@gmail.com" 
              className="flex items-center gap-2.5 text-xs text-[#EFE7DA]/90 hover:text-[#C69A4B] transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#C69A4B]/15 group-hover:bg-[#C69A4B] group-hover:text-[#1A110B] flex items-center justify-center shrink-0 text-[#C69A4B] transition-colors border border-[#C69A4B]/30">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#A3968A]">Official Inquiries</span>
                <span className="font-medium text-xs text-[#F8F5EF] group-hover:text-[#C69A4B] transition-colors truncate max-w-[170px]">kaashtacrafts@gmail.com</span>
              </div>
            </a>

            {/* Assurance */}
            <div className="pt-2 border-t border-[#342217]/60 flex items-center gap-2 text-[11px] text-[#A3968A]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero-Breakage Transit Guarantee</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#7D7368]">
          <p>© {new Date().getFullYear()} Kaashta Crafts. Pure Artisanal Woodcraft, Coimbatore. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-[#F8F5EF] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#F8F5EF] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#F8F5EF] transition-colors cursor-pointer">Authenticity Certificate</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
