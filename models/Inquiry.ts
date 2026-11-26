import mongoose from "mongoose";

export interface IInquiry extends mongoose.Document {
  name: string;
  phone: string;
  email?: string;
  type: "direct" | "bulk";
  category?: string;
  productChoice?: string;
  quantity?: string;
  customizations?: string[];
  targetDate?: string;
  message: string;
  status: string; // "New", "Contacted", "Quotation Sent", "Closed"
  createdAt: Date;
}

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: "" },
  type: { type: String, enum: ["direct", "bulk"], default: "direct" },
  category: { type: String, default: "General Product Inquiry" },
  productChoice: { type: String, default: "" },
  quantity: { type: String, default: "" },
  customizations: { type: [String], default: [] },
  targetDate: { type: String, default: "" },
  message: { type: String, required: true },
  status: { type: String, default: "New" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
