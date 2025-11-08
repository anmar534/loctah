import { apiFetch } from "./client";
import type { 
  DashboardSummary, 
  User, 
  Store, 
  Category, 
  Product, 
  Offer,
  CreateStoreInput,
  CreateCategoryInput,
  CreateProductInput,
  CreateOfferInput,
} from "@/types";

// Dashboard
export async function getDashboardSummary() {
  return apiFetch<DashboardSummary>("admin/summary");
}

export async function getDashboardStats() {
  const response = await apiFetch<{
    success: boolean;
    data: {
      stores: number;
      products: number;
      offers: number;
      users: number;
    };
  }>("admin/stats");
  return response?.data;
}

// Users
export async function listUsers(params?: { page?: number; limit?: number; role?: string; status?: string }) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.role) queryParams.append("role", params.role);
  if (params?.status) queryParams.append("status", params.status);
  
  const qs = queryParams.toString();
  return apiFetch<{ users: User[]; total: number; page: number; limit: number }>(
    `admin/users${qs ? `?${qs}` : ''}`
  );
}

export async function getUser(id: string) {
  return apiFetch<User>(`admin/users/${encodeURIComponent(id)}`);
}

export async function updateUser(id: string, data: Partial<User>) {
  return apiFetch<User>(`admin/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function toggleUserStatus(id: string) {
  return apiFetch<User>(`admin/users/${encodeURIComponent(id)}/toggle`, {
    method: "PATCH",
  });
}

// Stores
export async function listStores(params?: { page?: number; limit?: number; city?: string; status?: string }) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.city) queryParams.append("city", params.city);
  if (params?.status) queryParams.append("status", params.status);
  
  const qs = queryParams.toString();
  return apiFetch<{ stores: Store[]; total: number; page: number; limit: number }>(
    `admin/stores${qs ? `?${qs}` : ''}`
  );
}

export async function getStore(id: string) {
  return apiFetch<Store>(`admin/stores/${encodeURIComponent(id)}`);
}

export async function createStore(data: CreateStoreInput) {
  return apiFetch<Store>("admin/stores", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStore(id: string, data: Partial<Store>) {
  return apiFetch<Store>(`admin/stores/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStore(id: string) {
  return apiFetch<void>(`admin/stores/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function toggleStoreStatus(id: string) {
  return apiFetch<Store>(`admin/stores/${encodeURIComponent(id)}/toggle`, {
    method: "PATCH",
  });
}

// Categories
export async function listCategories(params?: { page?: number; limit?: number }) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  
  const qs = queryParams.toString();
  return apiFetch<{ categories: Category[]; total: number; page: number; limit: number }>(
    `admin/categories${qs ? `?${qs}` : ''}`
  );
}

export async function getCategoriesTree() {
  return apiFetch<Category[]>("admin/categories/tree");
}

export async function getCategory(id: string) {
  return apiFetch<Category>(`admin/categories/${encodeURIComponent(id)}`);
}

export async function createCategory(data: CreateCategoryInput) {
  return apiFetch<Category>("admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: string, data: Partial<Category>) {
  return apiFetch<Category>(`admin/categories/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string) {
  return apiFetch<void>(`admin/categories/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// Products
export async function listProducts(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  brand?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
  if (params?.brand) queryParams.append("brand", params.brand);
  if (params?.status) queryParams.append("status", params.status);
  
  const qs = queryParams.toString();
  return apiFetch<{ products: Product[]; total: number; page: number; limit: number }>(
    `admin/products${qs ? `?${qs}` : ''}`
  );
}

export async function getProduct(id: string) {
  return apiFetch<Product>(`admin/products/${encodeURIComponent(id)}`);
}

export async function createProduct(data: CreateProductInput) {
  return apiFetch<Product>("admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return apiFetch<Product>(`admin/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string) {
  return apiFetch<void>(`admin/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// Offers
export async function listOffers(params?: {
  page?: number;
  limit?: number;
  storeId?: string;
  categoryId?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.storeId) queryParams.append("storeId", params.storeId);
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
  if (params?.status) queryParams.append("status", params.status);

  const qs = queryParams.toString();
  const response = await apiFetch<{
    success: boolean;
    data: Offer[];
    pagination: { total: number; page: number; limit: number; pages: number };
  }>(`admin/offers${qs ? `?${qs}` : ''}`);

  return {
    offers: response?.data || [],
    total: response?.pagination?.total || 0,
    page: response?.pagination?.page || 1,
    limit: response?.pagination?.limit || 10,
  };
}

export async function getOffer(id: string) {
  return apiFetch<Offer>(`admin/offers/${encodeURIComponent(id)}`);
}

export async function createOffer(data: CreateOfferInput) {
  return apiFetch<Offer>("admin/offers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOffer(id: string, data: Partial<Offer>) {
  return apiFetch<Offer>(`admin/offers/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteOffer(id: string) {
  return apiFetch<void>(`admin/offers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
