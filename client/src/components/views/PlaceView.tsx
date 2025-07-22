import React from 'react'
import { FolderOpen, MapPin, Star, TagIcon } from 'lucide-react'
import { ModernButton } from '../ui/ModernButton'
import { PlaceActionDropdown } from '../place/PlaceActionDropdown'
import { PlaceTagEditor } from '../place/PlaceTagEditor'
import { Place, Tag, Folder } from '../../types'
import { decodeHtmlEntities } from '../../utils/filters'

interface PlaceViewProps {
  currentPlace: Place
  places: Place[]
  folders: Folder[]
  tags: Tag[]
  editingPlaceTags: string | null
  selectedPlaceTags: string[]
  openDropdown: string | null
  onBack: () => void
  onShowAddModal: () => void
  onShowTagFilter: (show: boolean) => void
  onTagFilter: (tagId: string) => void
  onPlaceClick: (place: Place) => void
  onPlaceTagEdit: (place: Place) => void
  onPlaceTagSave: (placeId: string) => void
  onPlaceTagCancel: () => void
  onPlaceTagToggle: (tagId: string) => void
  onShowTagManagement: () => void
  onDropdownToggle: (placeId: string) => void
  onDropdownClose: () => void
  onDeletePlace: (placeId: string) => void
}

export const PlaceView: React.FC<PlaceViewProps> = ({
  currentPlace,
  places,
  folders,
  tags,
  editingPlaceTags,
  selectedPlaceTags,
  openDropdown,
  onBack,
  onShowAddModal,
  onShowTagFilter,
  onTagFilter,
  onPlaceClick,
  onPlaceTagEdit,
  onPlaceTagSave,
  onPlaceTagCancel,
  onPlaceTagToggle,
  onShowTagManagement,
  onDropdownToggle,
  onDropdownClose,
  onDeletePlace
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <ModernButton
          variant="secondary"
          size="sm"
          onClick={onBack}
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
            <PlaceActionDropdown
              place={currentPlace}
              position="left"
              openDropdown={openDropdown}
              onToggle={onDropdownToggle}
              onTagEdit={(placeId) => {
                const placeToEdit = places.find(p => p.id === placeId)
                if (placeToEdit) onPlaceTagEdit(placeToEdit)
              }}
              onDelete={onDeletePlace}
              onClose={onDropdownClose}
            />
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
                      onBack()
                      onShowTagFilter(true)
                      onTagFilter(tag.id)
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

      {/* Place Tag Editor for Place Detail View */}
      {editingPlaceTags === currentPlace?.id && (
        <PlaceTagEditor
          place={currentPlace}
          tags={tags}
          selectedPlaceTags={selectedPlaceTags}
          onTagToggle={onPlaceTagToggle}
          onSave={onPlaceTagSave}
          onCancel={onPlaceTagCancel}
          onShowTagManagement={onShowTagManagement}
        />
      )}

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
                  onClick={() => onPlaceClick(place)}
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
                              onBack()
                              onShowTagFilter(true)
                              onTagFilter(tag.id)
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
                  onClick={onShowAddModal}
                  leftIcon={FolderOpen}
                >
                  Add Another Place
                </ModernButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
