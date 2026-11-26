"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Loader2, Printer } from "lucide-react";

export default function InvoicePage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-gray-500">Order not found.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] py-12 font-sans text-[#241812] print:bg-white print:py-0">
      
      {/* Non-printable action bar */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-end print:hidden px-4">
        <button 
          onClick={handlePrint}
          className="bg-[#241812] hover:bg-[#65452F] text-[#F7F5F0] px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#C49A50]" /> Print Official Invoice
        </button>
      </div>

      {/* Invoice Document */}
      <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-3xl border border-[#EAE1D2] shadow-xl shadow-[#241812]/5 print:shadow-none print:p-0 print:border-none print:rounded-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#EAE1D2] pb-8 mb-8">
          <div className="flex items-center gap-4">
            <Image src="/logo-circle.png" alt="Logo" width={60} height={60} className="rounded-full shadow-sm border border-[#EAE1D2]" />
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-[#241812]">Kaashta Crafts</h1>
              <p className="text-xs uppercase tracking-widest text-[#82786E] mt-0.5">Crafting Memories in Wood</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-serif font-bold text-[#C49A50] uppercase tracking-widest mb-1">TAX INVOICE</h2>
            <p className="text-xs font-mono font-bold text-[#241812]">#{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-[#82786E] mt-0.5">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-[10px] font-bold text-[#82786E] uppercase tracking-widest mb-2">Billed & Shipped To:</h3>
            <p className="font-serif font-bold text-base text-[#241812] mb-1">{order.customerName}</p>
            {order.email && <p className="text-xs text-[#82786E] mb-1">{order.email}</p>}
            <p className="text-xs text-[#82786E] mb-1">{order.phone}</p>
            <p className="text-xs text-[#82786E] whitespace-pre-line leading-relaxed">{order.address}</p>
            <p className="text-xs text-[#82786E]">{order.city} - {order.pincode}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-[#82786E] uppercase tracking-widest mb-2">Dispatched From Guild:</h3>
            <p className="font-serif font-bold text-base text-[#241812] mb-1">Kaashta Crafts Studio</p>
            <p className="text-xs text-[#82786E] mb-1">123 Artisan Guildway, Craftsville</p>
            <p className="text-xs text-[#82786E] mb-1">Chennai, Tamil Nadu - 600001</p>
            <p className="text-xs text-[#82786E]">concierge@kaashtacrafts.com</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#241812]">
                <th className="py-3 px-2 font-bold text-[11px] uppercase tracking-wider text-[#82786E]">Item Description</th>
                <th className="py-3 px-2 font-bold text-[11px] uppercase tracking-wider text-[#82786E] text-center">Qty</th>
                <th className="py-3 px-2 font-bold text-[11px] uppercase tracking-wider text-[#82786E] text-right">Price</th>
                <th className="py-3 px-2 font-bold text-[11px] uppercase tracking-wider text-[#82786E] text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-[#EAE1D2] last:border-0">
                  <td className="py-4 px-2">
                    <p className="font-medium text-sm text-[#241812]">{item.name}</p>
                    {item.customization?.text && (
                      <p className="text-[11px] font-semibold text-[#8B5A2B] mt-0.5">
                        ✒️ Laser Engraving: "{item.customization.text}" ({[item.customization.font, item.customization.size].filter(Boolean).join(" • ") || 'Royal Calligraphy'})
                      </p>
                    )}
                    <p className="text-[10px] font-mono text-[#82786E] mt-0.5">SKU: {item.productId.slice(-8)}</p>
                  </td>
                  <td className="py-4 px-2 text-center text-xs text-[#82786E]">{item.quantity}</td>
                  <td className="py-4 px-2 text-right text-xs text-[#82786E]">₹{item.price}</td>
                  <td className="py-4 px-2 text-right font-bold text-sm text-[#241812]">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-1/2 md:w-5/12">
            <div className="flex justify-between items-center py-2 border-b border-[#EAE1D2] text-xs">
              <span className="text-[#82786E]">Subtotal</span>
              <span className="font-semibold text-[#241812]">₹{order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)}</span>
            </div>
            
            {order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) > order.totalAmount && (
              <div className="flex justify-between items-center py-2 border-b border-[#EAE1D2] text-xs">
                <span className="text-[#82786E]">Privilege Discount</span>
                <span className="font-semibold text-emerald-700">-₹{order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) - order.totalAmount}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-2 border-b border-[#EAE1D2] text-xs">
              <span className="text-[#82786E]">Insured Shipping</span>
              <span className="font-semibold text-emerald-700">Complimentary</span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="text-base font-serif font-bold text-[#241812]">Total Paid</span>
              <span className="text-2xl font-serif font-bold text-[#65452F]">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#EAE1D2] pt-8 text-center">
          <p className="font-serif font-bold text-sm text-[#241812] mb-1">Crafted with Honour. Built to Last Generations.</p>
          <p className="text-xs text-[#82786E]">For bespoke orders, restoration, or inquiries, contact concierge@kaashtacrafts.com</p>
        </div>

      </div>
    </div>
  );
}
