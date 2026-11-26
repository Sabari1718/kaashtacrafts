"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Eye, ExternalLink } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  useEffect(() => {
    setSelectedItemIds(prev => prev.filter(id => cartItems.some(item => item.id === id)));
  }, [cartItems]);

  const toggleSelection = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedCartItems = cartItems.filter(item => selectedItemIds.includes(item.id));
  const subtotal = selectedCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal;

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] pt-8 pb-24 font-sans transition-colors duration-300">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 w-full">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#C49A50] text-xs font-bold uppercase tracking-[0.16em] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Bag</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-playfair tracking-tight text-[#241812] dark:text-[#F7F5F0]">
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-[#82786E] dark:text-[#A39A90] mt-1">
            Review your selected handcrafted creations and proceed to checkout.
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Cart Items List */}
            <div className="flex-grow w-full flex flex-col gap-4">
              {cartItems.map((item) => {
                const customQuery = new URLSearchParams();
                if (item.customization?.text) customQuery.set("customText", item.customization.text);
                if (item.customization?.secondaryText) customQuery.set("secondaryText", item.customization.secondaryText);
                if (item.customization?.font) customQuery.set("customFont", item.customization.font);
                if (item.customization?.size) customQuery.set("customSize", item.customization.size);
                if (item.customization?.color) customQuery.set("customColor", item.customization.color);
                if (item.customization?.secondaryFont) customQuery.set("customSecondaryFont", item.customization.secondaryFont);
                if (item.customization?.secondarySize) customQuery.set("customSecondarySize", item.customization.secondarySize);
                if (item.customization?.secondaryColor) customQuery.set("customSecondaryColor", item.customization.secondaryColor);
                if (item.customization?.position) customQuery.set("customPos", item.customization.position);
                customQuery.set("fromCart", "true");

                const productUrl = `/products/${item.id || (item as any)._id}?${customQuery.toString()}`;
                const displayImage = (item.images && item.images.length > 1) ? item.images[1] : (item.images?.[0] || item.image);

                return (
                <div 
                  key={item.id} 
                  className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-3xl transition-all duration-300 border ${
                    selectedItemIds.includes(item.id) 
                      ? 'border-[#C49A50] bg-white dark:bg-[#1E1713] shadow-xs' 
                      : 'border-[#EAE1D2] dark:border-[#2E241E] bg-white/70 dark:bg-[#1E1713]/70'
                  }`}
                >
                  
                  {/* Selection Checkbox (Desktop) */}
                  <button 
                    onClick={() => toggleSelection(item.id)}
                    className="shrink-0 p-1 focus:outline-none hidden sm:flex items-center justify-center cursor-pointer"
                    aria-label="Select piece"
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      selectedItemIds.includes(item.id) 
                        ? 'bg-[#241812] dark:bg-[#C49A50] text-[#F7F5F0] dark:text-[#241812]' 
                        : 'border border-[#EAE1D2] dark:border-[#2E241E] bg-white/60 dark:bg-[#14100E]'
                    }`}>
                      {selectedItemIds.includes(item.id) && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Thumbnail Image (Clickable Link with Live Wood Carving Preview Badge) */}
                  <div className="relative w-full sm:w-28 h-28 rounded-2xl overflow-hidden bg-[#EAE1D2]/30 dark:bg-[#2E241E]/30 shrink-0">
                    <button 
                      onClick={() => toggleSelection(item.id)}
                      className="absolute top-2 left-2 z-10 p-1 rounded-md sm:hidden bg-white/90 dark:bg-[#1E1713]/90 shadow-xs cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center ${selectedItemIds.includes(item.id) ? 'bg-[#241812] text-white' : 'border border-stone-300'}`}>
                        {selectedItemIds.includes(item.id) && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                    <Link 
                      href={productUrl}
                      className="block w-full h-full relative group/img cursor-pointer"
                      title={`Open ${item.name} with your custom engraving`}
                    >
                      <Image 
                        src={displayImage} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover/img:scale-108 transition-transform duration-300"
                      />
                      {(item.customization?.text || item.customization?.secondaryText) && (
                        <>
                          <div className="absolute top-1.5 left-1.5 bg-[#241812] text-[#E0D3BE] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#C49A50]/60 z-10 shadow-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                            <span>Engraved</span>
                          </div>
                          <div className="absolute inset-x-1.5 bottom-1.5 bg-black/80 backdrop-blur-[2px] rounded-lg px-1.5 py-1 text-center border border-[#C49A50]/60 shadow-xs pointer-events-none z-10">
                            <p className="text-[9px] font-black text-[#F7F5F0] truncate drop-shadow-sm font-serif">
                              ✒️ {item.customization.text || item.customization.secondaryText}
                            </p>
                          </div>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/25 transition-colors flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white opacity-0 group-hover/img:opacity-100 transition-opacity drop-shadow-md" />
                      </div>
                    </Link>
                  </div>
                  
                  {/* Meta & Controls */}
                  <div className="flex flex-col flex-grow w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#C49A50]">{item.category}</span>
                        <Link 
                          href={productUrl}
                          className="group/title block"
                          title={`Click to open ${item.name} with your custom engraving`}
                        >
                          <h3 className="text-base font-bold text-[#241812] dark:text-[#F7F5F0] line-clamp-1 group-hover/title:text-[#C49A50] transition-colors flex items-center gap-1.5 cursor-pointer">
                            <span>{item.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover/title:opacity-100 text-[#C49A50] shrink-0" />
                          </h3>
                        </Link>
                        {(item.customization?.text || item.customization?.secondaryText) && (
                          <div className="mt-1 flex flex-col gap-1 bg-[#FAF6EE] dark:bg-[#251A12] border border-[#C49A50]/40 p-2 rounded-xl text-[11px] font-semibold text-[#8B5A2B] dark:text-[#E6C477] w-fit shadow-xs">
                            {item.customization.text && (
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[#C49A50] font-bold">✒️ Line 1:</span>
                                <span className="font-extrabold text-[#241812] dark:text-[#F7F5F0]">"{item.customization.text}"</span>
                                <span className="opacity-75 text-[10px]">({[item.customization.font, item.customization.size, item.customization.color].filter(Boolean).join(" • ")})</span>
                              </div>
                            )}
                            {item.customization.secondaryText && (
                              <div className="flex items-center gap-1 flex-wrap text-[10px]">
                                <span className="text-[#C49A50] font-bold">✒️ Line 2:</span>
                                <span className="font-extrabold text-[#241812] dark:text-[#F7F5F0]">"{item.customization.secondaryText}"</span>
                                <span className="opacity-75 text-[9px]">({[item.customization.secondaryFont, item.customization.secondarySize, item.customization.secondaryColor].filter(Boolean).join(" • ")})</span>
                              </div>
                            )}
                            <Link 
                              href={productUrl}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C49A50] hover:underline pt-0.5"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Click to Open & View with Your Engraving</span>
                            </Link>
                          </div>
                        )}
                      </div>
                      <span className="text-base font-bold text-[#241812] dark:text-[#F7F5F0]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#EAE1D2]/60 dark:border-[#2E241E]/60">
                      
                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-3 bg-[#F7F5F0] dark:bg-[#14100E] border border-[#EAE1D2] dark:border-[#2E241E] rounded-full px-3 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-[#82786E] hover:text-[#241812] dark:hover:text-[#F7F5F0] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-4 text-center font-bold text-xs text-[#241812] dark:text-[#F7F5F0]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-[#82786E] hover:text-[#241812] dark:hover:text-[#F7F5F0] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                        <Link 
                          href={productUrl}
                          className="text-[#82786E] hover:text-[#241812] dark:hover:text-[#F7F5F0] flex items-center gap-1 text-xs font-semibold transition-colors"
                          title="Open product page with your saved engraving"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C49A50]" />
                          <span>View & Edit Engraving</span>
                        </Link>

                        <span className="text-[#EAE1D2] dark:text-[#2E241E]">•</span>

                        <Link 
                          href={`/checkout?buyNow=${item.id}${item.customization?.text ? `&customText=${encodeURIComponent(item.customization.text)}&customFont=${encodeURIComponent(item.customization.font || '')}&customSize=${encodeURIComponent(item.customization.size || '')}&customColor=${encodeURIComponent(item.customization.color || '')}&customPos=${encodeURIComponent(item.customization.position || '')}` : ''}${item.customization?.secondaryText ? `&customSecondaryText=${encodeURIComponent(item.customization.secondaryText)}&customSecondaryFont=${encodeURIComponent(item.customization.secondaryFont || '')}&customSecondarySize=${encodeURIComponent(item.customization.secondarySize || '')}&customSecondaryColor=${encodeURIComponent(item.customization.secondaryColor || '')}` : ''}`}
                          className="text-[#C49A50] hover:underline flex items-center gap-1 text-xs font-bold transition-colors"
                        >
                          Buy Now <ArrowRight className="w-3 h-3" />
                        </Link>

                        <span className="text-[#EAE1D2] dark:text-[#2E241E]">•</span>

                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#82786E] hover:text-red-500 flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Order Summary Box */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-white/85 dark:bg-[#1E1713]/85 p-6 sm:p-8 rounded-3xl shadow-xs border border-[#EAE1D2] dark:border-[#2E241E] sticky top-28">
                <h2 className="text-xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-5">Summary</h2>
                
                <div className="flex flex-col gap-3.5 text-xs sm:text-sm text-[#82786E] dark:text-[#A39A90] mb-5">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#241812] dark:text-[#F7F5F0]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Complimentary</span>
                  </div>
                </div>

                <div className="border-t border-[#EAE1D2] dark:border-[#2E241E] pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#241812] dark:text-[#F7F5F0]">Total ({selectedItemIds.length} items)</span>
                    <span className="text-2xl font-bold text-[#241812] dark:text-[#F7F5F0]">₹{total}</span>
                  </div>
                  <p className="text-[10px] text-[#82786E] mt-1 text-right">All taxes & cushioned delivery included</p>
                </div>

                <button
                  onClick={() => {
                    const selectedItems = cartItems.filter(item => selectedItemIds.includes(item.id));
                    if (selectedItems.length === 0) {
                      alert("Please select at least one item to order.");
                      return;
                    }
                    const itemsList = selectedItems
                      .map((item, i) => {
                        let desc = `${i + 1}. *${item.name}* (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`;
                        if (item.customization?.text) {
                          desc += `\n   ✒️ Line 1: "${item.customization.text}" (${[item.customization.font, item.customization.size, item.customization.color].filter(Boolean).join(", ")})`;
                        }
                        if (item.customization?.secondaryText) {
                          desc += `\n   ✒️ Line 2: "${item.customization.secondaryText}" (${[item.customization.secondaryFont, item.customization.secondarySize, item.customization.secondaryColor].filter(Boolean).join(", ")})`;
                        }
                        return desc;
                      })
                      .join('\n\n');
                    const waText = 
`🛍️ *KAASHTA CRAFTS BAG ORDER*
━━━━━━━━━━━━━━━━━━━━
Hello! I want to order these items from my bag:

${itemsList}

💰 *Total Amount:* ₹${total}
━━━━━━━━━━━━━━━━━━━━
Please share payment and delivery details!`;
                    window.open(`https://wa.me/918838098116?text=${encodeURIComponent(waText)}`, '_blank');
                  }}
                  disabled={selectedItemIds.length === 0}
                  className={`w-full py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mb-2 cursor-pointer shadow-sm hover:shadow-md
                    ${selectedItemIds.length > 0 
                      ? "bg-[#25D366] hover:bg-[#20bd5a] text-white" 
                      : "bg-[#EAE1D2] text-[#82786E] cursor-not-allowed"}`}
                >
                  Order via WhatsApp (+91 88380 98116)
                </button>

                <Link 
                  href={selectedItemIds.length > 0 ? `/checkout?selectedIds=${selectedItemIds.join(",")}` : "#"} 
                  className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mb-4 cursor-pointer
                    ${selectedItemIds.length > 0 
                      ? "bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] dark:text-[#241812] shadow-sm hover:shadow-md" 
                      : "bg-[#EAE1D2] text-[#82786E] cursor-not-allowed"}`}
                  onClick={(e) => {
                    if (selectedItemIds.length === 0) {
                      e.preventDefault();
                      alert("Please check at least one piece to proceed.");
                    }
                  }}
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs text-[#82786E]">
                  <ShieldCheck className="w-4 h-4 text-[#C49A50]" />
                  <span>Safe & Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/70 dark:bg-[#1E1713]/70 rounded-3xl border border-[#EAE1D2] dark:border-[#2E241E] text-center px-4">
            <div className="w-20 h-20 bg-[#EAE1D2]/50 dark:bg-[#2E241E] rounded-full flex items-center justify-center mb-5">
              <ShoppingBag className="w-8 h-8 text-[#82786E]" />
            </div>
            <h2 className="text-2xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-2">Your Bag is Empty</h2>
            <p className="text-xs sm:text-sm text-[#82786E] max-w-sm mb-6">
              You haven't reserved any handcrafted wooden creations yet.
            </p>
            <Link href="/products" className="bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm">
              Discover Masterpieces
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
