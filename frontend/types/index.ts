export type UserRole = 'user' | 'vendor' | 'admin';

export type UserStatus = 'active' | 'disabled' | 'pending';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  avatarUrl?: string | null;
  phone?: string | null;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  image?: string | null;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type StoreStatus = 'pending' | 'verified' | 'suspended';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type StoreDocument = {
  id: string;
  name: string;
  url?: string | null;
  uploadedAt?: string | null;
};

export type Store = {
  id: string;
  slug: string;
  name: string;
  address: string;
  city?: string;
  country?: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  status: StoreStatus;
  locationDescription?: string | null;
  coordinates?: Coordinates | null;
  logoUrl?: string | null;
  description?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  documents?: StoreDocument[] | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductAvailability = 'in-stock' | 'out-of-stock' | 'preorder';

export type ProductImage = {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary?: boolean;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  name?: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  currency: string;
  sku?: string | null;
  stock: number;
  availability?: ProductAvailability;
  brand?: string | null;
  image?: string | null;
  images?: ProductImage[];
  attributes?: Record<string, string | number | boolean | null>;
  categoryId: string;
  category?: Category | null;
  storeId: string;
  store?: Pick<Store, 'id' | 'name' | 'status'> | null;
  rating?: number | null;
  reviewCount?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  discount: number;
  currency?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  productId?: string | null;
  storeId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Favorite = {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  product?: Product;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type DashboardSummary = {
  totalUsers: number;
  totalVendors: number;
  totalStores: number;
  totalProducts: number;
  totalOffers: number;
  pendingStores: number;
  growthRate: number;
  revenue?: number;
  updatedAt: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};
