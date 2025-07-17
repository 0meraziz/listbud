import React, { useState } from 'react'
import { ArrowLeft, Plus, Map, Grid3X3, Table2, Filter, Search } from 'lucide-react'
import { List, Place, Tag, ViewMode } from '../../types'
import { NewButton } from '../shadcn/button'
import { Input } from '../shadcn/input'
import { Badge } from '../shadcn/badge'
import { Card, CardContent } from '../shadcn/card'

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
  onListUpdate,
  onTagCreate,
  onTagUpdate,
  onTagDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

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

  const renderPlaceCard = (place: Place) => (
    <Card key={place.id} className="notion-card">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-notion-100 flex items-center justify-center flex-shrink-0">
            <Map className="h-6 w-6 text-notion-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-notion-900 truncate">
              {place.name}
            </h3>
            <p className="text-sm text-notion-500 truncate">
              {place.address}
            </p>

            {place.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {place.tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: tag.color, color: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-notion-50">
      {/* Header */}
      <header className="notion-header sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <NewButton
              variant="ghost"
              size="icon"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </NewButton>

            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: list.color }}
              >
                {list.emoji || '📍'}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-notion-900">
                  {list.name}
                </h1>
                <p className="text-sm text-notion-500">
                  {places.length} places
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NewButton className="gap-2">
              <Plus className="h-4 w-4" />
              Add Place
            </NewButton>
          </div>
        </div>
      </header>

      {/* Sub-header with view controls */}
      <div className="border-b border-notion-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-notion-100 rounded-lg p-1">
              {viewModes.map((mode) => (
                <button
                  key={mode.type}
                  onClick={() => onViewModeChange(mode)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode.type === mode.type
                      ? 'bg-white text-notion-900 shadow-sm'
                      : 'text-notion-600 hover:text-notion-900'
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-400" />
                <Input
                  placeholder="Search places..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <NewButton variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </NewButton>
            </div>
          </div>

          {/* Tag filters */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag.id)
                      ? 'bg-primary-100 text-primary-800 border-primary-200'
                      : 'bg-notion-100 text-notion-700 border-notion-200 hover:bg-notion-200'
                  } border`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {viewMode.type === 'map' && (
          <div className="bg-white rounded-xl border border-notion-200 h-96 flex items-center justify-center">
            <div className="text-center text-notion-500">
              <Map className="h-12 w-12 mx-auto mb-2" />
              <p>Map view coming soon</p>
            </div>
          </div>
        )}

        {viewMode.type === 'gallery' && (
          <div className="notion-grid notion-grid-3">
            {filteredPlaces.map(renderPlaceCard)}
          </div>
        )}

        {viewMode.type === 'table' && (
          <div className="bg-white rounded-xl border border-notion-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-notion-50 border-b border-notion-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-notion-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-notion-700">Address</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-notion-700">Tags</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-notion-700">Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlaces.map(place => (
                  <tr key={place.id} className="border-b border-notion-200 hover:bg-notion-50">
                    <td className="px-6 py-4 text-sm text-notion-900">{place.name}</td>
                    <td className="px-6 py-4 text-sm text-notion-600">{place.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {place.tags.map(tag => (
                          <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-notion-600">
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
            <div className="notion-empty">
              <Map className="h-12 w-12 mx-auto mb-4 text-notion-300" />
              <h3 className="text-lg font-semibold text-notion-900 mb-2">
                No places found
              </h3>
              <p className="text-notion-500 mb-6">
                {searchQuery || selectedTags.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Add your first place to get started'
                }
              </p>
              <NewButton className="gap-2">
                <Plus className="h-4 w-4" />
                Add Place
              </NewButton>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
