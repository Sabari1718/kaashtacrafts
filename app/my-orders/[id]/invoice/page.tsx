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
    <div className="min-h-screen bg-gray-100 py-12 font-sans text-gray-900 print:bg-white print:py-0">
      
      {/* Non-printable action bar */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-end print:hidden">
        <button 
          onClick={handlePrint}
          className="bg-stone-900 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-stone-800 transition-colors shadow-sm"
        >
          <Printer className="w-5 h-5" /> Print Invoice
        </button>
      </div>

      {/* Invoice Document */}
      <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-xl shadow-lg print:shadow-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <Image src="/logo.jpeg" alt="Logo" width={60} height={60} className="rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold font-playfair tracking-tight">Kaashta Crafts</h1>
              <p className="text-sm text-gray-500 mt-1">Premium Woodworks & Crafts</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-200 uppercase tracking-widest mb-2">INVOICE</h2>
            <p className="text-sm font-medium">#{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Billed To:</h3>
            <p className="font-bold text-lg mb-1">{order.customerName}</p>
            {order.email && <p className="text-sm text-gray-600 mb-1">{order.email}</p>}
            <p className="text-sm text-gray-600 mb-1">{order.phone}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{order.address}</p>
            <p className="text-sm text-gray-600">{order.city} - {order.pincode}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Shipped From:</h3>
            <p className="font-bold mb-1">Kaashta Crafts Inc.</p>
            <p className="text-sm text-gray-600 mb-1">123 Artisan Street, Craftsville</p>
            <p className="text-sm text-gray-600 mb-1">Chennai, Tamil Nadu - 600001</p>
            <p className="text-sm text-gray-600">support@kaashtacrafts.com</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-3 px-2 font-bold text-sm uppercase tracking-wider text-gray-500">Item Description</th>
                <th className="py-3 px-2 font-bold text-sm uppercase tracking-wider text-gray-500 text-center">Qty</th>
                <th className="py-3 px-2 font-bold text-sm uppercase tracking-wider text-gray-500 text-right">Price</th>
                <th className="py-3 px-2 font-bold text-sm uppercase tracking-wider text-gray-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0">
                  <td className="py-4 px-2">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {item.productId.slice(-8)}</p>
                  </td>
                  <td className="py-4 px-2 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-4 px-2 text-right text-gray-700">₹{item.price}</td>
                  <td className="py-4 px-2 text-right font-medium">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-1/2 md:w-1/3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="font-medium">₹{order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)}</span>
            </div>
            
            {order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) > order.totalAmount && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Discount Applied</span>
                <span className="font-medium text-green-600">-₹{order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) - order.totalAmount}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Shipping</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-gray-900">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="font-medium mb-1">Thank you for your business!</p>
          <p className="text-xs text-gray-500">If you have any questions about this invoice, please contact support@kaashtacrafts.com</p>
        </div>

      </div>
    </div>
  );
}
