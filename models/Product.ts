import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  usageImages?: string[];
  inStock: boolean;
  featured: boolean;
  reviews: IReview[];
  rating: number;
  numReviews: number;
  createdAt: Date;
}

const ReviewSchema = new Schema({
  user: { type: String, required: true }, // Can be user email or ID
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  usageImages: [{ type: String }],
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  reviews: [ReviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
