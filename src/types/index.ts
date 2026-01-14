// User Types
export interface IUser {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'office-user';
  photoPath?: string;
  department?: string;
  position?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Asset Types
export interface IAsset {
  _id?: string;
  name: string;
  category: string;
  subcategory: string;
  brand?: string;
  quantity: number;
  unit: string;
  description?: string;
  assetIds?: string[];
  assignedToEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Asset Request Types
export interface IAssetRequest {
  _id?: string;
  userEmail: string;
  productId: string;
  productName: string;
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'approved' | 'rejected';
  sentDate: Date;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: Date;
  rejectReason?: string;
  message?: string;
  productIds?: string[];
  requestDate?: Date;
  updatedAt?: Date;
}

// Purchase Types
export interface IPurchaseItem {
  productId: string;
  productName?: string;
  assetName?: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  assetIds: string[];
}

export interface IPurchase {
  _id?: string;
  vendorId?: string;
  vendorName?: string;
  vendorPhone?: string;
  vendorAddress?: string;
  invoiceNo: string;
  purchasePrice: number;
  paidAmount: number;
  dueAmount: number;
  items: IPurchaseItem[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Vendor Types
export interface IVendor {
  _id?: string;
  name: string;
  status: 'active' | 'inactive';
  companyName?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Category Types
export interface ICategory {
  _id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Subcategory Types
export interface ISubcategory {
  _id?: string;
  name: string;
  categoryId: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Brand Types
export interface IBrand {
  _id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Dashboard Types
export interface IDashboardStats {
  totalQuantity: number;
  approvedCount: number;
  pendingCount: number;
  totalPurchasePrice: number;
  totalDueAmount: number;
}

// API Response Types
export interface IApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  insertedId?: string;
  modifiedCount?: number;
  deletedCount?: number;
}

// Request Types
export interface IAssetRequestCreate {
  userEmail: string;
  productId: string;
  productName: string;
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  message?: string;
}

export interface IAssetRequestApproval {
  approvedBy: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  productIds?: string[];
  message?: string;
}

export interface IAssetRequestStatusUpdate {
  status: 'approved' | 'rejected';
  approvedBy?: string;
  approvedByName?: string;
  reason?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  productIds?: string[];
  message?: string;
}

// User Profile Types
export interface IUserProfile {
  user: IUser;
  assetRequests: IAssetRequest[];
}