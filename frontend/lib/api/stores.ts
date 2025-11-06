import apiClient from './client';

export const storesApi = {
  getStores: async (city?: string) => {
    const response = await apiClient.get('/stores', {
      params: city ? { city } : undefined,
    });
    return response.data;
  },

  getStore: async (id: string) => {
    const response = await apiClient.get(`/stores/${id}`);
    return response.data;
  },

  createStore: async (data: any) => {
    const response = await apiClient.post('/stores', data);
    return response.data;
  },

  updateStore: async (id: string, data: any) => {
    const response = await apiClient.put(`/stores/${id}`, data);
    return response.data;
  },

  deleteStore: async (id: string) => {
    const response = await apiClient.delete(`/stores/${id}`);
    return response.data;
  },
};
