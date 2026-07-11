import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KaashtaCrafts | Premium Wooden Creations",
  description: "Handcrafted wooden products designed with passion and precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans text-stone-800 bg-stone-50 selection:bg-amber-900 selection:text-white">
        <Providers>
          <CartProvider>
            <WishlistProvider>
              <Toaster position="top-center" richColors />
              {/* Global Navbar */}
              <Navbar />

              {/* Page Content */}
              <div className="flex-grow">
                {children}
              </div>

              {/* Global Footer */}
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
