import { asyncHandler, uploadSingle, validate } from '@/middleware';
import { User } from '@/models';
import { AppError, NotFoundError } from '@/utils/AppError';
import {
	createUserSchema,
	deleteUserSchema,
	getUserByEmailSchema,
	getUserProfileSchema,
} from '@/validation';
import { Router } from 'express';

const router = Router();

// GET /users - Get all users
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const users = await User.find().select('-__v');
		res.json({
			success: true,
			data: users,
		});
	})
);

// POST /users - Create user (admin only)
router.post(
	'/',
	uploadSingle('photo'),
	validate(createUserSchema),
	asyncHandler(async (req: any, res) => {
		const { id, name, email, password, department, position, phone } = req.body;
		const photoPath = req.file ? req.file.filename : null;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new AppError('User already exists', 409);
		}

		// Create user in Firebase Auth (assuming Firebase admin is set up)
		// const firebaseUser = await admin.auth().createUser({
		//   email,
		//   password,
		//   displayName: name,
		// });

		const newUser = new User({
			id,
			name,
			email,
			role: 'office-user',
			photoPath,
			department,
			position,
			phone,
		});

		const result = await newUser.save();

		res.status(201).json({
			success: true,
			message: 'User created successfully',
			data: result,
		});
	})
);

// DELETE /users/:id - Delete user
router.delete(
	'/:id',
	validate(deleteUserSchema),
	asyncHandler(async (req, res) => {
		const { id } = req.params;

		const result = await User.findByIdAndDelete(id);

		if (!result) {
			throw new NotFoundError('User');
		}

		res.json({
			success: true,
			message: 'User deleted successfully',
			deletedCount: 1,
		});
	})
);

// GET /users/admin/:email - Check if user is admin
router.get(
	'/admin/:email',
	validate(getUserByEmailSchema),
	asyncHandler(async (req, res) => {
		const { email } = req.params;

		const user = await User.findOne({ email });
		const isAdmin = user?.role === 'admin';

		res.json({
			success: true,
			admin: isAdmin,
		});
	})
);

// GET /userProfile/:email - Get user profile with assigned assets
router.get(
	'/profile/:email',
	validate(getUserProfileSchema),
	asyncHandler(async (req, res) => {
		const { email } = req.params;

		const user = await User.findOne({ email });
		if (!user) {
			return res.json({
				success: true,
				data: { profile: null, assignedAssets: [] },
			});
		}

		// Get assigned assets (assuming Asset model has assignedToEmail field)
		// const assignedAssets = await Asset.find({ assignedToEmail: email });

		res.json({
			success: true,
			data: {
				profile: user,
				assignedAssets: [], // assignedAssets
			},
		});
	})
);

export default router;
