import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  body: z.object({
    id: z.string().min(1, 'ID is required'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    department: z.string().optional(),
    position: z.string().optional(),
    phone: z.string().optional(),
  }),
  file: z.object({
    filename: z.string().optional(),
  }).optional(),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    phone: z.string().optional(),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

export const getUserByEmailSchema = z.object({
  params: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export const getUserProfileSchema = z.object({
  params: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type GetUserByEmailInput = z.infer<typeof getUserByEmailSchema>;
export type GetUserProfileInput = z.infer<typeof getUserProfileSchema>;