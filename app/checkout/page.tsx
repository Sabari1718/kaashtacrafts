"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useSession, signIn } from "next-auth/react";
import { CheckCircle2, ShoppingBag, MapPin, Truck, Loader2, Tag, X } from "lucide-react";

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
            } else {
              setFormData(prev => ({
                ...prev,
                phone: prev.phone || data.phone || "",
                address: prev.address || data.address || "",
                city: prev.city || data.city || "",
                pincode: prev.pincode || data.pincode || ""
              }));
            }
          }
        } catch (error) {
          console.error("Failed to load profile details for checkout:", error);
        }
      };
      
      fetchProfileDetails();
    }
  }, [session]);

  useEffect(() => {
    if (buyNowId) {
      // Fetch specific product for Buy Now
      fetch(`/api/products/${buyNowId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setCheckoutItems([{
              id: data._id || data.id,
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
    // If they manually edit something, switch to 'new' mode
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
    if (checkoutItems.length === 0) {
      alert("No items to checkout!");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items: checkoutItems.map(item => ({
          productId: item.id,
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        if (buyNowId) {
          // Remove only this specific item from the cart since they bought it
          removeFromCart(buyNowId);
        } else if (selectedIds.length > 0) {
          // Remove all selected items from the cart
          selectedIds.forEach(id => removeFromCart(id));
        } else {
          clearCart(); // Clear entire cart if this was a global cart checkout
        }
        // Save phone to localStorage so they can auto-track their orders
        localStorage.setItem("userPhone", formData.phone);
        // Give them a moment to see success, then redirect to home
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
      <div className="flex w-full min-h-[80vh] items-center justify-center bg-stone-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-stone-200 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold font-playfair text-stone-900 mb-4">Order Placed!</h2>
          <p className="text-stone-600 mb-8">
            Thank you for shopping with Kaashta Crafts. We have received your order and will contact you shortly.
          </p>
          <div className="text-sm text-stone-400">Redirecting to homepage...</div>
        </div>
      </div>
    );
  }

  if (isLoadingProduct) {
    return (
      <div className="flex w-full min-h-[80vh] items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex w-full min-h-[80vh] items-center justify-center bg-stone-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-stone-200 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-amber-700" />
          </div>
          <h2 className="text-3xl font-bold font-playfair text-stone-900 mb-4">Login Required</h2>
          <p className="text-stone-600 mb-8">
            Please log in or create an account to proceed with your checkout.
          </p>
          <button 
            onClick={() => signIn("google")}
            className="w-full py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
      <h1 className="text-3xl md:text-4xl font-semibold text-stone-900 mb-2 tracking-tight">
        Secure Checkout {buyNowId && <span className="text-sm font-normal text-amber-700 bg-amber-100 px-3 py-1 rounded-full ml-2">Buy Now</span>}
      </h1>
      <p className="text-stone-500 mb-10">
        Enter your shipping details to complete your order.
      </p>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form Section */}
        <div className="flex-grow">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-100">
              <MapPin className="w-6 h-6 text-amber-700" />
              <h2 className="text-xl font-bold text-stone-900">Shipping Details</h2>
            </div>

            {savedAddresses.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">Select Saved Address</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((addr, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSelectSavedAddress(idx)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedAddressIndex === idx ? 'border-amber-500 bg-amber-50/50' : 'border-stone-200 hover:border-stone-300'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded uppercase tracking-wider">{addr.label}</span>
                      </div>
                      <p className="font-bold text-sm mt-2">{addr.name} - {addr.phone}</p>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">{addr.street}, {addr.city} - {addr.pincode}</p>
                    </div>
                  ))}
                  <div 
                    onClick={() => {
                      setSelectedAddressIndex('new');
                      setFormData(prev => ({...prev, customerName: session?.user?.name || "", phone: "", address: "", city: "", pincode: ""}));
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center transition-colors ${selectedAddressIndex === 'new' ? 'border-amber-500 bg-amber-50/50' : 'border-dashed border-stone-300 hover:border-stone-400'}`}
                  >
                    <span className="font-bold text-sm text-stone-700">+ Add New Address</span>
                  </div>
                </div>
              </div>
            )}

            <div className={`transition-all duration-300 ${savedAddresses.length > 0 && selectedAddressIndex !== 'new' ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}>
              {savedAddresses.length > 0 && selectedAddressIndex !== 'new' && (
                <div className="text-sm font-bold text-amber-700 mb-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  Using selected saved address. Edit below to create a new address.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">Email (Optional)</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">Delivery Address</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none transition-all resize-none"
                placeholder="123 Main St, Apartment 4B"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">City</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none transition-all"
                  placeholder="Chennai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">PIN Code</label>
                <input 
                  type="text" 
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none transition-all"
                  placeholder="600001"
                />
              </div>
            </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || checkoutItems.length === 0}
              className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white py-4 rounded-xl font-bold tracking-wide transition-all shadow-md flex justify-center items-center gap-2 mt-6"
            >
              {isSubmitting ? "Processing..." : "Place Order (Cash on Delivery)"}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 sticky top-28">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-6 h-6 text-stone-800" />
              <h2 className="text-xl font-bold font-playfair text-stone-900">Your Order</h2>
            </div>
            
            <div className="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-stone-600 line-clamp-1 pr-4">{item.quantity} x {item.name}</span>
                  <span className="font-medium text-stone-900 shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-medium text-stone-900">₹{checkoutTotal}</span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-stone-500 flex items-center gap-1">
                    Discount ({appliedPromo.code})
                  </span>
                  <span className="font-medium text-green-600">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-stone-500">Shipping</span>
                <span className="font-medium text-emerald-600">Free Delivery</span>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="mb-6">
              {!appliedPromo ? (
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Enter Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none uppercase text-sm"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-stone-900 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-stone-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Tag className="w-4 h-4" />
                    <span className="font-bold text-sm">{appliedPromo.code} Applied</span>
                  </div>
                  <button onClick={() => { setAppliedPromo(null); setPromoCode(""); }} className="text-green-700 hover:text-green-900">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-stone-200 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-stone-900">Total</span>
                <span className="text-2xl font-bold text-amber-800">₹{finalTotal}</span>
              </div>
            </div>

            <div className="mt-8 bg-stone-50 rounded-xl p-4 flex gap-3 text-sm text-stone-600 border border-stone-100">
              <Truck className="w-5 h-5 text-stone-400 shrink-0" />
              <p>Pay with cash upon delivery. We will call you to confirm the order before shipping.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-stone-50 pt-8 pb-24 font-sans">
      <Suspense fallback={
        <div className="flex w-full min-h-[80vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
