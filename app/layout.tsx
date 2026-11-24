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
  title: "KaashtaCrafts | Luxury Handcrafted Wooden Masterpieces",
  description: "Artisanal wooden living, executive office suites, and heirloom dining sculptures handcrafted with pride in Tamil Nadu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans text-[#241710] bg-[#F8F5EF] dark:bg-[#140F0C] dark:text-[#F8F5EF] selection:bg-[#C69A4B] selection:text-[#241710] transition-colors duration-300">
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
