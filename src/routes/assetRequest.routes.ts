import { asyncHandler, validate } from '@/middleware';
import { Asset, AssetRequest, User } from '@/models';
import { AppError, NotFoundError } from '@/utils/AppError';
import {
	approveAssetRequestSchema,
	createAndApproveAssetRequestSchema,
	createAssetRequestSchema,
	getAssetRequestByUserSchema,
	getAssetRequestDetailsSchema,
	updateAssetRequestStatusSchema,
} from '@/validation';
import { Router } from 'express';

const router = Router();

// GET /assets-request - Get all asset requests with user and asset info
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const requests = await AssetRequest.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'userEmail',
					foreignField: 'email',
					as: 'userInfo',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'approvedBy',
					foreignField: 'email',
					as: 'approvedByInfo',
				},
			},
			{
				$unwind: {
					path: '$userInfo',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$approvedByInfo',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$sort: { sentDate: -1 },
			},
		]);

		res.json({
			success: true,
			data: requests,
		});
	})
);

// POST /assets-request - Create asset request
router.post(
	'/',
	validate(createAssetRequestSchema),
	asyncHandler(async (req, res) => {
		const requestData = {
			...req.body,
			status: 'pending',
			sentDate: new Date(),
		};

		const request = new AssetRequest(requestData);
		const result = await request.save();

		res.status(201).json({
			success: true,
			message: 'Asset request created successfully',
			data: result,
		});
	})
);

// PATCH /assets-request/approve/:id - Approve asset request
router.patch(
	'/approve/:id',
	validate(approveAssetRequestSchema),
	asyncHandler(async (req, res) => {
		const { id } = req.params;
		const { approvedBy } = req.body;

		const request = await AssetRequest.findById(id);
		if (!request) {
			throw new NotFoundError('Asset request');
		}

		if (request.status === 'approved') {
			throw new AppError('Request already approved', 400);
		}

		const asset = await Asset.findById(request.productId);
		if (!asset) {
			throw new NotFoundError('Asset');
		}

		const requestedQty = Number(request.quantity);
		const availableQty = Number(asset.quantity);

		if (requestedQty > availableQty) {
			throw new AppError('Not enough stock for this asset', 400);
		}

		// Approve request
		const updateResult = await AssetRequest.findByIdAndUpdate(id, {
			status: 'approved',
			approvedBy,
			approvedAt: new Date(),
		});

		// Decrease asset quantity
		await Asset.findByIdAndUpdate(request.productId, {
			$inc: { quantity: -requestedQty },
		});

		// Send email notification (implement email service)
		// await sendApprovalEmail(request, user, approvedBy);

		res.json({
			success: true,
			message: 'Request approved successfully',
			modifiedCount: updateResult ? 1 : 0,
		});
	})
);

// POST /assets-request/admin/create-and-approve - Create and approve asset request
router.post(
	'/admin/create-and-approve',
	validate(createAndApproveAssetRequestSchema),
	asyncHandler(async (req, res) => {
		const {
			productId,
			productName,
			quantity,
			productIds,
			userEmail,
			approvedBy,
			message,
		} = req.body;

		if (!Array.isArray(productIds) || productIds.length !== quantity) {
			throw new AppError('Product IDs count mismatch', 400);
		}

		const uniqueIds = new Set(productIds);
		if (uniqueIds.size !== productIds.length) {
			throw new AppError('Duplicate Product ID not allowed', 400);
		}

		// Create approved request record
		const request = new AssetRequest({
			productId,
			productName: productName || 'Unnamed Asset',
			productIds,
			quantity,
			userEmail,
			approvedBy,
			message: message || '',
			status: 'approved',
			sentDate: new Date(),
			approvedAt: new Date(),
		});

		await request.save();

		// Update asset collection
		await Asset.findByIdAndUpdate(productId, {
			$inc: { quantity: -quantity },
			$pull: { assetIds: { $in: productIds } },
		});

		// Send email notification
		const user = await User.findOne({ email: userEmail });
		if (user?.email) {
			// Implement email sending
			// await sendAssetAssignedEmail(user, request);
		}

		res.json({
			success: true,
			message: 'Assets created and assigned successfully',
		});
	})
);

// PATCH /assets-request/status/:id - Update request status
router.patch(
	'/status/:id',
	validate(updateAssetRequestStatusSchema),
	asyncHandler(async (req, res) => {
		const { id } = req.params;
		const {
			status,
			approvedBy,
			approvedByName,
			reason,
			productId,
			productName,
			quantity,
			productIds,
			message,
		} = req.body;

		const request = await AssetRequest.findById(id);
		if (!request) {
			throw new NotFoundError('Asset request');
		}

		const user = await User.findOne({ email: request.userEmail });

		if (status === 'approved') {
			if (!productId || !productIds || !Array.isArray(productIds)) {
				throw new AppError(
					'productId and productIds array are required for approval',
					400
				);
			}

			const finalQuantity = quantity || request.quantity || productIds.length;

			if (productIds.length !== finalQuantity) {
				throw new AppError(`Product IDs count must match quantity`, 400);
			}

			const uniqueIds = new Set(productIds);
			if (uniqueIds.size !== productIds.length) {
				throw new AppError('Duplicate Product ID not allowed', 400);
			}

			// Update asset collection
			await Asset.findByIdAndUpdate(productId, {
				$inc: { quantity: -finalQuantity },
				$pull: { assetIds: { $in: productIds } },
			});

			// Update request
			await AssetRequest.findByIdAndUpdate(id, {
				status: 'approved',
				approvedBy: approvedBy || approvedByName,
				approvedByName: approvedByName || approvedBy,
				rejectReason: null,
				updatedAt: new Date(),
				productId,
				productName: productName || request.productName,
				quantity: finalQuantity,
				productIds,
				message: message || request.message,
			});

			// Send approval email
			if (user?.email) {
				// Implement email sending
			}

			res.json({
				success: true,
				message: 'Assets approved and assigned successfully',
			});
		} else if (status === 'rejected') {
			await AssetRequest.findByIdAndUpdate(id, {
				status: 'rejected',
				rejectReason: reason || 'No reason provided',
				updatedAt: new Date(),
			});

			// Send rejection email
			if (user?.email) {
				// Implement email sending
			}

			res.json({
				success: true,
				message: 'Request rejected successfully',
			});
		} else {
			throw new AppError(
				'Invalid status. Must be "approved" or "rejected"',
				400
			);
		}
	})
);

// GET /assets-request/user/:email - Get requests by user email
router.get(
	'/user/:email',
	validate(getAssetRequestByUserSchema),
	asyncHandler(async (req, res) => {
		const { email } = req.params;
		const requests = await AssetRequest.find({ userEmail: email });

		res.json({
			success: true,
			data: requests,
		});
	})
);

// GET /user/assets/details/:email - Get user asset details
router.get(
	'/user/details/:email',
	validate(getAssetRequestDetailsSchema),
	asyncHandler(async (req, res) => {
		const { email } = req.params;

		const user = await User.findOne({ email });
		if (!user) {
			throw new NotFoundError('User');
		}

		const assetRequests = await AssetRequest.find({ userEmail: email });

		res.json({
			success: true,
			data: {
				user,
				assetRequests,
			},
		});
	})
);

export default router;
