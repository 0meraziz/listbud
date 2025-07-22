import React, { useState, useEffect } from 'react'
import { Search, Plus, Grid3X3, Upload, Tag as TagIcon, MapPin, List as ListIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { List, Place, Tag, ViewMode } from '../../types'
import { EnhancedButton, EnhancedCard } from '../ui'
import { Badge } from '../shadcn/badge'
import { ListCard } from './ListCard'
import { ListView } from './ListView'
import { PlaceDetailView } from './PlaceDetailView'
import { GlobalSearchCommand, SearchBar } from './GlobalSearchCommand'
import { NewListDialog } from './NewListDialog'
import { TagManagementDialog } from './TagManagementDialog'
import { FloatingActionButton } from './FloatingActionButton'

interface NewDashboardProps {
  lists: List[]
  places: Place[]
  tags: Tag[]
  currentList?: List | null
  currentPlace?: Place | null
  searchQuery?: string
  onSearchChange?: (query: string) => void
  filteredLists?: List[]
  filteredPlaces?: Place[]
  onListSelect: (list: List) => void
  onListCreate: (list: Omit<List, 'id' | 'createdAt' | 'updatedAt'>) => void
  onListUpdate: (list: List) => void
  onListDelete: (id: string) => void
  onPlaceCreate: (place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => void
  onPlaceUpdate: (place: Place) => void
  onPlaceDelete: (id: string) => void
  onPlaceSelect: (place: Place | null) => void
  onTagCreate: (tag: Omit<Tag, 'id' | 'createdAt'>) => void
  onTagUpdate: (tag: Tag) => void
  onTagDelete: (id: string) => void
  onNavigateBack?: () => void
  onImport?: () => void
}

export const NewDashboard: React.FC<NewDashboardProps> = ({
  lists,
  places,
  tags,
  currentList,
  currentPlace,
  searchQuery: externalSearchQuery,
  onSearchChange,
  filteredLists: externalFilteredLists,
  filteredPlaces: externalFilteredPlaces,
  onListSelect,
  onListCreate,
  onListUpdate,
  onListDelete,
  onPlaceCreate,
  onPlaceUpdate,
  onPlaceDelete,
  onPlaceSelect,
  onTagCreate,
  onTagUpdate,
  onTagDelete,
  onNavigateBack,
  onImport,
}) => {
  // Use currentList from props if available, otherwise fall back to internal state
  const [selectedList, setSelectedList] = useState<List | null>(null)
  const activeList = currentList || selectedList

  const [currentView, setCurrentView] = useState<'lists' | 'list-detail'>('lists')
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const [showNewListDialog, setShowNewListDialog] = useState(false)
  const [showTagManagement, setShowTagManagement] = useState(false)
  const [listViewMode, setListViewMode] = useState<ViewMode>({ type: 'gallery', label: 'Gallery', icon: 'Grid3X3' })

  // Use external search state when available, otherwise use internal state
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery
  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query)
    } else {
      setInternalSearchQuery(query)
    }
  }

  // Update view based on currentList prop changes
  useEffect(() => {
    if (currentList) {
      setCurrentView('list-detail')
      setSelectedList(currentList)
    } else {
      setCurrentView('lists')
      setSelectedList(null)
    }
  }, [currentList])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowGlobalSearch(true)
      }
      if (e.key === 'Escape') {
        setShowGlobalSearch(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleListSelect = (list: List) => {
    setSelectedList(list)
    setCurrentView('list-detail')
    onListSelect(list)
  }

  const handleBackToLists = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      // Fallback to internal navigation
      setCurrentView('lists')
      setSelectedList(null)
    }
  }

  // Tag management helper functions
  const handleTagCreate = (name: string, color: string) => {
    onTagCreate({ name, color, userId: '' }) // userId will be set by the API
  }

  const handleTagUpdate = (tag: Tag) => {
    onTagUpdate(tag)
  }

  const handleTagDelete = (id: string) => {
    onTagDelete(id)
  }

  // Use external filtered lists when available, otherwise compute internally
  const filteredLists = externalFilteredLists || lists.filter(list =>
    searchQuery === '' ||
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (currentView === 'list-detail' && activeList) {
    let listPlaces = externalFilteredPlaces || places.filter(p => p.listId === activeList.id)

    // If no places found and this seems to be a data loading issue, show all places as fallback
    if (listPlaces.length === 0 && places.length > 0) {
      console.warn('No places found for list, showing all places as fallback')
      listPlaces = places
    }

    console.log('ListView filtering:', {
      activeListId: activeList.id,
      activeListName: activeList.name,
      totalPlaces: places.length,
      filteredPlaces: listPlaces.length,
      placesWithoutListId: places.filter(p => !p.listId).length,
      placesWithNullListId: places.filter(p => p.listId === null).length,
      placeListIds: places.map(p => ({ name: p.name, listId: p.listId, hasListId: !!p.listId }))
    })
    return (
      <ListView
        list={activeList}
        places={listPlaces}
        tags={tags}
        viewMode={listViewMode}
        onViewModeChange={setListViewMode}
        onBack={handleBackToLists}
        onPlaceCreate={onPlaceCreate}
        onPlaceUpdate={onPlaceUpdate}
        onPlaceDelete={onPlaceDelete}
        onPlaceSelect={onPlaceSelect}
        onListUpdate={onListUpdate}
        onTagCreate={onTagCreate}
        onTagUpdate={onTagUpdate}
        onTagDelete={onTagDelete}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="main-header">
        <div className="flex items-center space-x-4">
          <h1 className="text-heading-2 font-sans">
            ListBud
          </h1>
          <Badge variant="secondary" className="text-xs bg-primary-100 text-primary-700">
            Beta
          </Badge>
        </div>

        <div className="header-actions">
          {/* Global Search */}
          <SearchBar onFocus={() => setShowGlobalSearch(true)} />

          {onImport && (
            <EnhancedButton
              variant="outline"
              onClick={onImport}
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Import
            </EnhancedButton>
          )}

          <EnhancedButton
            variant="outline"
            onClick={() => setShowTagManagement(true)}
            leftIcon={<TagIcon className="h-4 w-4" />}
          >
            Tags
          </EnhancedButton>

          <EnhancedButton
            onClick={() => setShowNewListDialog(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            New List
          </EnhancedButton>

          <div className="user-profile"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content-wrapper py-8">
        {/* Place Detail View */}
        {currentPlace && (
          <PlaceDetailView
            place={currentPlace}
            currentList={activeList}
            allTags={tags}
            onBack={() => onPlaceSelect(null)}
            onPlaceUpdate={onPlaceUpdate}
          />
        )}

        {/* Main Dashboard View */}
        {!currentPlace && (
          <>
            {/* Modern Page Header */}
            <div className="page-title">
              <h2>Your Lists</h2>
              <p>Organize your saved places into beautiful, searchable collections.</p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  placeholder="Search your lists..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Clean Statistics Cards */}
            <div className="stats-container">
              <motion.div whileHover={{ y: -2, scale: 1.02 }}>
                <div className="stat-card">
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <div className="stat-content">
                    <span className="stat-value">{lists.length}</span>
                    <span className="stat-label">Lists Created</span>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -2, scale: 1.02 }}>
                <div className="stat-card">
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="stat-content">
                    <span className="stat-value">{places.length}</span>
                    <span className="stat-label">Places Saved</span>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -2, scale: 1.02 }}>
                <div className="stat-card">
                  <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div className="stat-content">
                    <span className="stat-value">{tags.length}</span>
                    <span className="stat-label">Tags Used</span>
                  </div>
                </div>
              </motion.div>
            </div>

        {/* Modern Lists Grid */}
        <div className="lists-grid">
          {filteredLists.map((list, index) => (
            <motion.div
              key={list.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListCard
                list={list}
                onSelect={() => handleListSelect(list)}
                onEdit={onListUpdate}
                onDelete={onListDelete}
              />
            </motion.div>
          ))}

          {/* Modern Empty State */}
          {filteredLists.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                <Grid3X3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No lists found' : 'Ready to organize your places?'}
              </h3>
              <p className="text-body-secondary mb-8 max-w-md text-center">
                {searchQuery
                  ? 'Try adjusting your search terms or browse all lists'
                  : 'Create your first list to start collecting and organizing all your favorite places'
                }
              </p>
              {!searchQuery && (
                <EnhancedButton
                  onClick={() => setShowNewListDialog(true)}
                  size="lg"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Create Your First List
                </EnhancedButton>
              )}
            </div>
          )}
        </div>
        </>
        )}
      </main>

      {/* Modals */}
      <GlobalSearchCommand
        open={showGlobalSearch}
        onOpenChange={setShowGlobalSearch}
        places={places}
        lists={lists}
        tags={tags}
        onPlaceSelect={(place) => {
          const list = lists.find(l => l.id === place.listId)
          if (list) {
            handleListSelect(list)
          }
          setShowGlobalSearch(false)
        }}
        onListSelect={(list) => {
          handleListSelect(list)
          setShowGlobalSearch(false)
        }}
      />

      <NewListDialog
        open={showNewListDialog}
        onOpenChange={setShowNewListDialog}
        onListCreate={onListCreate}
      />

      <TagManagementDialog
        open={showTagManagement}
        onOpenChange={setShowTagManagement}
        tags={tags}
        onTagCreate={handleTagCreate}
        onTagUpdate={handleTagUpdate}
        onTagDelete={handleTagDelete}
      />

      {/* Floating Action Button - only show on main lists view */}
      {currentView === 'lists' && !currentPlace && (
        <FloatingActionButton
          onClick={() => setShowNewListDialog(true)}
          label="Create new list"
        />
      )}
    </div>
  )
}

const SkeletonListCard = () => (
  <div className="list-card">
    <div className="flex items-center justify-between">
      <div className="card-header">
        <div className="w-8 h-8 rounded-full skeleton"></div>
        <div className="w-24 h-4 rounded skeleton"></div>
      </div>
    </div>
    <div className="card-meta">
      <div className="w-16 h-3 rounded skeleton"></div>
    </div>
    <div className="card-footer">
      <div className="w-32 h-3 rounded skeleton"></div>
    </div>
  </div>
)
