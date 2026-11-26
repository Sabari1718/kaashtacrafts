import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "KaashtaCrafts | Premium Handcrafted Wooden Creations",
  description: "Artisanal wooden living, executive office suites, and heirloom dining sculptures handcrafted with pride in Tamil Nadu.",
  icons: {
    icon: "/logo-circle.png",
    apple: "/logo-circle.png",
  },
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
      className={`${manrope.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans text-[#2B1B14] bg-white dark:bg-[#0C0A09] dark:text-[#FAF6EE] selection:bg-[#C69A4B] selection:text-[#21150F] transition-colors duration-300">
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
