import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '@/types';

export interface IUserDocument extends Omit<IUser, '_id' | 'id'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['admin', 'office-user'],
      default: 'office-user',
    },
    photoPath: {
      type: String,
    },
    department: {
      type: String,
    },
    position: {
      type: String,
    },
    phone: {
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
userSchema.index({ role: 1 });

export const User = mongoose.model<IUserDocument>('User', userSchema);