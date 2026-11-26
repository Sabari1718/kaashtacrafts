"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Send, ArrowLeft, Loader2, Star, ShieldCheck, Trash2, ShoppingBag, Truck, Award, Sparkles, Check, Eye, X, ChevronLeft, ChevronRight, Layers, Home, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Product as BaseProduct } from "../page";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

interface Product extends BaseProduct {
  reviews?: any[];
  rating?: number;
  numReviews?: number;
  images?: string[];
  usageImages?: string[];
}

const ENGRAVING_FONTS = [
  { id: "calligraphy", name: "Royal Script", fontClass: "font-serif italic font-bold", sampleText: "Amma's Kitchen", letterSpacing: "0.02em" },
  { id: "serif", name: "Heritage Serif", fontClass: "font-serif font-black uppercase tracking-wider", sampleText: "SIVA & GANESH", letterSpacing: "0.08em" },
  { id: "modern", name: "Executive Bold", fontClass: "font-sans font-black tracking-tight uppercase", sampleText: "KAASHTA CRAFTS", letterSpacing: "0.04em" },
  { id: "artisan", name: "Artisan Monogram", fontClass: "font-mono font-bold tracking-widest uppercase", sampleText: "EST. 2024", letterSpacing: "0.15em" },
  { id: "cursive", name: "Cursive Signature", fontClass: "font-serif italic font-medium", sampleText: "Priya & Rajesh", letterSpacing: "0.01em" },
  { id: "minimal", name: "Minimal Roman", fontClass: "font-serif font-semibold uppercase tracking-widest", sampleText: "THE SHARMA'S", letterSpacing: "0.18em" },
];

const ENGRAVING_SIZES = [
  { id: "sm", label: "Small", sub: "18px", sizePx: 18, desc: "Subtle Initials & Dates" },
  { id: "md", label: "Medium", sub: "26px", sizePx: 26, desc: "Classic Name (Popular)" },
  { id: "lg", label: "Large", sub: "34px", sizePx: 34, desc: "Prominent Statement" },
  { id: "xl", label: "Grand XL", sub: "42px", sizePx: 42, desc: "Hero Gift Header" },
];

const ENGRAVING_POSITIONS = [
  { id: "top", label: "Top Area", topPercent: "30%", icon: "⬆️" },
  { id: "center", label: "Center Stage", topPercent: "50%", icon: "🎯" },
  { id: "bottom", label: "Lower Area", topPercent: "68%", icon: "⬇️" },
];

const ENGRAVING_COLORS = [
  { id: "charred", name: "Deep Charcoal", hex: "#1c0d06", bgClass: "bg-[#1c0d06]", borderClass: "border-[#1c0d06]", shadow: "0 1px 1px rgba(255,255,255,0.45), 0 -1px 1px rgba(0,0,0,0.9), 0 0 2px rgba(45,22,12,0.8)", desc: "Classic Laser Burn" },
  { id: "walnut", name: "Warm Walnut", hex: "#422006", bgClass: "bg-[#422006]", borderClass: "border-[#422006]", shadow: "0 1px 1px rgba(255,255,255,0.4), 0 -1px 1px rgba(0,0,0,0.85), 0 0 2px rgba(66,32,6,0.7)", desc: "Rich Timber Grain" },
  { id: "gold", name: "Artisan Gold", hex: "#C49A50", bgClass: "bg-gradient-to-r from-[#D4AF37] to-[#C49A50]", borderClass: "border-[#C49A50]", shadow: "0 1px 2px rgba(0,0,0,0.85), 0 0 4px rgba(196,154,80,0.7), 0 -1px 1px rgba(255,255,255,0.5)", desc: "Metallic Gold Inlay" },
  { id: "white", name: "Frost White", hex: "#F7F5F0", bgClass: "bg-[#F7F5F0]", borderClass: "border-stone-400", shadow: "0 1px 2px rgba(0,0,0,0.95), 0 -1px 1px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.7)", desc: "White Chalk Inlay" },
  { id: "ebony", name: "Ebony Black", hex: "#080605", bgClass: "bg-[#080605]", borderClass: "border-black", shadow: "0 1px 1px rgba(255,255,255,0.3), 0 -1px 2px rgba(0,0,0,0.95)", desc: "Jet Black Etch" },
  { id: "crimson", name: "Royal Rust", hex: "#7a2217", bgClass: "bg-[#7a2217]", borderClass: "border-[#7a2217]", shadow: "0 1px 1px rgba(255,255,255,0.35), 0 -1px 1px rgba(0,0,0,0.85)", desc: "Redwood Pigment" },
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isMainZoomOpen, setIsMainZoomOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Bespoke Custom Laser Engraving State
  const [customText, setCustomText] = useState("");
  const [secondaryText, setSecondaryText] = useState("");
  const [showSecondaryLine, setShowSecondaryLine] = useState(false);

  // Line 1 styles (independent)
  const [selectedFont1, setSelectedFont1] = useState("calligraphy");
  const [selectedSize1, setSelectedSize1] = useState("md");
  const [selectedColor1, setSelectedColor1] = useState("charred");
  const [textPos1, setTextPos1] = useState<{ x: number; y: number }>({ x: 50, y: 38 });

  // Line 2 styles (independent)
  const [selectedFont2, setSelectedFont2] = useState("calligraphy");
  const [selectedSize2, setSelectedSize2] = useState("sm");
  const [selectedColor2, setSelectedColor2] = useState("charred");
  const [textPos2, setTextPos2] = useState<{ x: number; y: number }>({ x: 50, y: 64 });

  const [activeElement, setActiveElement] = useState<"line1" | "line2" | null>("line1");
  const [draggingTarget, setDraggingTarget] = useState<"line1" | "line2" | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const customInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);
  const modalPreviewRef = useRef<HTMLDivElement>(null);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    params.then(p => {
      setResolvedParams(p);
      fetchProduct(p.id);
    });
  }, [params]);

  async function fetchProduct(id: string) {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        setActiveImageIndex(0);
        
        try {
          const allRes = await fetch('/api/products');
          if (allRes.ok) {
            const allData = await allRes.json();
            const related = allData
              .filter((p: any) => (p._id !== id && p.id !== id) && (p.category === data.category))
              .slice(0, 8);
            
            // If we don't have enough related products in the same category, pad with others
            if (related.length < 4) {
              const others = allData.filter((p: any) => p._id !== id && p.id !== id && p.category !== data.category).slice(0, 8 - related.length);
              related.push(...others);
            }
            
            setRelatedProducts(related);
          }
        } catch (e) {
          console.error(e);
        }
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1 && document.referrer.includes(window.location.host)) {
      router.back();
    } else {
      router.push("/products");
    }
  };

  const handleStartCustomizing = () => {
    // If multiple product images are available, default to index 1 (clean wood view without marketing text)
    if (allProductImages.length > 1 && modalImageIndex === 0) {
      setModalImageIndex(1);
    }
    setIsCustomizeModalOpen(true);
    setTimeout(() => {
      customInputRef.current?.focus();
    }, 150);
  };

  const handlePointerDown = (target: "line1" | "line2", e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveElement(target);
    setDraggingTarget(target);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (target: "line1" | "line2", e: React.PointerEvent) => {
    if (draggingTarget !== target || !modalPreviewRef.current) return;
    const rect = modalPreviewRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(12, Math.min(88, Math.round(rawX)));
    const clampedY = Math.max(8, Math.min(92, Math.round(rawY)));
    if (target === "line1") {
      setTextPos1({ x: clampedX, y: clampedY });
    } else {
      setTextPos2({ x: clampedX, y: clampedY });
    }
    setEngravingPosition("custom");
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingTarget) {
      setDraggingTarget(null);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePreviewCanvasClick = () => {
    // Clicking outside on the wood background hides the selection boxes and shows finished piece
    setActiveElement(null);
  };

  const handleDoubleClickLine1 = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveElement("line1");
    customInputRef.current?.focus();
  };

  const handleDoubleClickLine2 = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveElement("line2");
    secondaryInputRef.current?.focus();
  };

  const handleOrderCustomized = () => {
    if (!product) return;
    const trimmed = customText.trim();
    const trimmedSecondary = secondaryText.trim();
    if (!trimmed && !trimmedSecondary) {
      setIsCustomizeModalOpen(true);
      toast.error("Please enter your name or text to engrave!", {
        description: "Or select 'Buy Standard Piece' if you want plain timber."
      });
      setTimeout(() => customInputRef.current?.focus(), 150);
      return;
    }
    const pid = product.id || (product as any)._id;
    const fontObj1 = ENGRAVING_FONTS.find(f => f.id === selectedFont1) || ENGRAVING_FONTS[0];
    const sizeObj1 = ENGRAVING_SIZES.find(s => s.id === selectedSize1) || ENGRAVING_SIZES[1];
    const colorObj1 = ENGRAVING_COLORS.find(c => c.id === selectedColor1) || ENGRAVING_COLORS[0];

    const fontObj2 = ENGRAVING_FONTS.find(f => f.id === selectedFont2) || ENGRAVING_FONTS[0];
    const sizeObj2 = ENGRAVING_SIZES.find(s => s.id === selectedSize2) || ENGRAVING_SIZES[0];
    const colorObj2 = ENGRAVING_COLORS.find(c => c.id === selectedColor2) || ENGRAVING_COLORS[0];

    const textParam = `&customText=${encodeURIComponent(trimmed || trimmedSecondary)}`;
    const secondaryParam = trimmedSecondary && trimmed ? `&customSecondaryText=${encodeURIComponent(trimmedSecondary)}` : '';
    const fontParam = `&customFont=${encodeURIComponent(fontObj1.name)}`;
    const sizeParam = `&customSize=${encodeURIComponent(sizeObj1.label)}`;
    const colorParam = `&customColor=${encodeURIComponent(colorObj1.name)}`;
    const secFontParam = trimmedSecondary ? `&customSecondaryFont=${encodeURIComponent(fontObj2.name)}` : '';
    const secSizeParam = trimmedSecondary ? `&customSecondarySize=${encodeURIComponent(sizeObj2.label)}` : '';
    const secColorParam = trimmedSecondary ? `&customSecondaryColor=${encodeURIComponent(colorObj2.name)}` : '';
    const posParam = `&customPos=${encodeURIComponent(`L1:x:${textPos1.x}%,y:${textPos1.y}%${trimmedSecondary ? `|L2:x:${textPos2.x}%,y:${textPos2.y}%` : ''}`)}`;
    setIsCustomizeModalOpen(false);
    router.push(`/checkout?buyNow=${pid}${textParam}${secondaryParam}${fontParam}${sizeParam}${colorParam}${secFontParam}${secSizeParam}${secColorParam}${posParam}`);
  };

  const handleAddCustomizedToCart = () => {
    if (!product) return;
    const trimmed = customText.trim();
    const trimmedSecondary = secondaryText.trim();
    if (!trimmed && !trimmedSecondary) {
      setIsCustomizeModalOpen(true);
      toast.error("Please enter your name or text to engrave!", {
        description: "Or select 'Add to Bag' below if you want plain timber."
      });
      setTimeout(() => customInputRef.current?.focus(), 150);
      return;
    }
    const fontObj1 = ENGRAVING_FONTS.find(f => f.id === selectedFont1) || ENGRAVING_FONTS[0];
    const sizeObj1 = ENGRAVING_SIZES.find(s => s.id === selectedSize1) || ENGRAVING_SIZES[1];
    const colorObj1 = ENGRAVING_COLORS.find(c => c.id === selectedColor1) || ENGRAVING_COLORS[0];

    const fontObj2 = ENGRAVING_FONTS.find(f => f.id === selectedFont2) || ENGRAVING_FONTS[0];
    const sizeObj2 = ENGRAVING_SIZES.find(s => s.id === selectedSize2) || ENGRAVING_SIZES[0];
    const colorObj2 = ENGRAVING_COLORS.find(c => c.id === selectedColor2) || ENGRAVING_COLORS[0];

    addToCart(product, {
      text: trimmed || trimmedSecondary,
      secondaryText: trimmedSecondary && trimmed ? trimmedSecondary : undefined,
      font: fontObj1.name,
      size: sizeObj1.label,
      color: colorObj1.name,
      secondaryFont: trimmedSecondary ? fontObj2.name : undefined,
      secondarySize: trimmedSecondary ? sizeObj2.label : undefined,
      secondaryColor: trimmedSecondary ? colorObj2.name : undefined,
      position: `L1:x:${textPos1.x}%,y:${textPos1.y}%${trimmedSecondary ? ` | L2:x:${textPos2.x}%,y:${textPos2.y}%` : ''}`
    });
    setIsCustomizeModalOpen(false);
    const summary = [trimmed, trimmedSecondary].filter(Boolean).join(" & ");
    toast.success(`"${product.name}" with custom laser engraving "${summary}" added to bag!`);
  };

  const handleBuyStandard = () => {
    if (!product) return;
    const pid = product.id || (product as any)._id;
    router.push(`/checkout?buyNow=${pid}`);
  };

  const handleAddStandardToCart = () => {
    if (!product) return;
    addToCart(product);
    toast.success(`"${product.name}" added to bag!`);
  };

  const handleAddToCart = () => {
    if (customText.trim()) {
      handleAddCustomizedToCart();
    } else {
      handleAddStandardToCart();
    }
  };

  const handleBuyNow = () => {
    if (customText.trim()) {
      handleOrderCustomized();
    } else {
      handleBuyStandard();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name} at KaashtaCrafts!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedParams?.id) return;
    
    if (!session) {
      toast.error("Please login to submit a review");
      router.push("/api/auth/signin");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${resolvedParams.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          user: session.user?.email || "Anonymous",
          name: session.user?.name || "Customer"
        }),
      });

      if (res.ok) {
        toast.success("Review submitted successfully!");
        setReviewComment("");
        setReviewRating(5);
        fetchProduct(resolvedParams.id);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!resolvedParams?.id) return;
    
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/products/${resolvedParams.id}?reviewId=${reviewId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        toast.success("Review deleted successfully!");
        fetchProduct(resolvedParams.id);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete review");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] transition-colors duration-300">
        <Loader2 className="w-10 h-10 animate-spin text-[#C49A50]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] transition-colors duration-300">
        <h1 className="text-2xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-4">Masterpiece Not Found</h1>
        <Link href="/products" className="text-[#C49A50] hover:underline text-sm font-semibold">Explore Catalog</Link>
      </div>
    );
  }

  // Calculate discount percentage
  const originalPrice = product.originalPrice || Math.floor(product.price * 1.4);
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  
  // Combine primary image, extra images, and all styling/usage images into a single Amazon-style gallery
  const allProductImages: string[] = Array.from(
    new Set(
      [
        product.image,
        ...(product.images || []),
        ...(product.usageImages || [])
      ].filter(Boolean)
    )
  );

  const nextImage = () => {
    if (allProductImages.length <= 1) return;
    setActiveImageIndex(prev => (prev + 1) % allProductImages.length);
  };
  const prevImage = () => {
    if (allProductImages.length <= 1) return;
    setActiveImageIndex(prev => (prev - 1 + allProductImages.length) % allProductImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      nextImage();
    } else if (diff < -45) {
      prevImage();
    }
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] font-sans pb-24 md:pb-16 transition-colors duration-300">
      
      {/* Mobile Top Navigation Bar (With Smart Back, Logo Home & Share) */}
      <div className="md:hidden flex items-center justify-between px-3.5 py-2.5 sticky top-0 bg-[#F7F5F0]/95 dark:bg-[#14100E]/95 backdrop-blur-md z-40 border-b border-[#EAE1D2] dark:border-[#2E241E]">
        <button 
          onClick={handleGoBack} 
          className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#1E1713] rounded-full border border-[#EAE1D2] dark:border-[#2E241E] text-xs font-bold text-[#241812] dark:text-[#F7F5F0] shadow-xs active:scale-95 transition-all cursor-pointer" 
          aria-label="Go Back"
        >
          <ArrowLeft className="w-4 h-4 text-[#C49A50]" />
          <span>Back</span>
        </button>

        <Link href="/" className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-[#C49A50]/60 bg-[#2E1A11] shrink-0 relative">
            <Image src="/logo.jpg" alt="Kaashta Crafts" fill className="object-contain" />
          </div>
          <span className="font-playfair font-bold text-xs tracking-wider text-[#241812] dark:text-[#F7F5F0]">
            Kaashta Crafts
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link 
            href="/" 
            className="p-1.5 bg-white dark:bg-[#1E1713] rounded-full border border-[#EAE1D2] dark:border-[#2E241E] text-[#241812] dark:text-[#F7F5F0] shadow-xs active:scale-95 transition-all" 
            title="Go to Home"
          >
            <Home className="w-4 h-4 text-[#241812] dark:text-[#F7F5F0]" />
          </Link>
          <button 
            onClick={handleShare} 
            className="p-1.5 bg-white dark:bg-[#1E1713] rounded-full border border-[#EAE1D2] dark:border-[#2E241E] text-[#241812] dark:text-[#F7F5F0] shadow-xs active:scale-95 transition-all cursor-pointer" 
            aria-label="Share"
            title="Share with friends"
          >
            <Send className="w-4 h-4 text-[#241812] dark:text-[#F7F5F0]" />
          </button>
        </div>
      </div>

      {/* Top Breadcrumb & Navigation Trail (Desktop & Tablet) */}
      <div className="max-w-[1300px] mx-auto w-full pt-4 md:pt-8 px-4 sm:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#1E1713] border border-[#EAE1D2] dark:border-[#2E241E] text-[#241812] dark:text-[#F7F5F0] hover:border-[#C49A50] hover:text-[#C49A50] font-bold transition-all shadow-xs cursor-pointer group active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C49A50] group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to All Pieces</span>
          </button>
          
          <span className="hidden sm:inline text-[#82786E]">•</span>
          
          <nav className="hidden sm:flex items-center gap-2 text-xs text-[#82786E] font-medium">
            <Link href="/" className="hover:text-[#241812] dark:hover:text-[#F7F5F0] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-[#C49A50]" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#241812] dark:hover:text-[#F7F5F0] transition-colors">
              Shop All
            </Link>
            <span>/</span>
            <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#241812] dark:hover:text-[#F7F5F0] transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#241812] dark:text-[#F7F5F0] font-semibold line-clamp-1 max-w-[200px] lg:max-w-[320px]">
              {product.name}
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-[#1E1713]/70 border border-[#EAE1D2] dark:border-[#2E241E] text-xs font-semibold text-[#82786E] hover:text-[#241812] dark:hover:text-[#F7F5F0] hover:border-[#C49A50] transition-all"
          >
            <Home className="w-3.5 h-3.5 text-[#C49A50]" />
            <span>Home Page</span>
          </Link>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#C49A50] hover:text-[#D4AF37] transition-colors"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto w-full pt-4 md:pt-6 px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        
        {/* Left Column: Product Image & Gallery (Amazon-Style Carousel with Swipe & Arrows) */}
        <div className="flex flex-col gap-3.5">
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] max-h-[620px] bg-gradient-to-b from-[#EDE5D8] via-[#F4EFE6] to-[#E5DAC8] dark:from-[#211712] dark:via-[#1A120E] dark:to-[#140E0A] rounded-3xl overflow-hidden border-2 border-[#DFCDB7] dark:border-[#38261C] shadow-md group flex items-center justify-center select-none"
          >
            {/* Ambient subtle warm gold glow */}
            <div className="absolute inset-0 bg-radial from-[#C49A50]/10 via-transparent to-transparent pointer-events-none" />

            <Image 
              src={allProductImages[activeImageIndex] || product.image} 
              alt={`${product.name} - View ${activeImageIndex + 1}`} 
              fill 
              className="object-contain p-2 sm:p-4 transition-all duration-300 group-hover:scale-102 cursor-zoom-in"
              priority
              onClick={() => setIsMainZoomOpen(true)}
            />

            {/* ═════════════════════════════════════════════════════════════════
                LIVE REAL-TIME LASER ENGRAVING DIRECTLY ON THE PRODUCT PHOTO
                (Shown when personalized)
                ═════════════════════════════════════════════════════════════════ */}
            {customText.trim() && (
              <div
                className="absolute z-20 pointer-events-none select-none transition-all duration-300 ease-out flex flex-col items-center justify-center px-4"
                style={{
                  top: engravingPosition === "top" ? "30%" : engravingPosition === "bottom" ? "68%" : "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "84%",
                  maxWidth: "400px"
                }}
              >
                <div className="relative text-center w-full px-3 py-2.5 rounded-2xl border-2 border-dashed border-[#8B5A2B]/60 bg-black/10 dark:bg-black/40 backdrop-blur-[0.5px] shadow-sm animate-in fade-in duration-200">
                  
                  {/* Floating Laser Badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#241812] text-[#E0D3BE] text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow-md whitespace-nowrap border border-[#C49A50]/60 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>Live Carved Preview on Wood</span>
                  </div>

                  {/* Real-time carved text on the wood */}
                  <p
                    className={`leading-tight break-words select-none transition-all duration-150 ${
                      (ENGRAVING_FONTS.find(f => f.id === selectedFont1) || ENGRAVING_FONTS[0]).fontClass
                    }`}
                    style={{
                      fontSize: `clamp(14px, 4.2vw, ${(ENGRAVING_SIZES.find(s => s.id === selectedSize1)?.sizePx || 26)}px)`,
                      color: (ENGRAVING_COLORS.find(c => c.id === selectedColor1) || ENGRAVING_COLORS[0]).hex,
                      textShadow: (ENGRAVING_COLORS.find(c => c.id === selectedColor1) || ENGRAVING_COLORS[0]).shadow,
                      letterSpacing: (ENGRAVING_FONTS.find(f => f.id === selectedFont1) || ENGRAVING_FONTS[0]).letterSpacing || "normal",
                    }}
                  >
                    {customText.trim() || (secondaryText.trim() ? "" : "Your Name Here")}
                  </p>

                  {secondaryText.trim() && (
                    <p
                      className={`leading-tight break-words select-none transition-all duration-150 mt-0.5 ${
                        (ENGRAVING_FONTS.find(f => f.id === selectedFont2) || ENGRAVING_FONTS[0]).fontClass
                      }`}
                      style={{
                        fontSize: `clamp(12px, 3.6vw, ${(ENGRAVING_SIZES.find(s => s.id === selectedSize2)?.sizePx || 18)}px)`,
                        color: (ENGRAVING_COLORS.find(c => c.id === selectedColor2) || ENGRAVING_COLORS[0]).hex,
                        textShadow: (ENGRAVING_COLORS.find(c => c.id === selectedColor2) || ENGRAVING_COLORS[0]).shadow,
                        letterSpacing: (ENGRAVING_FONTS.find(f => f.id === selectedFont2) || ENGRAVING_FONTS[0]).letterSpacing || "normal",
                      }}
                    >
                      {secondaryText.trim()}
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-2 mt-1 pt-1 border-t border-[#8B5A2B]/20 text-[8px] sm:text-[9px] font-bold text-[#3D2214] dark:text-[#E0D3BE]/90">
                    <span>{(ENGRAVING_FONTS.find(f => f.id === selectedFont1) || ENGRAVING_FONTS[0]).name}</span>
                    <span>•</span>
                    <span>{(ENGRAVING_SIZES.find(s => s.id === selectedSize1) || ENGRAVING_SIZES[1]).label}</span>
                    <span>•</span>
                    <span>{(ENGRAVING_COLORS.find(c => c.id === selectedColor1) || ENGRAVING_COLORS[0]).name}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Amazon-Style Prev & Next Arrow Buttons */}
            {allProductImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-[#1E1713]/90 hover:bg-white dark:hover:bg-[#1E1713] text-[#241812] dark:text-[#F7F5F0] border border-[#DFCDB7] dark:border-[#38261C] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                  title="Previous photo"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#241812] dark:text-[#F7F5F0]" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-[#1E1713]/90 hover:bg-white dark:hover:bg-[#1E1713] text-[#241812] dark:text-[#F7F5F0] border border-[#DFCDB7] dark:border-[#38261C] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                  title="Next photo"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#241812] dark:text-[#F7F5F0]" />
                </button>
              </>
            )}

            {/* Image counter indicator (e.g. 1 / 8) */}
            {allProductImages.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/15 shadow-sm z-20">
                {activeImageIndex + 1} / {allProductImages.length}
              </div>
            )}

            {/* Click to zoom badge at bottom left */}
            <button
              onClick={() => setIsMainZoomOpen(true)}
              className="absolute bottom-3.5 left-3.5 bg-[#241812]/85 hover:bg-[#241812] backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg z-20"
              title="Click to view full image"
            >
              <Eye className="w-3.5 h-3.5 text-[#C49A50]" />
              <span>Tap to Zoom</span>
            </button>
            
            {/* Wishlist & Share Floating Icons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-20">
              <button 
                onClick={() => {
                  if (product) {
                    toggleWishlist(product);
                    const isNowWishlisted = !isInWishlist(product.id || (product as any)._id);
                    if (isNowWishlisted) {
                      toast.success("Added to Private Wishlist ❤️");
                    } else {
                      toast.success("Removed from Wishlist");
                    }
                  }
                }}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 ${
                  product && isInWishlist(product.id || (product as any)._id)
                    ? 'bg-red-50 border-red-300 text-red-500 shadow-red-200/50'
                    : 'bg-white/95 dark:bg-[#1E1713]/95 border-[#DFCDB7] dark:border-[#38261C] text-[#241812] dark:text-[#F7F5F0] hover:border-[#C49A50] hover:text-[#C49A50]'
                }`}
                aria-label="Wishlist Toggle"
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${product && isInWishlist(product.id || (product as any)._id) ? 'fill-red-500 text-red-500' : 'stroke-[2.2]'}`} />
              </button>
              <button 
                onClick={handleShare}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-white/95 dark:bg-[#1E1713]/95 border-2 border-[#DFCDB7] dark:border-[#38261C] text-[#241812] dark:text-[#F7F5F0] hover:border-[#C49A50] hover:text-[#C49A50] rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                aria-label="Share Piece"
                title="Share this creation"
              >
                <Send className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* Amazon-Style Thumbnail Strip (Shows all product & styling photos) */}
          {allProductImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1 scrollbar-hide">
              {allProductImages.map((img: string, idx: number) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-gradient-to-b from-[#EDE5D8] to-[#E0D3BE] dark:from-[#261D15] dark:to-[#1E1510] ${
                      isActive 
                        ? 'border-[#C49A50] ring-2 ring-[#C49A50]/50 scale-105 shadow-md z-10' 
                        : 'border-[#DFCDB7] dark:border-[#38261C] opacity-70 hover:opacity-100 hover:border-[#C49A50]'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`} 
                      fill 
                      className="object-contain p-1" 
                    />
                    {idx > 0 && (
                      <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[9px] font-bold text-white px-1 rounded">
                        #{idx}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Product Meta, Pricing, Guarantees & CTAs */}
        <div className="flex flex-col">
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#C49A50]">
              {product.category}
            </span>
            <span className="text-[#82786E]">•</span>
            <span className="text-xs text-[#82786E] flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#C49A50]" />
              100% Solid Seasoned Wood
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-3 leading-tight">
            {product.name}
          </h1>
          
          {/* Rating Pill */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center bg-[#241812] text-[#F7F5F0] dark:bg-[#C49A50] dark:text-[#241812] px-2.5 py-0.5 rounded-full text-xs font-bold">
              <span>{product.rating ? product.rating.toFixed(1) : "4.9"}</span>
              <Star className="w-3 h-3 ml-1 fill-current" />
            </div>
            <span className="text-xs text-[#82786E] font-medium">
              {product.numReviews || 38} Verified Collector Reviews
            </span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl sm:text-4xl font-bold font-sans text-[#241812] dark:text-[#F7F5F0]">
              ₹{product.price}
            </span>
            <span className="text-base text-[#82786E] line-through">
              ₹{originalPrice}
            </span>
            <span className="text-xs font-bold text-[#C49A50] bg-[#EAE1D2]/50 dark:bg-[#2E241E] px-2 py-0.5 rounded-md">
              {discountPercentage}% OFF
            </span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-6 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Free Cushioned Shipping Across India
          </p>

          {/* The Kaashta Trust Banner */}
          <div className="bg-white/80 dark:bg-[#1E1713]/80 p-4 rounded-2xl mb-6 border border-[#EAE1D2] dark:border-[#2E241E] flex items-start gap-3.5 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-[#C49A50] shrink-0 mt-0.5" />
            <div className="text-xs text-[#82786E] dark:text-[#A39A90] leading-relaxed">
              <span className="font-bold text-[#241812] dark:text-[#F7F5F0]">100% Genuine Timber Guarantee.</span> Cold-pressed natural oil polish, non-toxic food-safe wax finish, and zero-breakage replacement assurance.
            </div>
          </div>

          {/* Product Description */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C49A50] mb-2">
              The Artisan Design
            </h3>
            <p className="text-[#241812]/80 dark:text-[#F7F5F0]/80 leading-relaxed text-sm">
              {product.description || "Crafted with handpicked timber, this bespoke piece infuses timeless warmth and dignity into your living space. Hand-turned and hand-planed by Kaashta Crafts master woodcarvers."}
            </p>
            
            <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs border-t border-[#EAE1D2]/80 dark:border-[#2E241E]/80 pt-3">
              <span className="text-[#82786E]">Curated Guild:</span>
              <span className="text-[#241812] dark:text-[#F7F5F0] font-semibold">{product.category}</span>
              <span className="text-[#82786E]">Availability:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Ready to Ship</span>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════
              BESPOKE LASER ENGRAVING CALLOUT CARD
              ═════════════════════════════════════════════════════════ */}
          <div className="bg-gradient-to-br from-[#FAF6EE] to-[#F2EAE0] dark:from-[#211712] dark:to-[#18110C] p-4 sm:p-5 rounded-2xl border-2 border-[#C49A50]/40 shadow-xs mb-6 transition-all">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#C49A50] text-[#241812] flex items-center justify-center text-sm font-black shadow-xs">
                  ✒️
                </span>
                <h3 className="font-playfair font-bold text-sm sm:text-base text-[#241812] dark:text-[#F7F5F0]">
                  Personalize With Custom Laser Engraving
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shrink-0">
                100% Free
              </span>
            </div>

            <p className="text-xs text-[#82786E] dark:text-[#A39A90] mb-4 leading-relaxed">
              {(customText.trim() || secondaryText.trim()) ? (
                <span className="font-semibold text-[#8B5A2B] dark:text-[#E6C477] flex items-center gap-1.5 flex-wrap">
                  <span>✒️ Selected Engraving: "{[customText.trim(), secondaryText.trim()].filter(Boolean).join(" • ")}"</span>
                  <span>
                    ({[
                      customText.trim() ? `${(ENGRAVING_FONTS.find(f => f.id === selectedFont1) || ENGRAVING_FONTS[0]).name} • ${(ENGRAVING_SIZES.find(s => s.id === selectedSize1) || ENGRAVING_SIZES[1]).label} • ${(ENGRAVING_COLORS.find(c => c.id === selectedColor1) || ENGRAVING_COLORS[0]).name}` : null,
                      secondaryText.trim() ? `L2: ${(ENGRAVING_FONTS.find(f => f.id === selectedFont2) || ENGRAVING_FONTS[0]).name} • ${(ENGRAVING_SIZES.find(s => s.id === selectedSize2) || ENGRAVING_SIZES[0]).label} • ${(ENGRAVING_COLORS.find(c => c.id === selectedColor2) || ENGRAVING_COLORS[0]).name}` : null,
                    ].filter(Boolean).join(" | ")})
                  </span>
                </span>
              ) : (
                "Add your custom name, couple names, or gift message. Choose font styles, sizes, and colors with real-time live preview on the piece before ordering!"
              )}
            </p>

            <button
              type="button"
              onClick={handleStartCustomizing}
              className="w-full bg-gradient-to-r from-[#C49A50] via-[#D4AF37] to-[#C49A50] hover:brightness-105 text-[#241812] py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{(customText.trim() || secondaryText.trim()) ? "Edit / Change Customization" : "Customize Order (Free Laser Engraving)"}</span>
            </button>
          </div>

          {/* Main Desktop Action Buttons */}
          <div className="hidden md:flex gap-3 mt-auto pt-4 border-t border-[#EAE1D2] dark:border-[#2E241E]">
            <button 
              onClick={(customText.trim() || secondaryText.trim()) ? handleAddCustomizedToCart : handleAddStandardToCart}
              className="flex-1 bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] py-3.5 rounded-full font-bold text-sm tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#C49A50]" />
              <span>{(customText.trim() || secondaryText.trim()) ? "Add Customized to Bag" : "Add to Bag"}</span>
            </button>
            <button 
              onClick={(customText.trim() || secondaryText.trim()) ? handleOrderCustomized : handleBuyStandard}
              className="flex-1 bg-[#C49A50] hover:bg-[#D4AF37] text-[#241812] py-3.5 rounded-full font-bold text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{(customText.trim() || secondaryText.trim()) ? `Order Customized ₹${product.price}` : `Buy Now ₹${product.price}`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1300px] mx-auto w-full px-4 sm:px-8 mt-16 pt-12 border-t border-[#EAE1D2] dark:border-[#2E241E] mb-12 relative group/swiper">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#C49A50]">Complementary Creations</span>
              <h2 className="text-2xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0]">You May Also Cherish</h2>
            </div>
          </div>
          
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={16}
            slidesPerView={2}
            freeMode={true}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="pb-4"
          >
            {relatedProducts.map((p: any) => (
              <SwiperSlide key={p._id || p.id}>
                <Link 
                  href={`/products/${p._id || p.id}`} 
                  className="group flex flex-col h-full bg-white/80 dark:bg-[#1E1713]/80 p-3 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] hover:border-[#C49A50] shadow-xs hover:shadow-sm transition-all duration-300"
                >
                  <div className="relative aspect-square bg-white/60 dark:bg-[#1E1713]/60 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                    <Image src={p.image} alt={p.name} fill className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-[#241812] dark:text-[#F7F5F0] line-clamp-1 text-sm group-hover:text-[#65452F] dark:group-hover:text-[#C49A50] transition-colors">{p.name}</h3>
                  <p className="text-[#C49A50] font-bold mt-1 text-sm">₹{p.price}</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="max-w-[1300px] mx-auto w-full px-4 sm:px-8 pb-12">
        <h2 className="text-2xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-6 border-b border-[#EAE1D2] dark:border-[#2E241E] pb-3">
          Collector Reflections & Reviews
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Write a Review Card */}
          <div className="lg:col-span-1 bg-white/80 dark:bg-[#1E1713]/80 p-6 rounded-3xl border border-[#EAE1D2] dark:border-[#2E241E] h-fit shadow-xs">
            <h3 className="text-base font-bold font-playfair text-[#241812] dark:text-[#F7F5F0] mb-1">Review this creation</h3>
            <p className="text-xs text-[#82786E] mb-4">Share your tactile experience with other collectors</p>
            
            <form onSubmit={submitReview} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C49A50] mb-2">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-[#C49A50] text-[#C49A50]' : 'text-stone-300 dark:text-stone-700'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C49A50] mb-2">Your Thoughts</label>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How does the wood finish and grain feel in person?"
                  rows={4}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE1D2] dark:border-[#2E241E] bg-[#F7F5F0]/60 dark:bg-[#14100E] text-xs text-[#241812] dark:text-[#F7F5F0] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 resize-none transition-all"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingReview}
                className="w-full bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] disabled:bg-stone-400 text-[#F7F5F0] dark:text-[#241812] py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                {isSubmittingReview ? "Submitting..." : session ? "Submit Review" : "Login to Review"}
              </button>
            </form>
          </div>

          {/* Display Reviews */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="text-center py-12 bg-white/70 dark:bg-[#1E1713]/70 rounded-3xl border border-[#EAE1D2] dark:border-[#2E241E]">
                <p className="text-xs sm:text-sm text-[#82786E]">No reviews yet. Be the first to share reflections on this piece.</p>
              </div>
            ) : (
              product.reviews.map((review: any, idx: number) => (
                <div key={idx} className="bg-white/80 dark:bg-[#1E1713]/80 p-5 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] shadow-2xs relative group transition-all">
                  {session?.user?.email === review.user && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="absolute top-4 right-4 p-1.5 text-[#82786E] hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete your review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-8 h-8 bg-[#EAE1D2] dark:bg-[#2E241E] text-[#65452F] dark:text-[#C49A50] rounded-full flex items-center justify-center font-bold text-xs">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#241812] dark:text-[#F7F5F0] text-xs">{review.name}</h4>
                      <p className="text-[10px] text-[#82786E]">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#C49A50] text-[#C49A50]' : 'text-stone-300 dark:text-stone-700'}`} />
                    ))}
                  </div>
                  
                  <p className="text-[#241812]/80 dark:text-[#F7F5F0]/80 text-xs sm:text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Back to Home & Explore Full Catalog Banner */}
      <div className="max-w-[1300px] mx-auto w-full px-4 sm:px-8 mt-6 mb-16">
        <div className="bg-gradient-to-r from-[#241812] via-[#38261C] to-[#241812] p-6 sm:p-9 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-[#C49A50]/30 relative overflow-hidden">
          <div className="relative z-10 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C49A50] mb-1.5 block">
              Handcrafted With Tamil Woodcraft Heritage
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-playfair text-[#F7F5F0] mb-2">
              Discover More From Kaashta Crafts
            </h3>
            <p className="text-xs sm:text-sm text-[#E0D3BE] max-w-xl leading-relaxed">
              Shared this piece with family or friends? Explore our full collection of teak desk suites, sacred home decor, and culinary serving boards.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3 shrink-0 justify-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-[#C49A50] hover:bg-[#D4AF37] text-[#241812] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F5F0] border border-white/20 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse All Creations</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Actions */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F7F5F0]/95 dark:bg-[#14100E]/95 backdrop-blur-md border-t border-[#EAE1D2] dark:border-[#2E241E] p-3 flex flex-col gap-1.5 z-40 shadow-xl">
        {customText.trim() ? (
          <div className="flex items-center justify-between px-2 text-[10px] font-bold text-[#8B5A2B] dark:text-[#E6C477]">
            <span className="truncate max-w-[200px]">✒️ Engraving: "{customText}"</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold uppercase">Free Laser Etch</span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 text-[10px] text-[#82786E]">
            <span>✨ 100% Solid Seasoned Wood</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Free Cushioned Shipping</span>
          </div>
        )}
        <div className="flex gap-2">
          {(customText.trim() || secondaryText.trim()) ? (
            <>
              <button 
                onClick={handleAddCustomizedToCart}
                className="flex-1 bg-[#241812] text-[#F7F5F0] py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C49A50]" />
                <span>Add Engraved</span>
              </button>
              <button 
                onClick={handleOrderCustomized}
                className="flex-1 bg-gradient-to-r from-[#C49A50] via-[#D4AF37] to-[#C49A50] text-[#241812] py-3 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Order Engraved ₹{product.price}</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleStartCustomizing}
                className="flex-1 bg-gradient-to-r from-[#C49A50] via-[#D4AF37] to-[#C49A50] text-[#241812] py-3 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Customize Order</span>
              </button>
              <button 
                onClick={handleBuyStandard}
                className="flex-1 bg-[#241812] text-[#F7F5F0] py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>Buy Plain ₹{product.price}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Image Zoom Lightbox */}
      {isMainZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
          onClick={() => setIsMainZoomOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsMainZoomOpen(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
              aria-label="Close Zoom"
            >
              <X className="w-5 h-5" />
            </button>

            {allProductImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-2 sm:left-4 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 sm:right-4 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden">
              <Image
                src={allProductImages[activeImageIndex] || product.image}
                alt={`${product.name} view ${activeImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-5 py-2 rounded-full text-xs font-semibold text-white/90 border border-white/10 shadow-lg">
              {product.name} • View {activeImageIndex + 1} of {allProductImages.length}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          DEDICATED INTERACTIVE CUSTOMIZATION STUDIO MODAL
          ═════════════════════════════════════════════════════════════════ */}
      {isCustomizeModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsCustomizeModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#F7F5F0] dark:bg-[#18110C] rounded-3xl border-2 border-[#C49A50]/60 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#DFCDB7] dark:border-[#38261C] bg-white/70 dark:bg-[#1E1713]/80">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-[#C49A50] text-[#241812] flex items-center justify-center text-sm font-black shadow-xs">
                  ✨
                </span>
                <div>
                  <h2 className="font-playfair font-bold text-base sm:text-lg text-[#241812] dark:text-[#F7F5F0]">
                    Customize Your {product.name}
                  </h2>
                  <p className="text-[11px] text-[#8B5A2B] dark:text-[#E6C477] font-semibold">
                    100% Free Bespoke Laser Wood Engraving
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomizeModalOpen(false)}
                className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Left = Live Product Preview, Right = Customization Controls */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Live Product Photo with Wood Engraving Overlay */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C49A50] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Live Wood Preview on Piece:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {activeElement ? (
                      <button
                        type="button"
                        onClick={() => setActiveElement(null)}
                        className="text-[10px] bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                        title="Hide edit borders and see realistic finished wood carving"
                      >
                        ✓ Done Editing (Preview)
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                        ✨ Realistic Finished Look
                      </span>
                    )}
                  </div>
                </div>

                {/* Wood Preview Box (Interactive Canvas - Click background to deselect & save view) */}
                <div 
                  ref={modalPreviewRef}
                  onClick={handlePreviewCanvasClick}
                  className="relative w-full aspect-square bg-[#F5EFEB] dark:bg-[#1A120E] rounded-2xl overflow-hidden border-2 border-[#DFCDB7] dark:border-[#38261C] shadow-inner flex items-center justify-center select-none cursor-default"
                >
                  <Image 
                    src={allProductImages[modalImageIndex] || product.image} 
                    alt={product.name} 
                    fill 
                    className="object-contain p-2 pointer-events-none"
                  />

                  {/* ═══════════ INDEPENDENT LINE 1 (Primary Name) ═══════════ */}
                  <div
                    onPointerDown={(e) => handlePointerDown("line1", e)}
                    onPointerMove={(e) => handlePointerMove("line1", e)}
                    onPointerUp={handlePointerUp}
                    onClick={(e) => { e.stopPropagation(); setActiveElement("line1"); }}
                    onDoubleClick={handleDoubleClickLine1}
                    className={`absolute z-20 select-none transition-transform ${
                      activeElement === "line1" 
                        ? "cursor-grab active:cursor-grabbing z-30" 
                        : "cursor-pointer hover:ring-1 hover:ring-[#C49A50]/40 rounded-lg"
                    } ${draggingTarget === "line1" ? "scale-105" : ""}`}
                    style={{
                      top: `${textPos1.y}%`,
                      left: `${textPos1.x}%`,
                      transform: "translate(-50%, -50%)",
                      touchAction: "none"
                    }}
                  >
                    <div className={`relative text-center px-3 py-1.5 rounded-xl transition-all ${
                      activeElement === "line1"
                        ? "border-2 border-dashed border-[#C49A50] bg-black/20 dark:bg-black/55 backdrop-blur-[0.5px] shadow-lg ring-2 ring-[#C49A50]/30"
                        : "border-2 border-transparent bg-transparent"
                    }`}>
                      {activeElement === "line1" && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#241812] text-[#E0D3BE] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-[#C49A50]/70 flex items-center gap-1 pointer-events-none">
                          <Sparkles className="w-2.5 h-2.5 text-[#C49A50]" />
                          <span>Line 1 • Drag 👆</span>
                        </div>
                      )}

                      {/* Primary Laser Engraving Text */}
                      <p
                        className={`leading-tight whitespace-nowrap select-none transition-all duration-150 ${(ENGRAVING_FONTS.find(f => f.id === selectedFont1) || ENGRAVING_FONTS[0]).fontClass}`}
                        style={{
                          fontSize: `clamp(14px, 4.2vw, ${(ENGRAVING_SIZES.find(s => s.id === selectedSize1)?.sizePx || 26)}px)`,
                          color: (ENGRAVING_COLORS.find(c => c.id === selectedColor1) || ENGRAVING_COLORS[0]).hex,
                          textShadow: (ENGRAVING_COLORS.find(c => c.id === selectedColor1) || ENGRAVING_COLORS[0]).shadow,
                          letterSpacing: (ENGRAVING_FONTS.find(f => f.id === selectedFont1) || ENGRAVING_FONTS[0]).letterSpacing || "normal",
                        }}
                      >
                        {customText.trim() || (activeElement === "line1" ? "Type Name Here" : "Your Name Here")}
                      </p>

                      {activeElement === "line1" && (
                        <span className="text-[7.5px] font-bold text-[#3D2214] dark:text-[#E0D3BE]/90 block mt-0.5 whitespace-nowrap pointer-events-none">
                          {(ENGRAVING_FONTS.find(f => f.id === selectedFont1) || ENGRAVING_FONTS[0]).name} • {(ENGRAVING_SIZES.find(s => s.id === selectedSize1) || ENGRAVING_SIZES[1]).label} • {(ENGRAVING_COLORS.find(c => c.id === selectedColor1) || ENGRAVING_COLORS[0]).name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ═══════════ INDEPENDENT LINE 2 (Separate 2nd Name / Date) ═══════════ */}
                  {(showSecondaryLine || secondaryText.trim()) && (
                    <div
                      onPointerDown={(e) => handlePointerDown("line2", e)}
                      onPointerMove={(e) => handlePointerMove("line2", e)}
                      onPointerUp={handlePointerUp}
                      onClick={(e) => { e.stopPropagation(); setActiveElement("line2"); }}
                      onDoubleClick={handleDoubleClickLine2}
                      className={`absolute z-20 select-none transition-transform ${
                        activeElement === "line2" 
                          ? "cursor-grab active:cursor-grabbing z-30" 
                          : "cursor-pointer hover:ring-1 hover:ring-[#C49A50]/40 rounded-lg"
                      } ${draggingTarget === "line2" ? "scale-105" : ""}`}
                      style={{
                        top: `${textPos2.y}%`,
                        left: `${textPos2.x}%`,
                        transform: "translate(-50%, -50%)",
                        touchAction: "none"
                      }}
                    >
                      <div className={`relative text-center px-3 py-1.5 rounded-xl transition-all ${
                        activeElement === "line2"
                          ? "border-2 border-dashed border-[#C49A50] bg-black/20 dark:bg-black/55 backdrop-blur-[0.5px] shadow-lg ring-2 ring-[#C49A50]/30"
                          : "border-2 border-transparent bg-transparent"
                      }`}>
                        {activeElement === "line2" && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C49A50] text-[#241812] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-[#241812]/50 flex items-center gap-1 pointer-events-none">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Line 2 • Drag 👆</span>
                          </div>
                        )}

                        {/* Secondary Laser Engraving Text */}
                        <p
                          className={`leading-tight whitespace-nowrap select-none transition-all duration-150 ${(ENGRAVING_FONTS.find(f => f.id === selectedFont2) || ENGRAVING_FONTS[0]).fontClass}`}
                          style={{
                            fontSize: `clamp(12px, 3.6vw, ${(ENGRAVING_SIZES.find(s => s.id === selectedSize2)?.sizePx || 18)}px)`,
                            color: (ENGRAVING_COLORS.find(c => c.id === selectedColor2) || ENGRAVING_COLORS[0]).hex,
                            textShadow: (ENGRAVING_COLORS.find(c => c.id === selectedColor2) || ENGRAVING_COLORS[0]).shadow,
                            letterSpacing: (ENGRAVING_FONTS.find(f => f.id === selectedFont2) || ENGRAVING_FONTS[0]).letterSpacing || "normal",
                          }}
                        >
                          {secondaryText.trim() || (activeElement === "line2" ? "2nd Name / Date" : "Additional Name")}
                        </p>

                        {activeElement === "line2" && (
                          <span className="text-[7.5px] font-bold text-[#3D2214] dark:text-[#E0D3BE]/90 block mt-0.5 whitespace-nowrap pointer-events-none">
                            Line 2: {(ENGRAVING_FONTS.find(f => f.id === selectedFont2) || ENGRAVING_FONTS[0]).name} • {(ENGRAVING_SIZES.find(s => s.id === selectedSize2) || ENGRAVING_SIZES[0]).label} • {(ENGRAVING_COLORS.find(c => c.id === selectedColor2) || ENGRAVING_COLORS[0]).name}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Helpful Canvas Navigation Tip */}
                <p className="text-[10px] text-stone-500 dark:text-stone-400 text-center flex items-center justify-center gap-1">
                  <span>👆 Tap text to drag</span>
                  <span>•</span>
                  <span>Double-tap to edit</span>
                  <span>•</span>
                  <span className="font-semibold text-[#8B5A2B] dark:text-[#E6C477]">Tap wood to remove box</span>
                </p>

                {/* Wood Angle Selector (Allows customer to preview on plain clean wood photos) */}
                {allProductImages.length > 1 && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-[10px] text-stone-600 dark:text-stone-400 font-bold flex items-center justify-between">
                      <span>Select Wood Angle / Photo to Preview:</span>
                      <span className="text-[#C49A50]">Photo #{modalImageIndex + 1} of {allProductImages.length}</span>
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-hide">
                      {allProductImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setModalImageIndex(idx)}
                          className={`relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-stone-100 dark:bg-stone-900 ${
                            modalImageIndex === idx 
                              ? 'border-[#C49A50] ring-2 ring-[#C49A50]/60 scale-105 shadow-xs' 
                              : 'border-[#DFCDB7] dark:border-[#38261C] opacity-60 hover:opacity-100 hover:border-[#C49A50]'
                          }`}
                          title={`Switch preview to photo #${idx + 1}`}
                        >
                          <Image src={img} alt={`Angle ${idx + 1}`} fill className="object-contain p-0.5" />
                          <span className="absolute bottom-0 right-0 bg-black/75 text-white text-[8px] font-bold px-1 rounded-tl">
                            #{idx + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Customization Controls */}
              <div className="flex flex-col gap-4">
                
                {/* Step 1: Text Customization (Line 1 + Separate Line 2) */}
                <div className="flex flex-col gap-2.5">
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    activeElement === 'line1'
                      ? 'border-[#C49A50] bg-[#FAF6EE] dark:bg-[#1E1713] ring-1 ring-[#C49A50]/30'
                      : 'border-[#DFCDB7] dark:border-[#38261C] bg-white dark:bg-[#14100E]'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#C49A50] flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#241812] text-[#F7F5F0] text-[10px] flex items-center justify-center font-bold">1</span>
                        <span>Line 1 (Main Name / Text):</span>
                      </label>
                      <span className="text-[10px] text-stone-400 font-semibold select-none">
                        {customText.length}/35
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        ref={customInputRef}
                        type="text"
                        maxLength={35}
                        value={customText}
                        onFocus={() => setActiveElement("line1")}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="e.g. Amma's Kitchen / Vignesh & Divya"
                        className="w-full pl-3 pr-16 py-2 rounded-lg border border-[#DFCDB7] dark:border-[#38261C] bg-white dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] placeholder:text-[#82786E]/60 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#C49A50] transition-all"
                      />
                      {customText && (
                        <button
                          type="button"
                          onClick={() => setCustomText("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md font-bold cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Line 2 (Separate Additional Name / Date / Subtitle) */}
                  {showSecondaryLine ? (
                    <div className={`p-2.5 rounded-xl border transition-all animate-in fade-in slide-in-from-top-1 duration-200 ${
                      activeElement === 'line2'
                        ? 'border-[#C49A50] bg-[#FAF6EE] dark:bg-[#1E1713] ring-1 ring-[#C49A50]/30'
                        : 'border-[#DFCDB7] dark:border-[#38261C] bg-white dark:bg-[#14100E]'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#C49A50] flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#C49A50] text-[#241812] text-[10px] flex items-center justify-center font-bold">2</span>
                          <span>Line 2 (Separate 2nd Name / Date):</span>
                        </label>
                        <span className="text-[10px] text-stone-400 font-semibold select-none">
                          {secondaryText.length}/35
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          ref={secondaryInputRef}
                          type="text"
                          maxLength={35}
                          value={secondaryText}
                          onFocus={() => setActiveElement("line2")}
                          onChange={(e) => setSecondaryText(e.target.value)}
                          placeholder="e.g. Est. 2024 / Happy Housewarming"
                          className="w-full pl-3 pr-20 py-2 rounded-lg border border-[#DFCDB7] dark:border-[#38261C] bg-white dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] placeholder:text-[#82786E]/60 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#C49A50] transition-all"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {secondaryText && (
                            <button
                              type="button"
                              onClick={() => setSecondaryText("")}
                              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded-md font-bold cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => { setShowSecondaryLine(false); setSecondaryText(""); setActiveElement("line1"); }}
                            className="text-red-500 hover:text-red-700 text-xs bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded-md font-bold cursor-pointer"
                            title="Remove Line 2"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowSecondaryLine(true);
                        setActiveElement("line2");
                        setTimeout(() => secondaryInputRef.current?.focus(), 100);
                      }}
                      className="w-full py-2.5 px-3 border-2 border-dashed border-[#C49A50] hover:bg-[#C49A50]/10 rounded-xl text-xs font-bold text-[#8B5A2B] dark:text-[#E6C477] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>➕ Add Second Name / Date (Move Anywhere Independently)</span>
                    </button>
                  )}
                </div>

                {/* Active Target Banner */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B5A2B] dark:text-[#E6C477]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C49A50]" />
                    <span>Styling:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveElement("line1")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        (activeElement === "line2" ? "line2" : "line1") === "line1"
                          ? "bg-[#241812] text-white dark:bg-[#C49A50] dark:text-[#241812] shadow-sm ring-1 ring-amber-500/60"
                          : "bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 border border-stone-200 dark:border-stone-700"
                      }`}
                    >
                      Line 1 {customText.trim() ? `("${customText.slice(0, 8)}")` : ""}
                    </button>
                    {(showSecondaryLine || secondaryText.trim()) && (
                      <button
                        type="button"
                        onClick={() => setActiveElement("line2")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          (activeElement === "line2" ? "line2" : "line1") === "line2"
                            ? "bg-[#241812] text-white dark:bg-[#C49A50] dark:text-[#241812] shadow-sm ring-1 ring-amber-500/60"
                            : "bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 border border-stone-200 dark:border-stone-700"
                        }`}
                      >
                        Line 2 {secondaryText.trim() ? `("${secondaryText.slice(0, 8)}")` : ""}
                      </button>
                    )}
                  </div>
                </div>

                {/* Step 2: Font Style (Applies ONLY to active line) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#C49A50] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#241812] text-[#F7F5F0] text-[10px] flex items-center justify-center font-bold">2</span>
                      <span>Font Style (for {(activeElement === "line2" ? "Line 2" : "Line 1")}):</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ENGRAVING_FONTS.map((f) => {
                      const isSelected = (activeElement === "line2" ? selectedFont2 : selectedFont1) === f.id;
                      const activeTextSample = activeElement === "line2" ? (secondaryText.trim() || f.sampleText) : (customText.trim() || f.sampleText);
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            if (activeElement === "line2") {
                              setSelectedFont2(f.id);
                            } else {
                              setSelectedFont1(f.id);
                            }
                          }}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#241812] text-[#F7F5F0] dark:bg-[#C49A50] dark:text-[#241812] border-[#C49A50] shadow-sm ring-2 ring-[#C49A50]/40 scale-[1.02]'
                              : 'bg-white/80 dark:bg-[#1A120E] text-[#241812] dark:text-[#E2D8CC] border-[#DFCDB7] dark:border-[#38261C] hover:border-[#C49A50]'
                          }`}
                        >
                          <span className={`block text-xs truncate leading-tight ${f.fontClass}`}>
                            {activeTextSample}
                          </span>
                          <span className="text-[9px] opacity-75 font-sans font-medium block mt-1">
                            {f.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Size (Applies ONLY to active line) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#C49A50] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#241812] text-[#F7F5F0] text-[10px] flex items-center justify-center font-bold">3</span>
                      <span>Size (for {(activeElement === "line2" ? "Line 2" : "Line 1")}):</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ENGRAVING_SIZES.map((s) => {
                      const isSelected = (activeElement === "line2" ? selectedSize2 : selectedSize1) === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            if (activeElement === "line2") {
                              setSelectedSize2(s.id);
                            } else {
                              setSelectedSize1(s.id);
                            }
                          }}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#241812] text-[#F7F5F0] dark:bg-[#C49A50] dark:text-[#241812] border-[#C49A50] shadow-sm ring-2 ring-[#C49A50]/40 scale-[1.02]'
                              : 'bg-white/80 dark:bg-[#1A120E] text-[#241812] dark:text-[#E2D8CC] border-[#DFCDB7] dark:border-[#38261C] hover:border-[#C49A50]'
                          }`}
                        >
                          <span className="block text-xs font-bold leading-tight">
                            {s.label}
                          </span>
                          <span className="text-[9px] opacity-75 block mt-0.5">
                            {s.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 4: Engraving Tone & Color Options */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#C49A50] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#241812] text-[#F7F5F0] text-[10px] flex items-center justify-center font-bold">4</span>
                      <span>Color & Inlay Style (for {(activeElement === "line2" ? "Line 2" : "Line 1")}):</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ENGRAVING_COLORS.map((c) => {
                      const isSelected = (activeElement === "line2" ? selectedColor2 : selectedColor1) === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            if (activeElement === "line2") {
                              setSelectedColor2(c.id);
                            } else {
                              setSelectedColor1(c.id);
                            }
                          }}
                          className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#241812] text-[#F7F5F0] dark:bg-[#C49A50] dark:text-[#241812] border-[#C49A50] shadow-sm ring-2 ring-[#C49A50]/40 scale-[1.02]'
                              : 'bg-white/80 dark:bg-[#1A120E] text-[#241812] dark:text-[#E2D8CC] border-[#DFCDB7] dark:border-[#38261C] hover:border-[#C49A50]'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full shrink-0 shadow-xs ${c.bgClass}`} />
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold leading-tight truncate">{c.name}</span>
                            <span className="text-[8px] opacity-75">{c.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 5: Position On Wood */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#C49A50] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#241812] text-[#F7F5F0] text-[10px] flex items-center justify-center font-bold">5</span>
                      <span>Quick Placement ({activeElement === 'line2' ? 'Line 2' : 'Line 1'}):</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {ENGRAVING_POSITIONS.map((p) => {
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setEngravingPosition(p.id);
                            const target = activeElement === "line2" ? "line2" : "line1";
                            const newY = p.id === "top" ? (target === "line1" ? 28 : 38) : p.id === "bottom" ? (target === "line1" ? 65 : 78) : (target === "line1" ? 42 : 60);
                            if (target === "line1") {
                              setTextPos1({ x: 50, y: newY });
                            } else {
                              setTextPos2({ x: 50, y: newY });
                            }
                          }}
                          className="py-2 px-1 rounded-xl border text-center transition-all cursor-pointer bg-white/80 dark:bg-[#1A120E] text-[#241812] dark:text-[#E2D8CC] border-[#DFCDB7] dark:border-[#38261C] hover:border-[#C49A50]"
                        >
                          <span className="block text-xs font-bold">
                            {p.icon} {p.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 border-t border-[#DFCDB7] dark:border-[#38261C] bg-white/70 dark:bg-[#1E1713]/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsCustomizeModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
              >
                Cancel / Close
              </button>
              
              <div className="flex gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddCustomizedToCart}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-[#241812] hover:bg-[#38261C] text-[#F7F5F0] font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C49A50]" />
                  <span>Add Customized to Bag</span>
                </button>
                <button
                  type="button"
                  onClick={handleOrderCustomized}
                  className="flex-1 sm:flex-none px-7 py-3 rounded-full bg-gradient-to-r from-[#C49A50] via-[#D4AF37] to-[#C49A50] hover:brightness-105 text-[#241812] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Order Now ₹{product.price}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
