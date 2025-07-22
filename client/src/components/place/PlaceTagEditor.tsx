import React from 'react'
import { Tags, Plus, TagIcon } from 'lucide-react'
import { ModernButton } from '../ui/ModernButton'
import { Place, Tag } from '../../types'

// Utility function
const decodeHtmlEntities = (text: string): string => {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = text
  return textArea.value
}

interface PlaceTagEditorProps {
  place: Place
  tags: Tag[]
  selectedPlaceTags: string[]
  onTagToggle: (tagId: string) => void
  onSave: (placeId: string) => void
  onCancel: () => void
  onShowTagManagement: () => void
}

export const PlaceTagEditor: React.FC<PlaceTagEditorProps> = ({
  place,
  tags,
  selectedPlaceTags,
  onTagToggle,
  onSave,
  onCancel,
  onShowTagManagement
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tags className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Edit Tags</h3>
              <p className="text-sm text-gray-600">{decodeHtmlEntities(place.name)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModernButton
              variant="primary"
              size="sm"
              onClick={() => onSave(place.id)}
              className="shadow-sm"
            >
              Save Changes
            </ModernButton>
            <ModernButton
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </ModernButton>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-6">
          Select tags to assign to this place. You can select multiple tags to organize and categorize your places.
        </p>
        {tags.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No tags available</p>
            <p className="text-gray-500 text-sm mb-6">Create tags first to organize your places</p>
            <ModernButton
              variant="primary"
              size="sm"
              onClick={onShowTagManagement}
              leftIcon={Plus}
            >
              Create Your First Tag
            </ModernButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onTagToggle(tag.id)}
                  className={`relative px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 font-medium text-sm ${
                    selectedPlaceTags.includes(tag.id)
                      ? 'border-transparent shadow-md transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: selectedPlaceTags.includes(tag.id)
                      ? tag.color
                      : `${tag.color}08`,
                    color: selectedPlaceTags.includes(tag.id)
                      ? '#ffffff'
                      : tag.color,
                  }}
                >
                  <TagIcon className="w-4 h-4" />
                  {tag.name}
                  {selectedPlaceTags.includes(tag.id) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {selectedPlaceTags.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700">
                  <Tags className="w-4 h-4" />
                  <span className="font-medium">
                    {selectedPlaceTags.length} tag{selectedPlaceTags.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
