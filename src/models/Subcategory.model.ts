import mongoose, { Document, Schema } from 'mongoose';
import { ISubcategory } from '@/types';

export interface ISubcategoryDocument extends Omit<ISubcategory, '_id'>, Document {
	createdAt: Date;
	updatedAt: Date;
}

const subcategorySchema = new Schema<ISubcategoryDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
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
subcategorySchema.index({ categoryId: 1 });
subcategorySchema.index({ name: 1 });

export const Subcategory = mongoose.model<ISubcategoryDocument>('Subcategory', subcategorySchema);