import axios from 'axios';
import { User, Place, Tag, Folder, SearchFilters, AuthResponse, ImportResult } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', { email, password, name });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  storeAuth(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const placesService = {
  async getPlaces(): Promise<Place[]> {
    const response = await api.get('/api/places');
    return response.data.places;
  },

  async createPlace(place: Omit<Place, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'tags'>): Promise<Place> {
    const response = await api.post('/api/places', place);
    return response.data;
  },

  async updatePlace(id: string, place: Partial<Omit<Place, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'tags'>>): Promise<void> {
    await api.put(`/api/places/${id}`, place);
  },

  async updatePlaceTags(id: string, tagIds: string[]): Promise<void> {
    await api.put(`/api/places/${id}/tags`, { tagIds });
  },

  async searchPlaces(filters: SearchFilters): Promise<Place[]> {
    const response = await api.get('/api/places/search', { params: filters });
    return response.data.places;
  },

  async deletePlace(id: string): Promise<void> {
    await api.delete(`/api/places/${id}`);
  },

  async deleteAllPlaces(): Promise<void> {
    await api.delete('/api/places');
  }
};

export const categoriesService = {
  async getCategories(): Promise<Tag[]> {
    const response = await api.get('/api/categories');
    return response.data.categories;
  },

  async createCategory(name: string, color: string): Promise<Tag> {
    const response = await api.post('/api/categories', { name, color });
    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/api/categories/${id}`);
  },

  async addCategoryToPlace(categoryId: string, placeId: string): Promise<void> {
    await api.post(`/api/categories/${categoryId}/places/${placeId}`);
  },

  async removeCategoryFromPlace(categoryId: string, placeId: string): Promise<void> {
    await api.delete(`/api/categories/${categoryId}/places/${placeId}`);
  }
};

export const importService = {
  async importFromGoogleTakeout(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/import/google-takeout', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
};

export const foldersService = {
  async getFolders(): Promise<Folder[]> {
    const response = await api.get('/api/folders');
    return response.data.folders;
  },

  async createFolder(name: string, color: string): Promise<Folder> {
    const response = await api.post('/api/folders', { name, color });
    return response.data;
  },

  async updateFolder(id: string, name: string, color: string): Promise<void> {
    await api.put(`/api/folders/${id}`, { name, color });
  },

  async deleteFolder(id: string): Promise<void> {
    await api.delete(`/api/folders/${id}`);
  },

  async movePlaceToFolder(folderId: string, placeId: string): Promise<void> {
    await api.post(`/api/folders/${folderId}/places/${placeId}`);
  },

  async removePlaceFromFolder(folderId: string, placeId: string): Promise<void> {
    await api.delete(`/api/folders/${folderId}/places/${placeId}`);
  }
};
