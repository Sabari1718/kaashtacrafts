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
  ArrowRight
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
    <footer className="relative bg-[#1E140E] text-[#F7F5F0] pt-16 pb-10 px-6 sm:px-10 border-t border-[#38261C] overflow-hidden transition-colors duration-300">
      {/* Subtle Warm Spotlight */}
      <div className="absolute top-0 left-1/3 w-[500px] h-32 bg-[#C49A50]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-40 bg-[#65452F]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto flex flex-col gap-12 relative z-10">
        
        {/* Top Section: Brand & Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#38261C]/80">
          
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-4 group w-fit">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-1 ring-[#C49A50]/50 shadow-md group-hover:scale-105 transition-transform">
                <Image src="/logo.jpeg" alt="Kaashta Crafts Logo" fill className="object-cover" />
              </div>
              <div>
                <span className="text-2xl font-bold font-playfair tracking-tight text-[#F7F5F0] group-hover:text-[#C49A50] transition-colors">
                  Kaashta Crafts
                </span>
                <p className="text-[10px] text-[#C49A50] tracking-[0.2em] uppercase font-sans -mt-0.5">Artisanal Woodcraft</p>
              </div>
            </Link>
            
            <p className="text-sm text-[#A39A90] leading-relaxed max-w-sm mb-5 font-sans">
              Handcrafted with pride in Tamil Nadu from sustainably seasoned hardwoods. Every piece carries the organic warmth of real timber grain and hereditary artisanal mastery.
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-[#C49A50] font-medium tracking-wide bg-[#C49A50]/10 border border-[#C49A50]/20 px-3 py-1.5 rounded-full w-fit mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#C49A50]" />
              <span>Preserving Traditional Indian Woodcraft</span>
            </div>

            {/* Social Connect: Instagram */}
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 text-[#F7F5F0] border border-[#C49A50]/30 hover:border-[#C49A50] px-4 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer shadow-sm hover:scale-102"
                title="Follow us on Instagram"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-[#A39A90] leading-tight">Follow On</span>
                  <span className="text-xs font-bold text-[#F7F5F0] group-hover:text-[#C49A50] transition-colors">Instagram</span>
                </div>
              </a>
            </div>
          </div>

          {/* Curated Collections */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#C49A50] mb-1">
              Curated Collections
            </span>
            <Link href="/products?category=Desk Accessories" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] hover:translate-x-1 transition-all flex items-center gap-1.5">
              <span>Executive Desk Suite</span>
            </Link>
            <Link href="/products?category=Home Decor" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] hover:translate-x-1 transition-all flex items-center gap-1.5">
              <span>Sacred & Home Decor</span>
            </Link>
            <Link href="/products?category=Kitchen" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] hover:translate-x-1 transition-all flex items-center gap-1.5">
              <span>Artisanal Dining</span>
            </Link>
            <Link href="/products?category=Stationery" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] hover:translate-x-1 transition-all flex items-center gap-1.5">
              <span>Stationery & Organizers</span>
            </Link>
            <Link href="/products" className="text-sm text-[#C49A50] hover:text-[#D4AF37] hover:translate-x-1 transition-all flex items-center gap-1.5 font-medium mt-1">
              <span>All Masterpieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Collector Care */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#C49A50] mb-1">
              Collector Care
            </span>
            <Link href="/my-orders" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] hover:translate-x-1 transition-all">Track Your Order</Link>
            <Link href="/wishlist" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] hover:translate-x-1 transition-all">Saved Wishlist</Link>
            <Link href="/cart" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] hover:translate-x-1 transition-all">Shopping Bag</Link>
            <Link href="/profile" className="text-sm text-[#EAE1D2]/80 hover:text-[#C49A50] hover:translate-x-1 transition-all">Account Settings</Link>
          </div>

          {/* Connect & Guild Information */}
          <div className="flex flex-col gap-3.5">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#C49A50] mb-1">
              Connect With Us
            </span>
            
            {/* Location */}
            <div className="flex items-start gap-2.5 text-xs text-[#EAE1D2]/90">
              <div className="w-6 h-6 rounded-lg bg-[#C49A50]/15 flex items-center justify-center shrink-0 mt-0.5 text-[#C49A50]">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[#F7F5F0]">Coimbatore</span>
                <span className="text-[#A39A90] text-[11px]">Tamil Nadu, India</span>
              </div>
            </div>

            {/* Phone */}
            <a 
              href="tel:8838098116" 
              className="flex items-center gap-2.5 text-xs text-[#EAE1D2]/90 hover:text-[#C49A50] transition-colors group"
            >
              <div className="w-6 h-6 rounded-lg bg-[#C49A50]/15 group-hover:bg-[#C49A50] group-hover:text-[#1E140E] flex items-center justify-center shrink-0 text-[#C49A50] transition-colors">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#A39A90]">Call / WhatsApp</span>
                <span className="font-mono font-medium text-xs text-[#F7F5F0] group-hover:text-[#C49A50] transition-colors">+91 88380 98116</span>
              </div>
            </a>

            {/* Email */}
            <a 
              href="mailto:kaashtacrafts@gmail.com" 
              className="flex items-center gap-2.5 text-xs text-[#EAE1D2]/90 hover:text-[#C49A50] transition-colors group"
            >
              <div className="w-6 h-6 rounded-lg bg-[#C49A50]/15 group-hover:bg-[#C49A50] group-hover:text-[#1E140E] flex items-center justify-center shrink-0 text-[#C49A50] transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#A39A90]">Official Inquiries</span>
                <span className="font-medium text-xs text-[#F7F5F0] group-hover:text-[#C49A50] transition-colors truncate max-w-[170px]">kaashtacrafts@gmail.com</span>
              </div>
            </a>

            {/* Assurance */}
            <div className="pt-2 border-t border-[#38261C]/60 flex items-center gap-2 text-[11px] text-[#A39A90]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero-Breakage Transit Guarantee</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#82786E]">
          <p>© {new Date().getFullYear()} Kaashta Crafts. Pure Artisanal Woodcraft, Coimbatore. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-[#F7F5F0] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#F7F5F0] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#F7F5F0] transition-colors cursor-pointer">Authenticity Certificate</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
