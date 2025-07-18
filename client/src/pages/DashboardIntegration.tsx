import React, { useState, useEffect } from 'react'
import { NewDashboard } from '../components/redesign/NewDashboard'
import { List, Place, Tag } from '../types'
import { placesService, foldersService, categoriesService } from '../services/api'

// This is a demo integration component showing how to use the new dashboard
// Replace your existing Dashboard component with this structure

export const DashboardIntegration: React.FC = () => {
  const [lists, setLists] = useState<List[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Load existing data and convert to new format
      const [placesData, foldersData, categoriesData] = await Promise.all([
        placesService.getPlaces(),
        foldersService.getFolders(),
        categoriesService.getCategories()
      ])

      // Convert folders to lists (with safety check)
      const convertedLists: List[] = (foldersData || []).map(folder => ({
        id: folder.id,
        name: folder.name,
        emoji: '📍', // Default emoji
        color: folder.color,
        userId: folder.userId,
        placeCount: folder.placeCount,
        createdAt: folder.createdAt,
        updatedAt: folder.createdAt, // Use createdAt as updatedAt for now
      }))

      // Convert categories to tags (with safety check)
      const convertedTags: Tag[] = (categoriesData || []).map(category => ({
        id: category.id,
        name: category.name,
        color: category.color,
        userId: category.userId,
        createdAt: category.createdAt,
      }))

      // Convert places to new format (with safety check)
      const convertedPlaces: Place[] = (placesData || []).map(place => ({
        ...place,
        listId: (place as any).folderId, // Convert folderId to listId
        tags: ((place as any).categories || []).map((category: any) => ({
          id: category.id,
          name: category.name,
          color: category.color,
          userId: category.userId,
          createdAt: category.createdAt,
        })),
        visited: false, // Default value
      }))

      setLists(convertedLists)
      setPlaces(convertedPlaces)
      setTags(convertedTags)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleListSelect = (list: List) => {
    console.log('Selected list:', list)
  }

  const handleListCreate = async (listData: Omit<List, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Create new folder using existing API
      const newFolder = await foldersService.createFolder(listData.name, listData.color)

      // Convert to list format
      const newList: List = {
        id: newFolder.id,
        name: newFolder.name,
        emoji: listData.emoji,
        color: newFolder.color,
        userId: newFolder.userId,
        placeCount: 0,
        createdAt: newFolder.createdAt,
        updatedAt: newFolder.createdAt,
      }

      setLists(prev => [newList, ...prev])
    } catch (err) {
      console.error('Error creating list:', err)
      setError('Failed to create list')
    }
  }

  const handleListUpdate = async (list: List) => {
    try {
      // Update folder using existing API
      await foldersService.updateFolder(list.id, list.name, list.color)

      setLists(prev => prev.map(l =>
        l.id === list.id ? { ...list, updatedAt: new Date().toISOString() } : l
      ))
    } catch (err) {
      console.error('Error updating list:', err)
      setError('Failed to update list')
    }
  }

  const handleListDelete = async (id: string) => {
    try {
      await foldersService.deleteFolder(id)
      setLists(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      console.error('Error deleting list:', err)
      setError('Failed to delete list')
    }
  }

  const handlePlaceCreate = async (placeData: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Create new place using existing API - convert new format to old format
      const oldFormatPlace = {
        name: placeData.name,
        address: placeData.address,
        latitude: placeData.latitude,
        longitude: placeData.longitude,
        placeId: placeData.placeId,
        url: placeData.url,
        notes: placeData.notes,
        rating: placeData.rating,
        tags: [] as any[], // Empty array for compatibility
      }

      const newPlace = await placesService.createPlace(oldFormatPlace as any)

      // Convert to new format
      const convertedPlace: Place = {
        ...newPlace,
        listId: (newPlace as any).folderId,
        tags: ((newPlace as any).categories || []).map((category: any) => ({
          id: category.id,
          name: category.name,
          color: category.color,
          userId: category.userId,
          createdAt: category.createdAt,
        })),
        visited: false,
      }

      setPlaces(prev => [convertedPlace, ...prev])
    } catch (err) {
      console.error('Error creating place:', err)
      setError('Failed to create place')
    }
  }

  const handlePlaceUpdate = async (place: Place) => {
    try {
      // Since updatePlace doesn't exist in the API, we'll just update the local state
      // In a real implementation, you would add the updatePlace method to the API
      console.log('Place update not implemented in API, updating local state only')

      setPlaces(prev => prev.map(p =>
        p.id === place.id ? { ...place, updatedAt: new Date().toISOString() } : p
      ))
    } catch (err) {
      console.error('Error updating place:', err)
      setError('Failed to update place')
    }
  }

  const handlePlaceDelete = async (id: string) => {
    try {
      await placesService.deletePlace(id)
      setPlaces(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting place:', err)
      setError('Failed to delete place')
    }
  }

  const handleTagCreate = async (tagData: Omit<Tag, 'id' | 'createdAt'>) => {
    try {
      // Create new category using existing API
      const newCategory = await categoriesService.createCategory(tagData.name, tagData.color)

      const newTag: Tag = {
        id: newCategory.id,
        name: newCategory.name,
        color: newCategory.color,
        userId: newCategory.userId,
        createdAt: newCategory.createdAt,
      }

      setTags(prev => [newTag, ...prev])
    } catch (err) {
      console.error('Error creating tag:', err)
      setError('Failed to create tag')
    }
  }

  const handleTagUpdate = async (tag: Tag) => {
    try {
      // Since updateCategory doesn't exist in the API, we'll just update the local state
      // In a real implementation, you would add the updateCategory method to the API
      console.log('Tag update not implemented in API, updating local state only')

      setTags(prev => prev.map(t => t.id === tag.id ? tag : t))
    } catch (err) {
      console.error('Error updating tag:', err)
      setError('Failed to update tag')
    }
  }

  const handleTagDelete = async (id: string) => {
    try {
      await categoriesService.deleteCategory(id)
      setTags(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error deleting tag:', err)
      setError('Failed to delete tag')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-notion-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-notion-600">Loading your lists...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-notion-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <NewDashboard
      lists={lists}
      places={places}
      tags={tags}
      onListSelect={handleListSelect}
      onListCreate={handleListCreate}
      onListUpdate={handleListUpdate}
      onListDelete={handleListDelete}
      onPlaceCreate={handlePlaceCreate}
      onPlaceUpdate={handlePlaceUpdate}
      onPlaceDelete={handlePlaceDelete}
      onTagCreate={handleTagCreate}
      onTagUpdate={handleTagUpdate}
      onTagDelete={handleTagDelete}
    />
  )
}

// Usage: Replace your existing Dashboard import with this component
// import { DashboardIntegration as Dashboard } from './pages/DashboardIntegration'
