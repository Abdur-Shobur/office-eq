import { Router } from 'express';
import {
  createPurchaseSchema,
  updatePurchaseSchema,
  getPurchaseSchema,
  deletePurchaseSchema,
  getPurchaseAssetIdsSchema,
} from '@/validation';
import { validate, asyncHandler } from '@/middleware';
import { Purchase, Asset, Vendor } from '@/models';
import { NotFoundError, AppError } from '@/utils/AppError';

const router = Router();

// GET /purchases - Get all purchases with vendor info
router.get('/', asyncHandler(async (req, res) => {
  const purchases = await Purchase.aggregate([
    {
      $lookup: {
        from: 'vendors',
        localField: 'vendorId',
        foreignField: '_id',
        as: 'vendor',
      },
    },
    {
      $unwind: {
        path: '$vendor',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  res.json({
    success: true,
    data: purchases,
  });
}));

// POST /purchases - Create purchase
router.post(
  '/',
  validate(createPurchaseSchema),
  asyncHandler(async (req, res) => {
    const purchaseData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate items
    for (const purchaseItem of purchaseData.items) {
      const asset = await Asset.findById(purchaseItem.productId);
      purchaseItem.assetName = asset?.name || 'Unknown';

      // Update asset quantity
      await Asset.findByIdAndUpdate(purchaseItem.productId, {
        $inc: { quantity: Number(purchaseItem.qty) },
      });

      // Validate asset IDs
      if (
        !Array.isArray(purchaseItem.assetIds) ||
        purchaseItem.assetIds.length !== Number(purchaseItem.qty)
      ) {
        throw new AppError('Asset ID count must match quantity', 400);
      }
    }

    // Add vendor info if vendorId provided
    if (purchaseData.vendorId) {
      const vendor = await Vendor.findById(purchaseData.vendorId);
      if (vendor) {
        purchaseData.vendorName = vendor.name;
        purchaseData.vendorPhone = vendor.phone || '-';
        purchaseData.vendorAddress = vendor.address || '-';
      }
    }

    const purchase = new Purchase(purchaseData);
    const result = await purchase.save();

    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: result,
    });
  })
);

// GET /purchases/:id - Get single purchase
router.get(
  '/:id',
  validate(getPurchaseSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const purchase = await Purchase.findById(id);

    if (!purchase) {
      throw new NotFoundError('Purchase');
    }

    res.json({
      success: true,
      data: purchase,
    });
  })
);

// PATCH /purchases/:id - Update purchase
router.patch(
  '/:id',
  validate(updatePurchaseSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const existingPurchase = await Purchase.findById(id);
    if (!existingPurchase) {
      throw new NotFoundError('Purchase');
    }

    // Check if assetIds are being modified
    if (updateData.items && Array.isArray(updateData.items)) {
      for (let i = 0; i < updateData.items.length; i++) {
        const newAssetIds = updateData.items[i].assetIds || [];
        const oldAssetIds =
          (existingPurchase.items[i] && existingPurchase.items[i].assetIds) ||
          [];

        if (JSON.stringify(newAssetIds) !== JSON.stringify(oldAssetIds)) {
          throw new AppError('Asset IDs cannot be modified after purchase', 403);
        }
      }
    }

    // Adjust asset quantities if items are updated
    if (updateData.items && Array.isArray(updateData.items)) {
      // Revert old quantities
      if (existingPurchase.items && Array.isArray(existingPurchase.items)) {
        for (const oldItem of existingPurchase.items) {
          if (oldItem.productId && oldItem.qty) {
            await Asset.findByIdAndUpdate(oldItem.productId, {
              $inc: { quantity: -Number(oldItem.qty) },
            });
          }
        }
      }

      // Add new quantities
      for (const newItem of updateData.items) {
        if (newItem.productId && newItem.qty) {
          await Asset.findByIdAndUpdate(newItem.productId, {
            $inc: { quantity: Number(newItem.qty) },
          });
        }
      }
    }

    updateData.updatedAt = new Date();

    const result = await Purchase.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Purchase updated successfully',
      data: result,
    });
  })
);

// DELETE /purchases/:id - Delete purchase
router.delete(
  '/:id',
  validate(deletePurchaseSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const purchase = await Purchase.findById(id);
    if (!purchase) {
      throw new NotFoundError('Purchase');
    }

    // Revert asset quantities
    if (purchase.items && Array.isArray(purchase.items)) {
      for (const purchaseItem of purchase.items) {
        if (purchaseItem.productId && purchaseItem.qty) {
          await Asset.findByIdAndUpdate(purchaseItem.productId, {
            $inc: { quantity: -Number(purchaseItem.qty) },
          });
        }
      }
    }

    await Purchase.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Purchase deleted successfully',
    });
  })
);

// GET /purchases/asset-ids/:productId - Get asset IDs for product
router.get(
  '/asset-ids/:productId',
  validate(getPurchaseAssetIdsSchema),
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const approvedRequests = await Purchase.find({
      'items.productId': productId,
    });

    let assetIds: string[] = [];

    approvedRequests.forEach((purchase) => {
      purchase.items.forEach((item) => {
        if (item.productId === productId && Array.isArray(item.assetIds)) {
          assetIds.push(...item.assetIds);
        }
      });
    });

    res.json({
      success: true,
      data: assetIds,
    });
  })
);

export default router;