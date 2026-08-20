"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-stone-950 dark:bg-black text-stone-400 py-12 px-6 border-t border-stone-800 dark:border-stone-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 text-stone-100 text-xl font-playfair font-bold">
          <Image src="/logo.jpeg" alt="Logo" width={32} height={32} className="rounded-md opacity-90" />
          KaashtaCrafts
        </div>
        <div className="flex gap-8 text-sm">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
        </div>
        <p className="text-sm text-stone-500">
          © {new Date().getFullYear()} KaashtaCrafts. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
