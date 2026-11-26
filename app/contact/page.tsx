"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Package, 
  Hammer, 
  ArrowRight,
  ShieldCheck,
  Clock,
  Leaf,
  Award,
  Truck
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"direct" | "bulk">("direct");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Direct Message Form State
  const [directForm, setDirectForm] = useState({
    name: "",
    phone: "",
    email: "",
    category: "General Product Inquiry",
    message: "",
  });

  // Bulk Order Form State
  const [bulkForm, setBulkForm] = useState({
    organization: "",
    name: "",
    phone: "",
    email: "",
    productChoice: "Executive Desk Suites & Organizers",
    quantity: "50 - 100 Units",
    customizations: ["Laser Logo Engraving", "Luxury Gift Box & Packaging"],
    targetDate: "",
    message: "",
  });

  const toggleCustomization = (item: string) => {
    setBulkForm(prev => {
      const exists = prev.customizations.includes(item);
      return {
        ...prev,
        customizations: exists 
          ? prev.customizations.filter(c => c !== item)
          : [...prev.customizations, item]
      };
    });
  };

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directForm.name || !directForm.phone || !directForm.message) {
      toast.error("Please fill in your name, phone number, and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...directForm,
          type: "direct"
        })
      });

      // Prepare WhatsApp URL
      const waText = encodeURIComponent(
        `*🪵 New Artisan Inquiry - Kaashta Crafts*\n\n` +
        `👤 *Name:* ${directForm.name}\n` +
        `📞 *Phone:* ${directForm.phone}\n` +
        `📧 *Email:* ${directForm.email || "N/A"}\n` +
        `📂 *Category:* ${directForm.category}\n\n` +
        `💬 *Message / Custom Request:*\n${directForm.message}`
      );
      
      toast.success("Connecting with our master woodcraft studio on WhatsApp...");
      setIsSubmitted(true);
      window.open(`https://wa.me/918838098116?text=${waText}`, "_blank");
    } catch (err) {
      toast.error("Connecting to WhatsApp directly...");
      window.open(`https://wa.me/918838098116`, "_blank");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkForm.name || !bulkForm.phone || !bulkForm.message) {
      toast.error("Please fill in your name, contact phone, and requirements.");
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bulkForm,
          type: "bulk"
        })
      });

      // Prepare WhatsApp URL
      const waText = encodeURIComponent(
        `*📦 Bulk Order & Custom Woodcraft Request - Kaashta Crafts*\n\n` +
        `🏢 *Organization / Client:* ${bulkForm.organization || "Individual / Guild"}\n` +
        `👤 *Contact Person:* ${bulkForm.name}\n` +
        `📞 *Phone:* ${bulkForm.phone}\n` +
        `📧 *Email:* ${bulkForm.email || "N/A"}\n` +
        `🪵 *Collection:* ${bulkForm.productChoice}\n` +
        `🔢 *Estimated Quantity:* ${bulkForm.quantity}\n` +
        `✨ *Customizations:* ${bulkForm.customizations.join(", ") || "Standard"}\n` +
        `📅 *Target Delivery Date:* ${bulkForm.targetDate || "Flexible"}\n\n` +
        `📝 *Requirement Notes:*\n${bulkForm.message}`
      );

      toast.success("Connecting your bulk inquiry with our master artisan studio!");
      setIsSubmitted(true);
      window.open(`https://wa.me/918838098116?text=${waText}`, "_blank");
    } catch (err) {
      toast.error("Connecting to WhatsApp directly...");
      window.open(`https://wa.me/918838098116`, "_blank");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6] dark:bg-[#120E0A] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-[1300px] mx-auto">

        {/* ── LUXURY ARTISAN HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7DA] dark:bg-[#251A13] border border-[#C69A4B]/40 text-[#8C621E] dark:text-[#E2B462] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C69A4B]" />
            <span>Artisan Studio Direct Desk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-playfair text-[#22130E] dark:text-[#F8F5EF] tracking-tight leading-tight mb-4">
            Connect With Our Master Woodturners.
          </h1>

          <p className="text-xs sm:text-base text-[#6E5D50] dark:text-[#B5A597] leading-relaxed max-w-2xl mx-auto font-medium">
            Whether you need bespoke laser name engraving, dimensional customization, curated corporate gifting, or grand wholesale bulk orders, our Tamil Nadu craft guild is at your service.
          </p>
        </div>

        {/* ── 3 TOP STUDIO ACTION CARDS (LUXURY WOOD & GOLD STYLING - NO GENERIC RAINBOW COLORS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
          
          {/* Card 1: Direct Phone Line */}
          <div className="bg-[#FAF7F2] dark:bg-[#1C140F] rounded-2xl p-6 sm:p-7 border border-[#E3D4C0] dark:border-[#332318] shadow-[0_4px_16px_rgba(42,22,13,0.04)] hover:shadow-xl hover:border-[#C69A4B]/60 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#2A160E] dark:bg-[#2A160E] text-[#DEB96A] border border-[#C69A4B]/40 flex items-center justify-center mb-4 group-hover:scale-108 transition-transform shadow-sm">
                <PhoneCall className="w-5 h-5 text-[#DEB96A]" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8C7B6D] dark:text-[#A8988B]">
                Direct Artisan Line
              </span>
              <h3 className="text-xl font-bold font-mono text-[#21130E] dark:text-[#F8F5EF] mt-1 mb-2 tracking-wide">
                +91 88380 98116
              </h3>
              <p className="text-xs text-[#7A695C] dark:text-[#9E8E81] leading-relaxed">
                Direct phone consultation with our workshop guild for order assistance and custom dimensions.
              </p>
            </div>
            <a
              href="tel:+918838098116"
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#24150E] hover:bg-[#382216] active:scale-95 text-[#E6C477] border border-[#C69A4B]/50 font-bold text-xs uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#C69A4B]" />
              <span>Call Artisan Studio</span>
            </a>
          </div>

          {/* Card 2: WhatsApp Workshop Desk */}
          <div className="bg-[#FAF7F2] dark:bg-[#1C140F] rounded-2xl p-6 sm:p-7 border border-[#E3D4C0] dark:border-[#332318] shadow-[0_4px_16px_rgba(42,22,13,0.04)] hover:shadow-xl hover:border-[#C69A4B]/60 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1C2C20] dark:bg-[#1C2C20] text-[#52B788] border border-[#2D6A4F] flex items-center justify-center mb-4 group-hover:scale-108 transition-transform shadow-sm">
                <MessageCircle className="w-5 h-5 text-[#52B788]" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8C7B6D] dark:text-[#A8988B]">
                WhatsApp Workshop Desk
              </span>
              <h3 className="text-xl font-bold font-mono text-[#21130E] dark:text-[#F8F5EF] mt-1 mb-2 tracking-wide">
                +91 88380 98116
              </h3>
              <p className="text-xs text-[#7A695C] dark:text-[#9E8E81] leading-relaxed">
                Real-time chat, live timber grain photos, custom laser engraving previews, and quotes.
              </p>
            </div>
            <a
              href="https://wa.me/918838098116?text=Hi%20Kaashta%20Crafts,%20I%20would%20like%20to%20inquire%20about%20your%20handcrafted%20wooden%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#1B2D20] hover:bg-[#253D2B] active:scale-95 text-[#74C69D] border border-[#2D6A4F]/80 font-bold text-xs uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#52B788]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Card 3: Guild Formal Inquiries */}
          <div className="bg-[#FAF7F2] dark:bg-[#1C140F] rounded-2xl p-6 sm:p-7 border border-[#E3D4C0] dark:border-[#332318] shadow-[0_4px_16px_rgba(42,22,13,0.04)] hover:shadow-xl hover:border-[#C69A4B]/60 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#2A160E] dark:bg-[#2A160E] text-[#DEB96A] border border-[#C69A4B]/40 flex items-center justify-center mb-4 group-hover:scale-108 transition-transform shadow-sm">
                <Mail className="w-5 h-5 text-[#DEB96A]" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8C7B6D] dark:text-[#A8988B]">
                Official Inquiries
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#21130E] dark:text-[#F8F5EF] mt-1 mb-2 truncate">
                kaashtacrafts@gmail.com
              </h3>
              <p className="text-xs text-[#7A695C] dark:text-[#9E8E81] leading-relaxed">
                For formal corporate purchase orders, institutional procurement, and custom design briefs.
              </p>
            </div>
            <a
              href="mailto:kaashtacrafts@gmail.com"
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#24150E] hover:bg-[#382216] active:scale-95 text-[#E6C477] border border-[#C69A4B]/50 font-bold text-xs uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#C69A4B]" />
              <span>Send Official Email</span>
            </a>
          </div>
        </div>

        {/* ── 2-COLUMN MAIN CONTENT: WORKSHOP CREDENTIALS & INQUIRY DESK ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: STUDIO SHOWCASE & GUILD CREDENTIALS (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Workshop Photo Frame */}
            <div className="relative rounded-3xl overflow-hidden border border-[#E0D3BE] dark:border-[#382619] shadow-xl group">
              <div className="relative w-full h-[240px] sm:h-[280px]">
                <Image
                  src="/hero_wood.png"
                  alt="Master Woodturner at Work"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21150F] via-[#21150F]/30 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 bg-[#21150F]/85 backdrop-blur-md p-3.5 rounded-2xl border border-[#C69A4B]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#C69A4B]">
                      <Image src="/logo-circle.png" alt="Logo" fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F8F5EF]">Coimbatore Workshop</h4>
                      <p className="text-[10px] text-[#C69A4B]">Tamil Nadu Artisan Guild</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    Active Studio
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Pillars of Guild Authenticity */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A130E] rounded-3xl p-6 border border-[#E3D4C0] dark:border-[#332318] shadow-md flex flex-col gap-4">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C621E] dark:text-[#DEB96A]">
                The Kaashta Standard
              </span>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A160E] border border-[#C69A4B]/30 flex items-center justify-center shrink-0 text-[#C69A4B] mt-0.5">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#21130E] dark:text-[#F8F5EF]">Seasoned Solid Hardwood</h5>
                    <p className="text-[11px] text-[#7A695C] dark:text-[#9E8E81] leading-relaxed">
                      Sustainably harvested teak and acacia, kiln-seasoned for zero warping across seasons.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A160E] border border-[#C69A4B]/30 flex items-center justify-center shrink-0 text-[#C69A4B] mt-0.5">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#21130E] dark:text-[#F8F5EF]">Custom Laser & Hand Carving</h5>
                    <p className="text-[11px] text-[#7A695C] dark:text-[#9E8E81] leading-relaxed">
                      High-precision laser corporate logo etching or bespoke name personalization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A160E] border border-[#C69A4B]/30 flex items-center justify-center shrink-0 text-[#C69A4B] mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#21130E] dark:text-[#F8F5EF]">Organic Beeswax Buff</h5>
                    <p className="text-[11px] text-[#7A695C] dark:text-[#9E8E81] leading-relaxed">
                      Hand-rubbed with 100% natural beeswax for a tactile satin finish with zero toxic varnishes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A160E] border border-[#C69A4B]/30 flex items-center justify-center shrink-0 text-[#C69A4B] mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#21130E] dark:text-[#F8F5EF]">White-Glove Pan-India Delivery</h5>
                    <p className="text-[11px] text-[#7A695C] dark:text-[#9E8E81] leading-relaxed">
                      Triple-layered bespoke gift packaging with insured zero-breakage transit guarantee.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE CONSULTATION DESK (7 cols) */}
          <div className="lg:col-span-7">
            
            {/* Classy Pill Switcher */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex p-1.5 rounded-2xl bg-[#EDE4D6] dark:bg-[#1E1510] border border-[#DFCBB2] dark:border-[#382619] shadow-inner gap-1.5 w-full max-w-md">
                <button
                  type="button"
                  onClick={() => { setActiveTab("direct"); setIsSubmitted(false); }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === "direct"
                      ? "bg-[#21130E] text-[#F8F5EF] shadow-md dark:bg-[#C69A4B] dark:text-[#1A110B]"
                      : "text-[#6E5D50] dark:text-[#A8988B] hover:text-[#21130E] dark:hover:text-[#F8F5EF]"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Direct Inquiry</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("bulk"); setIsSubmitted(false); }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === "bulk"
                      ? "bg-[#21130E] text-[#F8F5EF] shadow-md dark:bg-[#C69A4B] dark:text-[#1A110B]"
                      : "text-[#6E5D50] dark:text-[#A8988B] hover:text-[#21130E] dark:hover:text-[#F8F5EF]"
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Bulk & Custom Orders</span>
                </button>
              </div>
            </div>

            {/* FORM CONTAINER */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A130E] rounded-3xl p-6 sm:p-8 md:p-10 border border-[#E3D4C0] dark:border-[#332318] shadow-xl">
              
              {/* TAB 1: DIRECT ARTISAN INQUIRY */}
              {activeTab === "direct" && (
                <div>
                  <div className="mb-6 border-b border-[#E3D4C0] dark:border-[#2C1F17] pb-4">
                    <h2 className="text-2xl font-bold font-playfair text-[#21130E] dark:text-[#F8F5EF] mb-1">
                      Send a Direct Message
                    </h2>
                    <p className="text-xs text-[#7A695C] dark:text-[#9E8E81]">
                      Fill in your query below. Our workshop team responds directly within 1–2 hours.
                    </p>
                  </div>

                  <form onSubmit={handleDirectSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Name */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={directForm.name}
                          onChange={e => setDirectForm({ ...directForm, name: e.target.value })}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                          Phone / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9843343232"
                          value={directForm.phone}
                          onChange={e => setDirectForm({ ...directForm, phone: e.target.value })}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Email */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={directForm.email}
                          onChange={e => setDirectForm({ ...directForm, email: e.target.value })}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                          Inquiry Category
                        </label>
                        <select
                          value={directForm.category}
                          onChange={e => setDirectForm({ ...directForm, category: e.target.value })}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all cursor-pointer"
                        >
                          <option value="General Product Inquiry">General Product Inquiry</option>
                          <option value="Order Status & Delivery">Order Status & Tracking</option>
                          <option value="Custom Wood Carving">Custom Name / Logo Engraving</option>
                          <option value="Wood Care & Guild Quality">Wood Care & Maintenance Guide</option>
                          <option value="Other Assistance">Other Assistance</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                        Your Message / Piece Details <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us what wooden pieces, questions, or assistance you need..."
                        value={directForm.message}
                        onChange={e => setDirectForm({ ...directForm, message: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all resize-y"
                      />
                    </div>

                    {/* Submit Button (Artisan Gold / WhatsApp) */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4A359] via-[#C69A4B] to-[#A87B2A] hover:brightness-105 active:scale-98 text-[#1E110A] font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_4px_18px_rgba(198,154,75,0.35)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#1E110A]" />
                      <span>{isSubmitting ? "Connecting..." : "Submit & Connect on WhatsApp"}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: BULK & CUSTOM WOODCRAFT */}
              {activeTab === "bulk" && (
                <div>
                  <div className="mb-6 border-b border-[#E3D4C0] dark:border-[#2C1F17] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold font-playfair text-[#21130E] dark:text-[#F8F5EF] mb-1">
                        Bulk Orders & Bespoke Customization
                      </h2>
                      <p className="text-xs text-[#7A695C] dark:text-[#9E8E81]">
                        Special guild wholesale pricing for corporate gifting, weddings, and volume orders.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C69A4B]/15 border border-[#C69A4B]/40 text-[#8C621E] dark:text-[#DEB96A] text-[10px] font-extrabold uppercase tracking-wider w-fit">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C69A4B]" />
                      <span>Guild Tier Pricing</span>
                    </div>
                  </div>

                  <form onSubmit={handleBulkSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Organization / Client Name */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                          Company / Event Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Google, Wedding Gift, Boutique Hotel"
                          value={bulkForm.organization}
                          onChange={e => setBulkForm({ ...bulkForm, organization: e.target.value })}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                        />
                      </div>

                      {/* Contact Person */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                          Contact Person <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={bulkForm.name}
                          onChange={e => setBulkForm({ ...bulkForm, name: e.target.value })}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Phone */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                          Phone / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9843343232"
                          value={bulkForm.phone}
                          onChange={e => setBulkForm({ ...bulkForm, phone: e.target.value })}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                          Official Email
                        </label>
                        <input
                          type="email"
                          placeholder="procurement@company.com"
                          value={bulkForm.email}
                          onChange={e => setBulkForm({ ...bulkForm, email: e.target.value })}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Product Collection */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                        Product Collection
                      </label>
                      <select
                        value={bulkForm.productChoice}
                        onChange={e => setBulkForm({ ...bulkForm, productChoice: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all cursor-pointer"
                      >
                        <option value="Executive Desk Suites & Organizers">Executive Desk Suites & Docking Organizers</option>
                        <option value="Artisanal Kitchen Platters & Acacia Bowls">Artisanal Kitchen Platters & Acacia Bowls</option>
                        <option value="Sculptural Teak Clocks & Wall Art">Sculptural Teak Clocks & Wall Art</option>
                        <option value="Minimalist Stationery Blocks & Coasters">Minimalist Stationery Blocks & Coasters</option>
                        <option value="Wedding / Bespoke Corporate Gift Hampers">Wedding / Bespoke Corporate Gift Hampers</option>
                        <option value="Entirely Custom Concept">Entirely Custom Concept (Blueprint / Sketch)</option>
                      </select>
                    </div>

                    {/* Quantity Selector Tokens */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                        Estimated Quantity Range
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {["25 - 50 Pcs", "50 - 100 Pcs", "100 - 250 Pcs", "250 - 500 Pcs", "500+ Pcs"].map(qty => (
                          <button
                            type="button"
                            key={qty}
                            onClick={() => setBulkForm({ ...bulkForm, quantity: qty })}
                            className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                              bulkForm.quantity === qty
                                ? "bg-[#21130E] text-[#E6C477] border-[#C69A4B] shadow-sm dark:bg-[#C69A4B] dark:text-[#1A110B]"
                                : "bg-[#FCFAF6] dark:bg-[#221812] text-[#6E5D50] dark:text-[#B5A597] border-[#D5C2AB] dark:border-[#38261A] hover:border-[#C69A4B]"
                            }`}
                          >
                            {qty}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Customization Options Multi-select */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                        Customization Required (Select all that apply)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { id: "Laser Logo Engraving", label: "✒️ Custom Laser Logo / Branding" },
                          { id: "Tamil Nadu Teak Wood", label: "🪵 Seasoned Teak Wood Grain" },
                          { id: "Luxury Gift Box & Packaging", label: "🎁 Bespoke Gift Box & Ribbon" },
                          { id: "Custom Dimensions", label: "📐 Custom Blueprint Sizing" },
                          { id: "Organic Beeswax Polish", label: "🍯 100% Organic Beeswax Polish" },
                          { id: "Individual Personalization", label: "✨ Name per Recipient" },
                        ].map(opt => {
                          const selected = bulkForm.customizations.includes(opt.id);
                          return (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() => toggleCustomization(opt.id)}
                              className={`p-2.5 rounded-xl text-[11px] font-semibold border flex items-center justify-between text-left transition-all cursor-pointer ${
                                selected
                                  ? "bg-[#2A160E] text-[#E6C477] border-[#C69A4B] shadow-xs"
                                  : "bg-[#FCFAF6] dark:bg-[#221812] text-[#6E5D50] dark:text-[#B5A597] border-[#D5C2AB] dark:border-[#38261A] hover:border-[#C69A4B]/60"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {selected ? <CheckCircle2 className="w-3.5 h-3.5 text-[#E6C477] shrink-0 ml-1.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-600 shrink-0 ml-1.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-1.5">
                        Project Requirements & Notes <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us what pieces, engraving placement, packaging, or target timeline you need..."
                        value={bulkForm.message}
                        onChange={e => setBulkForm({ ...bulkForm, message: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-[#D5C2AB] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-xs sm:text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all resize-y"
                      />
                    </div>

                    {/* Submit Bulk WhatsApp Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4A359] via-[#C69A4B] to-[#A87B2A] hover:brightness-105 active:scale-98 text-[#1E110A] font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_4px_18px_rgba(198,154,75,0.35)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#1E110A]" />
                      <span>{isSubmitting ? "Connecting..." : "Request Bulk Quote & WhatsApp Guild"}</span>
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
