import { Router } from 'express';
import {
  createSubcategorySchema,
  updateSubcategorySchema,
  getSubcategorySchema,
  deleteSubcategorySchema,
} from '@/validation';
import { validate, asyncHandler } from '@/middleware';
import { Subcategory } from '@/models';
import { NotFoundError } from '@/utils/AppError';

const router = Router();

// GET /subcategories - Get all subcategories
router.get('/', asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.find().select('-__v');
  res.json({
    success: true,
    data: subcategories,
  });
}));

// POST /subcategories - Create subcategory
router.post(
  '/',
  validate(createSubcategorySchema),
  asyncHandler(async (req, res) => {
    const subcategoryData = {
      ...req.body,
      createdAt: new Date(),
    };

    const subcategory = new Subcategory(subcategoryData);
    const result = await subcategory.save();

    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: result,
    });
  })
);

// GET /subcategories/:id - Get single subcategory
router.get(
  '/:id',
  validate(getSubcategorySchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      throw new NotFoundError('Subcategory');
    }

    res.json({
      success: true,
      data: subcategory,
    });
  })
);

// PATCH /subcategories/:id - Update subcategory
router.patch(
  '/:id',
  validate(updateSubcategorySchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    const result = await Subcategory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      throw new NotFoundError('Subcategory');
    }

    res.json({
      success: true,
      message: 'Subcategory updated successfully',
      data: result,
    });
  })
);

// DELETE /subcategories/:id - Delete subcategory
router.delete(
  '/:id',
  validate(deleteSubcategorySchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await Subcategory.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundError('Subcategory');
    }

    res.json({
      success: true,
      message: 'Subcategory deleted successfully',
    });
  })
);

export default router;