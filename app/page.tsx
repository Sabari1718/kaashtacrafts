"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./context/CartContext";
import { Product } from "./products/page";

// Swiper imports for Carousels
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const categories = [
  { name: "Top Offers", image: "/top-offers.jpg", href: "/products" },
  { name: "Stationery", image: "/stationery.jpg", href: "/products?category=Stationery" },
  { name: "Home Decor", image: "/home-decor.jpg", href: "/products?category=Home Decor" },
  { name: "Desk Accessories", image: "/desk-accessories.jpg", href: "/products?category=Desk Accessories" },
  { name: "Kitchen", image: "/kitchen.jpg", href: "/products?category=Kitchen" },
];

export default function Home() {
  const { addToCart } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Split products for different sections
  const trendingProducts = allProducts.slice(0, Math.ceil(allProducts.length / 2));
  const newArrivals = allProducts.slice(Math.ceil(allProducts.length / 2));

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-50">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
        <p className="text-stone-500 font-medium">Loading amazing deals...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-stone-50 pb-10">
      
      {/* 1. Top Categories Nav (Horizontal Scroll) */}
      <div className="w-full bg-white shadow-sm overflow-x-auto scrollbar-hide py-3 px-4 md:px-10 mb-2">
        <div className="flex justify-between items-center min-w-max gap-8 lg:justify-center mx-auto max-w-7xl">
          {categories.map((cat, idx) => (
            <Link href={cat.href} key={idx} className="flex flex-col items-center group cursor-pointer">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 bg-stone-100 p-1 border-2 border-transparent group-hover:border-amber-500 transition-all">
                <div className="w-full h-full relative rounded-full overflow-hidden">
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-stone-800 group-hover:text-amber-700 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-2 md:px-4 flex flex-col gap-4">
        
        {/* 2. Hero Banner Carousel */}
        <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] bg-stone-50 rounded-lg shadow-sm overflow-hidden relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            style={{
              "--swiper-pagination-color": "#b45309",
              "--swiper-pagination-bullet-inactive-color": "#d6d3d1",
            } as any}
            className="w-full h-full"
          >
            {/* Banner 1 */}
            <SwiperSlide>
              <div className="w-full h-full relative bg-stone-100 flex items-center justify-center cursor-pointer" onClick={() => window.location.href = '/products'}>
                <Image src="/banner1.jpg" alt="Kaashta Crafts Offers" fill className="object-contain" unoptimized={true} quality={100} priority={true} />
              </div>
            </SwiperSlide>
            {/* Banner 2 */}
            <SwiperSlide>
              <div className="w-full h-full relative bg-stone-100 flex items-center justify-center cursor-pointer" onClick={() => window.location.href = '/products'}>
                <Image src="/banner2.jpg" alt="Kaashta Crafts Collections" fill className="object-contain" unoptimized={true} quality={100} priority={true} />
              </div>
            </SwiperSlide>
            {/* Banner 3 */}
            <SwiperSlide>
              <div className="w-full h-full relative bg-stone-100 flex items-center justify-center cursor-pointer" onClick={() => window.location.href = '/products'}>
                <Image src="/banner3.jpg" alt="Kaashta Crafts New Arrivals" fill className="object-contain" unoptimized={true} quality={100} priority={true} />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* 3. Product Row: Best of KaashtaCrafts */}
        <div className="w-full bg-white p-4 md:p-6 rounded-2xl shadow-sm flex flex-col border border-stone-200">
          <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
            <h2 className="text-2xl font-bold font-playfair text-stone-900">Best of KaashtaCrafts</h2>
            <Link href="/products" className="w-10 h-10 rounded-full bg-amber-500 text-stone-900 flex items-center justify-center shadow-md hover:bg-amber-400 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
          
          <Swiper
            modules={[FreeMode, Mousewheel]}
            freeMode={true}
            mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
            grabCursor={true}
            simulateTouch={true}
            slidesPerView={1.5}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 5.5 },
            }}
            className="w-full pb-4"
          >
            {trendingProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <Link href={`/products/${product.id}`} className="flex flex-col group border border-stone-100 rounded-xl p-4 hover:shadow-xl transition-all duration-300 bg-white h-full hover:border-amber-500">
                  <div className="relative w-full aspect-[4/5] bg-stone-50 rounded-lg mb-4 overflow-hidden">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-stone-800 line-clamp-1 mb-1 group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-stone-900">₹{product.price}</span>
                    <span className="text-xs text-stone-400 line-through">₹{Math.floor(product.price * 1.4)}</span>
                    <span className="text-xs font-bold text-emerald-600">40% off</span>
                  </div>
                  <p className="text-xs font-medium text-amber-700 bg-amber-50 w-fit px-2 py-1 rounded-md">Free delivery</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>


        {/* 5. Product Row: Trending Deals */}
        <div className="w-full bg-white p-4 md:p-6 rounded-2xl shadow-sm flex flex-col border border-stone-200">
          <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
            <h2 className="text-2xl font-bold font-playfair text-stone-900">Top Deals on Curated Items</h2>
            <Link href="/products" className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-md hover:bg-stone-800 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
          
          <Swiper
            modules={[FreeMode, Mousewheel]}
            freeMode={true}
            mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
            grabCursor={true}
            simulateTouch={true}
            slidesPerView={1.5}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 5.5 },
            }}
            className="w-full pb-4"
          >
            {newArrivals.map((product) => (
              <SwiperSlide key={product.id}>
                <Link href={`/products/${product.id}`} className="flex flex-col group border border-stone-100 rounded-xl p-4 hover:shadow-xl transition-all duration-300 bg-white h-full relative hover:border-amber-500">
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-br-lg z-10 uppercase tracking-widest shadow-sm">HOT DEAL</div>
                  <div className="relative w-full aspect-[4/5] bg-stone-50 rounded-lg mb-4 overflow-hidden">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-stone-800 line-clamp-1 mb-1 group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-stone-900">₹{product.price}</span>
                    <span className="text-xs text-stone-400 line-through">₹{Math.floor(product.price * 1.6)}</span>
                  </div>
                  <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 w-fit px-2 py-1 rounded-md uppercase tracking-wide">Special Price</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </main>
  );
}