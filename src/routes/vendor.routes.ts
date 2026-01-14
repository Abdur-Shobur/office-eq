import { Router } from 'express';
import {
  createVendorSchema,
  updateVendorSchema,
  getVendorSchema,
  deleteVendorSchema,
} from '@/validation';
import { validate, asyncHandler } from '@/middleware';
import { Vendor } from '@/models';
import { NotFoundError } from '@/utils/AppError';

const router = Router();

// GET /vendors - Get all vendors
router.get('/', asyncHandler(async (req, res) => {
  const vendors = await Vendor.find().select('-__v');
  res.json({
    success: true,
    data: vendors,
  });
}));

// POST /vendors - Create vendor
router.post(
  '/',
  validate(createVendorSchema),
  asyncHandler(async (req, res) => {
    const vendorData = {
      ...req.body,
      createdAt: new Date(),
    };

    const vendor = new Vendor(vendorData);
    const result = await vendor.save();

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: result,
    });
  })
);

// GET /vendors/:id - Get single vendor
router.get(
  '/:id',
  validate(getVendorSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);

    if (!vendor) {
      throw new NotFoundError('Vendor');
    }

    res.json({
      success: true,
      data: vendor,
    });
  })
);

// PATCH /vendors/:id - Update vendor
router.patch(
  '/:id',
  validate(updateVendorSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    const result = await Vendor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      throw new NotFoundError('Vendor');
    }

    res.json({
      success: true,
      message: 'Vendor updated successfully',
      data: result,
    });
  })
);

// DELETE /vendors/:id - Delete vendor
router.delete(
  '/:id',
  validate(deleteVendorSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await Vendor.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundError('Vendor');
    }

    res.json({
      success: true,
      message: 'Vendor deleted successfully',
    });
  })
);

export default router;