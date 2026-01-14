import { Router } from 'express';
import { asyncHandler } from '@/middleware';
import { Asset, AssetRequest, Purchase } from '@/models';

const router = Router();

// GET /dashboard-statics - Get dashboard statistics
router.get('/statics', asyncHandler(async (req, res) => {
  // Get total quantity from assets
  const quantityResult = await Asset.aggregate([
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: { $toInt: '$quantity' } },
      },
    },
  ]);

  const totalQuantity = quantityResult[0]?.totalQuantity || 0;

  // Get approved and pending counts
  const approvedCount = await AssetRequest.countDocuments({
    status: 'approved',
  });
  const pendingCount = await AssetRequest.countDocuments({
    status: 'pending',
  });

  // Get purchase statistics
  const purchaseResult = await Purchase.aggregate([
    {
      $group: {
        _id: null,
        totalPurchasePrice: { $sum: '$purchasePrice' },
        totalDueAmount: { $sum: '$dueAmount' },
      },
    },
  ]);

  const totalPurchasePrice = purchaseResult[0]?.totalPurchasePrice || 0;
  const totalDueAmount = purchaseResult[0]?.totalDueAmount || 0;

  res.json({
    success: true,
    data: {
      totalQuantity,
      approvedCount,
      pendingCount,
      totalPurchasePrice,
      totalDueAmount,
    },
  });
}));

export default router;