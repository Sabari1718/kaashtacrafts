"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { User, MapPin, Phone, Building, Save, Loader2, LogOut, Plus, Trash2, Home, Briefcase, Map } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface IAddress {
  _id?: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // Primary phone
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<IAddress>({
    label: "Home",
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
    isDefault: false
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setName(data.name || session?.user?.name || "");
        setPhone(data.phone || "");
        
        // Handle migration from legacy single address to array
        if (data.addresses && data.addresses.length > 0) {
          setAddresses(data.addresses);
        } else if (data.address && data.city && data.pincode) {
          // Has legacy address but no array
          const legacyAddress: IAddress = {
            label: "Home",
            name: data.name || session?.user?.name || "",
            phone: data.phone || "",
            street: data.address,
            city: data.city,
            pincode: data.pincode,
            isDefault: true
          };
          setAddresses([legacyAddress]);
        }
      }
    } catch (error) {
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (addressesToSave = addresses) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          addresses: addressesToSave
        })
      });

      if (res.ok) {
        toast.success("Profile saved successfully!");
        fetchProfile(); // Refresh IDs
      } else {
        toast.error("Failed to save profile");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedAddresses = [...addresses];
    
    // If it's the first address, make it default
    if (updatedAddresses.length === 0) {
      newAddress.isDefault = true;
    } else if (newAddress.isDefault) {
      // If new is default, remove default from others
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }
    
    updatedAddresses.push({ ...newAddress });
    setAddresses(updatedAddresses);
    setShowAddForm(false);
    setNewAddress({ label: "Home", name: "", phone: "", street: "", city: "", pincode: "", isDefault: false });
    
    // Auto save
    handleSaveProfile(updatedAddresses);
  };

  const handleDeleteAddress = (index: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    const updatedAddresses = [...addresses];
    const removed = updatedAddresses.splice(index, 1)[0];
    
    // If we removed the default and there are others left, make the first one default
    if (removed.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    setAddresses(updatedAddresses);
    handleSaveProfile(updatedAddresses);
  };

  const handleSetDefault = (index: number) => {
    const updatedAddresses = addresses.map((a, i) => ({
      ...a,
      isDefault: i === index
    }));
    setAddresses(updatedAddresses);
    handleSaveProfile(updatedAddresses);
  };

  if (status === "loading" || isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] dark:bg-[#121212] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C49A50]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] dark:bg-[#121212] font-sans pb-24 text-[#241812] dark:text-[#F7F5F0]">
      {/* Header Profile Banner */}
      <div className="bg-[#241812] text-[#F7F5F0] pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C49A50]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#65452F]/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-[#C49A50]/40 bg-[#1A120D] relative shadow-2xl shrink-0 p-1">
            {session?.user?.image ? (
              <div className="w-full h-full relative rounded-2xl overflow-hidden">
                <Image src={session.user.image} alt="Profile" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#65452F] to-[#241812] text-[#F7F5F0] text-4xl font-serif font-bold">
                {name.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C49A50] font-bold">Client Account</span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#F7F5F0] mt-1 mb-1">{name || session?.user?.name}</h1>
            <p className="text-[#82786E] text-sm">{session?.user?.email}</p>
          </div>
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 rounded-full font-medium text-xs tracking-wider uppercase transition-all shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20 flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Column: Basic Details */}
        <div className="w-full md:w-1/3 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-xl shadow-[#241812]/5 p-6 md:p-8 border border-[#EAE1D2] dark:border-[#2D2A26] shrink-0">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAE1D2] dark:border-[#2D2A26]">
            <h2 className="text-lg font-serif font-bold text-[#241812] dark:text-[#F7F5F0]">Personal Details</h2>
            <span className="w-2 h-2 rounded-full bg-[#C49A50]"></span>
          </div>
          
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#82786E] mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82786E] w-4 h-4" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F7F5F0] dark:bg-[#242424] border border-[#EAE1D2] dark:border-[#333333] focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 outline-none text-sm font-medium text-[#241812] dark:text-[#F7F5F0] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#82786E] mb-2">Primary Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82786E] w-4 h-4" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F7F5F0] dark:bg-[#242424] border border-[#EAE1D2] dark:border-[#333333] focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 outline-none text-sm font-medium text-[#241812] dark:text-[#F7F5F0] transition-all"
                />
              </div>
            </div>
            <button 
              onClick={() => handleSaveProfile()}
              disabled={isSaving}
              className="mt-2 bg-[#241812] dark:bg-[#C49A50] text-[#F7F5F0] dark:text-[#121212] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#65452F] dark:hover:bg-[#b0883f] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>

        {/* Right Column: Address Book */}
        <div className="w-full md:w-2/3 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-xl shadow-[#241812]/5 p-6 md:p-8 border border-[#EAE1D2] dark:border-[#2D2A26]">
          <div className="flex justify-between items-center mb-6 border-b border-[#EAE1D2] dark:border-[#2D2A26] pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#241812] dark:text-[#F7F5F0]">Address Book</h2>
              <p className="text-xs text-[#82786E] mt-0.5">Manage delivery addresses for expedited checkout</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-[#65452F] dark:text-[#C49A50] font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 bg-[#EAE1D2]/50 dark:bg-[#2A241F] hover:bg-[#EAE1D2] px-4 py-2 rounded-full transition-all cursor-pointer"
            >
              {showAddForm ? "Cancel" : <><Plus className="w-3.5 h-3.5" /> Add New</>}
            </button>
          </div>

          {/* Add New Address Form */}
          {showAddForm && (
            <form onSubmit={handleAddAddress} className="bg-[#F7F5F0] dark:bg-[#242424] p-6 rounded-3xl border border-[#EAE1D2] dark:border-[#333333] mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="font-serif font-bold text-base text-[#241812] dark:text-[#F7F5F0] mb-4">Add New Delivery Address</h3>
              
              <div className="flex gap-4 mb-6">
                {['Home', 'Work', 'Other'].map(lbl => (
                  <label key={lbl} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#241812] dark:text-[#F7F5F0]">
                    <input type="radio" name="label" checked={newAddress.label === lbl} onChange={() => setNewAddress({...newAddress, label: lbl})} className="accent-[#C49A50] w-4 h-4 cursor-pointer" />
                    <span>{lbl}</span>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input type="text" placeholder="Full Name" required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-[#EAE1D2] dark:border-[#3D3A36] bg-white dark:bg-[#1A1A1A] focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 outline-none text-xs text-[#241812] dark:text-[#F7F5F0]" />
                </div>
                <div>
                  <input type="tel" placeholder="Phone Number" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-[#EAE1D2] dark:border-[#3D3A36] bg-white dark:bg-[#1A1A1A] focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 outline-none text-xs text-[#241812] dark:text-[#F7F5F0]" />
                </div>
                <div className="md:col-span-2">
                  <textarea placeholder="Street Address, Building, Apartment" required rows={2} value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-[#EAE1D2] dark:border-[#3D3A36] bg-white dark:bg-[#1A1A1A] focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 outline-none text-xs text-[#241812] dark:text-[#F7F5F0] resize-none" />
                </div>
                <div>
                  <input type="text" placeholder="City" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-[#EAE1D2] dark:border-[#3D3A36] bg-white dark:bg-[#1A1A1A] focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 outline-none text-xs text-[#241812] dark:text-[#F7F5F0]" />
                </div>
                <div>
                  <input type="text" placeholder="Pincode" required value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-[#EAE1D2] dark:border-[#3D3A36] bg-white dark:bg-[#1A1A1A] focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 outline-none text-xs text-[#241812] dark:text-[#F7F5F0]" />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <input type="checkbox" id="isDefault" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} className="accent-[#C49A50] rounded w-4 h-4 cursor-pointer" />
                <label htmlFor="isDefault" className="text-xs text-[#82786E] cursor-pointer">Set as default delivery address</label>
              </div>

              <button type="submit" className="w-full bg-[#241812] hover:bg-[#65452F] text-[#F7F5F0] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer">
                Save Address
              </button>
            </form>
          )}

          {/* Saved Addresses List */}
          {addresses.length === 0 ? (
            <div className="text-center py-16 text-[#82786E]">
              <MapPin className="w-12 h-12 mx-auto text-[#EAE1D2] mb-3" />
              <p className="text-sm font-medium">No saved addresses yet.</p>
              <p className="text-xs text-[#82786E] mt-1">Add your shipping details for rapid checkout.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr, idx) => (
                <div key={idx} className={`p-5 rounded-3xl border transition-all relative ${addr.isDefault ? 'border-[#C49A50] bg-[#C49A50]/5 shadow-sm' : 'border-[#EAE1D2] dark:border-[#2D2A26] bg-[#F7F5F0]/50 dark:bg-[#202020] hover:border-[#65452F]/40'}`}>
                  
                  {addr.isDefault && (
                    <span className="absolute -top-2.5 left-4 bg-[#C49A50] text-[#241812] text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                      Default Address
                    </span>
                  )}

                  <div className="flex justify-between items-start mb-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#65452F] dark:text-[#C49A50] bg-[#EAE1D2]/60 dark:bg-[#2D2620] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {addr.label === 'Home' ? <Home className="w-3.5 h-3.5" /> : addr.label === 'Work' ? <Briefcase className="w-3.5 h-3.5" /> : <Map className="w-3.5 h-3.5" />}
                      {addr.label}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(idx)} className="text-[10px] uppercase font-bold text-[#82786E] hover:text-[#C49A50] tracking-wider transition-colors cursor-pointer">
                          Set Default
                        </button>
                      )}
                      <button onClick={() => handleDeleteAddress(idx)} className="text-[#82786E] hover:text-red-500 transition-colors cursor-pointer p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-serif font-bold text-sm text-[#241812] dark:text-[#F7F5F0] mb-1">{addr.name}</p>
                  <p className="text-xs text-[#82786E] mb-3 leading-relaxed">{addr.street}, {addr.city} - {addr.pincode}</p>
                  <p className="text-xs font-medium text-[#241812] dark:text-[#F7F5F0] flex items-center gap-2"><Phone className="w-3 h-3 text-[#C49A50]" /> {addr.phone}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
