import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NewDashboard } from '../../components/redesign/NewDashboard'
import ImportTakeout from '../../components/ImportTakeout'
import { List, Place, Tag } from '../../types'
import { placesService, foldersService, categoriesService } from '../../services/api'

// This is the main integration component connecting the redesigned NewDashboard
// with the existing API and routing system

export const DashboardIntegration: React.FC = () => {
  const navigate = useNavigate()
  const { folderId, placeId } = useParams()

  // Data state
  const [lists, setLists] = useState<List[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Navigation state
  const [currentList, setCurrentList] = useState<List | null>(null)
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  // Import state
  const [showImport, setShowImport] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  // Handle URL parameter changes for folder/list navigation
  useEffect(() => {
    if (folderId && lists.length > 0) {
      const list = lists.find(l => l.id === folderId)
      setCurrentList(list || null)
    } else {
      setCurrentList(null)
    }
  }, [folderId, lists])

  // Handle URL parameter changes for place navigation
  useEffect(() => {
    if (placeId && places.length > 0) {
      const place = places.find(p => p.id === placeId)
      setCurrentPlace(place || null)
    } else {
      setCurrentPlace(null)
    }
  }, [placeId, places])

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
      const convertedPlaces: Place[] = (placesData || []).map(place => {
        const listId = (place as any).folderId || (place as any).listId
        console.log('Converting place:', {
          placeName: place.name,
          originalFolderId: (place as any).folderId,
          originalListId: (place as any).listId,
          convertedListId: listId
        })
        return {
          ...place,
          listId: listId, // Convert folderId to listId, with fallback
          tags: ((place as any).categories || []).map((category: any) => ({
            id: category.id,
            name: category.name,
            color: category.color,
            userId: category.userId,
            createdAt: category.createdAt,
          })),
          visited: false, // Default value
        }
      })

      console.log('Loaded data:', {
        places: convertedPlaces.length,
        lists: convertedLists.length,
        tags: convertedTags.length
      })
      console.log('Place-List associations:', convertedPlaces.map(p => ({
        placeName: p.name,
        listId: p.listId
      })))
      console.log('Available lists:', convertedLists.map(l => ({
        listId: l.id,
        listName: l.name
      })))

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
    // Navigate to the folder/list view using the existing route structure
    navigate(`/redesign/folders/${list.id}`)
  }

  const handlePlaceSelect = (place: Place) => {
    console.log('Selected place:', place)
    // Navigate to the place detail view
    navigate(`/redesign/places/${place.id}`)
  }

  const handlePlaceView = (place: Place | null) => {
    setCurrentPlace(place)
    if (place) {
      // Update URL to reflect place selection but stay in current context
      navigate(`/redesign/places/${place.id}`, { replace: true })
    } else {
      // Go back to current list or main view
      if (currentList) {
        navigate(`/redesign/folders/${currentList.id}`, { replace: true })
      } else {
        navigate('/redesign', { replace: true })
      }
    }
  }

  const handleBackToLists = () => {
    // Navigate back to main lists view
    navigate('/redesign')
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

  // Advanced place-tag management functions
  const handlePlaceTagUpdate = async (placeId: string, tagIds: string[]) => {
    try {
      console.log('handlePlaceTagUpdate called:', { placeId, tagIds })

      // Update place tags using existing API
      await placesService.updatePlaceTags(placeId, tagIds)

      // Update local state
      setPlaces(prev => prev.map(place => {
        if (place.id === placeId) {
          const newTags = tagIds.map(tagId => tags.find(tag => tag.id === tagId)).filter(Boolean) as Tag[]
          return { ...place, tags: newTags }
        }
        return place
      }))
    } catch (err) {
      console.error('Error updating place tags:', err)
      setError('Failed to update place tags')
    }
  }

  const handlePlaceListUpdate = async (placeId: string, listId: string | null) => {
    try {
      console.log('handlePlaceListUpdate called:', { placeId, listId })

      // Update place list using existing API
      await placesService.updatePlace(placeId, { listId: listId || undefined })

      // Update local state
      setPlaces(prev => prev.map(place => {
        if (place.id === placeId) {
          return { ...place, listId: listId || undefined }
        }
        return place
      }))
    } catch (err) {
      console.error('Error updating place list:', err)
      setError('Failed to update place list')
    }
  }

  // Search and filtering functions
  const handleSearch = (query: string) => {
    console.log('Search handler called with query:', query)
    setSearchQuery(query)
  }

  const getPlacesInCurrentList = () => {
    if (!currentList) {
      return places // Show all places when no list is selected
    }
    // Filter places by list ID
    return places.filter(place => place.listId === currentList.id)
  }

  const getFilteredPlaces = () => {
    let filteredPlaces = getPlacesInCurrentList()

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filteredPlaces = filteredPlaces.filter(place =>
        place.name.toLowerCase().includes(query) ||
        place.address?.toLowerCase().includes(query) ||
        place.notes?.toLowerCase().includes(query) ||
        (place.tags || []).some(tag => tag.name.toLowerCase().includes(query))
      )
    }

    // Apply tag filter - Use OR logic (show places that have ANY of the selected tags)
    if (selectedTagIds.length > 0) {
      console.log('Applying tag filter for:', selectedTagIds.length, 'tags')
      const beforeCount = filteredPlaces.length

      filteredPlaces = filteredPlaces.filter(place => {
        const placeTags = place.tags || []
        const placeTagIds = placeTags.map(tag => tag.id)

        // Check if this place has ANY of the selected tags (OR logic)
        const hasAnyTag = selectedTagIds.some(selectedTagId =>
          placeTagIds.includes(selectedTagId)
        )

        return hasAnyTag
      })

      console.log(`Tag filter applied: ${filteredPlaces.length} places (was ${beforeCount})`)
    }

    return filteredPlaces
  }

  const getFilteredLists = () => {
    if (!searchQuery.trim()) {
      return lists
    }

    const query = searchQuery.toLowerCase()
    return lists.filter(list =>
      list.name.toLowerCase().includes(query)
    )
  }

  const handleTagClick = (tagId: string) => {
    console.log('Tag clicked:', tagId, 'Current selection:', selectedTagIds)

    setSelectedTagIds(prev => {
      const newSelection = prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
      console.log('New selectedTagIds:', newSelection)
      return newSelection
    })
  }

  const clearTagFilters = () => {
    setSelectedTagIds([])
  }

  const handleImportClick = () => {
    setShowImport(true)
  }

  const handleImportComplete = () => {
    loadData() // Refresh data after import
    setShowImport(false)
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
    <>
      <NewDashboard
        lists={lists}
        places={places}
        tags={tags}
        currentList={currentList}
        currentPlace={currentPlace}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        filteredLists={getFilteredLists()}
        filteredPlaces={getFilteredPlaces()}
        onListSelect={handleListSelect}
        onListCreate={handleListCreate}
        onListUpdate={handleListUpdate}
        onListDelete={handleListDelete}
        onPlaceCreate={handlePlaceCreate}
        onPlaceUpdate={handlePlaceUpdate}
        onPlaceDelete={handlePlaceDelete}
        onPlaceSelect={handlePlaceView}
        onTagCreate={handleTagCreate}
        onTagUpdate={handleTagUpdate}
        onTagDelete={handleTagDelete}
        onNavigateBack={handleBackToLists}
        onImport={handleImportClick}
      />

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Import from Google Takeout</h3>
              <button
                onClick={() => setShowImport(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ImportTakeout onImportComplete={handleImportComplete} />
          </div>
        </div>
      )}
    </>
  )
}

// Usage: Replace your existing Dashboard import with this component
// import { DashboardIntegration as Dashboard } from './pages/DashboardIntegration'
