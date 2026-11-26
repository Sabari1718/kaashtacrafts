import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  order: number;
  createdAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
