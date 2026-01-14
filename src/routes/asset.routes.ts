import { Router } from 'express';
import {
  createAssetSchema,
  updateAssetSchema,
  getAssetSchema,
  deleteAssetSchema,
  getAssetIdsSchema,
  getAvailableIdsSchema,
} from '@/validation';
import { validate, asyncHandler } from '@/middleware';
import { Asset, AssetRequest, Purchase } from '@/models';
import { NotFoundError } from '@/utils/AppError';

const router = Router();

// GET /assets - Get all assets
router.get('/', asyncHandler(async (req, res) => {
  const assets = await Asset.find().select('-__v');
  res.json({
    success: true,
    data: assets,
  });
}));

// POST /assets - Create asset
router.post(
  '/',
  validate(createAssetSchema),
  asyncHandler(async (req, res) => {
    const asset = new Asset(req.body);
    const result = await asset.save();

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: result,
    });
  })
);

// GET /assets/:id - Get single asset
router.get(
  '/:id',
  validate(getAssetSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const asset = await Asset.findById(id);

    if (!asset) {
      throw new NotFoundError('Asset');
    }

    res.json({
      success: true,
      data: asset,
    });
  })
);

// PATCH /assets/:id - Update asset
router.patch(
  '/:id',
  validate(updateAssetSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const result = await Asset.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      throw new NotFoundError('Asset');
    }

    res.json({
      success: true,
      message: 'Asset updated successfully',
      data: result,
    });
  })
);

// DELETE /assets/:id - Delete asset
router.delete(
  '/:id',
  validate(deleteAssetSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await Asset.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundError('Asset');
    }

    res.json({
      success: true,
      message: 'Asset deleted successfully',
    });
  })
);

// GET /assets/:productId/asset-ids - Get asset IDs for a product
router.get(
  '/:productId/asset-ids',
  validate(getAssetIdsSchema),
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const asset = await Asset.findById(productId);

    if (!asset) {
      return res.json({
        success: true,
        data: [],
      });
    }

    res.json({
      success: true,
      data: asset.assetIds || [],
    });
  })
);

// GET /assets/available-ids/:id - Get available asset IDs
router.get(
  '/available-ids/:id',
  validate(getAvailableIdsSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Get all purchased asset IDs for this product
    const purchases = await Purchase.find({ 'items.productId': id });
    let allAssetIds: string[] = [];

    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        if (item.productId === id && item.assetIds) {
          allAssetIds = [...allAssetIds, ...item.assetIds];
        }
      });
    });

    if (allAssetIds.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // Get approved requests to filter out used IDs
    const approvedRequests = await AssetRequest.find({
      productId: id,
      status: 'approved',
    });

    const usedIds = approvedRequests.flatMap((req) => {
      const ids: string[] = [];
      if (req.productId) ids.push(req.productId);
      if (req.productIds && Array.isArray(req.productIds)) {
        ids.push(...req.productIds);
      }
      return ids;
    });

    const availableIds = allAssetIds.filter((id) => !usedIds.includes(id));

    res.json({
      success: true,
      data: availableIds,
    });
  })
);

export default router;