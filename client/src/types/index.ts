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
  visited?: boolean;
  listId?: string; // Changed from folderId to listId
  tags: Tag[]; // Changed from categories to tags
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
}

export interface List {
  id: string;
  name: string;
  emoji?: string; // New field for emoji icon
  color: string;
  coverImage?: string; // New field for cover image
  userId: string;
  placeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  query: string;
  tags: string[]; // Changed from categories to tags
  rating?: number;
  visited?: boolean;
  listId?: string; // Filter by specific list
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

// New types for the redesigned UI
export interface ViewMode {
  type: 'map' | 'gallery' | 'table';
  label: string;
  icon: string;
}

export interface PlaceDetailPanelProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (place: Place) => void;
  onDelete: (id: string) => void;
}

export interface ListCardProps {
  list: List;
  onSelect: (list: List) => void;
  onEdit: (list: List) => void;
  onDelete: (id: string) => void;
}

export interface TagBadgeProps {
  tag: Tag;
  removable?: boolean;
  onRemove?: (tagId: string) => void;
}

// Legacy types for backward compatibility - to be removed
export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  userId: string;
  placeCount: number;
  createdAt: string;
}
