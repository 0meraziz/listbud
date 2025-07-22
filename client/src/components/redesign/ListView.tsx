import React, { useState } from 'react'
import { ArrowLeft, Plus, Map, Grid3X3, Table2, Filter, Search, Tag as TagIcon } from 'lucide-react'
import { List, Place, Tag, ViewMode } from '../../types'
import { Badge } from '../shadcn/badge'
import { PlaceTagsDialog } from './PlaceTagsDialog'
import { EnhancedButton } from '../ui/EnhancedButton'
import { EnhancedCard } from '../ui/EnhancedCard'

interface ListViewProps {
  list: List
  places: Place[]
  tags: Tag[]
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onBack: () => void
  onPlaceCreate: (place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => void
  onPlaceUpdate: (place: Place) => void
  onPlaceDelete: (id: string) => void
  onPlaceSelect: (place: Place) => void
  onListUpdate: (list: List) => void
  onTagCreate: (tag: Omit<Tag, 'id' | 'createdAt'>) => void
  onTagUpdate: (tag: Tag) => void
  onTagDelete: (id: string) => void
}

export const ListView: React.FC<ListViewProps> = ({
  list,
  places,
  tags,
  viewMode,
  onViewModeChange,
  onBack,
  onPlaceCreate,
  onPlaceUpdate,
  onPlaceDelete,
  onPlaceSelect,
  onListUpdate,
  onTagCreate,
  onTagUpdate,
  onTagDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [placeTagsDialogOpen, setPlaceTagsDialogOpen] = useState(false)
  const [selectedPlaceForTags, setSelectedPlaceForTags] = useState<Place | null>(null)

  const filteredPlaces = places.filter(place => {
    const matchesSearch = !searchQuery ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.notes?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tagId => place.tags.some(tag => tag.id === tagId))

    return matchesSearch && matchesTags
  })

  const viewModes: ViewMode[] = [
    { type: 'map', label: 'Map', icon: 'Map' },
    { type: 'gallery', label: 'Gallery', icon: 'Grid3X3' },
    { type: 'table', label: 'Table', icon: 'Table2' },
  ]

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleOpenPlaceTagsDialog = (place: Place, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering place selection
    setSelectedPlaceForTags(place)
    setPlaceTagsDialogOpen(true)
  }

  const handlePlaceTagsUpdate = (updatedPlace: Place) => {
    onPlaceUpdate(updatedPlace)
  }

  // Helper function to determine if a color field contains an emoji or hex code
  const isEmoji = (colorValue: string) => {
    if (colorValue.startsWith('#') && colorValue.length === 7) {
      return false
    }
    return true
  }

  // Helper function to render tag display (emoji or colored dot)
  const renderTagDisplay = (tag: Tag) => {
    if (isEmoji(tag.color)) {
      return <span className="text-sm">{tag.color}</span>
    } else {
      return (
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ backgroundColor: tag.color }}
        />
      )
    }
  }

  const renderPlaceCard = (place: Place) => (
    <EnhancedCard
      key={place.id}
      variant="interactive"
      hover="lift"
      className="cursor-pointer group"
      onClick={() => onPlaceSelect(place)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Map className="h-6 w-6 text-gray-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-body-strong truncate">
                  {place.name}
                </h3>
                <p className="text-body-secondary truncate">
                  {place.address}
                </p>
              </div>

              {/* Tag Management Button */}
              <EnhancedButton
                size="sm"
                variant="outline"
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                onClick={(e: React.MouseEvent) => handleOpenPlaceTagsDialog(place, e)}
                leftIcon={<TagIcon className="h-4 w-4" />}
              />
            </div>

            {place.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {place.tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                    style={{ borderColor: isEmoji(tag.color) ? '#e5e7eb' : tag.color, color: isEmoji(tag.color) ? '#374151' : tag.color }}
                  >
                    {renderTagDisplay(tag)}
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </EnhancedCard>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="page-header px-6 py-4">
        <div className="container-section flex items-center justify-between">
          <div className="flex items-center gap-4">
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={onBack}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            />

            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: list.color }}
              >
                {list.emoji || '📍'}
              </div>
              <div>
                <h1 className="text-heading-2">
                  {list.name}
                </h1>
                <p className="text-body-secondary">
                  {places.length} places
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <EnhancedButton
              variant="default"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Place
            </EnhancedButton>
          </div>
        </div>
      </header>

      {/* Sub-header with view controls */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container-section px-6 py-4">
          <div className="flex items-center justify-between">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {viewModes.map((mode) => (
                <button
                  key={mode.type}
                  onClick={() => onViewModeChange(mode)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode.type === mode.type
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode.type === 'map' && <Map className="h-4 w-4" />}
                  {mode.type === 'gallery' && <Grid3X3 className="h-4 w-4" />}
                  {mode.type === 'table' && <Table2 className="h-4 w-4" />}
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search places..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-search w-64 pl-10"
                />
              </div>

              <EnhancedButton
                variant="outline"
                size="sm"
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filter
              </EnhancedButton>
            </div>
          </div>

          {/* Tag filters */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-2 ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  } border`}
                >
                  {renderTagDisplay(tag)}
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container-section px-6 py-8">
        {viewMode.type === 'map' && (
          <div className="bg-white rounded-xl border border-gray-200 h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Map className="h-12 w-12 mx-auto mb-2" />
              <p>Map view coming soon</p>
            </div>
          </div>
        )}

        {viewMode.type === 'gallery' && (
          <div className="grid-responsive">
            {filteredPlaces.map(renderPlaceCard)}
          </div>
        )}

        {viewMode.type === 'table' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Address</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tags</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlaces.map(place => (
                  <tr key={place.id} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => onPlaceSelect(place)}>
                    <td className="px-6 py-4 text-sm text-gray-900">{place.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{place.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {place.tags.map(tag => (
                          <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {place.rating ? `${place.rating}/5` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <Map className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-heading-3 mb-2">
                No places found
              </h3>
              <p className="text-body-secondary mb-6">
                {searchQuery || selectedTags.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Add your first place to get started'
                }
              </p>
              <EnhancedButton
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Place
              </EnhancedButton>
            </div>
          </div>
        )}
      </main>

      {/* Place Tags Dialog */}
      {selectedPlaceForTags && (
        <PlaceTagsDialog
          open={placeTagsDialogOpen}
          onOpenChange={setPlaceTagsDialogOpen}
          place={selectedPlaceForTags}
          allTags={tags}
          onPlaceUpdate={handlePlaceTagsUpdate}
        />
      )}
    </div>
  )
}
