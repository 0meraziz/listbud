export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Place {
  id: string;
  userId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  url?: string;
  rating?: number;
  notes?: string;
  folderId?: string;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  categories: string[];
  rating?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  userId: string;
  placeCount: number;
  createdAt: string;
}
