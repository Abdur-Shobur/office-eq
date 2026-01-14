import { IAsset } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';

export interface IAssetDocument extends Omit<IAsset, '_id'>, Document {
	createdAt: Date;
	updatedAt: Date;
}

const assetSchema = new Schema<IAssetDocument>(
	{
		name: {
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
		brand: {
			type: String,
		},
		quantity: {
			type: Number,
			required: true,
			min: 0,
		},
		unit: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		assetIds: [
			{
				type: String,
			},
		],
		assignedToEmail: {
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
assetSchema.index({ category: 1, subcategory: 1 });
assetSchema.index({ name: 1 });
assetSchema.index({ assignedToEmail: 1 });

export const Asset = mongoose.model<IAssetDocument>('Asset', assetSchema);
