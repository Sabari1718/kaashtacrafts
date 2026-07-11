"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Package, PlusCircle, LayoutDashboard, Settings, LogOut, UploadCloud, TrendingUp, ShoppingBag, Clock, ShieldAlert, MessageSquare, Trash2, Star, Lock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
export default function AdminPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("Desk Accessories");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Promo Code Form State
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("");
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);

  useEffect(() => {
    setIsCheckingAuth(false);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoginError(data.error || "Invalid credentials");
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
  };

  const fetchDashboardData = async () => {
    setIsLoadingOrders(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products")
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      
      if (Array.isArray(ordersData)) setOrders(ordersData);
      if (Array.isArray(productsData)) setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const res = await fetch("/api/admin/promos");
      const data = await res.json();
      if (Array.isArray(data)) setPromos(data);
    } catch (error) {
      console.error("Failed to fetch promos", error);
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingPromo(true);
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newPromoCode, discountPercentage: newPromoDiscount })
      });
      if (res.ok) {
        setNewPromoCode("");
        setNewPromoDiscount("");
        fetchPromoCodes();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      alert("Error creating promo");
    } finally {
      setIsCreatingPromo(false);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    try {
      await fetch(`/api/admin/promos?id=${id}`, { method: "DELETE" });
      fetchPromoCodes();
    } catch (error) {
      alert("Error deleting promo");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating order status");
    }
  };

  const handleDeleteReview = async (productId: string, reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/products/${productId}?reviewId=${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.map(p => {
          if (p._id === productId) {
            return { ...p, reviews: p.reviews.filter((r: any) => r._id !== reviewId) };
          }
          return p;
        }));
      } else {
        alert("Failed to delete review");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting review");
    }
  };



  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImage) {
      alert("Please select an image first!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("price", productPrice);
      formData.append("category", productCategory);
      formData.append("image", productImage);
      
      galleryImages.forEach(file => {
        formData.append("galleryImages", file);
      });

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Success! Product "${productName}" is now live on the website.`);
        setProductName("");
        setProductPrice("");
        setProductImage(null);
        setGalleryImages([]);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Something went wrong while uploading!");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <main className="flex w-full min-h-[80vh] items-center justify-center bg-stone-50">
        <div className="text-stone-500 font-medium">Checking Credentials...</div>
      </main>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <main className="flex w-full min-h-screen items-center justify-center bg-stone-50 p-6">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-stone-200">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-stone-900 text-amber-500 rounded-full flex items-center justify-center shadow-inner">
              <Lock className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-playfair text-stone-900 mb-2 text-center">Admin Portal</h1>
          <p className="text-stone-500 mb-8 text-sm text-center">
            Enter your owner credentials to access the dashboard.
          </p>
          
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-5" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Username</label>
              <input 
                type="text" 
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Admin username"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50"
                required
                autoComplete="new-password" // Using new-password trick to stop Chrome autofill
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
              <input 
                type="password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50"
                required
                autoComplete="new-password"
              />
            </div>

            {loginError && (
              <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">
                {loginError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white py-3.5 rounded-xl font-bold transition-colors mt-2"
            >
              {isLoggingIn ? "Verifying..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col md:flex-row w-full min-h-screen bg-stone-50 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-950 text-stone-300 flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-12 text-white font-bold text-xl">
          <Settings className="w-6 h-6 text-amber-500" />
          Admin Panel
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "dashboard" ? "bg-stone-800 text-white" : "hover:bg-stone-900 hover:text-white"}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("add-product")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "add-product" ? "bg-stone-800 text-white" : "hover:bg-stone-900 hover:text-white"}`}
          >
            <PlusCircle className="w-5 h-5" /> Add Product
          </button>
          <button 
            onClick={() => {
              setActiveTab("orders");
              fetchDashboardData();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "orders" ? "bg-stone-800 text-white" : "hover:bg-stone-900 hover:text-white"}`}
          >
            <ShoppingBag className="w-5 h-5" /> Orders
          </button>
          <button 
            onClick={() => {
              setActiveTab("reviews");
              fetchDashboardData();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "reviews" ? "bg-stone-800 text-white" : "hover:bg-stone-900 hover:text-white"}`}
          >
            <MessageSquare className="w-5 h-5" /> Reviews
          </button>
          <button 
            onClick={() => {
              setActiveTab("promos");
              fetchPromoCodes(); // We will define this next
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "promos" ? "bg-stone-800 text-white" : "hover:bg-stone-900 hover:text-white"}`}
          >
            <Settings className="w-5 h-5" /> Promo Codes
          </button>
        </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-auto hover:bg-red-950 hover:text-red-400 rounded-xl transition-colors text-left"
          >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-12 overflow-y-auto max-h-screen">
        
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-8">Analytics Dashboard</h2>
            
            {isLoadingOrders ? (
              <div className="text-stone-500">Loading data...</div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <p className="text-stone-500 font-medium text-sm mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-stone-900">₹{orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)}</h3>
                </div>
                
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-stone-500 font-medium text-sm mb-1">Total Orders</p>
                  <h3 className="text-3xl font-bold text-stone-900">{orders.length}</h3>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <p className="text-stone-500 font-medium text-sm mb-1">Pending Orders</p>
                  <h3 className="text-3xl font-bold text-stone-900">{orders.filter(o => o.status === "Pending").length}</h3>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <Package className="w-6 h-6" />
                  </div>
                  <p className="text-stone-500 font-medium text-sm mb-1">Products Listed</p>
                  <h3 className="text-3xl font-bold text-stone-900">{products.length}</h3>
                </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                    <h3 className="text-lg font-bold text-stone-900 mb-6">Revenue Overview</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={[
                            { name: 'Jan', revenue: 4000 },
                            { name: 'Feb', revenue: 3000 },
                            { name: 'Mar', revenue: 2000 },
                            { name: 'Apr', revenue: 2780 },
                            { name: 'May', revenue: 1890 },
                            { name: 'Jun', revenue: 2390 },
                            { name: 'Jul', revenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) },
                          ]} 
                          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#78716c'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c'}} tickFormatter={(val) => `₹${val}`} />
                          <Tooltip cursor={{stroke: '#e7e5e4', strokeWidth: 2}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Line type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={3} dot={{r: 4, fill: '#d97706'}} activeDot={{r: 6}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                    <h3 className="text-lg font-bold text-stone-900 mb-6">Orders by Status</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            { name: 'Pending', count: orders.filter(o => o.status === "Pending").length },
                            { name: 'Processing', count: orders.filter(o => o.status === "Processing").length },
                            { name: 'Shipped', count: orders.filter(o => o.status === "Shipped").length },
                            { name: 'Delivered', count: orders.filter(o => o.status === "Delivered").length },
                            { name: 'Cancelled', count: orders.filter(o => o.status === "Cancelled").length },
                          ]} 
                          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c'}} allowDecimals={false} />
                          <Tooltip cursor={{fill: '#f5f5f4'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "add-product" && (
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-8">Add New Product</h2>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 max-w-2xl">
              <form onSubmit={handleAddProduct} className="flex flex-col gap-6">
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Product Name</label>
                  <input 
                    type="text" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Premium Wooden Clock"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50"
                    required
                  />
                </div>

                <div className="flex gap-6">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Price (₹)</label>
                    <input 
                      type="number" 
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="999"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50"
                      required
                    />
                  </div>
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Category</label>
                    <select 
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50"
                    >
                      <option>Desk Accessories</option>
                      <option>Home Decor</option>
                      <option>Kitchen</option>
                      <option>Stationery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Main Product Image (Required)</label>
                  <div className="border-2 border-dashed border-stone-300 rounded-2xl p-8 flex flex-col items-center justify-center text-stone-500 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer relative overflow-hidden">
                    {productImage ? (
                      <div className="text-center">
                        <p className="font-bold text-emerald-600 mb-2">Image Selected: {productImage.name}</p>
                        <p className="text-xs text-stone-400">Click below to change</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-10 h-10 mb-3 text-stone-400" />
                        <p className="font-medium text-stone-700 mb-1">Click to upload photo</p>
                        <p className="text-xs">PNG, JPG up to 5MB</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setProductImage(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Gallery Images (Optional, for Product Detail Page)</label>
                  <div className="border-2 border-dashed border-stone-300 rounded-2xl p-8 flex flex-col items-center justify-center text-stone-500 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer relative overflow-hidden">
                    {galleryImages.length > 0 ? (
                      <div className="text-center">
                        <p className="font-bold text-emerald-600 mb-2">{galleryImages.length} images selected</p>
                        <p className="text-xs text-stone-400">Click below to change</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-10 h-10 mb-3 text-stone-400" />
                        <p className="font-medium text-stone-700 mb-1">Click to select multiple photos</p>
                        <p className="text-xs">PNG, JPG up to 5MB each</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setGalleryImages(Array.from(e.target.files));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-amber-800 hover:bg-amber-700 disabled:bg-stone-400 text-white py-4 rounded-xl font-bold tracking-wide transition-colors shadow-md mt-4 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? "Uploading & Saving..." : "Save Product to Website"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-8">Customer Orders</h2>
            
            {isLoadingOrders ? (
              <div className="text-stone-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 text-center text-stone-500">
                No orders yet.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-stone-100">
                      <div>
                        <h3 className="text-xl font-bold text-stone-900">{order.customerName}</h3>
                        <p className="text-stone-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-800">₹{order.totalAmount}</div>
                        <div className="mt-2">
                          <select 
                            value={order.status} 
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="px-3 py-1.5 bg-stone-100 border border-stone-200 text-stone-800 rounded-lg text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm hover:border-stone-300 transition-colors"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-stone-900 mb-2">Delivery Details</h4>
                        <p className="text-stone-600 text-sm mb-1">📞 {order.phone}</p>
                        <p className="text-stone-600 text-sm mb-1">✉️ {order.email}</p>
                        <p className="text-stone-600 text-sm mt-2">{order.address}</p>
                        <p className="text-stone-600 text-sm">{order.city} - {order.pincode}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-900 mb-2">Items Ordered</h4>
                        <ul className="text-sm text-stone-600 flex flex-col gap-2">
                          {order.items.map((item: any, index: number) => (
                            <li key={index} className="flex justify-between border-b border-stone-50 pb-1">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="font-medium text-stone-900">₹{item.price * item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-8">Manage Customer Reviews</h2>
            
            {isLoadingOrders ? (
              <div className="text-stone-500">Loading reviews...</div>
            ) : (
              <div className="flex flex-col gap-6">
                {products.flatMap(p => p.reviews?.map((r: any) => ({ ...r, productId: p._id, productName: p.name })) || []).length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 text-center text-stone-500">
                    No reviews found across any products.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.flatMap(p => p.reviews?.map((r: any) => ({ ...r, productId: p._id, productName: p.name })) || []).map((review: any) => (
                      <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 relative group flex flex-col h-full">
                        <button
                          onClick={() => handleDeleteReview(review.productId, review._id)}
                          className="absolute top-4 right-4 p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3 line-clamp-1 pr-8">
                          {review.productName}
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-stone-100 text-stone-800 rounded-full flex items-center justify-center font-bold">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900 text-sm">{review.name}</h4>
                            <p className="text-xs text-stone-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
                          ))}
                        </div>
                        
                        <p className="text-stone-600 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "promos" && (
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-8">Manage Promo Codes</h2>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 mb-8">
              <h3 className="text-xl font-bold text-stone-900 mb-4">Create New Promo Code</h3>
              <form onSubmit={handleCreatePromo} className="flex gap-4 items-end">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Code (e.g. FESTIVAL20)</label>
                  <input 
                    type="text" 
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50"
                    required
                  />
                </div>
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isCreatingPromo}
                  className="bg-amber-800 hover:bg-amber-700 disabled:bg-stone-400 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-md h-[46px]"
                >
                  {isCreatingPromo ? "Creating..." : "Create Code"}
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.length === 0 ? (
                <div className="col-span-full text-center text-stone-500 py-8">No active promo codes.</div>
              ) : (
                promos.map((promo) => (
                  <div key={promo._id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 relative group flex flex-col justify-between h-full">
                    <button
                      onClick={() => handleDeletePromo(promo._id)}
                      className="absolute top-4 right-4 p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Promo"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div>
                      <div className="text-2xl font-black tracking-widest text-amber-700 mb-1">
                        {promo.code}
                      </div>
                      <div className="text-3xl font-bold text-stone-900 mb-4">
                        {promo.discountPercentage}% OFF
                      </div>
                    </div>
                    <div className="text-xs text-stone-400">
                      Created: {new Date(promo.createdAt).toLocaleDateString()}
                      <br/>
                      Used: {promo.usageCount} times
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
