// Helper function to get admin routes with locale
export const getAdminRoutes = (locale: string = 'ar') => ({
  dashboard: `/${locale}/admin`,
  stores: {
    list: `/${locale}/admin/stores`,
    new: `/${locale}/admin/stores/new`,
    edit: (id: string) => `/${locale}/admin/stores/${id}/edit`,
    view: (id: string) => `/${locale}/admin/stores/${id}`,
  },
  categories: {
    list: `/${locale}/admin/categories`,
    new: `/${locale}/admin/categories/create`,
    edit: (id: string) => `/${locale}/admin/categories/${id}/edit`,
  },
  products: {
    list: `/${locale}/admin/products`,
    new: `/${locale}/admin/products/create`,
    edit: (id: string) => `/${locale}/admin/products/${id}/edit`,
  },
  offers: {
    list: `/${locale}/admin/offers`,
    new: `/${locale}/admin/offers/create`,
    edit: (id: string) => `/${locale}/admin/offers/${id}/edit`,
  },
  users: {
    list: `/${locale}/admin/users`,
    view: (id: string) => `/${locale}/admin/users/${id}`,
  },
});

// Default export for backward compatibility (uses 'ar' locale by default)
export const ADMIN_ROUTES = getAdminRoutes('ar');
