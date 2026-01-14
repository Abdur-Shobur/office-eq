import cors from 'cors';
import express from 'express';
import path from 'path';

// Import configurations
import { appConfig, connectDB } from '@/config';

// Import middleware
import { errorHandler } from '@/middleware';

// Import routes
import {
	assetRequestRoutes,
	assetRoutes,
	brandRoutes,
	categoryRoutes,
	dashboardRoutes,
	purchaseRoutes,
	subcategoryRoutes,
	userRoutes,
	vendorRoutes,
} from '@/routes';

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors(appConfig.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/assets-request', assetRequestRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'Office Inventory API Running!',
		timestamp: new Date().toISOString(),
		environment: appConfig.nodeEnv,
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: `Route ${req.originalUrl} not found`,
	});
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
