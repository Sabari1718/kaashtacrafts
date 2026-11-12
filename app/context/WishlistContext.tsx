"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Product } from "../data/products";

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session, status } = useSession();

  // Load from DB or localStorage on mount
  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      // Fetch from DB
      fetch("/api/user/wishlist")
        .then(res => res.json())
        .then(data => {
          let dbWishlist = data.wishlist || [];
          
          const savedWishlist = localStorage.getItem("kaashtaWishlist");
          if (savedWishlist) {
            try {
              const localWishlist = JSON.parse(savedWishlist);
              if (localWishlist.length > 0) {
                // Merge logic
                localWishlist.forEach((localItem: any) => {
                  const exists = dbWishlist.find((dbItem: any) => dbItem.id === localItem.id || dbItem._id === localItem._id);
                  if (!exists) {
                    dbWishlist.push(localItem);
                  }
                });
                localStorage.removeItem("kaashtaWishlist");
                fetch("/api/user/wishlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ wishlist: dbWishlist })
                }).catch(e => console.error("Failed to sync merged wishlist to DB", e));
              }
            } catch (e) {
              console.error("Failed to parse wishlist from local storage", e);
            }
          }

          setWishlistItems(dbWishlist);
          setIsInitialized(true);
        })
        .catch(e => {
          console.error("Failed to fetch wishlist from DB", e);
          setIsInitialized(true);
        });
    } else {
      const savedWishlist = localStorage.getItem("kaashtaWishlist");
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (e) {
          console.error("Failed to parse wishlist from local storage", e);
        }
      }
      setIsInitialized(true);
    }
  }, [session, status]);

  // Save to DB or localStorage whenever wishlistItems changes
  useEffect(() => {
    if (isInitialized) {
      if (session) {
        fetch("/api/user/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wishlist: wishlistItems })
        }).catch(e => console.error("Failed to save wishlist to DB", e));
      } else {
        localStorage.setItem("kaashtaWishlist", JSON.stringify(wishlistItems));
      }
    }
  }, [wishlistItems, isInitialized, session]);

  const toggleWishlist = (product: Product) => {
    setWishlistItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id || (item as any)._id === (product as any)._id);
      if (existing) {
        return prevItems.filter((item) => item.id !== product.id && (item as any)._id !== (product as any)._id);
      }
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id && (item as any)._id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id || (item as any)._id === id);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      toggleWishlist, 
      removeFromWishlist, 
      isInWishlist, 
      wishlistCount: wishlistItems.length 
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
