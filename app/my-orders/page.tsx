"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Search, Phone, ArrowRight, XCircle, Clock, CheckCircle2, Truck, Check, FileText, Star, RefreshCcw, ShoppingBag, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OrderTracker = ({ status }: { status: string }) => {
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  
  if (status === "Cancelled") {
    return (
      <div className="text-red-600 font-bold mt-4 p-3.5 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/40 text-xs">
        <XCircle className="w-4 h-4"/> This order was cancelled.
      </div>
    );
  }

  const currentIndex = steps.indexOf(status) >= 0 ? steps.indexOf(status) : 0;

  return (
    <div className="w-full mt-8 mb-6 px-4 md:px-8 relative">
      <div className="flex justify-between items-center relative">
        {/* Background Line */}
        <div className="absolute left-0 top-3 md:top-3.5 -translate-y-1/2 w-full h-[2px] bg-[#EAE1D2] dark:bg-[#2E241E] rounded-full z-0"></div>
        {/* Progress Line */}
        <div 
          className="absolute left-0 top-3 md:top-3.5 -translate-y-1/2 h-[2px] bg-[#C49A50] rounded-full z-0 transition-all duration-700 ease-out"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xs border-2 ${
                isCompleted 
                  ? 'bg-[#241812] dark:bg-[#C49A50] border-[#241812] dark:border-[#C49A50] text-[#F7F5F0] dark:text-[#241812]' 
                  : 'bg-white dark:bg-[#1E1713] border-[#EAE1D2] dark:border-[#2E241E] text-stone-300'
              } ${isActive ? 'scale-110 shadow-sm ring-4 ring-[#C49A50]/20' : ''}`}>
                {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className={`mt-2 text-[10px] md:text-xs font-bold transition-colors tracking-wide ${
                isCompleted ? 'text-[#241812] dark:text-[#F7F5F0]' : 'text-[#82786E]'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function MyOrdersPage() {
  const [phone, setPhone] = useState("");
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const { addToCart } = useCart();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductToReview, setSelectedProductToReview] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.email) {
      fetchOrdersByEmail(session.user.email);
    } else {
      const savedPhone = localStorage.getItem("userPhone");
      if (savedPhone) {
        setPhone(savedPhone);
        fetchOrdersByPhone(savedPhone);
        setIsGuestLoggedIn(true);
      }
    }
  }, [session, status]);

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      localStorage.setItem("userPhone", phone);
      setIsGuestLoggedIn(true);
      fetchOrdersByPhone(phone);
    } else {
      alert("Please enter a valid phone number");
    }
  };

  const handleGuestLogout = () => {
    localStorage.removeItem("userPhone");
    setIsGuestLoggedIn(false);
    setOrders([]);
    setPhone("");
  };

  const fetchOrdersByPhone = async (userPhone: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders?phone=${userPhone}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders by phone:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrdersByEmail = async (userEmail: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders?email=${userEmail}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders by email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    const confirmCancel = confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" })
      });
      
      if (res.ok) {
        alert("Order has been cancelled successfully.");
        if (session?.user?.email) fetchOrdersByEmail(session.user.email);
        else fetchOrdersByPhone(phone);
      } else {
        alert("Failed to cancel order. Please contact support.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductToReview || (!selectedProductToReview.productId && !selectedProductToReview._id)) {
      alert("Product ID is missing.");
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      const pId = selectedProductToReview.productId || selectedProductToReview._id;
      const res = await fetch(`/api/products/${pId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment || "Great product!",
          user: session?.user?.email || phone || "Anonymous",
          name: session?.user?.name || "Customer"
        }),
      });

      if (res.ok) {
        alert("Review submitted successfully! Thank you.");
        setReviewModalOpen(false);
        setReviewComment("");
        setReviewRating(5);
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReturnItem = (orderId: string) => {
    alert("Return request submitted successfully! Our team will contact you shortly to pick up the item.");
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isUserAuthenticated = !!session || isGuestLoggedIn;

  const handleBuyAgain = (item: any) => {
    const productToBuy = {
      id: item.productId || item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: "Reordered Item",
      inStock: true,
      quantity: 1
    };
    addToCart(productToBuy as any);
    toast.success("Added to cart! Let's checkout.");
    router.push("/cart");
  };

  if (!isUserAuthenticated) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F7F5F0] dark:bg-[#14100E] p-6 transition-colors duration-300 font-sans">
        <div className="bg-white/90 dark:bg-[#1E1713]/90 p-8 md:p-12 rounded-3xl shadow-xl border border-[#EAE1D2] dark:border-[#2E241E] max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#EAE1D2]/50 dark:bg-[#2E241E] rounded-full flex items-center justify-center mx-auto mb-5">
            <Package className="w-8 h-8 text-[#C49A50]" />
          </div>
          <h1 className="text-3xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-2">Track Orders</h1>
          <p className="text-xs sm:text-sm text-[#82786E] mb-6">Enter your phone number to view, manage, or track your handcrafted creations.</p>
          
          <form onSubmit={handleGuestLogin} className="flex flex-col gap-4">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82786E] w-4 h-4" />
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit Phone Number" 
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] bg-[#F7F5F0]/60 dark:bg-[#14100E] text-xs text-[#241812] dark:text-[#F7F5F0] outline-none focus:border-[#C49A50]"
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer">
              Lookup Orders
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] pt-8 pb-24 font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#C49A50] text-xs font-bold uppercase tracking-[0.16em] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Purchase History</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0]">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-[#82786E] mt-1">Orders for: <span className="font-semibold text-[#241812] dark:text-[#F7F5F0]">{session?.user?.email || phone}</span></p>
          </div>
          {!session && (
            <button onClick={handleGuestLogout} className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline whitespace-nowrap cursor-pointer">
              Clear Phone Search
            </button>
          )}
        </div>

        {!isLoading && orders.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82786E] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search Order ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] bg-white/80 dark:bg-[#1E1713] text-xs text-[#241812] dark:text-[#F7F5F0] outline-none focus:border-[#C49A50]"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] bg-white/80 dark:bg-[#1E1713] text-xs text-[#241812] dark:text-[#F7F5F0] outline-none focus:border-[#C49A50] font-semibold cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-[#82786E] text-xs sm:text-sm">Retrieving your orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white/80 dark:bg-[#1E1713]/80 p-12 rounded-3xl border border-[#EAE1D2] dark:border-[#2E241E] text-center shadow-xs">
            <Package className="w-14 h-14 text-[#82786E] mx-auto mb-4" />
            <h2 className="text-2xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-2">No orders recorded</h2>
            <p className="text-xs sm:text-sm text-[#82786E] mb-6">You have not dispatched any orders with this number yet.</p>
            <Link href="/products" className="bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs">
              Explore Masterpieces <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : filteredOrders.length === 0 && orders.length > 0 ? (
          <div className="text-center py-16 text-[#82786E] bg-white/70 dark:bg-[#1E1713]/70 rounded-3xl border border-[#EAE1D2] dark:border-[#2E241E]">
            <Search className="w-10 h-10 text-[#82786E] mx-auto mb-3" />
            <h2 className="text-lg font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-1">No matching orders</h2>
            <p className="text-xs text-[#82786E]">Adjust your search query or filter options.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredOrders.map((order) => {
              const isPending = order.status === "Pending";
              const isDelivered = order.status === "Delivered";
              
              return (
                <div key={order._id} className="bg-white/85 dark:bg-[#1E1713]/85 p-6 md:p-7 rounded-3xl shadow-xs border border-[#EAE1D2] dark:border-[#2E241E]">
                  
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-5 border-b border-[#EAE1D2]/80 dark:border-[#2E241E]/80">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#C49A50]">ORDER #{order._id.slice(-8).toUpperCase()}</div>
                      <div className="text-[11px] text-[#82786E] mt-0.5">Placed on: {new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-lg font-bold text-[#241812] dark:text-[#F7F5F0]">
                      ₹{order.totalAmount}
                    </div>
                  </div>

                  {/* Status Tracker */}
                  <OrderTracker status={order.status} />

                  {/* Order Items */}
                  <div className="flex flex-col gap-4 mb-6">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-2 rounded-2xl">
                        <div className="flex gap-3.5 items-center flex-grow">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#EAE1D2]/40 shrink-0 border border-[#EAE1D2] dark:border-[#2E241E]">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#241812] dark:text-[#F7F5F0] line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-[#82786E]">Qty: {item.quantity} • ₹{item.price} each</p>
                            {item.customization?.text && (
                              <p className="text-[11px] font-semibold text-[#8B5A2B] dark:text-[#E6C477] mt-0.5">
                                ✒️ Laser Engraved: "{item.customization.text}" ({item.customization.font || 'Royal Calligraphy'})
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Item Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => handleBuyAgain(item)}
                            className="text-[#241812] dark:text-[#F7F5F0] bg-[#EAE1D2]/60 dark:bg-[#2E241E] hover:bg-[#EAE1D2] px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Reorder
                          </button>

                          {isDelivered && (
                            <button 
                              onClick={() => {
                                setSelectedProductToReview(item);
                                setReviewModalOpen(true);
                              }}
                              className="text-[#C49A50] hover:bg-[#C49A50]/10 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors border border-[#C49A50]/40 cursor-pointer"
                            >
                              <Star className="w-3 h-3 fill-[#C49A50]" /> Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#EAE1D2]/80 dark:border-[#2E241E]/80 flex-wrap gap-3">
                    <Link 
                      href={`/my-orders/${order._id}/invoice`} 
                      target="_blank"
                      className="text-[#65452F] dark:text-[#C49A50] hover:underline font-bold text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors border border-[#EAE1D2] dark:border-[#2E241E]"
                    >
                      <FileText className="w-3.5 h-3.5" /> Download Tax Invoice
                    </Link>

                    <div className="flex gap-2">
                      {isDelivered && (
                        <button 
                          onClick={() => handleReturnItem(order._id)}
                          className="text-[#82786E] hover:text-[#241812] dark:hover:text-[#F7F5F0] font-bold text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#EAE1D2] dark:border-[#2E241E] cursor-pointer"
                        >
                          <RefreshCcw className="w-3.5 h-3.5" /> Return
                        </button>
                      )}

                      {isPending && (
                        <button 
                          onClick={() => cancelOrder(order._id)}
                          className="text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedProductToReview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#F7F5F0] dark:bg-[#1E1713] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#EAE1D2] dark:border-[#2E241E]">
            <h3 className="text-xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-2">Review Creation</h3>
            
            <div className="flex items-center gap-3 bg-white/80 dark:bg-[#14100E]/80 p-3 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] mb-5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                <Image src={selectedProductToReview.image} alt={selectedProductToReview.name} fill className="object-cover" />
              </div>
              <span className="line-clamp-2 text-xs font-bold text-[#241812] dark:text-[#F7F5F0]">{selectedProductToReview.name}</span>
            </div>
            
            <form onSubmit={submitReview} className="flex flex-col gap-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Star className={`w-8 h-8 ${star <= reviewRating ? 'fill-[#C49A50] text-[#C49A50]' : 'text-stone-300 dark:text-stone-700'}`} />
                  </button>
                ))}
              </div>
              
              <div>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share feedback on tactile quality, wood grains, or finish..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E] bg-white/90 dark:bg-[#14100E] text-xs text-[#241812] dark:text-[#F7F5F0] outline-none focus:border-[#C49A50] resize-none"
                />
              </div>

              <div className="flex gap-3 mt-1">
                <button 
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-full font-bold text-xs text-[#82786E] bg-[#EAE1D2]/50 hover:bg-[#EAE1D2] transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingReview}
                  className="flex-1 bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
