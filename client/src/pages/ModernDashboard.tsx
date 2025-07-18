// Modern Dashboard with Gumroad-inspired design
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, MapPin, Search, Grid3X3, List as ListIcon, Star, TrendingUp } from 'lucide-react'

// Import our new components
import AppHeader from '../components/AppHeader'
import EnhancedCard from '../components/EnhancedCard'
import {
  Grid,
  PageContainer,
  Section,
  EmptyState,
  SkeletonCard
} from '../components/LayoutComponents'
import { Button } from '../components/ui/Button'

// Import existing services and types
import { placesService, categoriesService, foldersService } from '../services/api'
import { Place, Tag, Folder } from '../types'

const ModernDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [places, setPlaces] = useState<Place[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Mock data for demonstration
      const mockFolders: Folder[] = [
        {
          id: '1',
          name: 'Favorite Restaurants',
          color: '#3B82F6',
          userId: 'user1',
          placeCount: 2,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Coffee Shops',
          color: '#8B5CF6',
          userId: 'user1',
          placeCount: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Weekend Getaways',
          color: '#10B981',
          userId: 'user1',
          placeCount: 0,
          createdAt: new Date().toISOString()
        }
      ]

      const mockTags: Tag[] = [
        { id: '1', name: 'Fine Dining', color: '#EF4444', userId: 'user1', createdAt: new Date().toISOString() },
        { id: '2', name: 'Date Night', color: '#F59E0B', userId: 'user1', createdAt: new Date().toISOString() },
        { id: '3', name: 'Third Wave', color: '#8B5CF6', userId: 'user1', createdAt: new Date().toISOString() },
        { id: '4', name: 'Gastropub', color: '#06B6D4', userId: 'user1', createdAt: new Date().toISOString() },
        { id: '5', name: 'Casual', color: '#10B981', userId: 'user1', createdAt: new Date().toISOString() }
      ]

      const mockPlaces: Place[] = [
        {
          id: '1',
          name: 'Blue Hill',
          address: '75 Washington Pl, New York, NY 10011',
          latitude: 40.732,
          longitude: -73.997,
          listId: '1',
          tags: [mockTags[0], mockTags[1]],
          userId: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Stumptown Coffee',
          address: '18 W 29th St, New York, NY 10001',
          latitude: 40.746,
          longitude: -73.988,
          listId: '2',
          tags: [mockTags[2]],
          userId: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'The Spotted Pig',
          address: '314 W 11th St, New York, NY 10014',
          latitude: 40.735,
          longitude: -74.006,
          listId: '1',
          tags: [mockTags[3]],
          userId: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setPlaces(mockPlaces)
      setTags(mockTags)
      setFolders(mockFolders)
    } catch (err: any) {
      setError('Failed to load data')
      console.error('Error loading data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
  }

  const handleAddNew = () => {
    console.log('Add new item')
  }

  const handleFolderClick = (folder: Folder) => {
    setCurrentFolder(folder)
    navigate(`/folders/${folder.id}`)
  }

  const handlePlaceClick = (place: Place) => {
    navigate(`/places/${place.id}`)
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'Dashboard', href: '/dashboard' }]
    if (currentFolder) {
      breadcrumbs.push({ label: currentFolder.name, href: `/folders/${currentFolder.id}` })
    }
    return breadcrumbs
  }

  const getPlacesInCurrentFolder = () => {
    if (!currentFolder) return places
    return places.filter(place => place.listId === currentFolder.id)
  }

  const getPageTitle = () => {
    if (currentFolder) {
      const placesCount = getPlacesInCurrentFolder().length
      return {
        title: currentFolder.name,
        subtitle: `${placesCount} place${placesCount !== 1 ? 's' : ''}`
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
              variant="ghost"
              size="lg"
              className="text-gray-600 hover:text-gray-900 px-8 py-3 text-lg"
            >
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
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  {/* Card Header with gradient */}
                  <div className="h-24 bg-gradient-to-br from-blue-500 to-purple-600"></div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">📁</div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {folder.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {folderPlaces.length} place{folderPlaces.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleFolderClick(folder)}
                      variant="ghost"
                      className="w-full justify-start text-left p-0 h-auto text-gray-600 hover:text-gray-900"
                    >
                      View places →
                    </Button>
                  </div>
                </div>
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
              <div className="text-sm text-gray-500 mt-1">
                Organize your places
              </div>
            </button>
          </div>
        </Grid>
      </div>
    )
  }

  const renderPlacesView = () => {
    const placesToShow = getPlacesInCurrentFolder()

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
        <Grid cols={3} gap={6}>
          {placesToShow.map((place: Place) => (
            <div key={place.id} className="group">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📍</div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {place.name}
                        </h3>
                        <p className="text-gray-600 text-sm truncate">
                          {place.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {place.tags && place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {place.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {place.tags.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{place.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={() => handlePlaceClick(place)}
                    variant="ghost"
                    className="w-full justify-start text-left p-0 h-auto text-gray-600 hover:text-gray-900"
                  >
                    View details →
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Grid>
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
      {(folders.length > 0 || currentFolder) && (
        <AppHeader
          title={pageTitle.title}
          subtitle={pageTitle.subtitle}
          breadcrumbs={getBreadcrumbs()}
          user={{
            name: 'John Doe',
            email: 'john@example.com'
          }}
          onSearch={handleSearch}
          onAdd={handleAddNew}
        />
      )}

      <div className="py-8">
        {!currentFolder ? (
          renderFolderView()
        ) : (
          <div>
            {/* Folder Header */}
            <div className="max-w-6xl mx-auto px-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{currentFolder.name}</h1>
                  <p className="text-gray-600 mt-1">
                    {getPlacesInCurrentFolder().length} place{getPlacesInCurrentFolder().length !== 1 ? 's' : ''}
                  </p>
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
    </div>
  )
}

export default ModernDashboard
