import { MapPin, TagIcon, FolderOpen } from 'lucide-react'
import { Place, Folder, Tag } from '../types'

export interface StatItem {
  label: string
  value: number | string
  icon: typeof MapPin
  color: string
  bgColor: string
}

export const getPlaceStats = (currentPlace: Place): StatItem[] => [
  {
    label: 'Place Details',
    value: 1,
    icon: MapPin,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    label: 'Tags Used',
    value: currentPlace.tags?.length || 0,
    icon: TagIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    label: 'In List',
    value: currentPlace.listId ? 1 : 0,
    icon: FolderOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }
]

export const getFolderStats = (filteredPlaces: Place[]): StatItem[] => [
  {
    label: 'Places in List',
    value: filteredPlaces.length,
    icon: MapPin,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    label: 'Unique Tags',
    value: new Set(filteredPlaces.flatMap(p => p.tags?.map(t => t.id) || [])).size,
    icon: TagIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    label: 'List Created',
    value: 1,
    icon: FolderOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }
]

export const getDashboardStats = (folders: Folder[], places: Place[], tags: Tag[]): StatItem[] => [
  {
    label: 'Lists Created',
    value: folders.length,
    icon: FolderOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    label: 'Places Saved',
    value: places.length,
    icon: MapPin,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    label: 'Tags Used',
    value: tags.length,
    icon: TagIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
]
