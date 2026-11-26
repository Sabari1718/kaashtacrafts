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
  Clock
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
    productChoice: "Executive Desk Suites",
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
        `*New Inquiry - Kaashta Crafts*\n\n` +
        `👤 *Name:* ${directForm.name}\n` +
        `📞 *Phone:* ${directForm.phone}\n` +
        `📧 *Email:* ${directForm.email || "N/A"}\n` +
        `📂 *Category:* ${directForm.category}\n\n` +
        `💬 *Message:*\n${directForm.message}`
      );
      
      toast.success("Connecting with our woodcraft team on WhatsApp...");
      setIsSubmitted(true);
      window.open(`https://wa.me/918838098116?text=${waText}`, "_blank");
    } catch (err) {
      toast.error("Failed to submit inquiry, opening WhatsApp directly.");
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
        `*📦 Bulk Order & Customization Request - Kaashta Crafts*\n\n` +
        `🏢 *Org / Client:* ${bulkForm.organization || "Individual/Guild"}\n` +
        `👤 *Contact Person:* ${bulkForm.name}\n` +
        `📞 *Phone:* ${bulkForm.phone}\n` +
        `📧 *Email:* ${bulkForm.email || "N/A"}\n` +
        `🪵 *Product Interest:* ${bulkForm.productChoice}\n` +
        `🔢 *Estimated Quantity:* ${bulkForm.quantity}\n` +
        `✨ *Customizations:* ${bulkForm.customizations.join(", ") || "None"}\n` +
        `📅 *Target Delivery Date:* ${bulkForm.targetDate || "Flexible"}\n\n` +
        `📝 *Requirement Details:*\n${bulkForm.message}`
      );

      toast.success("Connecting your bulk inquiry with our artisan studio on WhatsApp!");
      setIsSubmitted(true);
      window.open(`https://wa.me/918838098116?text=${waText}`, "_blank");
    } catch (err) {
      toast.error("Failed to submit inquiry, opening WhatsApp directly.");
      window.open(`https://wa.me/918838098116`, "_blank");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#120E0A] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* ── HEADER SECTION ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE1D2]/80 dark:bg-[#251A13] border border-[#C69A4B]/40 text-[#8C621E] dark:text-[#E2B462] text-[11px] font-bold tracking-widest uppercase mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisan Studio Direct Desk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-playfair text-[#22130E] dark:text-[#F8F5EF] tracking-tight leading-tight mb-4">
            Connect With Kaashta Crafts.
          </h1>

          <p className="text-sm sm:text-base text-[#6B5A4E] dark:text-[#B5A597] leading-relaxed">
            Whether you need a bespoke single artifact, corporate gift suites, custom laser engraving, or grand bulk orders, our master Tamil woodturners are here to assist you directly.
          </p>
        </div>

        {/* ── TOP CONTACT ACTION CARDS (3 CARDS MATCHING REFERENCE) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
          
          {/* Card 1: Direct Phone Line */}
          <div className="bg-white dark:bg-[#1C140F] rounded-2xl p-6 sm:p-7 border border-[#E7DBCB] dark:border-[#332318] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#8C7B6D] dark:text-[#A8988B]">
                Direct Phone Line
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-[#21130E] dark:text-[#F8F5EF] mt-1 mb-2">
                +91 88380 98116
              </h3>
              <p className="text-xs text-[#7A695C] dark:text-[#9E8E81] leading-relaxed">
                Instant calling for order assistance, bespoke woodcraft queries, and corporate gifting.
              </p>
            </div>
            <a
              href="tel:+918838098116"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider text-center shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Card 2: WhatsApp Support */}
          <div className="bg-white dark:bg-[#1C140F] rounded-2xl p-6 sm:p-7 border border-[#E7DBCB] dark:border-[#332318] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#8C7B6D] dark:text-[#A8988B]">
                WhatsApp Support
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-[#21130E] dark:text-[#F8F5EF] mt-1 mb-2">
                +91 88380 98116
              </h3>
              <p className="text-xs text-[#7A695C] dark:text-[#9E8E81] leading-relaxed">
                Fast chat, live artisan carving photos, custom engraving previews, and instant price quotes.
              </p>
            </div>
            <a
              href="https://wa.me/918838098116?text=Hi%20Kaashta%20Crafts,%20I%20would%20like%20to%20inquire%20about%20your%20handcrafted%20wooden%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] active:scale-95 text-white font-bold text-xs uppercase tracking-wider text-center shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Card 3: Official Email */}
          <div className="bg-white dark:bg-[#1C140F] rounded-2xl p-6 sm:p-7 border border-[#E7DBCB] dark:border-[#332318] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#8C7B6D] dark:text-[#A8988B]">
                Official Email
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#21130E] dark:text-[#F8F5EF] mt-1 mb-2 truncate">
                kaashtacrafts@gmail.com
              </h3>
              <p className="text-xs text-[#7A695C] dark:text-[#9E8E81] leading-relaxed">
                For formal purchase orders, institutional procurement, and custom design briefs.
              </p>
            </div>
            <a
              href="mailto:kaashtacrafts@gmail.com"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider text-center shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </a>
          </div>
        </div>

        {/* ── TABS SELECTOR (DIRECT MESSAGE vs BULK ORDERS) ── */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#EBE2D4] dark:bg-[#1E1510] border border-[#DFCBB2] dark:border-[#332318] shadow-inner gap-1.5 max-w-md w-full">
            <button
              onClick={() => { setActiveTab("direct"); setIsSubmitted(false); }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "direct"
                  ? "bg-[#21130E] text-[#F8F5EF] shadow-md dark:bg-[#C69A4B] dark:text-[#1A110B]"
                  : "text-[#6B5A4E] dark:text-[#A8988B] hover:text-[#21130E] dark:hover:text-[#F8F5EF]"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Direct Message</span>
            </button>
            <button
              onClick={() => { setActiveTab("bulk"); setIsSubmitted(false); }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "bulk"
                  ? "bg-[#21130E] text-[#F8F5EF] shadow-md dark:bg-[#C69A4B] dark:text-[#1A110B]"
                  : "text-[#6B5A4E] dark:text-[#A8988B] hover:text-[#21130E] dark:hover:text-[#F8F5EF]"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Bulk & Custom Orders</span>
            </button>
          </div>
        </div>

        {/* ── FORM CONTAINER ── */}
        <div className="bg-white dark:bg-[#1A130E] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7DBCB] dark:border-[#332318] shadow-xl">

          {/* TAB 1: SEND US A DIRECT MESSAGE */}
          {activeTab === "direct" && (
            <div>
              <div className="mb-8 border-b border-[#EAE1D2] dark:border-[#2C1F17] pb-6">
                <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-[#21130E] dark:text-[#F8F5EF] mb-2">
                  Send Us a Direct Message
                </h2>
                <p className="text-xs sm:text-sm text-[#7A695C] dark:text-[#9E8E81]">
                  Fill in your details below. We typically respond within 1–2 hours during studio workshop timings.
                </p>
              </div>

              <form onSubmit={handleDirectSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={directForm.name}
                      onChange={e => setDirectForm({ ...directForm, name: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                    />
                  </div>

                  {/* Phone / Mobile */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                      Phone / Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9843343232"
                      value={directForm.phone}
                      onChange={e => setDirectForm({ ...directForm, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={directForm.email}
                      onChange={e => setDirectForm({ ...directForm, email: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                    />
                  </div>

                  {/* Inquiry Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                      Inquiry Category
                    </label>
                    <select
                      value={directForm.category}
                      onChange={e => setDirectForm({ ...directForm, category: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all cursor-pointer"
                    >
                      <option value="General Product Inquiry">General Product Inquiry</option>
                      <option value="Order Status & Delivery">Order Status & Delivery</option>
                      <option value="Custom Wood Carving">Custom Wood Carving & Personalization</option>
                      <option value="Wood Care & Guild Quality">Wood Care & Guild Quality</option>
                      <option value="Other Assistance">Other Assistance</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                    Your Message or Piece Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what wooden pieces, questions, or assistance you need..."
                    value={directForm.message}
                    onChange={e => setDirectForm({ ...directForm, message: e.target.value })}
                    className="w-full p-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all resize-y"
                  />
                </div>

                {/* Submit Button (WhatsApp Connect - Exact Match with Reference) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#E53935] to-[#D32F2F] hover:from-[#D32F2F] hover:to-[#C62828] active:scale-98 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isSubmitting ? "Processing..." : "Submit & Connect on WhatsApp"}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: BULK ORDERS & CUSTOMIZATION */}
          {activeTab === "bulk" && (
            <div>
              <div className="mb-8 border-b border-[#EAE1D2] dark:border-[#2C1F17] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-[#21130E] dark:text-[#F8F5EF] mb-2">
                    Bulk Orders & Bespoke Customization
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7A695C] dark:text-[#9E8E81]">
                    Tailored for corporate gifting, wedding mementoes, executive events, and wholesale volume orders.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold w-fit">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Guild Wholesale Tier Pricing</span>
                </div>
              </div>

              <form onSubmit={handleBulkSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Organization / Client Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                      Company / Organization / Event Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Infosys, Wedding Memento, Boutique Cafe"
                      value={bulkForm.organization}
                      onChange={e => setBulkForm({ ...bulkForm, organization: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                    />
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                      Contact Person Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter contact person name"
                      value={bulkForm.name}
                      onChange={e => setBulkForm({ ...bulkForm, name: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Phone / Mobile */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                      Contact Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9843343232"
                      value={bulkForm.phone}
                      onChange={e => setBulkForm({ ...bulkForm, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                      Business Email
                    </label>
                    <input
                      type="email"
                      placeholder="procurement@company.com"
                      value={bulkForm.email}
                      onChange={e => setBulkForm({ ...bulkForm, email: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Product Choice */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                    Primary Product Collection
                  </label>
                  <select
                    value={bulkForm.productChoice}
                    onChange={e => setBulkForm({ ...bulkForm, productChoice: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all cursor-pointer"
                  >
                    <option value="Executive Desk Suites & Organizers">Executive Desk Suites & Docking Organizers</option>
                    <option value="Artisanal Kitchen Platters & Acacia Bowls">Artisanal Kitchen Platters & Acacia Bowls</option>
                    <option value="Sculptural Teak Clocks & Wall Art">Sculptural Teak Clocks & Wall Art</option>
                    <option value="Minimalist Stationery Blocks & Coasters">Minimalist Stationery Blocks & Coasters</option>
                    <option value="Wedding / Bespoke Corporate Gift Hampers">Wedding / Bespoke Corporate Gift Hampers</option>
                    <option value="Entirely Custom Concept">Entirely Custom Concept (Blueprint / Sketch)</option>
                  </select>
                </div>

                {/* Quantity Selector Pills */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-3">
                    Estimated Quantity Range
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {["25 - 50 Pcs", "50 - 100 Pcs", "100 - 250 Pcs", "250 - 500 Pcs", "500+ Pcs"].map(qty => (
                      <button
                        type="button"
                        key={qty}
                        onClick={() => setBulkForm({ ...bulkForm, quantity: qty })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          bulkForm.quantity === qty
                            ? "bg-[#21130E] text-white border-[#21130E] dark:bg-[#C69A4B] dark:text-[#1A110B] dark:border-[#C69A4B] shadow-md"
                            : "bg-[#FCFAF6] dark:bg-[#221812] text-[#6B5A4E] dark:text-[#B5A597] border-[#D8C7B2] dark:border-[#38261A] hover:border-[#C69A4B]"
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customization Options Multi-select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-3">
                    Customization Options Required (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: "Laser Logo Engraving", label: "✒️ Custom Laser Logo / Name" },
                      { id: "Tamil Nadu Teak Wood", label: "🪵 Seasoned Teak Wood" },
                      { id: "Luxury Gift Box & Packaging", label: "🎁 Bespoke Gift Box & Ribbon" },
                      { id: "Custom Dimensions", label: "📐 Custom Sizing / Blueprint" },
                      { id: "Organic Beeswax Polish", label: "🍯 100% Organic Beeswax Polish" },
                      { id: "Individual Personalization", label: "✨ Name per Recipient" },
                    ].map(opt => {
                      const selected = bulkForm.customizations.includes(opt.id);
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => toggleCustomization(opt.id)}
                          className={`p-3 rounded-xl text-xs font-semibold border flex items-center justify-between text-left transition-all cursor-pointer ${
                            selected
                              ? "bg-[#C69A4B]/15 border-[#C69A4B] text-[#8C621E] dark:text-[#E2B462] font-bold shadow-xs"
                              : "bg-[#FCFAF6] dark:bg-[#221812] text-[#6B5A4E] dark:text-[#B5A597] border-[#D8C7B2] dark:border-[#38261A] hover:border-[#C69A4B]/60"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {selected ? <CheckCircle2 className="w-4 h-4 text-[#C69A4B] shrink-0 ml-1.5" /> : <div className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-600 shrink-0 ml-1.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                    Target Delivery Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. By end of next month / Diwali 2026 / 15th Dec"
                    value={bulkForm.targetDate}
                    onChange={e => setBulkForm({ ...bulkForm, targetDate: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all"
                  />
                </div>

                {/* Detailed Requirements */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3C33] dark:text-[#C5B5A7] mb-2">
                    Project Requirements & Customization Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide details on quantity, packaging style, laser engraving text/logo placement, and any specific preferences..."
                    value={bulkForm.message}
                    onChange={e => setBulkForm({ ...bulkForm, message: e.target.value })}
                    className="w-full p-4 rounded-xl border border-[#D8C7B2] dark:border-[#38261A] bg-[#FCFAF6] dark:bg-[#221812] text-sm text-[#21130E] dark:text-[#F8F5EF] placeholder:text-[#A8988B] outline-none focus:border-[#C69A4B] focus:ring-2 focus:ring-[#C69A4B]/20 transition-all resize-y"
                  />
                </div>

                {/* Submit Bulk WhatsApp Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#C69A4B] via-[#B88736] to-[#9E6F22] hover:brightness-105 active:scale-98 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isSubmitting ? "Processing..." : "Request Bulk Quote & WhatsApp Guild"}</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
