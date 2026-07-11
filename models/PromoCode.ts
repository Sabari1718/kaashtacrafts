import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPromoCode extends Document {
  code: string;
  discountPercentage: number;
  isActive: boolean;
  expiryDate?: Date;
  usageCount: number;
  maxUsage?: number;
  createdAt: Date;
}

const PromoCodeSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercentage: { type: Number, required: true, min: 1, max: 100 },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date },
  usageCount: { type: Number, default: 0 },
  maxUsage: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const PromoCode: Model<IPromoCode> = mongoose.models.PromoCode || mongoose.model<IPromoCode>("PromoCode", PromoCodeSchema);

export default PromoCode;
