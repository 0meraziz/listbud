import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Plus,
  FolderOpen,
  MapPin,
  Star,
  TrendingUp,
  Upload,
  Grid3X3,
  List as ListIcon,
  MoreVertical,
  Search,
  Tag as TagIcon,
  Filter,
  X
} from 'lucide-react'

// Import our modern components
import { ModernButton } from '../components/ui/ModernButton'
import { ModernCard, CardHeader, CardBody, CardFooter, CardTitle, CardDescription } from '../components/ui/ModernCard'
import { SearchInput } from '../components/ui/ModernInput'
import ModernAppHeader from '../components/ModernAppHeader'
import ImportTakeout from '../components/ImportTakeout'
import { Grid, SkeletonCard } from '../components/LayoutComponents'
import { TagManagementDialog } from '../components/redesign/TagManagementDialog'
import { useAuth } from '../contexts/AuthContext'

// Import existing services and types
import { placesService, categoriesService, foldersService } from '../services/api'
import { Place, Tag, Folder } from '../types'

// Utility function
const decodeHtmlEntities = (text: string): string => {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = text
  return textArea.value
}

const EnhancedModernDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { folderId, placeId } = useParams()
  const { user, logout } = useAuth()

  // State management
  const [places, setPlaces] = useState<Place[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null)
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Tag filtering and management
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagFilter, setShowTagFilter] = useState(false)
  const [showTagManagement, setShowTagManagement] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (folderId && folders.length > 0) {
      const folder = folders.find(f => f.id === folderId)
      setCurrentFolder(folder || null)
      setCurrentPlace(null) // Clear place when viewing folder
    } else {
      setCurrentFolder(null)
    }
  }, [folderId, folders])

  useEffect(() => {
    if (placeId && places.length > 0) {
      const place = places.find(p => p.id === placeId)
      setCurrentPlace(place || null)
      setCurrentFolder(null) // Clear folder when viewing place
    } else {
      setCurrentPlace(null)
    }
  }, [placeId, places])

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
    setSearchQuery(query)
  }

  const handleFolderClick = (folder: Folder) => {
    navigate(`/folders/${folder.id}`)
  }

  const handlePlaceClick = (place: Place) => {
    navigate(`/places/${place.id}`)
  }

  // Tag management functions
  const handleTagCreate = async (name: string, color: string) => {
    try {
      const newTag = await categoriesService.createCategory(name, color)
      setTags(prev => [...prev, newTag])
    } catch (err) {
      console.error('Error creating tag:', err)
    }
  }

  const handleTagUpdate = async (tag: Tag) => {
    // TODO: Implement update functionality when API endpoint is available
    console.log('Tag update not yet implemented:', tag)
  }

  const handleTagDelete = async (tagId: string) => {
    try {
      await categoriesService.deleteCategory(tagId)
      setTags(prev => prev.filter(t => t.id !== tagId))
      setSelectedTags(prev => prev.filter(id => id !== tagId))
      // Reload places to reflect tag removal
      loadData()
    } catch (err) {
      console.error('Error deleting tag:', err)
    }
  }

  const handleTagFilter = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const clearTagFilters = () => {
    setSelectedTags([])
  }

  // Filter data based on current context
  const filteredPlaces = places.filter(place => {
    const matchesFolder = currentFolder ? place.listId === currentFolder.id : true
    const matchesSearch = searchQuery === '' ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address?.toLowerCase().includes(searchQuery.toLowerCase())

    // Tag filtering - place must have all selected tags
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tagId => place.tags?.some(tag => tag.id === tagId))

    return matchesFolder && matchesSearch && matchesTags
  })

  const filteredFolders = folders.filter(folder => {
    const matchesSearch = searchQuery === '' ||
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Tag filtering for folders - folder must have places with all selected tags
    if (selectedTags.length === 0) {
      return matchesSearch
    }

    const folderPlaces = places.filter(p => p.listId === folder.id)
    const matchesTags = selectedTags.every(tagId =>
      folderPlaces.some(place => place.tags?.some(tag => tag.id === tagId))
    )

    return matchesSearch && matchesTags
  })

  // Determine current view context
  const getViewContext = () => {
    if (currentPlace) {
      return {
        title: decodeHtmlEntities(currentPlace.name),
        subtitle: currentPlace.address || 'Place details',
        breadcrumbs: [
          { label: 'Lists', href: '/dashboard' },
          ...(currentPlace.listId ? [{
            label: folders.find(f => f.id === currentPlace.listId)?.name || 'Unknown List',
            href: `/folders/${currentPlace.listId}`
          }] : []),
          { label: decodeHtmlEntities(currentPlace.name) }
        ]
      }
    } else if (currentFolder) {
      return {
        title: decodeHtmlEntities(currentFolder.name),
        subtitle: `${filteredPlaces.length} place${filteredPlaces.length !== 1 ? 's' : ''}`,
        breadcrumbs: [
          { label: 'Lists', href: '/dashboard' },
          { label: decodeHtmlEntities(currentFolder.name) }
        ]
      }
    } else {
      return {
        title: "Your Lists",
        subtitle: "Organize your saved places into beautiful, searchable collections",
        breadcrumbs: undefined
      }
    }
  }

  const viewContext = getViewContext()

  // Context-aware statistics
  const getStats = () => {
    if (currentPlace) {
      return [
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
    } else if (currentFolder) {
      return [
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
    } else {
      return [
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
    }
  }

  const stats = getStats()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ModernAppHeader
          title="Loading..."
          subtitle="Please wait while we load your data"
          user={user || undefined}
          onLogout={logout}
        />
        <main className="container-section py-8">
          <div className="stats-container">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="w-6 h-6 modern-skeleton rounded" />
                </div>
                <div className="stat-content">
                  <div className="modern-skeleton h-8 w-16 mb-2 rounded" />
                  <div className="modern-skeleton h-4 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="lists-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="list-card animate-pulse">
                <div className="list-card-header">
                  <div className="modern-skeleton h-6 w-32 rounded" />
                  <div className="modern-skeleton h-6 w-6 rounded" />
                </div>
                <div className="modern-skeleton h-4 w-20 mb-4 rounded-full bg-blue-100" />
                <div className="space-y-2 mb-6">
                  <div className="modern-skeleton h-4 w-full rounded" />
                  <div className="modern-skeleton h-4 w-3/4 rounded" />
                  <div className="modern-skeleton h-4 w-1/2 rounded" />
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="modern-skeleton h-6 w-16 rounded-full" />
                  <div className="modern-skeleton h-6 w-20 rounded-full" />
                  <div className="modern-skeleton h-6 w-14 rounded-full" />
                </div>
                <div className="list-card-footer">
                  <div className="modern-skeleton h-4 w-24 rounded" />
                  <div className="modern-skeleton h-3 w-3 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernAppHeader
        title={viewContext.title}
        subtitle={viewContext.subtitle}
        breadcrumbs={viewContext.breadcrumbs}
        actions={{
          search: !currentPlace, // Hide search on place detail view
          add: true
        }}
        user={user || undefined}
        onSearch={handleSearch}
        currentSearchQuery={searchQuery}
        onAdd={() => setShowAddModal(true)}
        onImport={() => setShowImport(true)}
        onLogout={logout}
      />

      <main className="container-section py-8">
        {/* Enhanced Statistics Section */}
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className={`stat-icon ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        {currentPlace ? (
          // Individual Place Detail View
          <div>
            <div className="flex items-center justify-between mb-8">
              <ModernButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (currentPlace.listId) {
                    navigate(`/folders/${currentPlace.listId}`)
                  } else {
                    navigate('/dashboard')
                  }
                }}
                leftIcon={FolderOpen}
              >
                Back to {currentPlace.listId ?
                  folders.find(f => f.id === currentPlace.listId)?.name || 'List' :
                  'Lists'
                }
              </ModernButton>
            </div>

            {/* Place Detail Card */}
            <div className="list-card mb-8">
              <div className="list-card-header">
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <h1 className="list-card-title text-2xl mb-2">
                      {decodeHtmlEntities(currentPlace.name)}
                    </h1>
                    {currentPlace.address && (
                      <div className="list-card-meta flex items-center gap-2 text-lg">
                        <MapPin className="w-5 h-5" />
                        {currentPlace.address}
                      </div>
                    )}
                  </div>
                  <ModernButton
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      // Handle edit place
                    }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </ModernButton>
                </div>
              </div>

              <div className="list-card-description">
                {/* Tags */}
                {currentPlace.tags && currentPlace.tags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPlace.tags.map((tag) => (
                        <button
                          key={tag.id}
                          className="modern-tag cursor-pointer hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 transition-all"
                          style={{
                            backgroundColor: `${tag.color}15`,
                            color: tag.color,
                            borderColor: `${tag.color}30`
                          }}
                          onClick={() => {
                            // Navigate back to list view with this tag filter
                            if (currentPlace.listId) {
                              navigate(`/folders/${currentPlace.listId}`)
                            } else {
                              navigate('/dashboard')
                            }
                            setShowTagFilter(true)
                            handleTagFilter(tag.id)
                          }}
                          title={`Filter places by ${tag.name}`}
                        >
                          <TagIcon className="w-3 h-3" />
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Added</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>List</span>
                        <span>
                          {currentPlace.listId ?
                            folders.find(f => f.id === currentPlace.listId)?.name || 'Unknown' :
                            'No list'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tags</span>
                        <span>{currentPlace.tags?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Actions</h4>
                    <div className="space-y-3">
                      <ModernButton
                        variant="secondary"
                        size="sm"
                        className="w-full justify-start"
                        leftIcon={Star}
                      >
                        Add to Favorites
                      </ModernButton>
                      {currentPlace.address && (
                        <ModernButton
                          variant="secondary"
                          size="sm"
                          className="w-full justify-start"
                          leftIcon={MapPin}
                          onClick={() => {
                            window.open(`https://maps.google.com/?q=${encodeURIComponent(currentPlace.address || '')}`, '_blank')
                          }}
                        >
                          View on Map
                        </ModernButton>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Places */}
            {currentPlace.listId && (
              <div>
                <h3 className="text-heading-3 mb-6">More from this list</h3>
                <div className="lists-grid">
                  {places
                    .filter(p => p.listId === currentPlace.listId && p.id !== currentPlace.id)
                    .slice(0, 6)
                    .map((place) => (
                      <div
                        key={place.id}
                        className="list-card cursor-pointer"
                        onClick={() => handlePlaceClick(place)}
                      >
                        <div className="list-card-header">
                          <h3 className="list-card-title text-lg">
                            {decodeHtmlEntities(place.name)}
                          </h3>
                        </div>
                        <div className="list-card-description">
                          {place.address && (
                            <div className="list-card-meta flex items-center gap-2 mb-4">
                              <MapPin className="w-4 h-4" />
                              {place.address}
                            </div>
                          )}
                          {place.tags && place.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {place.tags.slice(0, 2).map((tag) => (
                                <button
                                  key={tag.id}
                                  className="modern-tag cursor-pointer hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 transition-all"
                                  style={{
                                    backgroundColor: `${tag.color}15`,
                                    color: tag.color,
                                    borderColor: `${tag.color}30`
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Navigate back to list view with this tag filter
                                    if (currentPlace?.listId) {
                                      navigate(`/folders/${currentPlace.listId}`)
                                    } else {
                                      navigate('/dashboard')
                                    }
                                    setShowTagFilter(true)
                                    handleTagFilter(tag.id)
                                  }}
                                  title={`Filter by ${tag.name}`}
                                >
                                  {tag.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                {places.filter(p => p.listId === currentPlace.listId && p.id !== currentPlace.id).length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state-content">
                      <div className="empty-state-icon">
                        <MapPin className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-heading-4 mb-3">No other places in this list</h3>
                      <p className="text-body-secondary mb-6">
                        This is the only place in this list. Add more places to build a complete collection.
                      </p>
                      <ModernButton
                        onClick={() => setShowAddModal(true)}
                        leftIcon={Plus}
                      >
                        Add Another Place
                      </ModernButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : placeId && !currentPlace && !isLoading ? (
          // Place not found
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <MapPin className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-heading-3 mb-3">Place not found</h3>
              <p className="text-body-secondary mb-8">
                The place you're looking for might have been deleted or you don't have access to it.
              </p>
              <ModernButton
                onClick={() => navigate('/dashboard')}
                leftIcon={FolderOpen}
              >
                Return to Dashboard
              </ModernButton>
            </div>
          </div>
        ) : currentFolder ? (
          // Places view for a specific folder
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <ModernButton
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  leftIcon={FolderOpen}
                >
                  Back to Lists
                </ModernButton>
              </div>

              <div className="flex items-center gap-3">
                <div className="view-toggle">
                  <button
                    className={`view-toggle-button ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Grid
                  </button>
                  <button
                    className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <ListIcon className="w-4 h-4" />
                    List
                  </button>
                </div>

                {/* Tag Filter Toggle */}
                <ModernButton
                  variant={showTagFilter ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setShowTagFilter(!showTagFilter)}
                  leftIcon={Filter}
                >
                  Filter by Tags
                  {selectedTags.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {selectedTags.length}
                    </span>
                  )}
                </ModernButton>

                {/* Tag Management Button */}
                <ModernButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowTagManagement(true)}
                  leftIcon={TagIcon}
                >
                  Manage Tags
                </ModernButton>
              </div>
            </div>

            {/* Tag Filter Panel */}
            {showTagFilter && (
              <div className="list-card mb-6">
                <div className="list-card-header">
                  <h3 className="list-card-title text-lg">Filter by Tags</h3>
                  <div className="flex items-center gap-2">
                    {selectedTags.length > 0 && (
                      <ModernButton
                        variant="ghost"
                        size="sm"
                        onClick={clearTagFilters}
                        leftIcon={X}
                      >
                        Clear All
                      </ModernButton>
                    )}
                    <ModernButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTagFilter(false)}
                      leftIcon={X}
                    >
                      Close
                    </ModernButton>
                  </div>
                </div>
                <div className="list-card-description">
                  {tags.length === 0 ? (
                    <div className="text-center py-8">
                      <TagIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No tags available. Create tags to organize your places.</p>
                      <ModernButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowTagManagement(true)}
                        leftIcon={Plus}
                        className="mt-3"
                      >
                        Create First Tag
                      </ModernButton>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Select tags to filter places. Only places with all selected tags will be shown.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => handleTagFilter(tag.id)}
                            className={`modern-tag cursor-pointer transition-all ${
                              selectedTags.includes(tag.id)
                                ? 'ring-2 ring-blue-500 ring-offset-2'
                                : 'hover:ring-1 hover:ring-gray-300'
                            }`}
                            style={{
                              backgroundColor: selectedTags.includes(tag.id)
                                ? tag.color
                                : `${tag.color}15`,
                              color: selectedTags.includes(tag.id)
                                ? '#ffffff'
                                : tag.color,
                              borderColor: `${tag.color}30`
                            }}
                          >
                            <TagIcon className="w-3 h-3" />
                            {tag.name}
                          </button>
                        ))}
                      </div>
                      {selectedTags.length > 0 && (
                        <div className="text-sm text-gray-600 mt-3">
                          Filtering by {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
                          {' • '}
                          {filteredPlaces.length} place{filteredPlaces.length !== 1 ? 's' : ''} match{filteredPlaces.length === 1 ? 'es' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {filteredPlaces.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-content">
                  <div className="empty-state-icon">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-heading-3 mb-3">No places yet</h3>
                  <p className="text-body-secondary mb-8 max-w-md mx-auto">
                    {searchQuery ?
                      `No places found matching "${searchQuery}". Try adjusting your search terms.` :
                      "Transform this empty space into a curated collection of your favorite places. Add your first location to get started!"
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <ModernButton
                      onClick={() => setShowAddModal(true)}
                      leftIcon={Plus}
                      size="lg"
                    >
                      Add Your First Place
                    </ModernButton>
                    {!searchQuery && (
                      <ModernButton
                        variant="secondary"
                        onClick={() => setShowImport(true)}
                        leftIcon={Upload}
                        size="lg"
                      >
                        Import from Google
                      </ModernButton>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'places-grid' : 'places-list'}>
                {filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="place-card"
                    onClick={() => handlePlaceClick(place)}
                  >
                    <div className="place-card-content">
                      <div className="place-card-header">
                        <h3 className="place-card-title">
                          {decodeHtmlEntities(place.name)}
                        </h3>
                        <ModernButton
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle menu click
                          }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </ModernButton>
                      </div>

                      {place.address && (
                        <div className="place-card-address">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>
                      )}

                      {place.tags && place.tags.length > 0 && (
                        <div className="place-card-tags">
                          {place.tags.slice(0, 3).map((tag) => (
                            <button
                              key={tag.id}
                              className="modern-tag cursor-pointer hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 transition-all"
                              style={{
                                backgroundColor: `${tag.color}15`,
                                color: tag.color,
                                borderColor: `${tag.color}30`
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowTagFilter(true)
                                handleTagFilter(tag.id)
                              }}
                              title={`Filter by ${tag.name}`}
                            >
                              <TagIcon className="w-3 h-3" />
                              {tag.name}
                            </button>
                          ))}
                          {place.tags.length > 3 && (
                            <span className="modern-tag" style={{
                              backgroundColor: 'var(--color-surface)',
                              color: 'var(--color-text-tertiary)'
                            }}>
                              +{place.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : folderId && !currentFolder && !isLoading ? (
          // Folder not found
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <FolderOpen className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-heading-3 mb-3">List not found</h3>
              <p className="text-body-secondary mb-8">
                The list you're looking for might have been deleted or you don't have access to it.
              </p>
              <ModernButton
                onClick={() => navigate('/dashboard')}
                leftIcon={FolderOpen}
              >
                Return to Dashboard
              </ModernButton>
            </div>
          </div>
        ) : (
          // Folders/Lists overview
          <div>
            {/* Dashboard Controls */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-2">Your Lists</h2>
              <div className="flex items-center gap-3">
                {/* Tag Filter Toggle */}
                <ModernButton
                  variant={showTagFilter ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setShowTagFilter(!showTagFilter)}
                  leftIcon={Filter}
                >
                  Filter by Tags
                  {selectedTags.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {selectedTags.length}
                    </span>
                  )}
                </ModernButton>

                {/* Tag Management Button */}
                <ModernButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowTagManagement(true)}
                  leftIcon={TagIcon}
                >
                  Manage Tags
                </ModernButton>
              </div>
            </div>

            {/* Tag Filter Panel */}
            {showTagFilter && (
              <div className="list-card mb-6">
                <div className="list-card-header">
                  <h3 className="list-card-title text-lg">Filter Lists by Tags</h3>
                  <div className="flex items-center gap-2">
                    {selectedTags.length > 0 && (
                      <ModernButton
                        variant="ghost"
                        size="sm"
                        onClick={clearTagFilters}
                        leftIcon={X}
                      >
                        Clear All
                      </ModernButton>
                    )}
                    <ModernButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTagFilter(false)}
                      leftIcon={X}
                    >
                      Close
                    </ModernButton>
                  </div>
                </div>
                <div className="list-card-description">
                  {tags.length === 0 ? (
                    <div className="text-center py-8">
                      <TagIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No tags available. Create tags to organize your places.</p>
                      <ModernButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowTagManagement(true)}
                        leftIcon={Plus}
                        className="mt-3"
                      >
                        Create First Tag
                      </ModernButton>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Select tags to filter lists. Only lists containing places with all selected tags will be shown.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => handleTagFilter(tag.id)}
                            className={`modern-tag cursor-pointer transition-all ${
                              selectedTags.includes(tag.id)
                                ? 'ring-2 ring-blue-500 ring-offset-2'
                                : 'hover:ring-1 hover:ring-gray-300'
                            }`}
                            style={{
                              backgroundColor: selectedTags.includes(tag.id)
                                ? tag.color
                                : `${tag.color}15`,
                              color: selectedTags.includes(tag.id)
                                ? '#ffffff'
                                : tag.color,
                              borderColor: `${tag.color}30`
                            }}
                          >
                            <TagIcon className="w-3 h-3" />
                            {tag.name}
                          </button>
                        ))}
                      </div>
                      {selectedTags.length > 0 && (
                        <div className="text-sm text-gray-600 mt-3">
                          Filtering by {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {filteredFolders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-content">
                  <div className="empty-state-icon">
                    <FolderOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-heading-3 mb-3">No lists yet</h3>
                  <p className="text-body-secondary mb-8 max-w-lg mx-auto">
                    {searchQuery ?
                      `No lists found matching "${searchQuery}". Try different search terms or create a new list.` :
                      "Lists help you organize your places into meaningful collections. Create your first list to start building your personal travel guide!"
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <ModernButton
                      onClick={() => setShowAddModal(true)}
                      leftIcon={Plus}
                      size="lg"
                    >
                      Create Your First List
                    </ModernButton>
                    {!searchQuery && (
                      <ModernButton
                        variant="secondary"
                        onClick={() => setShowImport(true)}
                        leftIcon={Upload}
                        size="lg"
                      >
                        Import Existing Data
                      </ModernButton>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="lists-grid">
                {filteredFolders.map((folder) => {
                  const folderPlaces = places.filter(p => p.listId === folder.id)
                  const folderTags = new Set(folderPlaces.flatMap(p => p.tags?.map(t => t.name) || []))

                  return (
                    <div
                      key={folder.id}
                      className="list-card cursor-pointer"
                      onClick={() => handleFolderClick(folder)}
                    >
                      <div className="list-card-header">
                        <h3 className="list-card-title">
                          {decodeHtmlEntities(folder.name)}
                        </h3>
                        <ModernButton
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle menu click
                          }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </ModernButton>
                      </div>

                      <div className="list-card-meta">
                        <MapPin className="w-4 h-4" />
                        <span>{folderPlaces.length} place{folderPlaces.length !== 1 ? 's' : ''}</span>
                        {folderTags.size > 0 && (
                          <>
                            <span className="text-gray-300">•</span>
                            <TagIcon className="w-4 h-4" />
                            <span>{folderTags.size} tag{folderTags.size !== 1 ? 's' : ''}</span>
                          </>
                        )}
                      </div>

                      <div className="list-card-description">
                        {(folder as any).description ||
                         `A curated collection of ${folderPlaces.length} special places${folderTags.size > 0 ? ` organized with ${folderTags.size} different tags` : ''}. Click to explore this list and discover amazing locations.`
                        }
                      </div>

                      {/* Preview of place tags */}
                      {folderTags.size > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {Array.from(folderTags).slice(0, 4).map((tagName) => (
                            <span
                              key={tagName}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {tagName}
                            </span>
                          ))}
                          {folderTags.size > 4 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{folderTags.size - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="list-card-footer">
                        <div className="activity-indicator">
                          <div className="activity-dot" />
                          <span>Updated recently</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date().toLocaleDateString()}
                          </span>
                          <div
                            className="w-3 h-3 rounded-full shadow-sm"
                            style={{ backgroundColor: folder.color || '#3B82F6' }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Tag Management Dialog */}
      <TagManagementDialog
        open={showTagManagement}
        onOpenChange={setShowTagManagement}
        tags={tags}
        onTagCreate={handleTagCreate}
        onTagUpdate={handleTagUpdate}
        onTagDelete={handleTagDelete}
      />

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <ImportTakeout />
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedModernDashboard
