// Modern Dashboard with Gumroad-inspired design
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, FolderOpen, MapPin, Search, Grid3X3, List as ListIcon, Star, TrendingUp, Upload, ExternalLink, Tag as TagIcon } from 'lucide-react'

// Import our new components
import AppHeader from '../components/AppHeader'
import EnhancedCard from '../components/EnhancedCard'
import PlaceCard from '../components/PlaceCard'
import ImportTakeout from '../components/ImportTakeout'
import {
  Grid,
  PageContainer,
  Section,
  EmptyState,
  SkeletonCard
} from '../components/LayoutComponents'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

// Import existing services and types
import { placesService, categoriesService, foldersService } from '../services/api'
import { Place, Tag, Folder } from '../types'

const ModernDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { folderId, placeId } = useParams()
  const { user, logout } = useAuth()
  const [loggedOut, setLoggedOut] = useState(false)
  const [places, setPlaces] = useState<Place[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null)
  const [showTagModal, setShowTagModal] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagEmoji, setNewTagEmoji] = useState('🏷️')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [managingTagsForPlace, setManagingTagsForPlace] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Set current folder based on URL parameter
    if (folderId && folders.length > 0) {
      const folder = folders.find(f => f.id === folderId)
      setCurrentFolder(folder || null)
    } else {
      setCurrentFolder(null)
    }
  }, [folderId, folders])

  useEffect(() => {
    // Set current place based on URL parameter
    if (placeId && places.length > 0) {
      const place = places.find(p => p.id === placeId)
      setCurrentPlace(place || null)
    } else {
      setCurrentPlace(null)
    }
  }, [placeId, places])

  useEffect(() => {
    // Close tag management dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Don't close if clicking inside a dropdown
      if (managingTagsForPlace && !target.closest('.tag-dropdown')) {
        setManagingTagsForPlace(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [managingTagsForPlace])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [placesData, tagsData, foldersData] = await Promise.all([
        placesService.getPlaces(),
        categoriesService.getCategories(),
        foldersService.getFolders()
      ])
      setPlaces(placesData || [])
      setTags(tagsData || [])
      setFolders(foldersData || [])
    } catch (err: any) {
      setError('Failed to load data')
      console.error('Error loading data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    console.log('Search handler called with query:', query)
    setSearchQuery(query)
  }

  const handleAddNew = () => {
    setShowAddModal(true)
    setNewItemName('')
  }

  const handleCreateItem = async () => {
    if (!newItemName.trim()) return

    try {
      if (currentFolder) {
        // Create a new place via API
        const newPlace = await placesService.createPlace({
          name: newItemName,
          address: 'Address not specified',
          latitude: 0,
          longitude: 0,
          listId: currentFolder.id
        })
        setPlaces(prev => [...prev, newPlace])
      } else {
        // Create a new folder via API
        const newFolder = await foldersService.createFolder(newItemName, '#3B82F6')
        setFolders(prev => [...prev, newFolder])
      }

      setShowAddModal(false)
      setNewItemName('')
    } catch (error) {
      console.error('Error creating item:', error)
      setError('Failed to create item')
    }
  }

  const handleFolderClick = (folder: Folder) => {
    console.log('Folder clicked:', folder.name)
    navigate(`/folders/${folder.id}`)
  }

  const handlePlaceClick = (place: Place) => {
    console.log('Place clicked:', place.name)
    navigate(`/places/${place.id}`)
  }

  const handleTagChange = async (placeId: string, tagIds: string[]) => {
    console.log('handleTagChange called:', { placeId, tagIds })

    try {
      await placesService.updatePlaceTags(placeId, tagIds)
      console.log('API call successful, updating local state')

      // Update the local state to reflect changes immediately
      setPlaces(prevPlaces =>
        prevPlaces.map(place => {
          if (place.id === placeId) {
            const updatedPlace = {
              ...place,
              tags: tags.filter(tag => tagIds.includes(tag.id))
            }
            console.log('Updated place:', updatedPlace)
            return updatedPlace
          }
          return place
        })
      )
    } catch (error) {
      console.error('Error updating tags:', error)
      setError('Failed to update tags')
    }
  }

  const handleListChange = async (placeId: string, listId: string | null) => {
    try {
      await placesService.updatePlace(placeId, { listId: listId || undefined })
      // Update the local state to reflect changes immediately
      setPlaces(prevPlaces =>
        prevPlaces.map(place => {
          if (place.id === placeId) {
            return {
              ...place,
              listId: listId || undefined
            }
          }
          return place
        })
      )
    } catch (error) {
      console.error('Error updating list:', error)
      setError('Failed to update list')
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    try {
      const newTag = await categoriesService.createCategory(newTagName.trim(), newTagEmoji)
      setTags(prevTags => [...prevTags, newTag])
      setNewTagName('')
      setNewTagEmoji('🏷️')
      setShowTagModal(false)
    } catch (error) {
      console.error('Error creating tag:', error)
      setError('Failed to create tag')
    }
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

  const handleManageTagsClick = (placeId: string) => {
    setManagingTagsForPlace(placeId)
  }

  const handleTagToggleForPlace = async (placeId: string, tagId: string) => {
    console.log('handleTagToggleForPlace called:', { placeId, tagId })

    const place = places.find(p => p.id === placeId)
    if (!place) {
      console.log('Place not found:', placeId)
      return
    }

    const currentTagIds = (place.tags || []).map(tag => tag.id)
    console.log('Current tag IDs for place:', currentTagIds)

    const newTagIds = currentTagIds.includes(tagId)
      ? currentTagIds.filter(id => id !== tagId)
      : [...currentTagIds, tagId]

    console.log('New tag IDs:', newTagIds)

    try {
      await handleTagChange(placeId, newTagIds)
      console.log('Tag change successful')
    } catch (error) {
      console.error('Error in handleTagToggleForPlace:', error)
    }
  }

  const handleDeletePlace = async (placeId: string) => {
    try {
      await placesService.deletePlace(placeId)
      await loadData() // Refresh data
    } catch (error) {
      console.error('Error deleting place:', error)
      setError('Failed to delete place')
    }
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'Dashboard', href: '/modern' }]
    if (currentFolder) {
      breadcrumbs.push({ label: currentFolder.name, href: `/folders/${currentFolder.id}` })
    }
    if (currentPlace) {
      breadcrumbs.push({ label: currentPlace.name, href: `/places/${currentPlace.id}` })
    }
    return breadcrumbs
  }

  const getPlacesInCurrentFolder = () => {
    if (!currentFolder) return places
    // Filter places by folder ID (using listId field)
    return places.filter(place => place.listId === currentFolder.id)
  }

  const getFilteredPlaces = () => {
    let filteredPlaces = getPlacesInCurrentFolder()

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

  const getPageTitle = () => {
    if (currentPlace) {
      return {
        title: currentPlace.name,
        subtitle: currentPlace.address || 'Place details'
      }
    }
    if (currentFolder) {
      const placesCount = getFilteredPlaces().length
      const totalPlaces = getPlacesInCurrentFolder().length
      const searchSuffix = searchQuery ? ` (${placesCount} of ${totalPlaces} shown)` : ''
      return {
        title: currentFolder.name,
        subtitle: `${placesCount} place${placesCount !== 1 ? 's' : ''}${searchSuffix}`
      }
    }

    return {
      title: 'My Places',
      subtitle: `${folders.length} list${folders.length !== 1 ? 's' : ''} • ${places.length} place${places.length !== 1 ? 's' : ''} total`
    }
  }

  const getTagsForPlace = (place: Place) => {
    return (place.tags || []).map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color
    }))
  }

  // Helper function to determine if a color field contains an emoji or hex code
  const isEmoji = (colorValue: string) => {
    // Check if it's a hex color code
    if (colorValue.startsWith('#') && colorValue.length === 7) {
      return false
    }
    // If it's not a hex code, assume it's an emoji
    return true
  }

  // Helper function to render tag display (emoji or colored dot)
  const renderTagDisplay = (tag: Tag) => {
    if (isEmoji(tag.color)) {
      return <span className="text-lg">{tag.color}</span>
    } else {
      return (
        <span
          className="w-3 h-3 rounded-full inline-block"
          style={{ backgroundColor: tag.color }}
        />
      )
    }
  }

  // Gumroad-inspired Hero Section
  const renderHeroSection = () => {
    if (currentFolder || places.length > 0) return null

    return (
      <div className="text-center py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Organize your favorite places
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create lists to organize your places by type, location, or any way that makes sense to you.
            Start with what you know and watch your collection grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleAddNew}
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg font-medium"
            >
              Create your first list
            </Button>
            <Button
              onClick={() => setShowImport(true)}
              variant="ghost"
              size="lg"
              className="text-gray-600 hover:text-gray-900 px-8 py-3 text-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Import from Google Maps
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Gumroad-inspired Feature Cards
  const renderFeatureCards = () => {
    if (currentFolder || places.length > 0) return null

    const features = [
      {
        icon: "🗂️",
        title: "Organize anything",
        description: "Restaurants, bars, coffee shops, attractions. Create lists for any type of place that matters to you."
      },
      {
        icon: "🏷️",
        title: "Tag & filter",
        description: "Add tags to places and filter your lists. Find exactly what you're looking for in seconds."
      },
      {
        icon: "📱",
        title: "Works everywhere",
        description: "Access your places on any device. Your lists sync automatically across all your devices."
      }
    ]

    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderFolderView = () => {
    if (isLoading) {
      return (
        <div className="max-w-6xl mx-auto px-4">
          <Grid cols={3} gap={6}>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </Grid>
        </div>
      )
    }

    if (folders.length === 0) {
      return (
        <>
          {renderHeroSection()}
          {renderFeatureCards()}
        </>
      )
    }

    return (
      <div className="max-w-6xl mx-auto px-4">
        {/* Stats Bar - Gumroad style */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold text-gray-900">{folders.length}</div>
              <div className="text-gray-600">Lists created</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold text-blue-600">{places.length}</div>
              <div className="text-gray-600">Places saved</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold text-green-600">{tags.length}</div>
              <div className="text-gray-600">Tags used</div>
            </div>
          </div>
        </div>

        {/* Lists Grid */}
        <Grid cols={3} gap={6}>
          {folders.map(folder => {
            const folderPlaces = places.filter(p => p.listId === folder.id)
            return (
              <div key={folder.id} className="group">
                <button
                  onClick={() => handleFolderClick(folder)}
                  className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left"
                >
                  {/* Card Header with gradient */}
                  <div className="h-24 bg-gradient-to-br from-blue-500 to-purple-600"></div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <div className="text-2xl flex-shrink-0">📁</div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg break-words">
                            {folder.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {folderPlaces.length} place{folderPlaces.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="text-gray-600 hover:text-gray-900">
                      View places →
                    </div>
                  </div>
                </button>
              </div>
            )
          })}

          {/* Add New List Card */}
          <div className="group">
            <button
              onClick={handleAddNew}
              className="w-full bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-200 p-8 text-center"
            >
              <div className="text-4xl text-gray-400 mb-4">➕</div>
              <div className="font-medium text-gray-600 group-hover:text-gray-900">
                Create new list
              </div>
              <div className="text-sm text-gray-500 mt-1 break-words">
                Organize your places
              </div>
            </button>
          </div>
        </Grid>
      </div>
    )
  }

  const renderPlacesView = () => {
    const placesToShow = getFilteredPlaces()

    if (isLoading) {
      return (
        <div className="max-w-6xl mx-auto px-4">
          <Grid cols={3} gap={6}>
            {Array.from({ length: 9 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </Grid>
        </div>
      )
    }

    if (placesToShow.length === 0) {
      // Different message for tag filter vs search vs no places
      if (selectedTagIds.length > 0) {
        return (
          <div className="max-w-2xl mx-auto text-center py-16 px-4">
            <div className="text-6xl mb-6">🏷️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No places found with selected tags
            </h2>
            <p className="text-gray-600 mb-8">
              No places match the selected tag filters. Try selecting different tags or clear the filters to see all places.
            </p>
            <Button
              onClick={clearTagFilters}
              size="lg"
              variant="outline"
              className="mr-4"
            >
              Clear Tag Filters
            </Button>
            <Button
              onClick={handleAddNew}
              size="lg"
              className="bg-black text-white hover:bg-gray-800"
            >
              Add New Place
            </Button>
          </div>
        )
      }

      if (searchQuery.trim()) {
        return (
          <div className="max-w-2xl mx-auto text-center py-16 px-4">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No places found
            </h2>
            <p className="text-gray-600 mb-8">
              No places match your search for "{searchQuery}". Try a different search term or clear the search to see all places.
            </p>
            <Button
              onClick={() => setSearchQuery('')}
              size="lg"
              variant="outline"
              className="mr-4"
            >
              Clear Search
            </Button>
            <Button
              onClick={handleAddNew}
              size="lg"
              className="bg-black text-white hover:bg-gray-800"
            >
              Add New Place
            </Button>
          </div>
        )
      }

      return (
        <div className="max-w-2xl mx-auto text-center py-16 px-4">
          <div className="text-6xl mb-6">📍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentFolder ? `No places in ${currentFolder.name} yet` : "No places yet"}
          </h2>
          <p className="text-gray-600 mb-8">
            {currentFolder
              ? "Start adding places to this list to see them here."
              : "Create your first place to get started with organizing your favorites."
            }
          </p>
          <Button
            onClick={handleAddNew}
            size="lg"
            className="bg-black text-white hover:bg-gray-800"
          >
            Add your first place
          </Button>
        </div>
      )
    }

    return (
      <div className="max-w-6xl mx-auto px-4">
        {/* Search Status Banner */}
        {searchQuery.trim() && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Showing {placesToShow.length} result{placesToShow.length !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Tag Filter Status Banner */}
        {selectedTagIds.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TagIcon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Showing places with {selectedTagIds.length} tag{selectedTagIds.length !== 1 ? 's' : ''}: {
                    selectedTagIds.map(tagId => {
                      const tag = tags.find(t => t.id === tagId)
                      if (!tag) return `Unknown tag (${tagId})`
                      return isEmoji(tag.color) ? `${tag.color} ${tag.name}` : tag.name
                    }).join(', ')
                  }
                </span>
              </div>
              <button
                onClick={clearTagFilters}
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {/* Tag Management Section */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tags.length > 0 && (
              <>
                <span className="text-sm font-medium text-gray-700 mr-2">Filter by tags:</span>
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                      selectedTagIds.includes(tag.id)
                        ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{renderTagDisplay(tag)}</span>
                    {tag.name}
                  </button>
                ))}
                {selectedTagIds.length > 0 && (
                  <button
                    onClick={clearTagFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 font-medium ml-2"
                  >
                    Clear filters
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setShowTagModal(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Tag
            </Button>
          </div>
        </div>

        <Grid cols={3} gap={6}>
          {placesToShow.map((place: Place) => (
            <div key={place.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <h3
                  className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => {
                    const query = encodeURIComponent(`${place.name} ${place.address}`)
                    window.open(`https://www.google.com/maps/search/${query}`, '_blank')
                  }}
                >
                  {place.name}
                </h3>
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{place.address}</span>
                </div>

                {/* Tags */}
                {place.tags && place.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        <span className="mr-1">{renderTagDisplay(tag)}</span>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2 flex-wrap">
                  <button
                    onClick={() => handlePlaceClick(place)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>

                  {/* Tag Management Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setManagingTagsForPlace(managingTagsForPlace === place.id ? null : place.id)
                      }}
                      className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
                    >
                      <TagIcon className="w-3 h-3" />
                      Manage Tags
                    </button>

                    {managingTagsForPlace === place.id && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48 tag-dropdown">
                        <div className="p-3">
                          <div className="text-xs font-medium text-gray-700 mb-2">Click to toggle tags:</div>
                          {tags.length > 0 ? (
                            <div className="space-y-1">
                              {tags.map(tag => {
                                const isSelected = (place.tags || []).some(pt => pt.id === tag.id)
                                return (
                                  <button
                                    key={tag.id}
                                    onClick={async (e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      console.log('Tag button clicked:', tag.name, 'for place:', place.name)
                                      await handleTagToggleForPlace(place.id, tag.id)
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                                      isSelected
                                        ? 'bg-blue-100 text-blue-800 font-medium'
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <span>{renderTagDisplay(tag)}</span>
                                    <span className="flex-1">{tag.name}</span>
                                    {isSelected && <span className="text-blue-600 font-bold">✓</span>}
                                  </button>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">No tags available. Create some first!</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Grid>
      </div>
    )
  }

  const renderPlaceDetailsView = () => {
    if (!currentPlace) return null

    return (
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setCurrentPlace(null)
              if (currentFolder) {
                navigate(`/folders/${currentFolder.id}`)
              } else {
                navigate('/')
              }
            }}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {currentFolder ? currentFolder.name : 'Dashboard'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentPlace.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>{currentPlace.address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {currentPlace.url && (
                  <Button
                    onClick={() => window.open(currentPlace.url, '_blank')}
                    variant="outline"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Link
                  </Button>
                )}
                <Button
                  onClick={() => {
                    const query = encodeURIComponent(`${currentPlace.name} ${currentPlace.address}`)
                    window.open(`https://www.google.com/maps/search/${query}`, '_blank')
                  }}
                  variant="outline"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Open in Maps
                </Button>
              </div>
            </div>

            {/* Tags */}
            {currentPlace.tags && currentPlace.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentPlace.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      <span className="mr-2">{renderTagDisplay(tag)}</span>
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {currentPlace.notes && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Notes</h3>
                <p className="text-gray-600 leading-relaxed">{currentPlace.notes}</p>
              </div>
            )}

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Coordinates</h3>
                <p className="text-gray-600">
                  {currentPlace.latitude}, {currentPlace.longitude}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Added</h3>
                <p className="text-gray-600">
                  {new Date(currentPlace.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const pageTitle = getPageTitle()

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button onClick={loadData} className="bg-black text-white hover:bg-gray-800">
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gumroad-style header - only show when we have content */}
      {(folders.length > 0 || currentFolder || currentPlace) && !loggedOut && (
        <AppHeader
          title={pageTitle.title}
          subtitle={pageTitle.subtitle}
          breadcrumbs={getBreadcrumbs()}
          user={user ? { name: user.name, email: user.email } : undefined}
          onSearch={handleSearch}
          currentSearchQuery={searchQuery}
          onAdd={handleAddNew}
          onImport={() => setShowImport(true)}
          onLogout={() => {
            logout();
            setLoggedOut(true);
            window.location.href = '/login';
          }}
        />
      )}

      <div className="py-8">
        {currentPlace ? (
          renderPlaceDetailsView()
        ) : !currentFolder ? (
          renderFolderView()
        ) : (
          <div>
            {/* Folder Header */}
            <div className="max-w-6xl mx-auto px-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate('/modern')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{currentFolder.name}</h1>
                    <p className="text-gray-600 mt-1">
                      {getPlacesInCurrentFolder().length} place{getPlacesInCurrentFolder().length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  >
                    {viewMode === 'grid' ? <ListIcon className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={handleAddNew}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add place
                  </Button>
                </div>
              </div>
            </div>
            {renderPlacesView()}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {currentFolder ? 'Add New Place' : 'Create New List'}
            </h3>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={currentFolder ? 'Enter place name' : 'Enter list name'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateItem()}
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateItem}
                disabled={!newItemName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentFolder ? 'Add Place' : 'Create List'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-90vw mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Import from Google Takeout</h3>
              <button
                onClick={() => setShowImport(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ImportTakeout onImportComplete={() => {
              loadData();
              setShowImport(false);
            }} />
          </div>
        </div>
      )}

      {/* Tag Creation Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-90vw mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Tag</h3>
              <button
                onClick={() => setShowTagModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tag name..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateTag()
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emoji
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['🏷️', '🍽️', '🏨', '🎭', '🏪', '☕', '🏋️', '🎯', '📚', '🎵', '🌟', '💼', '🎨', '🌮', '🍕', '🎪'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewTagEmoji(emoji)}
                      className={`w-8 h-8 rounded border-2 text-lg hover:bg-gray-50 ${
                        newTagEmoji === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowTagModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim()}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create Tag
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModernDashboard
