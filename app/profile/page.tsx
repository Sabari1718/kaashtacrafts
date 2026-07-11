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
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 font-sans pb-24">
      {/* Header Profile Banner */}
      <div className="bg-stone-950 text-white pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-stone-800 bg-stone-800 relative shadow-xl shrink-0">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-amber-500 text-stone-900 text-4xl font-bold">
                {name.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl md:text-4xl font-bold font-playfair mb-2">{name || session?.user?.name}</h1>
            <p className="text-stone-400">{session?.user?.email}</p>
          </div>
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-medium transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20 flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Column: Basic Details */}
        <div className="w-full md:w-1/3 bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-6 md:p-8 border border-stone-100 shrink-0">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Personal Details</h2>
          
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Primary Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
              </div>
            </div>
            <button 
              onClick={() => handleSaveProfile()}
              disabled={isSaving}
              className="mt-2 bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>

        {/* Right Column: Address Book */}
        <div className="w-full md:w-2/3 bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-6 md:p-8 border border-stone-100">
          <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
            <h2 className="text-xl font-bold text-stone-900">Address Book</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-amber-700 hover:text-amber-800 font-bold text-sm flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {showAddForm ? "Cancel" : <><Plus className="w-4 h-4" /> Add New</>}
            </button>
          </div>

          {/* Add New Address Form */}
          {showAddForm && (
            <form onSubmit={handleAddAddress} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="font-bold text-stone-900 mb-4">Add New Delivery Address</h3>
              
              <div className="flex gap-4 mb-6">
                {['Home', 'Work', 'Other'].map(lbl => (
                  <label key={lbl} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="label" checked={newAddress.label === lbl} onChange={() => setNewAddress({...newAddress, label: lbl})} className="text-amber-600 focus:ring-amber-500" />
                    <span className="text-sm font-medium text-stone-700">{lbl}</span>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input type="text" placeholder="Name" required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white" />
                </div>
                <div>
                  <input type="tel" placeholder="Phone Number" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white" />
                </div>
                <div className="md:col-span-2">
                  <textarea placeholder="Street Address, Area, Building" required rows={2} value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white resize-none" />
                </div>
                <div>
                  <input type="text" placeholder="City" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white" />
                </div>
                <div>
                  <input type="text" placeholder="Pincode" required value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white" />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <input type="checkbox" id="isDefault" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} className="rounded text-amber-600 focus:ring-amber-500" />
                <label htmlFor="isDefault" className="text-sm text-stone-600 cursor-pointer">Set as default delivery address</label>
              </div>

              <button type="submit" className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors">
                Save Address
              </button>
            </form>
          )}

          {/* Saved Addresses List */}
          {addresses.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <MapPin className="w-12 h-12 mx-auto text-stone-300 mb-3" />
              <p>No saved addresses yet. Add one to checkout faster.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border-2 transition-colors relative ${addr.isDefault ? 'border-amber-500 bg-amber-50/30' : 'border-stone-100 bg-white hover:border-stone-300'}`}>
                  
                  {addr.isDefault && (
                    <span className="absolute -top-3 left-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                      Default
                    </span>
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-stone-500 text-sm font-bold bg-stone-100 px-2 py-1 rounded-md">
                      {addr.label === 'Home' ? <Home className="w-4 h-4" /> : addr.label === 'Work' ? <Briefcase className="w-4 h-4" /> : <Map className="w-4 h-4" />}
                      {addr.label}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(idx)} className="text-[10px] uppercase font-bold text-stone-400 hover:text-amber-700">
                          Set Default
                        </button>
                      )}
                      <button onClick={() => handleDeleteAddress(idx)} className="text-stone-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="font-bold text-stone-900 mb-1">{addr.name}</p>
                  <p className="text-sm text-stone-600 mb-2 leading-relaxed">{addr.street}, {addr.city} - {addr.pincode}</p>
                  <p className="text-sm font-medium text-stone-700 flex items-center gap-2"><Phone className="w-3 h-3 text-stone-400" /> {addr.phone}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
