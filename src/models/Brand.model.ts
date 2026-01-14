import { IBrand } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';

export interface IBrandDocument extends Omit<IBrand, '_id'>, Document {
	createdAt: Date;
	updatedAt: Date;
}

const brandSchema = new Schema<IBrandDocument>(
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

export const Brand = mongoose.model<IBrandDocument>('Brand', brandSchema);
