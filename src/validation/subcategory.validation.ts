import { z } from 'zod';

// Subcategory validation schemas
export const createSubcategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Subcategory name is required'),
    categoryId: z.string().min(1, 'Category ID is required'),
    description: z.string().optional(),
  }),
});

export const updateSubcategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Subcategory ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Subcategory name is required').optional(),
    categoryId: z.string().min(1, 'Category ID is required').optional(),
    description: z.string().optional(),
  }),
});

export const getSubcategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Subcategory ID is required'),
  }),
});

export const deleteSubcategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Subcategory ID is required'),
  }),
});

export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
export type UpdateSubcategoryInput = z.infer<typeof updateSubcategorySchema>;
export type GetSubcategoryInput = z.infer<typeof getSubcategorySchema>;
export type DeleteSubcategoryInput = z.infer<typeof deleteSubcategorySchema>;