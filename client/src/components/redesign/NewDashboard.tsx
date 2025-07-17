import React, { useState, useEffect } from 'react'
import { Search, Plus, MoreVertical, Grid3X3, Map, Table2, Settings } from 'lucide-react'
import { List, Place, Tag, SearchFilters, ViewMode } from '../../types'
import { NewButton } from '../shadcn/button'
import { Input } from '../shadcn/input'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Badge } from '../shadcn/badge'
import { cn } from '../../lib/utils'
import { ListCard } from './ListCard'
import { ListView } from './ListView'
import { GlobalSearchCommand } from './GlobalSearchCommand'
import { NewListDialog } from './NewListDialog'

interface NewDashboardProps {
  lists: List[]
  places: Place[]
  tags: Tag[]
  onListSelect: (list: List) => void
  onListCreate: (list: Omit<List, 'id' | 'createdAt' | 'updatedAt'>) => void
  onListUpdate: (list: List) => void
  onListDelete: (id: string) => void
  onPlaceCreate: (place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => void
  onPlaceUpdate: (place: Place) => void
  onPlaceDelete: (id: string) => void
  onTagCreate: (tag: Omit<Tag, 'id' | 'createdAt'>) => void
  onTagUpdate: (tag: Tag) => void
  onTagDelete: (id: string) => void
}

export const NewDashboard: React.FC<NewDashboardProps> = ({
  lists,
  places,
  tags,
  onListSelect,
  onListCreate,
  onListUpdate,
  onListDelete,
  onPlaceCreate,
  onPlaceUpdate,
  onPlaceDelete,
  onTagCreate,
  onTagUpdate,
  onTagDelete,
}) => {
  const [currentView, setCurrentView] = useState<'lists' | 'list-detail'>('lists')
  const [selectedList, setSelectedList] = useState<List | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const [showNewListDialog, setShowNewListDialog] = useState(false)
  const [listViewMode, setListViewMode] = useState<ViewMode>({ type: 'map', label: 'Map', icon: 'Map' })

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
    setCurrentView('lists')
    setSelectedList(null)
  }

  const filteredLists = lists.filter(list =>
    searchQuery === '' ||
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const viewModes: ViewMode[] = [
    { type: 'map', label: 'Map', icon: 'Map' },
    { type: 'gallery', label: 'Gallery', icon: 'Grid3X3' },
    { type: 'table', label: 'Table', icon: 'Table2' },
  ]

  if (currentView === 'list-detail' && selectedList) {
    return (
      <ListView
        list={selectedList}
        places={places.filter(p => p.listId === selectedList.id)}
        tags={tags}
        viewMode={listViewMode}
        onViewModeChange={setListViewMode}
        onBack={handleBackToLists}
        onPlaceCreate={onPlaceCreate}
        onPlaceUpdate={onPlaceUpdate}
        onPlaceDelete={onPlaceDelete}
        onListUpdate={onListUpdate}
        onTagCreate={onTagCreate}
        onTagUpdate={onTagUpdate}
        onTagDelete={onTagDelete}
      />
    )
  }

  return (
    <div className="min-h-screen bg-notion-50">
      {/* Header */}
      <header className="notion-header sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-notion-900">
              ListBud
            </h1>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* Global Search */}
            <div className="relative">
              <div
                className="notion-search flex items-center px-3 py-2 cursor-pointer min-w-[300px]"
                onClick={() => setShowGlobalSearch(true)}
              >
                <Search className="h-4 w-4 text-notion-400 mr-2" />
                <span className="text-sm text-notion-400 flex-1">
                  Search all places...
                </span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-notion-100 px-1.5 font-mono text-xs text-notion-500">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            {/* Settings */}
            <NewButton variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </NewButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-notion-900 mb-2">
              Your Lists
            </h2>
            <p className="text-notion-600">
              Organize your saved places into beautiful, searchable collections
            </p>
          </div>

          <NewButton
            onClick={() => setShowNewListDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New List
          </NewButton>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-400" />
            <Input
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lists Grid */}
        <div className="notion-grid notion-grid-4">
          {filteredLists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onSelect={() => handleListSelect(list)}
              onEdit={onListUpdate}
              onDelete={onListDelete}
            />
          ))}

          {/* Empty State */}
          {filteredLists.length === 0 && (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <CardContent>
                  <div className="notion-empty">
                    <div className="mx-auto h-24 w-24 text-notion-300 mb-4">
                      <Grid3X3 className="h-full w-full" />
                    </div>
                    <h3 className="text-lg font-semibold text-notion-900 mb-2">
                      {searchQuery ? 'No lists found' : 'No lists yet'}
                    </h3>
                    <p className="text-notion-500 mb-6">
                      {searchQuery
                        ? 'Try adjusting your search terms'
                        : 'Create your first list to get started organizing your places'
                      }
                    </p>
                    {!searchQuery && (
                      <NewButton
                        onClick={() => setShowNewListDialog(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create Your First List
                      </NewButton>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-notion-900 mb-1">
                {lists.length}
              </div>
              <div className="text-sm text-notion-500">Total Lists</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-notion-900 mb-1">
                {places.length}
              </div>
              <div className="text-sm text-notion-500">Total Places</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-notion-900 mb-1">
                {tags.length}
              </div>
              <div className="text-sm text-notion-500">Total Tags</div>
            </CardContent>
          </Card>
        </div>
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
    </div>
  )
}
