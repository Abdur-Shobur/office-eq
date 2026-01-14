import { Router } from 'express';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
  deleteCategorySchema,
} from '@/validation';
import { validate, asyncHandler } from '@/middleware';
import { Category } from '@/models';
import { NotFoundError } from '@/utils/AppError';

const router = Router();

// GET /categories - Get all categories
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find().select('-__v');
  res.json({
    success: true,
    data: categories,
  });
}));

// POST /categories - Create category
router.post(
  '/',
  validate(createCategorySchema),
  asyncHandler(async (req, res) => {
    const categoryData = {
      ...req.body,
      createdAt: new Date(),
    };

    const category = new Category(categoryData);
    const result = await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: result,
    });
  })
);

// GET /categories/:id - Get single category
router.get(
  '/:id',
  validate(getCategorySchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      throw new NotFoundError('Category');
    }

    res.json({
      success: true,
      data: category,
    });
  })
);

// PATCH /categories/:id - Update category
router.patch(
  '/:id',
  validate(updateCategorySchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    const result = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      throw new NotFoundError('Category');
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: result,
    });
  })
);

// DELETE /categories/:id - Delete category
router.delete(
  '/:id',
  validate(deleteCategorySchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await Category.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundError('Category');
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  })
);

export default router;