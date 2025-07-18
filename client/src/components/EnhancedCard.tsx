import React from 'react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import {
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Folder,
  Tag as TagIcon
} from 'lucide-react'

// Utility function for classnames
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ')

// Types
interface Tag {
  id: string
  name: string
  color?: string
}

interface CardAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
}

interface EnhancedCardProps {
  variant: 'folder' | 'list' | 'place'
  title: string
  subtitle?: string
  description?: string
  icon?: string | React.ReactNode
  tags?: Tag[]
  coverImage?: string
  actions?: CardAction[]
  selected?: boolean
  hoverable?: boolean
  onClick?: () => void
  className?: string
}

// Card Actions Component
const CardActions: React.FC<{ actions: CardAction[] }> = ({ actions }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="h-8 w-8 p-0"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick()
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2",
                  action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                )}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Get default icon based on variant
const getDefaultIcon = (variant: EnhancedCardProps['variant']) => {
  switch (variant) {
    case 'folder':
      return <Folder className="w-5 h-5 text-blue-500" />
    case 'list':
      return <TagIcon className="w-5 h-5 text-green-500" />
    case 'place':
      return <MapPin className="w-5 h-5 text-red-500" />
    default:
      return <Folder className="w-5 h-5 text-gray-500" />
  }
}

// Main Enhanced Card Component
const EnhancedCard: React.FC<EnhancedCardProps> = ({
  variant,
  title,
  subtitle,
  description,
  icon,
  tags,
  coverImage,
  actions,
  selected,
  hoverable = true,
  onClick,
  className
}) => {
  const displayIcon = icon || getDefaultIcon(variant)

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 overflow-hidden",
        hoverable && "hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300",
        selected && "ring-2 ring-blue-500 ring-offset-2",
        className
      )}
      onClick={onClick}
    >
      {/* Cover Image */}
      {coverImage && (
        <div
          className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center"
          style={coverImage.startsWith('http') ? { backgroundImage: `url(${coverImage})` } : undefined}
        />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {typeof displayIcon === 'string' ? (
                <span className="text-xl">{displayIcon}</span>
              ) : (
                displayIcon
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate text-base">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Actions (show on hover) */}
          {actions && actions.length > 0 && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <CardActions actions={actions} />
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.slice(0, 3).map(tag => (
              <Badge
                key={tag.id}
                variant="secondary"
                size="sm"
                className="text-xs"
                color={tag.color}
              >
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="default" size="sm" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

// Export types for use in other components
export type { EnhancedCardProps, CardAction, Tag }
export default EnhancedCard
