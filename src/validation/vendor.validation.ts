import { z } from 'zod';

// Vendor validation schemas
export const createVendorSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Vendor name is required'),
    status: z.enum(['active', 'inactive']).default('active'),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    address: z.string().optional(),
  }),
});

export const updateVendorSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Vendor ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Vendor name is required').optional(),
    status: z.enum(['active', 'inactive']).optional(),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    address: z.string().optional(),
  }),
});

export const getVendorSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Vendor ID is required'),
  }),
});

export const deleteVendorSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Vendor ID is required'),
  }),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
export type GetVendorInput = z.infer<typeof getVendorSchema>;
export type DeleteVendorInput = z.infer<typeof deleteVendorSchema>;