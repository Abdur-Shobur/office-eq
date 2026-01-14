import { z } from 'zod';

// Asset validation schemas
export const createAssetSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Asset name is required'),
    category: z.string().min(1, 'Category is required'),
    subcategory: z.string().min(1, 'Subcategory is required'),
    brand: z.string().optional(),
    quantity: z.number().min(0, 'Quantity must be non-negative'),
    unit: z.string().min(1, 'Unit is required'),
    description: z.string().optional(),
    assetIds: z.array(z.string()).optional(),
  }),
});

export const updateAssetSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Asset ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Asset name is required').optional(),
    category: z.string().min(1, 'Category is required').optional(),
    subcategory: z.string().min(1, 'Subcategory is required').optional(),
    brand: z.string().optional(),
    quantity: z.number().min(0, 'Quantity must be non-negative').optional(),
    unit: z.string().min(1, 'Unit is required').optional(),
    description: z.string().optional(),
    assetIds: z.array(z.string()).optional(),
  }),
});

export const getAssetSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Asset ID is required'),
  }),
});

export const deleteAssetSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Asset ID is required'),
  }),
});

export const getAssetIdsSchema = z.object({
  params: z.object({
    productId: z.string().min(1, 'Product ID is required'),
  }),
});

export const getAvailableIdsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Asset ID is required'),
  }),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
export type GetAssetInput = z.infer<typeof getAssetSchema>;
export type DeleteAssetInput = z.infer<typeof deleteAssetSchema>;
export type GetAssetIdsInput = z.infer<typeof getAssetIdsSchema>;
export type GetAvailableIdsInput = z.infer<typeof getAvailableIdsSchema>;