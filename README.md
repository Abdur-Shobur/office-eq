"# Inventory Management System Backend

A comprehensive backend API for inventory management built with TypeScript, Express.js, MongoDB, and Mongoose.

## Features

- **TypeScript**: Full type safety throughout the application
- **Zod Validation**: Runtime type validation for all API inputs
- **Mongoose ODM**: MongoDB object modeling with schema validation
- **Error Handling**: Centralized error handling with custom error classes
- **Authentication**: JWT-based authentication system
- **File Upload**: Multer-based file upload with validation
- **Email Notifications**: Automated email notifications for asset requests
- **Modular Architecture**: Well-organized folder structure with separation of concerns

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Authentication**: JWT
- **Email**: Nodemailer
- **File Upload**: Multer
- **Development**: ts-node-dev, nodemon

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── app.ts       # App configuration
│   ├── database.ts  # Database connection
│   └── index.ts     # Config exports
├── controllers/      # Route controllers (if needed)
├── middleware/       # Express middleware
│   ├── auth.ts      # Authentication middleware
│   ├── errorHandler.ts # Error handling
│   ├── validate.ts  # Request validation
│   └── upload.ts    # File upload middleware
├── models/          # Mongoose models
│   ├── User.model.ts
│   ├── Asset.model.ts
│   ├── AssetRequest.model.ts
│   ├── Purchase.model.ts
│   ├── Vendor.model.ts
│   ├── Category.model.ts
│   ├── Subcategory.model.ts
│   ├── Brand.model.ts
│   └── index.ts
├── routes/          # API routes organized by feature
│   ├── user.routes.ts
│   ├── asset.routes.ts
│   ├── assetRequest.routes.ts
│   ├── purchase.routes.ts
│   ├── vendor.routes.ts
│   ├── category.routes.ts
│   ├── subcategory.routes.ts
│   ├── brand.routes.ts
│   ├── dashboard.routes.ts
│   └── index.ts
├── types/           # TypeScript interfaces
│   ├── index.ts
├── utils/           # Utility functions
│   ├── AppError.ts
│   ├── email.ts
│   ├── jwt.ts
│   ├── helpers.ts
│   └── index.ts
├── validation/      # Zod validation schemas
│   ├── user.validation.ts
│   ├── asset.validation.ts
│   ├── assetRequest.validation.ts
│   ├── purchase.validation.ts
│   ├── vendor.validation.ts
│   ├── category.validation.ts
│   ├── subcategory.validation.ts
│   ├── brand.validation.ts
│   └── index.ts
├── app.ts          # Express app setup
└── server.ts       # Server startup
```

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventoryDb?retryWrites=true&w=majority
   DB_USER=your_db_user
   DB_PASS=your_db_password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d

   # Email Configuration (for Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_SERVICE=gmail

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000,http://localhost:3001
   ```

## Development

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Run Both Build and Start

```bash
npm run prod
```

### Type Checking

```bash
npm run lint
```

### Er

![Banner](./er.png)

## Postman

[API Documentation](https://bold-trinity-158119.postman.co/workspace/My-Workspace~5985e162-3675-4f31-85f6-22f3fb5e5358/request/42365408-2d945a15-373c-4fe0-933d-5b63b4f9ab60?action=share&creator=42365408&ctx=documentation)

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/admin/:email` - Check admin status
- `GET /api/users/profile/:email` - Get user profile

### Assets

- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create asset
- `GET /api/assets/:id` - Get asset by ID
- `PATCH /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset
- `GET /api/assets/:productId/asset-ids` - Get asset IDs
- `GET /api/assets/available-ids/:id` - Get available asset IDs

### Asset Requests

- `GET /api/assets-request` - Get all asset requests
- `POST /api/assets-request` - Create asset request
- `PATCH /api/assets-request/approve/:id` - Approve asset request
- `POST /api/assets-request/admin/create-and-approve` - Create and approve request
- `PATCH /api/assets-request/status/:id` - Update request status

### Purchases

- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Create purchase
- `GET /api/purchases/:id` - Get purchase by ID
- `PATCH /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Vendors

- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create vendor
- `GET /api/vendors/:id` - Get vendor by ID
- `PATCH /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `GET /api/categories/:id` - Get category by ID
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Subcategories

- `GET /api/subcategories` - Get all subcategories
- `POST /api/subcategories` - Create subcategory
- `GET /api/subcategories/:id` - Get subcategory by ID
- `PATCH /api/subcategories/:id` - Update subcategory
- `DELETE /api/subcategories/:id` - Delete subcategory

### Brands

- `GET /api/brands` - Get all brands
- `POST /api/brands` - Create brand
- `GET /api/brands/:id` - Get brand by ID
- `PATCH /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Delete brand

### Dashboard

- `GET /api/dashboard/statics` - Get dashboard statistics

## Validation

All API endpoints use Zod schemas for input validation. Request bodies, parameters, and query strings are automatically validated before reaching the route handlers.

## Error Handling

The application uses centralized error handling with custom error classes:

- `AppError`: Base error class
- `ValidationError`: For validation failures
- `NotFoundError`: For resource not found
- `UnauthorizedError`: For authentication failures
- `ForbiddenError`: For authorization failures
- `ConflictError`: For resource conflicts

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## File Upload

File uploads are handled via the `/uploads` endpoint with the following constraints:

- Maximum file size: 5MB
- Allowed types: JPEG, PNG, JPG, GIF, WebP

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper validation schemas for new endpoints
4. Include error handling for all operations
5. Update this README for any new features

## License
