import { z } from 'zod';

// Asset Request validation schemas
export const createAssetRequestSchema = z.object({
  body: z.object({
    userEmail: z.string().email('Invalid email format'),
    productId: z.string().min(1, 'Product ID is required'),
    productName: z.string().min(1, 'Product name is required'),
    category: z.string().min(1, 'Category is required'),
    subcategory: z.string().min(1, 'Subcategory is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unit: z.string().min(1, 'Unit is required'),
    message: z.string().optional(),
  }),
});

export const approveAssetRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Request ID is required'),
  }),
  body: z.object({
    approvedBy: z.string().email('Invalid email format'),
  }),
});

export const createAndApproveAssetRequestSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    productName: z.string().min(1, 'Product name is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    productIds: z.array(z.string()).min(1, 'Product IDs array is required'),
    userEmail: z.string().email('Invalid email format'),
    approvedBy: z.string().email('Invalid email format'),
    message: z.string().optional(),
  }),
});

export const updateAssetRequestStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Request ID is required'),
  }),
  body: z.object({
    status: z.enum(['approved', 'rejected'], {
      errorMap: () => ({ message: 'Status must be either approved or rejected' }),
    }),
    approvedBy: z.string().email('Invalid email format').optional(),
    approvedByName: z.string().optional(),
    reason: z.string().optional(),
    productId: z.string().min(1, 'Product ID is required').optional(),
    productName: z.string().min(1, 'Product name is required').optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1').optional(),
    productIds: z.array(z.string()).optional(),
    message: z.string().optional(),
  }),
});

export const getAssetRequestByUserSchema = z.object({
  params: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export const getAssetRequestDetailsSchema = z.object({
  params: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export type CreateAssetRequestInput = z.infer<typeof createAssetRequestSchema>;
export type ApproveAssetRequestInput = z.infer<typeof approveAssetRequestSchema>;
export type CreateAndApproveAssetRequestInput = z.infer<typeof createAndApproveAssetRequestSchema>;
export type UpdateAssetRequestStatusInput = z.infer<typeof updateAssetRequestStatusSchema>;
export type GetAssetRequestByUserInput = z.infer<typeof getAssetRequestByUserSchema>;
export type GetAssetRequestDetailsInput = z.infer<typeof getAssetRequestDetailsSchema>;