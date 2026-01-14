import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from '@/types';

export interface ICategoryDocument extends Omit<ICategory, '_id'>, Document {
	createdAt: Date;
	updatedAt: Date;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better performance
// name field already has unique index

export const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);