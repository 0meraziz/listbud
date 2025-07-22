import React, { useState, useEffect } from 'react'
import { Plus, Check, X, Tag as TagIcon } from 'lucide-react'
import { Place, Tag } from '../../types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../shadcn/dialog'
import { Badge } from '../shadcn/badge'
import { EnhancedButton } from '../ui/EnhancedButton'

interface PlaceTagsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  place: Place
  allTags: Tag[]
  onPlaceUpdate: (place: Place) => void
}

// Helper function to determine if a color field contains an emoji or hex code
const isEmoji = (colorValue: string) => {
  // Check if it's a hex color code
  if (colorValue.startsWith('#') && colorValue.length === 7) {
    return false
  }
  // If it's not a hex code, assume it's an emoji
  return true
}

// Helper function to render tag display (emoji or colored dot)
const renderTagDisplay = (tag: Tag) => {
  if (isEmoji(tag.color)) {
    return <span className="text-lg">{tag.color}</span>
  } else {
    return (
      <span
        className="w-3 h-3 rounded-full inline-block"
        style={{ backgroundColor: tag.color }}
      />
    )
  }
}

export const PlaceTagsDialog: React.FC<PlaceTagsDialogProps> = ({
  open,
  onOpenChange,
  place,
  allTags,
  onPlaceUpdate,
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const currentTagIds = place.tags.map(tag => tag.id)

  const filteredTags = allTags.filter(tag =>
    !searchQuery || tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleTagToggle = (tag: Tag) => {
    const isCurrentlySelected = currentTagIds.includes(tag.id)

    let newTags: Tag[]
    if (isCurrentlySelected) {
      // Remove tag
      newTags = place.tags.filter(t => t.id !== tag.id)
    } else {
      // Add tag
      newTags = [...place.tags, tag]
    }

    const updatedPlace: Place = {
      ...place,
      tags: newTags
    }

    onPlaceUpdate(updatedPlace)
  }

  const handleRemoveTag = (tagId: string) => {
    const newTags = place.tags.filter(t => t.id !== tagId)
    const updatedPlace: Place = {
      ...place,
      tags: newTags
    }
    onPlaceUpdate(updatedPlace)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            Manage Tags for {place.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Tags */}
          <div>
            <h3 className="font-medium text-notion-900 mb-2">Current Tags</h3>
            {place.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {place.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="flex items-center gap-2 pr-1"
                    style={{ borderColor: isEmoji(tag.color) ? '#e5e7eb' : tag.color, color: isEmoji(tag.color) ? '#374151' : tag.color }}
                  >
                    {renderTagDisplay(tag)}
                    {tag.name}
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      className="ml-1 hover:bg-notion-100 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-notion-500">No tags assigned</p>
            )}
          </div>

          {/* Search Tags */}
          <div>
            <h3 className="text-body-strong mb-2">Add Tags</h3>
            <input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="input w-full mb-3"
            />
          </div>

          {/* Available Tags */}
          <div className="max-h-48 overflow-y-auto space-y-2">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => {
                const isSelected = currentTagIds.includes(tag.id)
                return (
                  <div
                    key={tag.id}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-notion-100 border-notion-300'
                        : 'bg-white border-notion-200 hover:bg-notion-50'
                    }`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2"
                      style={{ borderColor: isEmoji(tag.color) ? '#e5e7eb' : tag.color, color: isEmoji(tag.color) ? '#374151' : tag.color }}
                    >
                      {renderTagDisplay(tag)}
                      {tag.name}
                    </Badge>
                    <div className="flex items-center">
                      {isSelected ? (
                        <span className="text-xs text-notion-600">Added</span>
                      ) : (
                        <Plus className="h-4 w-4 text-notion-600" />
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-notion-500 text-center py-4">
                {allTags.length === 0
                  ? 'No tags available. Create some tags first.'
                  : 'No tags match your search.'
                }
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <EnhancedButton onClick={() => onOpenChange(false)}>
            Done
          </EnhancedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
