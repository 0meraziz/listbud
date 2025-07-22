import React from 'react'
import { motion } from 'framer-motion'
import { MoreVertical, Edit3, Trash2 } from 'lucide-react'
import { List } from '../../types'
import { EnhancedButton, EnhancedDropdown } from '../ui'
import { formatRelativeTime } from '../../lib/utils'

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
  onDelete
}) => {
  const handleCardClick = () => {
    onSelect(list)
  }

  const dropdownItems = [
    {
      id: 'edit',
      label: 'Edit List',
      icon: <Edit3 className="h-4 w-4" />,
      onClick: () => onEdit(list)
    },
    {
      id: 'delete',
      label: 'Delete List',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive' as const,
      onClick: () => {
        if (window.confirm(`Are you sure you want to delete "${list.name}"?`)) {
          onDelete(list.id)
        }
      }
    }
  ]

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onClick={handleCardClick}
      className="w-full h-full"
    >
      <div className="list-card group">
        {/* Card Header - Clean and Always Visible */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{list.emoji || '🗺️'}</span>
            <h3 className="card-title">{list.name}</h3>
          </div>

          {/* Enhanced Actions Dropdown - Clean and Always Visible */}
          <div className="opacity-60 hover:opacity-100 transition-opacity duration-200">
            <EnhancedDropdown
              trigger={
                <EnhancedButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  className="h-8 w-8 p-1 rounded"
                  title="List options"
                >
                  <MoreVertical className="h-4 w-4" />
                </EnhancedButton>
              }
              items={dropdownItems}
              align="right"
            />
          </div>
        </div>

        {/* Card Content - Always Visible with Clear Hierarchy */}
        <div className="card-meta mb-4">
          <span className="text-sm font-medium text-gray-600">
            {list.placeCount} {list.placeCount === 1 ? 'place' : 'places'}
          </span>
        </div>

        {/* Card Footer - Subtle but Always Readable */}
        <div className="card-footer">
          <span className="text-xs text-gray-400">
            Updated {formatRelativeTime(list.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
