"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  useEffect(() => {
    // If items are removed and no longer in cart, remove from selection
    setSelectedItemIds(prev => prev.filter(id => cartItems.some(item => item.id === id)));
  }, [cartItems]);

  const toggleSelection = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedCartItems = cartItems.filter(item => selectedItemIds.includes(item.id));
  const subtotal = selectedCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 0 : 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <main className="flex flex-col w-full min-h-screen bg-stone-50 pt-8 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <h1 className="text-3xl md:text-4xl font-semibold text-stone-900 mb-2 tracking-tight">
          Shopping Cart
        </h1>
        <p className="text-stone-500 mb-10">
          Review your items and proceed to checkout.
        </p>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items List */}
            <div className="flex-grow flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl shadow-sm transition-all hover:shadow-md border-2 ${selectedItemIds.includes(item.id) ? 'border-amber-500/60 bg-amber-50/40' : 'border-stone-100 bg-white'}`}>
                  
                  {/* Selection Checkbox */}
                  <button 
                    onClick={() => toggleSelection(item.id)}
                    className="shrink-0 p-2 focus:outline-none hidden sm:flex items-center justify-center transition-all"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${selectedItemIds.includes(item.id) ? 'bg-amber-600 border-2 border-amber-600 shadow-sm shadow-amber-600/30' : 'bg-white border-2 border-stone-300 hover:border-amber-400'}`}>
                      {selectedItemIds.includes(item.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>

                  <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center sm:block">
                    {/* Mobile Checkbox overlaid on image */}
                    <button 
                      onClick={() => toggleSelection(item.id)}
                      className="absolute top-2 left-2 z-10 p-1.5 rounded-lg sm:hidden bg-white/60 backdrop-blur-sm shadow-sm"
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${selectedItemIds.includes(item.id) ? 'bg-amber-600 border-amber-600' : 'bg-white border-2 border-stone-300'}`}>
                        {selectedItemIds.includes(item.id) && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-grow w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-stone-900">{item.name}</h3>
                        <p className="text-sm text-stone-500">{item.category}</p>
                      </div>
                      <span className="text-lg font-bold text-amber-800">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 bg-stone-50 border border-stone-200 rounded-full px-3 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-amber-700 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-4 text-center font-semibold text-stone-800 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-amber-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Buy Now Button */}
                        <Link 
                          href={`/checkout?buyNow=${item.id}`}
                          className="text-amber-700 hover:text-amber-800 flex items-center gap-1.5 text-sm font-bold transition-colors"
                        >
                          Buy this now <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        {/* Remove Button */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-500 flex items-center gap-1.5 text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 sticky top-28">
                <h2 className="text-xl font-bold font-playfair text-stone-900 mb-6">Order Summary</h2>
                
                <div className="flex flex-col gap-4 text-stone-600 mb-6">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-medium text-stone-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-stone-900">Total ({selectedItemIds.length} items)</span>
                    <span className="text-2xl font-bold text-amber-800">₹{total}</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 text-right">Including all taxes</p>
                </div>

                <Link 
                  href={selectedItemIds.length > 0 ? `/checkout?selectedIds=${selectedItemIds.join(",")}` : "#"} 
                  className={`w-full py-4 rounded-full font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 group mb-4
                    ${selectedItemIds.length > 0 
                      ? "bg-stone-900 hover:bg-stone-800 text-white hover:shadow-lg" 
                      : "bg-stone-300 text-stone-500 cursor-not-allowed"}`}
                  onClick={(e) => {
                    if (selectedItemIds.length === 0) {
                      e.preventDefault();
                      alert("Please select at least one item to proceed to checkout.");
                    }
                  }}
                >
                  Proceed to Checkout <ArrowRight className={`w-5 h-5 ${selectedItemIds.length > 0 ? 'group-hover:translate-x-1 transition-transform' : ''}`} />
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs font-medium text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-stone-200 shadow-sm text-center px-4">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-stone-300" />
            </div>
            <h2 className="text-2xl font-bold font-playfair text-stone-900 mb-3">Your cart is empty</h2>
            <p className="text-stone-500 max-w-md mb-8">
              Looks like you haven't added any premium wooden crafts to your cart yet.
            </p>
            <Link href="/products" className="bg-amber-800 hover:bg-amber-700 text-white px-8 py-3.5 rounded-full font-medium tracking-wide transition-all shadow-md">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

// Simple fallback icon since lucide-react ShoppingCart isn't imported above to avoid conflict
function ShoppingCart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
