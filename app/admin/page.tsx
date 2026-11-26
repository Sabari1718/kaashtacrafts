"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Package, PlusCircle, LayoutDashboard, Settings, LogOut, UploadCloud, TrendingUp, ShoppingBag, Clock, ShieldAlert, MessageSquare, Trash2, Star, Lock, Search, Edit2, X, Check, RefreshCw, ExternalLink, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [usageImages, setUsageImages] = useState<File[]>([]);
  const [usagePreviews, setUsagePreviews] = useState<string[]>([]);
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

  // Product Search, Filter, Edit & Delete State
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Dynamic Category Order & Management State
  const [categoriesList, setCategoriesList] = useState<string[]>([
    "Desk Accessories", "Home Decor", "Kitchen", "Stationery"
  ]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [categoryFeedback, setCategoryFeedback] = useState("");

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("Desk Accessories");
  const [editInStock, setEditInStock] = useState(true);
  const [editImage, setEditImage] = useState("");
  const [editUsageImages, setEditUsageImages] = useState<string[]>([]);
  const [isUploadingEditUsage, setIsUploadingEditUsage] = useState(false);
  const [newUsageUrlInput, setNewUsageUrlInput] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    setIsCheckingAuth(false);
    fetch("/api/categories")
      .then(r => r.json())
      .then(data => {
        const catList = Array.isArray(data)
          ? data
          : Array.isArray(data?.categories)
          ? data.categories
          : Array.isArray(data?.raw)
          ? data.raw.map((c: any) => c.name)
          : [];
        if (catList.length > 0) {
          setCategoriesList(catList);
        }
      })
      .catch(console.error);
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
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
        fetch("/api/categories")
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      
      if (Array.isArray(ordersData)) setOrders(ordersData);
      if (Array.isArray(productsData)) setProducts(productsData);
      const catList = Array.isArray(categoriesData)
        ? categoriesData
        : Array.isArray(categoriesData?.categories)
        ? categoriesData.categories
        : Array.isArray(categoriesData?.raw)
        ? categoriesData.raw.map((c: any) => c.name)
        : [];
      if (catList.length > 0) {
        setCategoriesList(catList);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const moveCategory = async (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoriesList.length) return;
    const updated = [...categoriesList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCategoriesList(updated);
    setCategoryFeedback("Saving order...");

    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: updated })
      });
      if (res.ok) {
        setCategoryFeedback("Order saved!");
        setTimeout(() => setCategoryFeedback(""), 2500);
      } else {
        setCategoryFeedback("Failed to save");
      }
    } catch (err) {
      console.error("Failed to reorder categories", err);
      setCategoryFeedback("Error saving");
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (categoriesList.some(c => c.toLowerCase() === trimmed.toLowerCase()) || trimmed.toLowerCase() === "all") {
      alert("Category already exists!");
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategoriesList(prev => [...prev, data.category.name]);
        setNewCategoryInput("");
        setIsAddingCategory(false);
        setCategoryFeedback("Category added!");
        setTimeout(() => setCategoryFeedback(""), 2500);
      } else {
        alert(data.error || "Failed to add category");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding category");
    }
  };

  const moveProduct = async (productId: string, direction: 'up' | 'down') => {
    const index = products.findIndex(p => (p._id || p.id) === productId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;
    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setProducts(updated);

    try {
      await fetch("/api/products/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: updated.map(p => p._id || p.id) })
      });
    } catch (err) {
      console.error("Failed to reorder products", err);
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



  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setEditName(product.name || "");
    setEditPrice((product.price || "").toString());
    setEditCategory(product.category || "Desk Accessories");
    setEditInStock(product.inStock !== false);
    setEditImage(product.image || "");
    setEditUsageImages(product.usageImages || []);
    setNewUsageUrlInput("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSavingEdit(true);
    const prodId = editingProduct._id || editingProduct.id;

    try {
      const res = await fetch(`/api/products/${prodId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          price: Number(editPrice),
          category: editCategory,
          inStock: editInStock,
          image: editImage,
          usageImages: editUsageImages,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            (p._id || p.id) === prodId
              ? {
                  ...p,
                  name: editName,
                  price: Number(editPrice),
                  category: editCategory,
                  inStock: editInStock,
                  image: editImage,
                  usageImages: editUsageImages,
                }
              : p
          )
        );
        alert(`Product "${editName}" updated successfully!`);
        setEditingProduct(null);
      } else if (res.status === 404) {
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== prodId));
        alert("This product was already removed from the store.");
        setEditingProduct(null);
      } else {
        alert(data.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error saving product changes");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action will remove it from the website.`)) {
      return;
    }
    setDeletingProductId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok || res.status === 404) {
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
        alert(`Product "${productName}" was deleted successfully.`);
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    } finally {
      setDeletingProductId(null);
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

      usageImages.forEach(file => {
        formData.append("usageImages", file);
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
        setUsageImages([]);
        setUsagePreviews([]);
        fetchDashboardData();
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
          <button 
            onClick={() => {
              setActiveTab("products");
              fetchDashboardData();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "products" ? "bg-stone-800 text-white" : "hover:bg-stone-900 hover:text-white"}`}
          >
            <Package className="w-5 h-5" /> Products
            {products.length > 0 && (
              <span className="ml-auto bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                {products.length}
              </span>
            )}
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

        {activeTab === "products" && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-stone-900">Manage Products</h2>
                <p className="text-stone-500 text-sm mt-1">
                  View your live products, edit details/price, or delete items you no longer want.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchDashboardData()}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors border border-stone-200 cursor-pointer shadow-xs"
                  title="Reload all products from store"
                >
                  <RefreshCw className="w-4 h-4 text-stone-500" /> Refresh List
                </button>
                <button
                  onClick={() => setActiveTab("add-product")}
                  className="bg-amber-800 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add New Product
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products by name or category..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-700/50"
                  />
                </div>

                {categoryFeedback && (
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full animate-pulse">
                    ✓ {categoryFeedback}
                  </span>
                )}
              </div>

              {/* Category Pills with Reorder Controls */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Category Display Order (Order on website updates instantly):
                  </span>
                  {!isAddingCategory ? (
                    <button
                      onClick={() => setIsAddingCategory(true)}
                      className="text-xs font-bold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Category
                    </button>
                  ) : (
                    <form onSubmit={handleAddCategorySubmit} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="New category..."
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-700"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-xs bg-amber-800 text-white font-bold rounded-lg hover:bg-amber-700 cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsAddingCategory(false); setNewCategoryInput(""); }}
                        className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Fixed "All" Pill */}
                  <button
                    onClick={() => setProductCategoryFilter("All")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      productCategoryFilter === "All"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    All Products
                  </button>

                  {/* Reorderable Category Pills */}
                  {categoriesList.map((cat, idx) => {
                    const isSelected = productCategoryFilter === cat;
                    return (
                      <div
                        key={cat}
                        className={`inline-flex items-center rounded-xl text-xs font-bold transition-all shadow-xs border ${
                          isSelected
                            ? "bg-amber-800 text-white border-amber-900 ring-2 ring-amber-800/20"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {/* Move Left Button */}
                        <button
                          type="button"
                          onClick={() => moveCategory(idx, "left")}
                          disabled={idx === 0}
                          title={idx === 0 ? "First category after All" : "Move left"}
                          className={`p-1.5 rounded-l-xl transition-colors cursor-pointer ${
                            idx === 0
                              ? "opacity-30 cursor-not-allowed"
                              : isSelected
                              ? "hover:bg-amber-900 text-amber-200"
                              : "hover:bg-stone-200 text-stone-500"
                          }`}
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        {/* Category Name (Filter Trigger) */}
                        <button
                          type="button"
                          onClick={() => setProductCategoryFilter(cat)}
                          className="px-2.5 py-1.5 cursor-pointer select-none"
                          title={`Click to filter by ${cat}`}
                        >
                          {cat}
                        </button>

                        {/* Move Right Button */}
                        <button
                          type="button"
                          onClick={() => moveCategory(idx, "right")}
                          disabled={idx === categoriesList.length - 1}
                          title={idx === categoriesList.length - 1 ? "Last category" : "Move right"}
                          className={`p-1.5 rounded-r-xl transition-colors cursor-pointer ${
                            idx === categoriesList.length - 1
                              ? "opacity-30 cursor-not-allowed"
                              : isSelected
                              ? "hover:bg-amber-900 text-amber-200"
                              : "hover:bg-stone-200 text-stone-500"
                          }`}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {isLoadingOrders ? (
              <div className="text-stone-500 text-center py-12">Loading products...</div>
            ) : (() => {
              const filteredProducts = products.filter((p) => {
                const matchesQuery = !productSearchQuery || p.name?.toLowerCase().includes(productSearchQuery.toLowerCase()) || p.category?.toLowerCase().includes(productSearchQuery.toLowerCase());
                const matchesCategory = productCategoryFilter === "All" || p.category === productCategoryFilter;
                return matchesQuery && matchesCategory;
              });

              if (filteredProducts.length === 0) {
                return (
                  <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-200 text-center">
                    <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-stone-800 mb-1">No products found</h3>
                    <p className="text-stone-500 text-sm mb-6">
                      {productSearchQuery || productCategoryFilter !== "All"
                        ? "Try adjusting your search or category filters."
                        : "You haven't added any products to the store yet."}
                    </p>
                    <button
                      onClick={() => setActiveTab("add-product")}
                      className="bg-amber-800 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Your First Product
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => {
                    const productId = product._id || product.id;
                    const isDeleting = deletingProductId === productId;
                    return (
                      <div
                        key={productId}
                        className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
                      >
                        <div>
                          {/* Product Image */}
                          <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={400}
                                height={300}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <Package className="w-10 h-10" />
                              </div>
                            )}
                            <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                              {product.category || "General"}
                            </span>
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-stone-900/85 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[11px] font-bold shadow-xs">
                              <span className="text-amber-300">#{products.findIndex(p => (p._id || p.id) === productId) + 1}</span>
                              <button
                                type="button"
                                onClick={() => moveProduct(productId, "up")}
                                title="Move product earlier in catalog"
                                className="hover:text-amber-300 p-0.5 transition-colors cursor-pointer"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveProduct(productId, "down")}
                                title="Move product later in catalog"
                                className="hover:text-amber-300 p-0.5 transition-colors cursor-pointer"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="p-5">
                            <h3 className="font-bold text-stone-900 text-base mb-1 line-clamp-1" title={product.name}>
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xl font-extrabold text-amber-800">
                                ₹{product.price}
                              </span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.inStock !== false ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                                {product.inStock !== false ? "In Stock" : "Out of Stock"}
                              </span>
                            </div>
                            {product.reviews && product.reviews.length > 0 && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-stone-500">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span>{product.rating ? product.rating.toFixed(1) : "0"} ({product.numReviews || product.reviews.length} reviews)</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-stone-100">
                              <span className="text-[11px] font-semibold text-stone-500">
                                {product.usageImages && product.usageImages.length > 0
                                  ? `📷 ${product.usageImages.length} Styling Photos`
                                  : "No styling photos"}
                              </span>
                              <a
                                href={`/products/${productId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-bold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1 hover:underline"
                                title="View live page"
                              >
                                View Page <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Edit and Delete */}
                        <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs tracking-wide transition-colors border border-stone-200 cursor-pointer"
                            title="Edit this product"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-stone-600" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(productId, product.name)}
                            disabled={isDeleting}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold text-xs tracking-wide transition-colors border border-red-200/60 disabled:opacity-50 cursor-pointer"
                            title="Delete this product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-stone-200 relative my-8">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-100">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">Edit Product</h3>
                      <p className="text-xs text-stone-500 mt-0.5">Modify product details and save to store.</p>
                    </div>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit} className="flex flex-col gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50 text-sm font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50 text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                          Category
                        </label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50 text-sm font-medium"
                        >
                          <option>Desk Accessories</option>
                          <option>Home Decor</option>
                          <option>Kitchen</option>
                          <option>Stationery</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        placeholder="https://res.cloudinary.com/..."
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 bg-stone-50 text-sm"
                      />
                      {editImage && (
                        <div className="mt-3 h-28 w-28 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                          <Image
                            src={editImage}
                            alt="Preview"
                            width={112}
                            height={112}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>

                    {/* How to Style & Use Photos in Edit Modal */}
                    <div className="pt-3 border-t border-stone-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                          How to Style & Use Photos (Up to 10 Photos)
                        </label>
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {editUsageImages.length} / 10 photos
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mb-3">
                        Photos showing how customers can use and style this piece. Shown below product details on customer page.
                      </p>

                      {/* Existing Usage Photos Grid */}
                      {editUsageImages.length > 0 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 mb-3.5">
                          {editUsageImages.map((imgUrl, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group shadow-2xs">
                              <img src={imgUrl} alt={`Usage ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setEditUsageImages(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs shadow-md transition-all cursor-pointer"
                                title="Remove this photo"
                              >
                                ×
                              </button>
                              <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-white px-1.5 py-0.2 rounded font-bold">
                                #{idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add more photos via file upload or URL */}
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <label className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                          <UploadCloud className="w-4 h-4 text-amber-700" />
                          <span>{isUploadingEditUsage ? "Uploading..." : "Upload Photos (up to 10)"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isUploadingEditUsage || editUsageImages.length >= 10}
                            onChange={async (e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setIsUploadingEditUsage(true);
                                try {
                                  const fd = new FormData();
                                  Array.from(e.target.files).slice(0, 10 - editUsageImages.length).forEach(f => fd.append('files', f));
                                  const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
                                  const uploadData = await uploadRes.json();
                                  if (uploadRes.ok && uploadData.urls) {
                                    setEditUsageImages(prev => [...prev, ...uploadData.urls].slice(0, 10));
                                  } else {
                                    alert(uploadData.error || "Upload failed");
                                  }
                                } catch (err) {
                                  alert("Error uploading photos");
                                } finally {
                                  setIsUploadingEditUsage(false);
                                }
                              }
                            }}
                            className="hidden"
                          />
                        </label>

                        {/* Add via image URL */}
                        <div className="flex-1 flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Paste image URL..."
                            value={newUsageUrlInput}
                            onChange={(e) => setNewUsageUrlInput(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-700/50"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newUsageUrlInput.trim()) return;
                              setEditUsageImages(prev => [...prev, newUsageUrlInput.trim()].slice(0, 10));
                              setNewUsageUrlInput("");
                            }}
                            disabled={!newUsageUrlInput.trim() || editUsageImages.length >= 10}
                            className="px-3 py-2 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Quick link to view live product */}
                      <div className="mt-2.5 flex items-center justify-between text-xs">
                        <span className="text-stone-400">Preview live on website:</span>
                        <a
                          href={`/products/${editingProduct._id || editingProduct.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-900 font-bold hover:underline"
                        >
                          View Live Product Page <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <input
                        type="checkbox"
                        id="inStockCheck"
                        checked={editInStock}
                        onChange={(e) => setEditInStock(e.target.checked)}
                        className="w-4 h-4 text-amber-700 rounded border-stone-300 focus:ring-amber-600 cursor-pointer"
                      />
                      <label htmlFor="inStockCheck" className="text-sm font-medium text-stone-800 cursor-pointer select-none">
                        Product is In Stock & Available for Purchase
                      </label>
                    </div>

                    <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 font-semibold text-stone-600 text-sm transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingEdit}
                        className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-700 disabled:bg-stone-400 text-white font-semibold text-sm transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        {isSavingEdit ? "Saving Changes..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
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

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-stone-700">
                      How to Style & Use Photos (Up to 10 Lifestyle Photos)
                    </label>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {usageImages.length} / 10 selected
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-2.5">
                    Upload photos showing how customers can use and style this piece (e.g. study desk, kitchen, bedside, dining, living room). These appear right below product details on the website!
                  </p>

                  <div className="border-2 border-dashed border-stone-300 rounded-2xl p-7 flex flex-col items-center justify-center text-stone-500 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer relative overflow-hidden">
                    <UploadCloud className="w-9 h-9 mb-2 text-stone-400" />
                    <p className="font-medium text-stone-700 text-sm mb-1">Click to select up to 10 photos</p>
                    <p className="text-xs text-stone-400">JPG, PNG up to 5MB each (multiple photos allowed)</p>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          const selected = Array.from(e.target.files).slice(0, 10);
                          setUsageImages(selected);
                          setUsagePreviews(selected.map(f => URL.createObjectURL(f)));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                  </div>

                  {/* Thumbnail Previews with Remove Button */}
                  {usagePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-5 gap-2.5">
                      {usagePreviews.map((preview, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group shadow-2xs">
                          <img src={preview} alt={`Usage preview ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = usageImages.filter((_, idx) => idx !== i);
                              const newPreviews = usagePreviews.filter((_, idx) => idx !== i);
                              setUsageImages(newFiles);
                              setUsagePreviews(newPreviews);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs shadow-md transition-transform group-hover:scale-110 cursor-pointer"
                            title="Remove"
                          >
                            ×
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-white px-1.5 py-0.2 rounded font-bold">
                            #{i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
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
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={`https://wa.me/91${order.phone?.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${order.customerName}, regarding your Kaashta Crafts Order #${order._id?.slice(-6).toUpperCase()}...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                          >
                            💬 WhatsApp Customer
                          </a>
                          <a
                            href={`https://wa.me/918838098116?text=${encodeURIComponent(`🛍️ *KAASHTA CRAFTS ORDER #${order._id?.slice(-6).toUpperCase()}*\nCustomer: ${order.customerName}\nPhone: ${order.phone}\nTotal: ₹${order.totalAmount}\nStatus: ${order.status}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-900 text-stone-100 px-3 py-1.5 rounded-lg text-xs font-medium shadow-xs transition-colors"
                          >
                            📱 Send to 8838098116
                          </a>
                        </div>
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
