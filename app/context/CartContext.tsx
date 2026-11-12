"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Product } from "../data/products";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session, status } = useSession();

  // Load from DB or localStorage on mount
  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      // Fetch from DB
      fetch("/api/user/cart")
        .then(res => res.json())
        .then(data => {
          let dbCart = data.cart || [];
          
          // Merge local cart if exists
          const savedCart = localStorage.getItem("kaashtaCart");
          if (savedCart) {
            try {
              const localCart = JSON.parse(savedCart);
              if (localCart.length > 0) {
                // Merge logic: Add local items to dbCart if they don't exist
                localCart.forEach((localItem: any) => {
                  const exists = dbCart.find((dbItem: any) => dbItem.id === localItem.id || dbItem._id === localItem._id);
                  if (!exists) {
                    dbCart.push(localItem);
                  }
                });
                // Clear local storage after merging
                localStorage.removeItem("kaashtaCart");
                // Immediately save the merged cart back to the DB
                fetch("/api/user/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ cart: dbCart })
                }).catch(e => console.error("Failed to sync merged cart to DB", e));
              }
            } catch (e) {
              console.error("Failed to parse cart from local storage", e);
            }
          }
          
          setCartItems(dbCart);
          setIsInitialized(true);
        })
        .catch(e => {
          console.error("Failed to fetch cart from DB", e);
          setIsInitialized(true);
        });
    } else {
      // Load from local storage
      const savedCart = localStorage.getItem("kaashtaCart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart from local storage", e);
        }
      }
      setIsInitialized(true);
    }
  }, [session, status]);

  // Save to DB or localStorage whenever cartItems changes
  useEffect(() => {
    if (isInitialized) {
      if (session) {
        fetch("/api/user/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: cartItems })
        }).catch(e => console.error("Failed to save cart to DB", e));
      } else {
        localStorage.setItem("kaashtaCart", JSON.stringify(cartItems));
      }
    }
  }, [cartItems, isInitialized, session]);

  // Calculate totals
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
