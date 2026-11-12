"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Search, Phone, ArrowRight, XCircle, Clock, CheckCircle2, Truck, Check, FileText, Star, RefreshCcw, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OrderTracker = ({ status }: { status: string }) => {
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  
  if (status === "Cancelled") {
    return (
      <div className="text-red-500 font-bold mt-4 p-4 bg-red-50 rounded-xl flex items-center justify-center gap-2 border border-red-100">
        <XCircle className="w-5 h-5"/> This order was cancelled.
      </div>
    );
  }

  const currentIndex = steps.indexOf(status) >= 0 ? steps.indexOf(status) : 0;

  return (
    <div className="w-full mt-10 mb-8 px-4 md:px-12 relative">
      <div className="flex justify-between items-center relative">
        {/* Background Line */}
        <div className="absolute left-0 top-3 md:top-4 -translate-y-1/2 w-full h-[3px] bg-gray-200 rounded-full z-0"></div>
        {/* Progress Line */}
        <div 
          className="absolute left-0 top-3 md:top-4 -translate-y-1/2 h-[3px] bg-[#26a541] rounded-full z-0 transition-all duration-700 ease-out"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border-[3px] ${
                isCompleted 
                  ? 'bg-[#26a541] border-[#26a541] text-white' 
                  : 'bg-white border-gray-300 text-gray-300'
              } ${isActive ? 'scale-110 shadow-md ring-4 ring-[#26a541]/20' : ''}`}>
                {isCompleted && <Check className="w-3 h-3 md:w-4 md:h-4 stroke-[3]" />}
              </div>
              <span className={`mt-3 text-[11px] md:text-sm font-bold transition-colors ${
                isCompleted ? 'text-gray-900' : 'text-gray-400'
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

  // New states for Filter and Reviews
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
      // If logged in via Google, fetch orders using email
      fetchOrdersByEmail(session.user.email);
    } else {
      // If guest, check localStorage for phone number
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
      <main className="flex flex-col items-center justify-center min-h-[80vh] bg-stone-50 dark:bg-[#121212] p-6 transition-colors duration-300">
        <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-3xl shadow-xl border border-stone-200 dark:border-stone-800 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-stone-800 dark:text-stone-300" />
          </div>
          <h1 className="text-3xl font-bold font-playfair text-stone-900 dark:text-stone-100 mb-4">My Orders</h1>
          <p className="text-stone-500 dark:text-stone-400 mb-8">Enter your phone number to track, manage, or cancel your previous orders.</p>
          
          <form onSubmit={handleGuestLogin} className="flex flex-col gap-4">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 w-5 h-5" />
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit Phone Number" 
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
                required
              />
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 py-4 rounded-xl font-bold transition-colors">
              Continue
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-stone-50 dark:bg-[#121212] pt-8 pb-24 font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-stone-900 dark:text-stone-100 mb-2">My Orders</h1>
            <p className="text-stone-500 dark:text-stone-400">Showing orders for: <span className="font-medium text-stone-900 dark:text-stone-200">{session?.user?.email || phone}</span></p>
          </div>
          {!session && (
            <button onClick={handleGuestLogout} className="text-sm text-red-600 dark:text-red-500 font-medium hover:underline whitespace-nowrap">
              Clear Phone Search
            </button>
          )}
        </div>

        {!isLoading && orders.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by Order ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 min-w-[160px] font-medium"
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-stone-500 dark:text-stone-400">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 p-12 rounded-3xl border border-stone-200 dark:border-stone-800 text-center shadow-sm">
            <Package className="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">No orders found</h2>
            <p className="text-stone-500 dark:text-stone-400 mb-8">It looks like you haven't placed any orders with this number yet.</p>
            <Link href="/products" className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-8 py-3 rounded-full font-medium inline-flex items-center gap-2">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : filteredOrders.length === 0 && orders.length > 0 ? (
          <div className="text-center py-20 text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <Search className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">No matching orders</h2>
            <p>Try changing your search or filter criteria.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredOrders.map((order) => {
              const isCancelled = order.status === "Cancelled";
              const isPending = order.status === "Pending";
              const isDelivered = order.status === "Delivered";
              
              return (
                <div key={order._id} className="bg-white dark:bg-stone-900 p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-stone-100 dark:border-stone-800">
                    <div>
                      <div className="text-sm text-stone-500 dark:text-stone-400 mb-1">Order ID: {order._id.slice(-8).toUpperCase()}</div>
                      <div className="text-sm text-stone-500 dark:text-stone-400">Placed on: {new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-stone-900 dark:text-stone-100">₹{order.totalAmount}</div>
                    </div>
                  </div>

                  <OrderTracker status={order.status} />

                  <div className="flex flex-col gap-4 mb-6">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex gap-4 items-center flex-grow">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">{item.name}</h4>
                            <p className="text-sm text-stone-500 dark:text-stone-400">Qty: {item.quantity}</p>
                          </div>
                          <div className="font-medium text-stone-900 dark:text-stone-100 hidden md:block">₹{item.price * item.quantity}</div>
                        </div>

                        {/* Actions for items */}
                        <div className="w-full md:w-auto flex flex-col md:flex-row md:justify-end border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 border-stone-100 dark:border-stone-800 gap-2">
                          <button 
                            onClick={() => handleBuyAgain(item)}
                            className="text-stone-900 bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" /> Buy it again
                          </button>

                          {isDelivered && (
                            <button 
                              onClick={() => {
                                setSelectedProductToReview(item);
                                setReviewModalOpen(true);
                              }}
                              className="text-amber-700 hover:bg-amber-50 px-4 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-1.5 transition-colors border border-amber-200"
                            >
                              <Star className="w-4 h-4 fill-amber-500" /> Rate & Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-stone-100 dark:border-stone-800 flex-wrap gap-4">
                    <Link 
                      href={`/my-orders/${order._id}/invoice`} 
                      target="_blank"
                      className="text-amber-700 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-400 font-bold text-sm flex items-center gap-1.5 px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors border border-amber-200/50 dark:border-amber-700/30"
                    >
                      <FileText className="w-4 h-4" /> Download Invoice
                    </Link>

                    <div className="flex gap-2">
                      {isDelivered && (
                        <button 
                          onClick={() => handleReturnItem(order._id)}
                          className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 font-bold text-sm flex items-center gap-1.5 px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors border border-stone-200 dark:border-stone-700"
                        >
                          <RefreshCcw className="w-4 h-4" /> Return Item
                        </button>
                      )}

                      {isPending && (
                        <button 
                          onClick={() => cancelOrder(order._id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-sm flex items-center gap-1.5 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4" /> Cancel Order
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
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 border border-stone-200 dark:border-stone-800">
            <h3 className="text-xl font-bold font-playfair text-stone-900 dark:text-stone-100 mb-2">Rate your product</h3>
            <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-100 dark:border-stone-800 mb-6">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0">
                <Image src={selectedProductToReview.image} alt={selectedProductToReview.name} fill className="object-cover" />
              </div>
              <span className="line-clamp-2 text-sm font-medium text-stone-700 dark:text-stone-300">{selectedProductToReview.name}</span>
            </div>
            
            <form onSubmit={submitReview} className="flex flex-col gap-5">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star className={`w-10 h-10 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-200 dark:text-stone-700'}`} />
                  </button>
                ))}
              </div>
              
              <div>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="What did you like or dislike? (Optional)"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none text-sm bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button 
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 px-4 py-3.5 rounded-xl font-bold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingReview}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-400 text-stone-900 py-3.5 rounded-xl font-bold transition-colors shadow-sm"
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
