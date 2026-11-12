"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useSession, signIn } from "next-auth/react";
import { CheckCircle2, ShoppingBag, MapPin, Truck, Loader2, Tag, X, Sparkles, ShieldCheck } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowId = searchParams.get("buyNow");
  const selectedIdsParam = searchParams.get("selectedIds");
  const selectedIds = selectedIdsParam ? selectedIdsParam.split(",") : [];
  
  const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
  const { data: session, status } = useSession();
  
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!!buyNowId);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount: number, type: 'percent' | 'flat' } | null>(null);

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | 'new'>('new');

  const [formData, setFormData] = useState({
    customerName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || session.user?.name || "",
        email: prev.email || session.user?.email || ""
      }));

      // Fetch saved profile details and addresses to auto-fill checkout
      const fetchProfileDetails = async () => {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            
            if (data.addresses && data.addresses.length > 0) {
              setSavedAddresses(data.addresses);
              // Find default address
              const defaultIdx = data.addresses.findIndex((a: any) => a.isDefault);
              const idxToSelect = defaultIdx >= 0 ? defaultIdx : 0;
              setSelectedAddressIndex(idxToSelect);
              
              const addr = data.addresses[idxToSelect];
              setFormData(prev => ({
                ...prev,
                customerName: addr.name,
                phone: addr.phone,
                address: addr.street,
                city: addr.city,
                pincode: addr.pincode
              }));
            } else if (data.phone || data.address) {
              // Legacy profile fallback
              setFormData(prev => ({
                ...prev,
                phone: data.phone || "",
                address: data.address || "",
                city: data.city || "",
                pincode: data.pincode || ""
              }));
            }
          }
        } catch (error) {
          console.error("Failed to load user profile for checkout", error);
        }
      };

      fetchProfileDetails();
    }
  }, [session]);

  useEffect(() => {
    if (buyNowId) {
      // Single product Buy Now checkout
      fetch(`/api/products/${buyNowId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setCheckoutItems([{
              productId: data.id || data._id,
              name: data.name,
              price: data.price,
              quantity: 1,
              image: data.image
            }]);
            setCheckoutTotal(data.price);
          }
          setIsLoadingProduct(false);
        })
        .catch(err => {
          console.error("Failed to load product", err);
          setIsLoadingProduct(false);
        });
    } else if (selectedIds.length > 0) {
      // Use specifically selected cart items
      const selectedCartItems = cartItems.filter(item => selectedIds.includes(item.id));
      setCheckoutItems(selectedCartItems);
      const total = selectedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setCheckoutTotal(total);
    } else {
      // Use all cart items (fallback)
      setCheckoutItems(cartItems);
      setCheckoutTotal(cartTotal);
    }
  }, [buyNowId, selectedIdsParam, cartItems, cartTotal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (selectedAddressIndex !== 'new') {
      setSelectedAddressIndex('new');
    }
  };

  const handleSelectSavedAddress = (index: number) => {
    setSelectedAddressIndex(index);
    const addr = savedAddresses[index];
    setFormData(prev => ({
      ...prev,
      customerName: addr.name,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
      pincode: addr.pincode
    }));
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    const code = promoCode.toUpperCase().trim();
    
    try {
      const res = await fetch("/api/promos/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      
      const data = await res.json();
      if (res.ok) {
        setAppliedPromo({ code: data.code, discount: data.discountPercentage, type: 'percent' });
      } else {
        alert(data.error || "Invalid or expired promo code.");
        setAppliedPromo(null);
      }
    } catch (error) {
      alert("Failed to apply promo code");
    }
  };

  // Calculate Discounts
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.floor(checkoutTotal * (appliedPromo.discount / 100));
    } else if (appliedPromo.type === 'flat') {
      discountAmount = appliedPromo.discount;
    }
  }
  const finalTotal = Math.max(0, checkoutTotal - discountAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        items: checkoutItems.map(item => ({
          productId: item.productId || item.id || (item as any)._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: finalTotal,
        promoCode: appliedPromo ? appliedPromo.code : undefined
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        if (!buyNowId) {
          if (selectedIds.length > 0) {
            selectedIds.forEach(id => removeFromCart(id));
          } else {
            clearCart();
          }
        }
        setTimeout(() => {
          router.push("/");
        }, 4000);
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex w-full min-h-[80vh] items-center justify-center bg-[#F7F5F0] dark:bg-[#14100E] p-6">
        <div className="bg-white/90 dark:bg-[#1E1713]/90 p-10 rounded-3xl shadow-xl border border-[#EAE1D2] dark:border-[#2E241E] text-center max-w-md w-full">
          <div className="w-16 h-16 bg-[#EAE1D2]/60 dark:bg-[#2E241E] rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-[#C49A50]" />
          </div>
          <h2 className="text-3xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-3">Order Confirmed</h2>
          <p className="text-xs sm:text-sm text-[#82786E] mb-6 leading-relaxed">
            Thank you for welcoming Kaashta Crafts into your sanctuary. Our master artisans have received your order details and will dispatch it with safe cushioned transit.
          </p>
          <div className="text-xs text-[#82786E] animate-pulse">Returning to gallery...</div>
        </div>
      </div>
    );
  }

  if (isLoadingProduct) {
    return (
      <div className="flex w-full min-h-[80vh] items-center justify-center bg-[#F7F5F0] dark:bg-[#14100E]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C49A50]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex w-full min-h-[80vh] items-center justify-center bg-[#F7F5F0] dark:bg-[#14100E] p-6">
        <div className="bg-white/90 dark:bg-[#1E1713]/90 p-10 rounded-3xl shadow-xl border border-[#EAE1D2] dark:border-[#2E241E] text-center max-w-md w-full">
          <div className="w-16 h-16 bg-[#EAE1D2]/60 dark:bg-[#2E241E] rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-7 h-7 text-[#C49A50]" />
          </div>
          <h2 className="text-2xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-2">Collector Sign In Required</h2>
          <p className="text-xs sm:text-sm text-[#82786E] mb-6">
            Please authenticate to secure your checkout and preserve your delivery preferences.
          </p>
          <button 
            onClick={() => signIn("google")}
            className="w-full py-3.5 bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-8 w-full pt-4">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[#C49A50] text-xs font-bold uppercase tracking-[0.16em] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Checkout Sanctuary</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] tracking-tight flex items-center gap-3">
          Secure Order Details
          {buyNowId && <span className="text-[11px] font-sans font-bold text-[#C49A50] bg-[#EAE1D2]/50 dark:bg-[#2E241E] px-3 py-1 rounded-full uppercase tracking-wider">Instant Buy</span>}
        </h1>
        <p className="text-xs sm:text-sm text-[#82786E] mt-1">
          Provide your delivery coordinates to complete your order.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Shipping Form Section */}
        <div className="flex-grow w-full">
          <form onSubmit={handleSubmit} className="bg-white/85 dark:bg-[#1E1713]/85 p-6 sm:p-8 rounded-3xl shadow-xs border border-[#EAE1D2] dark:border-[#2E241E]">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#EAE1D2] dark:border-[#2E241E]">
              <MapPin className="w-5 h-5 text-[#C49A50]" />
              <h2 className="text-lg font-bold font-playfair text-[#241812] dark:text-[#F7F5F0]">Delivery Destination</h2>
            </div>

            {/* Saved Address Selector */}
            {savedAddresses.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-[#C49A50] mb-3">Saved Addresses</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSelectSavedAddress(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedAddressIndex === idx ? 'border-[#C49A50] bg-[#F7F5F0] dark:bg-[#14100E] shadow-2xs' : 'border-[#EAE1D2] dark:border-[#2E241E] hover:border-[#82786E]'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold bg-[#EAE1D2]/60 dark:bg-[#2E241E] text-[#65452F] dark:text-[#C49A50] px-2 py-0.5 rounded uppercase tracking-wider">{addr.label}</span>
                      </div>
                      <p className="font-bold text-xs mt-1 text-[#241812] dark:text-[#F7F5F0]">{addr.name} • {addr.phone}</p>
                      <p className="text-[11px] text-[#82786E] mt-0.5 line-clamp-1">{addr.street}, {addr.city} - {addr.pincode}</p>
                    </div>
                  ))}
                  <div 
                    onClick={() => {
                      setSelectedAddressIndex('new');
                      setFormData(prev => ({...prev, customerName: session?.user?.name || "", phone: "", address: "", city: "", pincode: ""}));
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center ${selectedAddressIndex === 'new' ? 'border-[#C49A50] bg-[#F7F5F0] dark:bg-[#14100E]' : 'border-dashed border-[#EAE1D2] dark:border-[#2E241E] hover:border-[#82786E]'}`}
                  >
                    <span className="font-bold text-xs text-[#241812] dark:text-[#F7F5F0]">+ New Delivery Address</span>
                  </div>
                </div>
              </div>
            )}

            <div className={`transition-all duration-300 ${savedAddresses.length > 0 && selectedAddressIndex !== 'new' ? 'opacity-60 pointer-events-none' : ''}`}>
              {savedAddresses.length > 0 && selectedAddressIndex !== 'new' && (
                <div className="text-xs font-semibold text-[#65452F] dark:text-[#C49A50] mb-4 bg-[#EAE1D2]/40 dark:bg-[#2E241E]/40 p-2.5 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E]">
                  Using selected saved address above. Select "New Delivery Address" to enter fresh coordinates.
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#82786E] mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E] bg-[#F7F5F0]/60 dark:bg-[#14100E] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 text-xs text-[#241812] dark:text-[#F7F5F0] transition-all"
                    placeholder="Recipient's Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#82786E] mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E] bg-[#F7F5F0]/60 dark:bg-[#14100E] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 text-xs text-[#241812] dark:text-[#F7F5F0] transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#82786E] mb-1.5">Email (Optional)</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E] bg-[#F7F5F0]/60 dark:bg-[#14100E] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 text-xs text-[#241812] dark:text-[#F7F5F0] transition-all"
                  placeholder="For automated PDF receipt"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#82786E] mb-1.5">Street Address</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E] bg-[#F7F5F0]/60 dark:bg-[#14100E] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 text-xs text-[#241812] dark:text-[#F7F5F0] transition-all resize-none"
                  placeholder="Apartment, building, street coordinates"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#82786E] mb-1.5">City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E] bg-[#F7F5F0]/60 dark:bg-[#14100E] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 text-xs text-[#241812] dark:text-[#F7F5F0] transition-all"
                    placeholder="Chennai, Bangalore, Mumbai..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#82786E] mb-1.5">PIN Code</label>
                  <input 
                    type="text" 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E] bg-[#F7F5F0]/60 dark:bg-[#14100E] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 text-xs text-[#241812] dark:text-[#F7F5F0] transition-all"
                    placeholder="600001"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || checkoutItems.length === 0}
              className="w-full bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] disabled:bg-stone-300 text-[#F7F5F0] dark:text-[#241812] py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer flex justify-center items-center gap-2 mt-4"
            >
              {isSubmitting ? "Dispatching..." : "Confirm Order (Cash on Delivery)"}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white/85 dark:bg-[#1E1713]/85 p-6 sm:p-8 rounded-3xl shadow-xs border border-[#EAE1D2] dark:border-[#2E241E] sticky top-28">
            <div className="flex items-center gap-2.5 mb-5">
              <ShoppingBag className="w-5 h-5 text-[#C49A50]" />
              <h2 className="text-lg font-bold font-playfair text-[#241812] dark:text-[#F7F5F0]">Order Overview</h2>
            </div>
            
            <div className="flex flex-col gap-3 mb-5 max-h-56 overflow-y-auto pr-1">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-[#82786E] dark:text-[#A39A90] line-clamp-1 pr-3">{item.quantity} × {item.name}</span>
                  <span className="font-bold text-[#241812] dark:text-[#F7F5F0] shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EAE1D2] dark:border-[#2E241E] pt-4 mb-5">
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="text-[#82786E]">Subtotal</span>
                <span className="font-bold text-[#241812] dark:text-[#F7F5F0]">₹{checkoutTotal}</span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="text-[#82786E]">Privilege Discount ({appliedPromo.code})</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#82786E]">Shipping</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Complimentary</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="mb-5">
              {!appliedPromo ? (
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82786E] w-3.5 h-3.5" />
                    <input 
                      type="text" 
                      placeholder="Promo Voucher"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E] bg-[#F7F5F0]/60 dark:bg-[#14100E] text-xs uppercase font-mono outline-none focus:border-[#C49A50]"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-bold text-xs">{appliedPromo.code} Privilege Applied</span>
                  </div>
                  <button onClick={() => { setAppliedPromo(null); setPromoCode(""); }} className="text-emerald-800 dark:text-emerald-300 hover:text-red-500 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-[#EAE1D2] dark:border-[#2E241E] pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#241812] dark:text-[#F7F5F0]">Payable Total</span>
                <span className="text-2xl font-bold text-[#241812] dark:text-[#F7F5F0]">₹{finalTotal}</span>
              </div>
            </div>

            <div className="bg-[#F7F5F0] dark:bg-[#14100E] rounded-2xl p-3.5 flex gap-2.5 text-xs text-[#82786E] border border-[#EAE1D2] dark:border-[#2E241E]">
              <Truck className="w-4 h-4 text-[#C49A50] shrink-0 mt-0.5" />
              <p>Pay upon delivery. Our concierge will contact you to verify coordinates before dispatch.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] pt-8 pb-24 font-sans transition-colors duration-300">
      <Suspense fallback={
        <div className="flex w-full min-h-[80vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C49A50]" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
