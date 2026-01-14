import mongoose, { Document, Schema } from 'mongoose';
import { IVendor } from '@/types';

export interface IVendorDocument extends Omit<IVendor, '_id'>, Document {
	createdAt: Date;
	updatedAt: Date;
}

const vendorSchema = new Schema<IVendorDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    companyName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    address: {
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
vendorSchema.index({ name: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ email: 1 });

export const Vendor = mongoose.model<IVendorDocument>('Vendor', vendorSchema);