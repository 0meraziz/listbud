import React from 'react'
import { Plus, Upload, FolderOpen, Grid3X3, List as ListIcon, Filter, MapPin, TagIcon } from 'lucide-react'
import { ModernButton } from '../ui/ModernButton'
import { TagFilterPanel } from '../filters/TagFilterPanel'
import { PlaceActionDropdown } from '../place/PlaceActionDropdown'
import { PlaceTagEditor } from '../place/PlaceTagEditor'
import { Place, Tag, Folder } from '../../types'
import { decodeHtmlEntities } from '../../utils/filters'

interface FolderViewProps {
  currentFolder: Folder
  places: Place[]
  tags: Tag[]
  searchQuery: string
  filteredPlaces: Place[]
  viewMode: 'grid' | 'list'
  showTagFilter: boolean
  selectedTags: string[]
  editingPlaceTags: string | null
  selectedPlaceTags: string[]
  openDropdown: string | null
  onBack: () => void
  onViewModeChange: (mode: 'grid' | 'list') => void
  onShowAddModal: () => void
  onShowImport: () => void
  onShowTagFilter: (show: boolean) => void
  onShowTagManagement: () => void
  onTagFilter: (tagId: string) => void
  onClearTagFilters: () => void
  onPlaceClick: (place: Place) => void
  onPlaceTagEdit: (place: Place) => void
  onPlaceTagSave: (placeId: string) => void
  onPlaceTagCancel: () => void
  onPlaceTagToggle: (tagId: string) => void
  onDropdownToggle: (placeId: string) => void
  onDropdownClose: () => void
  onDeletePlace: (placeId: string) => void
}

export const FolderView: React.FC<FolderViewProps> = ({
  currentFolder,
  places,
  tags,
  searchQuery,
  filteredPlaces,
  viewMode,
  showTagFilter,
  selectedTags,
  editingPlaceTags,
  selectedPlaceTags,
  openDropdown,
  onBack,
  onViewModeChange,
  onShowAddModal,
  onShowImport,
  onShowTagFilter,
  onShowTagManagement,
  onTagFilter,
  onClearTagFilters,
  onPlaceClick,
  onPlaceTagEdit,
  onPlaceTagSave,
  onPlaceTagCancel,
  onPlaceTagToggle,
  onDropdownToggle,
  onDropdownClose,
  onDeletePlace
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <ModernButton
            variant="secondary"
            size="sm"
            onClick={onBack}
            leftIcon={FolderOpen}
          >
            Back to Lists
          </ModernButton>
        </div>

        <div className="flex items-center gap-3">
          <div className="view-toggle">
            <button
              className={`view-toggle-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
              Grid
            </button>
            <button
              className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange('list')}
            >
              <ListIcon className="w-4 h-4" />
              List
            </button>
          </div>

          {/* Tag Filter Toggle */}
          <ModernButton
            variant={showTagFilter ? "primary" : "secondary"}
            size="sm"
            onClick={() => onShowTagFilter(!showTagFilter)}
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
            onClick={onShowTagManagement}
            leftIcon={TagIcon}
          >
            Manage Tags
          </ModernButton>
        </div>
      </div>

      {/* Tag Filter Panel */}
      {showTagFilter && (
        <TagFilterPanel
          title="Filter by Tags"
          description="Select tags to filter places. Only places with all selected tags will be shown."
          tags={tags}
          selectedTags={selectedTags}
          filteredCount={filteredPlaces.length}
          onTagFilter={onTagFilter}
          onClearFilters={onClearTagFilters}
          onClose={() => onShowTagFilter(false)}
          onShowTagManagement={onShowTagManagement}
        />
      )}

      {/* Place Tag Editor */}
      {editingPlaceTags && (
        <PlaceTagEditor
          place={places.find(p => p.id === editingPlaceTags)!}
          tags={tags}
          selectedPlaceTags={selectedPlaceTags}
          onTagToggle={onPlaceTagToggle}
          onSave={onPlaceTagSave}
          onCancel={onPlaceTagCancel}
          onShowTagManagement={onShowTagManagement}
        />
      )}

      {/* Content */}
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
                onClick={onShowAddModal}
                leftIcon={Plus}
                size="lg"
              >
                Add Your First Place
              </ModernButton>
              {!searchQuery && (
                <ModernButton
                  variant="secondary"
                  onClick={onShowImport}
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
              onClick={() => onPlaceClick(place)}
            >
              <div className="place-card-content">
                <div className="place-card-header">
                  <h3 className="place-card-title">
                    {decodeHtmlEntities(place.name)}
                  </h3>
                  <PlaceActionDropdown
                    place={place}
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
                          onShowTagFilter(true)
                          onTagFilter(tag.id)
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
  )
}
