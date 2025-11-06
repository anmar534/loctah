import apiClient from './client';

export const offersApi = {
  getProductOffers: async (productId: string) => {
    const response = await apiClient.get(`/products/${productId}/offers`);
    return response.data;
  },

  createOffer: async (data: any) => {
    const response = await apiClient.post('/offers', data);
    return response.data;
  },

  updateOffer: async (id: string, data: any) => {
    const response = await apiClient.put(`/offers/${id}`, data);
    return response.data;
  },

  deleteOffer: async (id: string) => {
    const response = await apiClient.delete(`/offers/${id}`);
    return response.data;
  },
};
