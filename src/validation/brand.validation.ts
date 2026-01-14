import { z } from 'zod';

// Brand validation schemas
export const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  description: z.string().optional(),
});

export const updateBrandSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Brand ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Brand name is required').optional(),
    description: z.string().optional(),
  }),
});

export const getBrandSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Brand ID is required'),
  }),
});

export const deleteBrandSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Brand ID is required'),
  }),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type GetBrandInput = z.infer<typeof getBrandSchema>;
export type DeleteBrandInput = z.infer<typeof deleteBrandSchema>;