"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useSession, signIn } from "next-auth/react";
import { CheckCircle2, ShoppingBag, MapPin, Truck, Loader2, Tag, X, Sparkles, ShieldCheck } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowId = searchParams.get("buyNow");
  const customTextParam = searchParams.get("customText");
  const customFontParam = searchParams.get("customFont");
  const customSizeParam = searchParams.get("customSize");
  const customPosParam = searchParams.get("customPos");
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
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>("");

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
              image: data.image,
              customization: customTextParam ? { 
                text: customTextParam, 
                font: customFontParam || undefined,
                size: customSizeParam || undefined,
                position: customPosParam || undefined
              } : undefined
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
          image: item.image,
          customization: item.customization
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
        setConfirmedOrder(data.order);
        setWhatsappUrl(data.whatsappUrl || "");
        setIsSuccess(true);

        // Open WhatsApp automatically with pre-filled order details to 8838098116
        if (data.whatsappUrl) {
          try {
            window.open(data.whatsappUrl, '_blank');
          } catch (e) {
            console.error("Popup blocked:", e);
          }
        }

        if (!buyNowId) {
          if (selectedIds.length > 0) {
            selectedIds.forEach(id => removeFromCart(id));
          } else {
            clearCart();
          }
        }
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
    const orderIdShort = confirmedOrder?._id ? confirmedOrder._id.slice(-6).toUpperCase() : "SUCCESS";
    return (
      <div className="flex w-full min-h-[85vh] items-center justify-center bg-[#F7F5F0] dark:bg-[#14100E] p-4 sm:p-6">
        <div className="bg-white/95 dark:bg-[#1E1713]/95 p-6 sm:p-10 rounded-3xl shadow-xl border border-[#EAE1D2] dark:border-[#2E241E] text-center max-w-lg w-full">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C49A50] bg-[#C49A50]/10 px-3 py-1 rounded-full border border-[#C49A50]/20">
            Order #{orderIdShort}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mt-3 mb-2">
            Order Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-[#82786E] dark:text-[#A39A90] mb-6 leading-relaxed">
            Thank you for ordering with Kaashta Crafts! Your order has been placed in the Admin Panel, emailed to your inbox, and prepared for WhatsApp notification.
          </p>

          {/* Order Summary Box */}
          <div className="bg-stone-50 dark:bg-[#14100E] p-4 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] text-left mb-5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE1D2]/80 dark:border-[#2E241E] font-medium text-[#241812] dark:text-[#F7F5F0]">
              <span>Customer:</span>
              <span className="font-semibold">{formData.customerName} ({formData.phone})</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#EAE1D2]/80 dark:border-[#2E241E] text-[#82786E]">
              <span>Delivery To:</span>
              <span className="truncate max-w-[200px] text-right">{formData.address}, {formData.city}</span>
            </div>
            <div className="flex justify-between items-center pt-2 font-bold text-sm text-[#241812] dark:text-[#F7F5F0]">
              <span>Total Price:</span>
              <span className="text-[#C49A50]">₹{finalTotal}</span>
            </div>
          </div>

          {/* WhatsApp Direct Action Button */}
          {whatsappUrl && (
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer mb-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Send Details to WhatsApp (+91 88380 98116)</span>
            </a>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            <Link 
              href="/my-orders" 
              className="w-full bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] text-[#F7F5F0] dark:text-[#241812] py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center"
            >
              View My Orders
            </Link>
            <Link 
              href="/products" 
              className="w-full bg-stone-100 dark:bg-[#1E1713] hover:bg-stone-200 text-stone-800 dark:text-[#F7F5F0] py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center border border-stone-200 dark:border-stone-800"
            >
              Continue Shopping
            </Link>
          </div>
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
                <div key={idx} className="flex flex-col text-xs pb-2 border-b border-[#EAE1D2]/40 dark:border-[#2E241E]/40 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/products/${item.productId || item.id}`}
                      className="text-[#82786E] dark:text-[#A39A90] hover:text-[#C49A50] line-clamp-1 pr-3 transition-colors font-medium flex items-center gap-1 group"
                      title="View product"
                    >
                      <span>{item.quantity} × {item.name}</span>
                    </Link>
                    <span className="font-bold text-[#241812] dark:text-[#F7F5F0] shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                  {item.customization?.text && (
                    <span className="text-[10px] text-[#8B5A2B] dark:text-[#E6C477] font-semibold mt-0.5">
                      ✒️ Engraved: "{item.customization.text}" ({[item.customization.font, item.customization.size].filter(Boolean).join(" • ") || 'Royal Calligraphy'})
                    </span>
                  )}
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
