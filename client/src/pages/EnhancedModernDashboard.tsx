import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Import our modern components
import ModernAppHeader from '../components/ModernAppHeader'
import ImportTakeout from '../components/ImportTakeout'
import { TagManagementDialog } from '../components/redesign/TagManagementDialog'

// Import extracted components
import { Statistics } from '../components/dashboard/Statistics'

// Import view components
import { DashboardView } from '../components/views/DashboardView'
import { FolderView } from '../components/views/FolderView'
import { PlaceView } from '../components/views/PlaceView'
import { NotFoundView } from '../components/views/NotFoundView'

// Import hooks
import { useAuth } from '../contexts/AuthContext'
import { useTagManagement } from '../hooks/useTagManagement'
import { usePlaceTagEditing } from '../hooks/usePlaceTagEditing'

// Import services and types
import { placesService, categoriesService, foldersService } from '../services/api'
import { Place, Folder } from '../types'

// Import utilities
import { decodeHtmlEntities, filterPlaces, filterFolders } from '../utils/filters'
import { getPlaceStats, getFolderStats, getDashboardStats } from '../utils/statistics'

const EnhancedModernDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { folderId, placeId } = useParams()
  const { user, logout } = useAuth()

  // Basic state management
  const [places, setPlaces] = useState<Place[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null)
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Tag management using custom hook
  const {
    tags,
    selectedTags,
    showTagFilter,
    showTagManagement,
    setShowTagFilter,
    setShowTagManagement,
    handleTagCreate,
    handleTagUpdate,
    handleTagDelete,
    handleTagFilter,
    clearTagFilters,
    updateTags
  } = useTagManagement()

  // Place tag editing using custom hook
  const {
    editingPlaceTags,
    selectedPlaceTags,
    handlePlaceTagEdit,
    handlePlaceTagSave,
    handlePlaceTagCancel,
    handlePlaceTagToggle
  } = usePlaceTagEditing()

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
      updateTags(tagsData || [])
      setFolders(foldersData || [])
    } catch (err: any) {
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

  // Direct navigation function

  const handleDropdownToggle = (placeId: string) => {
    setOpenDropdown(openDropdown === placeId ? null : placeId)
  }

  const handleDeletePlace = async (placeId: string) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        await placesService.deletePlace(placeId)
        await loadData()
        setOpenDropdown(null)
      } catch (err) {
        console.error('Error deleting place:', err)
      }
    }
  }

  // Close dropdown when clicking outside - REMOVED to avoid conflicts
  // We now use the backdrop overlay approach instead

  // Filter data based on current context
  const filteredPlaces = filterPlaces(places, currentFolder, searchQuery, selectedTags)
  const filteredFolders = filterFolders(folders, places, searchQuery, selectedTags)

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

  // Context-aware statistics using utility functions
  const getStats = () => {
    if (currentPlace) {
      return getPlaceStats(currentPlace)
    } else if (currentFolder) {
      return getFolderStats(filteredPlaces)
    } else {
      return getDashboardStats(folders, places, tags)
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
        <Statistics stats={stats} />

        {/* Main Content */}
        {currentPlace ? (
          <PlaceView
            currentPlace={currentPlace}
            places={places}
            folders={folders}
            tags={tags}
            editingPlaceTags={editingPlaceTags}
            selectedPlaceTags={selectedPlaceTags}
            openDropdown={openDropdown}
            onBack={() => {
              if (currentPlace.listId) {
                navigate(`/folders/${currentPlace.listId}`)
              } else {
                navigate('/dashboard')
              }
            }}
            onShowAddModal={() => setShowAddModal(true)}
            onShowTagFilter={setShowTagFilter}
            onTagFilter={handleTagFilter}
            onPlaceClick={handlePlaceClick}
            onPlaceTagEdit={handlePlaceTagEdit}
            onPlaceTagSave={handlePlaceTagSave}
            onPlaceTagCancel={handlePlaceTagCancel}
            onPlaceTagToggle={handlePlaceTagToggle}
            onShowTagManagement={() => setShowTagManagement(true)}
            onDropdownToggle={handleDropdownToggle}
            onDropdownClose={() => setOpenDropdown(null)}
            onDeletePlace={handleDeletePlace}
          />
        ) : placeId && !currentPlace && !isLoading ? (
          <NotFoundView
            type="place"
            onNavigateHome={() => navigate('/dashboard')}
          />
        ) : currentFolder ? (
          <FolderView
            currentFolder={currentFolder}
            places={places}
            tags={tags}
            searchQuery={searchQuery}
            filteredPlaces={filteredPlaces}
            viewMode={viewMode}
            showTagFilter={showTagFilter}
            selectedTags={selectedTags}
            editingPlaceTags={editingPlaceTags}
            selectedPlaceTags={selectedPlaceTags}
            openDropdown={openDropdown}
            onBack={() => navigate('/dashboard')}
            onViewModeChange={setViewMode}
            onShowAddModal={() => setShowAddModal(true)}
            onShowImport={() => setShowImport(true)}
            onShowTagFilter={setShowTagFilter}
            onShowTagManagement={() => setShowTagManagement(true)}
            onTagFilter={handleTagFilter}
            onClearTagFilters={clearTagFilters}
            onPlaceClick={handlePlaceClick}
            onPlaceTagEdit={handlePlaceTagEdit}
            onPlaceTagSave={handlePlaceTagSave}
            onPlaceTagCancel={handlePlaceTagCancel}
            onPlaceTagToggle={handlePlaceTagToggle}
            onDropdownToggle={handleDropdownToggle}
            onDropdownClose={() => setOpenDropdown(null)}
            onDeletePlace={handleDeletePlace}
          />
        ) : folderId && !currentFolder && !isLoading ? (
          <NotFoundView
            type="folder"
            onNavigateHome={() => navigate('/dashboard')}
          />
        ) : (
          <DashboardView
            folders={folders}
            places={places}
            tags={tags}
            searchQuery={searchQuery}
            filteredFolders={filteredFolders}
            showTagFilter={showTagFilter}
            selectedTags={selectedTags}
            editingPlaceTags={editingPlaceTags}
            selectedPlaceTags={selectedPlaceTags}
            onFolderClick={handleFolderClick}
            onShowAddModal={() => setShowAddModal(true)}
            onShowImport={() => setShowImport(true)}
            onShowTagFilter={setShowTagFilter}
            onShowTagManagement={() => setShowTagManagement(true)}
            onTagFilter={handleTagFilter}
            onClearTagFilters={clearTagFilters}
            onPlaceTagEdit={handlePlaceTagEdit}
            onPlaceTagSave={handlePlaceTagSave}
            onPlaceTagCancel={handlePlaceTagCancel}
            onPlaceTagToggle={handlePlaceTagToggle}
          />
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
