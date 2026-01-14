import { IAssetRequest } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';

export interface IAssetRequestDocument extends Omit<IAssetRequest, '_id'>, Document {
	createdAt: Date;
	updatedAt: Date;
}

const assetRequestSchema = new Schema<IAssetRequestDocument>(
	{
		userEmail: {
			type: String,
			required: true,
			lowercase: true,
		},
		productId: {
			type: String,
			required: true,
		},
		productName: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		subcategory: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		unit: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
		sentDate: {
			type: Date,
			default: Date.now,
		},
		approvedBy: {
			type: String,
		},
		approvedByName: {
			type: String,
		},
		approvedAt: {
			type: Date,
		},
		rejectReason: {
			type: String,
		},
		message: {
			type: String,
		},
		productIds: [
			{
				type: String,
			},
		],
		requestDate: {
			type: Date,
			default: Date.now,
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
assetRequestSchema.index({ userEmail: 1 });
assetRequestSchema.index({ status: 1 });
assetRequestSchema.index({ productId: 1 });
assetRequestSchema.index({ sentDate: -1 });

export const AssetRequest = mongoose.model<IAssetRequestDocument>(
	'AssetRequest',
	assetRequestSchema
);
