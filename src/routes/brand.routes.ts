import { asyncHandler, validate } from '@/middleware';
import { Brand } from '@/models';
import { NotFoundError } from '@/utils/AppError';
import {
	createBrandSchema,
	deleteBrandSchema,
	getBrandSchema,
	updateBrandSchema,
} from '@/validation';
import { Router } from 'express';

const router = Router();

// GET /brands - Get all brands
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const brands = await Brand.find().select('-__v');
		res.json({
			success: true,
			data: brands,
		});
	})
);

// POST /brands - Create brand
router.post(
	'/',
	validate(createBrandSchema),
	asyncHandler(async (req, res) => {
		const brandData = {
			...req.body,
			createdAt: new Date(),
		};

		const brand = new Brand(brandData);
		const result = await brand.save();

		res.status(201).json({
			success: true,
			message: 'Brand created successfully',
			data: result,
		});
	})
);

// GET /brands/:id - Get single brand
router.get(
	'/:id',
	validate(getBrandSchema),
	asyncHandler(async (req, res) => {
		const { id } = req.params;
		const brand = await Brand.findById(id);

		if (!brand) {
			throw new NotFoundError('Brand');
		}

		res.json({
			success: true,
			data: brand,
		});
	})
);

// PATCH /brands/:id - Update brand
router.patch(
	'/:id',
	validate(updateBrandSchema),
	asyncHandler(async (req, res) => {
		const { id } = req.params;
		const updateData = {
			...req.body,
			updatedAt: new Date(),
		};

		const result = await Brand.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});

		if (!result) {
			throw new NotFoundError('Brand');
		}

		res.json({
			success: true,
			message: 'Brand updated successfully',
			data: result,
		});
	})
);

// DELETE /brands/:id - Delete brand
router.delete(
	'/:id',
	validate(deleteBrandSchema),
	asyncHandler(async (req, res) => {
		const { id } = req.params;
		const result = await Brand.findByIdAndDelete(id);

		if (!result) {
			throw new NotFoundError('Brand');
		}

		res.json({
			success: true,
			message: 'Brand deleted successfully',
		});
	})
);

export default router;
