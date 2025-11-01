import axios from 'axios';

const api = axios.create({
    baseURL: 'api', 
});

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryData {
    name: string;
    slug: string;
    description?: string;
}

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateCategoryData>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};