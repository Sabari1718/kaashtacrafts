import mongoose from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customization?: {
    text?: string;
    secondaryText?: string;
    font?: string;
    size?: string;
    position?: string;
    notes?: string;
  };
}

export interface IOrder extends mongoose.Document {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: IOrderItem[];
  totalAmount: number;
  status: string; // "Pending", "Processing", "Shipped", "Delivered"
  promoCode?: string;
  createdAt: Date;
}

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  customization: {
    text: { type: String },
    secondaryText: { type: String },
    font: { type: String },
    size: { type: String },
    position: { type: String },
    notes: { type: String },
  },
});

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  promoCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
