import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { List } from '../../types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../shadcn/dialog'
import { EnhancedButton } from '../ui/EnhancedButton'
import { generateColorFromString } from '../../lib/utils'

interface NewListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onListCreate: (list: Omit<List, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export const NewListDialog: React.FC<NewListDialogProps> = ({
  open,
  onOpenChange,
  onListCreate,
}) => {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('📍')
  const [color, setColor] = useState('#0ea5e9')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)

    try {
      await onListCreate({
        name: name.trim(),
        emoji,
        color,
        userId: '', // Will be set by the parent
        placeCount: 0,
      })

      // Reset form
      setName('')
      setEmoji('📍')
      setColor('#0ea5e9')
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating list:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    // Auto-generate color based on name
    if (newName.trim()) {
      setColor(generateColorFromString(newName))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Organize your places into a beautiful collection
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview */}
          <div className="text-center">
            <div
              className="inline-block w-20 h-20 rounded-lg flex items-center justify-center text-2xl mb-2"
              style={{ backgroundColor: color }}
            >
              {emoji}
            </div>
            <div className="text-sm text-notion-600">
              {name || 'Untitled List'}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              List Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Tokyo Trip 2024, Favorite Restaurants"
              value={name}
              onChange={handleNameChange}
              required
              className="input w-full"
            />
          </div>

          {/* Emoji Picker */}
          <div className="space-y-2">
            <label htmlFor="emoji" className="text-sm font-medium text-notion-700">
              Icon
            </label>
            <div className="flex gap-2">
              <div
                className="w-10 h-10 rounded-lg border-2 border-notion-200 flex items-center justify-center text-lg cursor-pointer hover:border-primary-500 transition-colors"
                style={{ backgroundColor: emoji ? 'transparent' : color }}
              >
                {emoji}
              </div>
              <div className="flex-1 grid grid-cols-6 gap-1">
                {['📍', '🌍', '🗺️', '✈️', '🏖️', '🏔️', '🍕', '☕', '🏛️', '🎭', '🛍️', '🏃'].map((e) => (
                  <button
                    key={e}
                    type="button"
                    className={`w-8 h-8 rounded-md border border-notion-200 flex items-center justify-center text-sm hover:border-primary-500 transition-colors ${
                      emoji === e ? 'border-primary-500 bg-primary-50' : ''
                    }`}
                    onClick={() => setEmoji(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Input */}
          <div className="space-y-2">
            <label htmlFor="color" className="text-sm font-medium text-notion-700">
              Color
            </label>
            <div className="flex gap-2">
              <input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-notion-200 cursor-pointer"
              />
              <div className="flex-1 grid grid-cols-8 gap-1">
                {[
                  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
                  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
                  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
                  '#ec4899'
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`w-6 h-6 rounded-md border-2 ${
                      color === c ? 'border-notion-700' : 'border-notion-200'
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <EnhancedButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </EnhancedButton>
            <EnhancedButton
              type="submit"
              disabled={!name.trim() || isLoading}
              leftIcon={isLoading ? undefined : <Plus className="h-4 w-4" />}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Creating...
                </>
              ) : (
                'Create List'
              )}
            </EnhancedButton>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
