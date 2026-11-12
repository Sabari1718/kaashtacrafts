import mongoose from 'mongoose';

export interface ICartItem {
  productId: string;
  quantity: number;
}

export interface IAddress {
  _id?: string;
  label: string; // 'Home', 'Work', etc.
  name: string;
  phone: string;
  street: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  image?: string;
  cart: ICartItem[];
  wishlist: string[]; // Array of product IDs
  role: string; // 'user' or 'admin'
  phone?: string;
  address?: string; // Legacy
  city?: string; // Legacy
  pincode?: string; // Legacy
  addresses: IAddress[];
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
}

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const AddressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  cart: [CartItemSchema],
  wishlist: [{ type: String }],
  role: { type: String, default: 'user' },
  phone: { type: String }, // Keep for legacy
  address: { type: String }, // Keep for legacy
  city: { type: String }, // Keep for legacy
  pincode: { type: String }, // Keep for legacy
  addresses: [AddressSchema],
  otp: { type: String },
  otpExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
