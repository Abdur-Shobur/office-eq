import mongoose, { Document, Schema } from 'mongoose';
import { IPurchase, IPurchaseItem } from '@/types';

export interface IPurchaseDocument extends Omit<IPurchase, '_id'>, Document {
	createdAt: Date;
	updatedAt: Date;
}

const purchaseItemSchema = new Schema<IPurchaseItem>({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
  },
  assetName: {
    type: String,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  assetIds: [{
    type: String,
    required: true,
  }],
});

const purchaseSchema = new Schema<IPurchaseDocument>(
  {
    vendorId: {
      type: String,
    },
    vendorName: {
      type: String,
    },
    vendorPhone: {
      type: String,
    },
    vendorAddress: {
      type: String,
    },
    invoiceNo: {
      type: String,
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    items: [purchaseItemSchema],
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
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
purchaseSchema.index({ vendorId: 1 });
purchaseSchema.index({ invoiceNo: 1 });
purchaseSchema.index({ createdAt: -1 });
purchaseSchema.index({ 'items.productId': 1 });

export const Purchase = mongoose.model<IPurchaseDocument>('Purchase', purchaseSchema);