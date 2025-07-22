import React, { useState } from 'react'
import { Plus, Edit3, Trash2, Tag as TagIcon } from 'lucide-react'
import { Tag } from '../../types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../shadcn/dialog'
import { Badge } from '../shadcn/badge'
import { EnhancedButton } from '../ui/EnhancedButton'
import { EnhancedCard } from '../ui/EnhancedCard'

interface TagManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tags: Tag[]
  onTagCreate: (name: string, color: string) => void
  onTagUpdate: (tag: Tag) => void
  onTagDelete: (id: string) => void
}

const DEFAULT_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6B7280', // Gray
]

const DEFAULT_EMOJIS = [
  '🏷️', '🍽️', '🏨', '🎭', '🏪', '☕', '🏋️', '🎯', '📚', '🎵',
  '🌟', '💼', '🎨', '🌮', '🍕', '🎪', '🛍️', '🎸', '🎮', '⚽'
]

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

export const TagManagementDialog: React.FC<TagManagementDialogProps> = ({
  open,
  onOpenChange,
  tags,
  onTagCreate,
  onTagUpdate,
  onTagDelete,
}) => {
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState(DEFAULT_COLORS[0])
  const [isUsingEmoji, setIsUsingEmoji] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [editIsUsingEmoji, setEditIsUsingEmoji] = useState(false)

  const handleCreateTag = () => {
    if (!newTagName.trim()) return

    const tagColor = isUsingEmoji ? newTagColor : newTagColor
    onTagCreate(newTagName.trim(), tagColor)
    setNewTagName('')
    setNewTagColor(isUsingEmoji ? DEFAULT_EMOJIS[0] : DEFAULT_COLORS[0])
  }

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag)
    setEditName(tag.name)
    setEditColor(tag.color)
    setEditIsUsingEmoji(isEmoji(tag.color))
  }

  const handleSaveEdit = () => {
    if (!editingTag || !editName.trim()) return

    onTagUpdate({
      ...editingTag,
      name: editName.trim(),
      color: editColor,
    })

    setEditingTag(null)
    setEditName('')
    setEditColor('')
    setEditIsUsingEmoji(false)
  }

  const handleCancelEdit = () => {
    setEditingTag(null)
    setEditName('')
    setEditColor('')
    setEditIsUsingEmoji(false)
  }

  const handleDeleteTag = (tagId: string) => {
    if (window.confirm('Are you sure you want to delete this tag? This will remove it from all places.')) {
      onTagDelete(tagId)
    }
  }

  const handleEmojiModeToggle = (useEmoji: boolean) => {
    setIsUsingEmoji(useEmoji)
    if (useEmoji) {
      setNewTagColor(DEFAULT_EMOJIS[0])
    } else {
      setNewTagColor(DEFAULT_COLORS[0])
    }
  }

  const handleEditEmojiModeToggle = (useEmoji: boolean) => {
    setEditIsUsingEmoji(useEmoji)
    if (useEmoji) {
      setEditColor(DEFAULT_EMOJIS[0])
    } else {
      setEditColor(DEFAULT_COLORS[0])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TagIcon className="w-5 h-5" />
            Manage Tags
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Tag Section */}
          <EnhancedCard>
            <div className="p-4">
              <h3 className="text-heading-3 mb-4">Create New Tag</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
                    Tag Name
                  </label>
                  <input
                    id="tagName"
                    value={newTagName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name..."
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter') {
                        handleCreateTag()
                      }
                    }}
                    className="input w-full"
                  />
                </div>

                {/* Toggle between Color and Emoji */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style
                  </label>
                  <div className="flex gap-2 mb-3">
                    <EnhancedButton
                      variant={!isUsingEmoji ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEmojiModeToggle(false)}
                    >
                      Color
                    </EnhancedButton>
                    <EnhancedButton
                      variant={isUsingEmoji ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEmojiModeToggle(true)}
                    >
                      Emoji
                    </EnhancedButton>
                  </div>

                  {isUsingEmoji ? (
                    <div className="grid grid-cols-10 gap-2">
                      {DEFAULT_EMOJIS.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => setNewTagColor(emoji)}
                          className={`w-8 h-8 rounded border-2 text-lg hover:bg-gray-50 ${
                            newTagColor === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-10 gap-2">
                      {DEFAULT_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewTagColor(color)}
                          className={`w-8 h-8 rounded border-2 ${
                            newTagColor === color ? 'border-blue-500' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <EnhancedButton
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Create Tag
                  </EnhancedButton>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-gray-500">Preview:</span>
                    <Badge variant="secondary" className="flex items-center gap-2">
                      {renderTagDisplay({ name: newTagName || 'New Tag', color: newTagColor } as Tag)}
                      {newTagName || 'New Tag'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </EnhancedCard>

          {/* Existing Tags Section */}
          <EnhancedCard>
            <div className="p-4">
              <h3 className="text-heading-3 mb-4">Existing Tags ({tags.length})</h3>

              {tags.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TagIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tags created yet</p>
                  <p className="text-sm">Create your first tag above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tags.map(tag => (
                    <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      {editingTag?.id === tag.id ? (
                        <div className="flex-1 space-y-3">
                          <input
                            value={editName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                            placeholder="Tag name..."
                            className="input w-full"
                          />

                          {/* Edit Style Toggle */}
                          <div className="flex gap-2 mb-2">
                            <EnhancedButton
                              variant={!editIsUsingEmoji ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleEditEmojiModeToggle(false)}
                            >
                              Color
                            </EnhancedButton>
                            <EnhancedButton
                              variant={editIsUsingEmoji ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleEditEmojiModeToggle(true)}
                            >
                              Emoji
                            </EnhancedButton>
                          </div>

                          {editIsUsingEmoji ? (
                            <div className="grid grid-cols-10 gap-1">
                              {DEFAULT_EMOJIS.map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => setEditColor(emoji)}
                                  className={`w-6 h-6 rounded border text-sm hover:bg-gray-50 ${
                                    editColor === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-10 gap-1">
                              {DEFAULT_COLORS.map(color => (
                                <button
                                  key={color}
                                  onClick={() => setEditColor(color)}
                                  className={`w-6 h-6 rounded border ${
                                    editColor === color ? 'border-blue-500' : 'border-gray-300'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <EnhancedButton size="sm" onClick={handleSaveEdit}>
                              Save
                            </EnhancedButton>
                            <EnhancedButton size="sm" variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </EnhancedButton>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            {renderTagDisplay(tag)}
                            <span className="font-medium">{tag.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <EnhancedButton
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditTag(tag)}
                              leftIcon={<Edit3 className="w-4 h-4" />}
                            />
                            <EnhancedButton
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteTag(tag.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              leftIcon={<Trash2 className="w-4 h-4" />}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </EnhancedCard>
        </div>

        <DialogFooter>
          <EnhancedButton variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </EnhancedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
