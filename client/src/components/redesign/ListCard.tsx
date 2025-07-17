import React, { useState } from 'react'
import { MoreVertical, MapPin, Calendar, Trash2, Edit3, ExternalLink } from 'lucide-react'
import { List } from '../../types'
import { Card, CardContent, CardHeader } from '../shadcn/card'
import { NewButton } from '../shadcn/button'
import { Badge } from '../shadcn/badge'
import { cn, formatRelativeTime } from '../../lib/utils'

interface ListCardProps {
  list: List
  onSelect: (list: List) => void
  onEdit: (list: List) => void
  onDelete: (id: string) => void
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false)

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(list)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${list.name}"?`)) {
      onDelete(list.id)
    }
  }

  const handleCardClick = () => {
    onSelect(list)
  }

  return (
    <Card
      className="notion-card group cursor-pointer hover:shadow-medium transition-all duration-200 relative overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Cover Image */}
      {list.coverImage ? (
        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${list.coverImage})` }}>
          <div className="h-full w-full bg-black/20" />
        </div>
      ) : (
        <div
          className="h-32 bg-gradient-to-br from-primary-400 to-primary-600"
          style={{ backgroundColor: list.color }}
        />
      )}

      {/* Actions Menu */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <NewButton
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </NewButton>

          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-strong border border-notion-200 py-1 z-50">
              <button
                className="notion-dropdown-item w-full text-left flex items-center gap-2"
                onClick={handleEdit}
              >
                <Edit3 className="h-4 w-4" />
                Edit List
              </button>
              <button
                className="notion-dropdown-item w-full text-left flex items-center gap-2 text-error-600 hover:bg-error-50"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                Delete List
              </button>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">
            {list.emoji || '📍'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-notion-900 truncate">
              {list.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-notion-500">
              <MapPin className="h-3 w-3" />
              <span>{list.placeCount} places</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-notion-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatRelativeTime(list.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="h-3 w-3" />
            <span>Open</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
