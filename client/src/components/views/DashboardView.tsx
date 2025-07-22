import React from 'react'
import { Plus, Upload, FolderOpen, MoreVertical, MapPin, TagIcon, Filter, X } from 'lucide-react'
import { ModernButton } from '../ui/ModernButton'
import { TagFilterPanel } from '../filters/TagFilterPanel'
import { PlaceTagEditor } from '../place/PlaceTagEditor'
import { Place, Tag, Folder } from '../../types'
import { decodeHtmlEntities } from '../../utils/filters'

interface DashboardViewProps {
  folders: Folder[]
  places: Place[]
  tags: Tag[]
  searchQuery: string
  filteredFolders: Folder[]
  showTagFilter: boolean
  selectedTags: string[]
  editingPlaceTags: string | null
  selectedPlaceTags: string[]
  onFolderClick: (folder: Folder) => void
  onShowAddModal: () => void
  onShowImport: () => void
  onShowTagFilter: (show: boolean) => void
  onShowTagManagement: () => void
  onTagFilter: (tagId: string) => void
  onClearTagFilters: () => void
  onPlaceTagEdit: (place: Place) => void
  onPlaceTagSave: (placeId: string) => void
  onPlaceTagCancel: () => void
  onPlaceTagToggle: (tagId: string) => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  folders,
  places,
  tags,
  searchQuery,
  filteredFolders,
  showTagFilter,
  selectedTags,
  editingPlaceTags,
  selectedPlaceTags,
  onFolderClick,
  onShowAddModal,
  onShowImport,
  onShowTagFilter,
  onShowTagManagement,
  onTagFilter,
  onClearTagFilters,
  onPlaceTagEdit,
  onPlaceTagSave,
  onPlaceTagCancel,
  onPlaceTagToggle
}) => {
  return (
    <div>
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-heading-2">Your Lists</h2>
        <div className="flex items-center gap-3">
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
        <div className="list-card mb-6">
          <div className="list-card-header">
            <h3 className="list-card-title text-lg">Filter Lists by Tags</h3>
            <div className="flex items-center gap-2">
              {selectedTags.length > 0 && (
                <ModernButton
                  variant="ghost"
                  size="sm"
                  onClick={onClearTagFilters}
                  leftIcon={X}
                >
                  Clear All
                </ModernButton>
              )}
              <ModernButton
                variant="ghost"
                size="sm"
                onClick={() => onShowTagFilter(false)}
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
                  onClick={onShowTagManagement}
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
                      onClick={() => onTagFilter(tag.id)}
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

      {/* Place Tag Editor for Dashboard */}
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
                onClick={onShowAddModal}
                leftIcon={Plus}
                size="lg"
              >
                Create Your First List
              </ModernButton>
              {!searchQuery && (
                <ModernButton
                  variant="secondary"
                  onClick={onShowImport}
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
                onClick={() => onFolderClick(folder)}
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
  )
}
