import { z } from 'zod';

// Purchase validation schemas
const purchaseItemSchema = z.object({
	productId: z.string().min(1, 'Product ID is required'),
	productName: z.string().optional(),
	qty: z.number().min(1, 'Quantity must be at least 1'),
	unitPrice: z.number().min(0, 'Unit price must be non-negative'),
	totalPrice: z.number().min(0, 'Total price must be non-negative'),
	assetIds: z.array(z.string()).min(1, 'Asset IDs array is required'),
});

export const createPurchaseSchema = z.object({
	vendorId: z.string().optional(),
	vendorName: z.string().optional(),
	invoiceNo: z.string().min(1, 'Invoice number is required'),
	purchasePrice: z.number().min(0, 'Purchase price must be non-negative'),
	paidAmount: z.number().min(0, 'Paid amount must be non-negative'),
	dueAmount: z.number().min(0, 'Due amount must be non-negative'),
	items: z.array(purchaseItemSchema).min(1, 'At least one item is required'),
	createdBy: z.string().min(1, 'Created by is required'),
	updatedBy: z.string().optional(),
});

export const updatePurchaseSchema = z.object({
	params: z.object({
		id: z.string().min(1, 'Purchase ID is required'),
	}),
	body: z.object({
		vendorId: z.string().optional(),
		vendorName: z.string().optional(),
		invoiceNo: z.string().min(1, 'Invoice number is required').optional(),
		purchasePrice: z
			.number()
			.min(0, 'Purchase price must be non-negative')
			.optional(),
		paidAmount: z
			.number()
			.min(0, 'Paid amount must be non-negative')
			.optional(),
		dueAmount: z.number().min(0, 'Due amount must be non-negative').optional(),
		items: z.array(purchaseItemSchema).optional(),
		updatedBy: z.string().min(1, 'Updated by is required'),
	}),
});

export const getPurchaseSchema = z.object({
	params: z.object({
		id: z.string().min(1, 'Purchase ID is required'),
	}),
});

export const deletePurchaseSchema = z.object({
	params: z.object({
		id: z.string().min(1, 'Purchase ID is required'),
	}),
});

export const getPurchaseAssetIdsSchema = z.object({
	params: z.object({
		productId: z.string().min(1, 'Product ID is required'),
	}),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>;
export type GetPurchaseInput = z.infer<typeof getPurchaseSchema>;
export type DeletePurchaseInput = z.infer<typeof deletePurchaseSchema>;
export type GetPurchaseAssetIdsInput = z.infer<
	typeof getPurchaseAssetIdsSchema
>;
