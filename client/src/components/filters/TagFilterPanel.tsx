import React from 'react'
import { X, Plus, Tag as TagIcon } from 'lucide-react'
import { ModernButton } from '../ui/ModernButton'
import { Tag } from '../../types'

interface TagFilterPanelProps {
  title: string
  description: string
  tags: Tag[]
  selectedTags: string[]
  onTagFilter: (tagId: string) => void
  onClearFilters: () => void
  onClose: () => void
  onShowTagManagement: () => void
  filteredCount?: number
  itemType?: string
}

export const TagFilterPanel: React.FC<TagFilterPanelProps> = ({
  title,
  description,
  tags,
  selectedTags,
  onTagFilter,
  onClearFilters,
  onClose,
  onShowTagManagement,
  filteredCount,
  itemType = 'items'
}) => {
  return (
    <div className="list-card mb-6">
      <div className="list-card-header">
        <h3 className="list-card-title text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          {selectedTags.length > 0 && (
            <ModernButton
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              leftIcon={X}
            >
              Clear All
            </ModernButton>
          )}
          <ModernButton
            variant="ghost"
            size="sm"
            onClick={onClose}
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
            <p className="text-sm text-gray-600">{description}</p>
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
            {selectedTags.length > 0 && typeof filteredCount === 'number' && (
              <div className="text-sm text-gray-600 mt-3">
                Filtering by {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
                {' • '}
                {filteredCount} {itemType} match{filteredCount === 1 ? 'es' : ''}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
