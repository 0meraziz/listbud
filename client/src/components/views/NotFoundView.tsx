import React from 'react'
import { FolderOpen, MapPin } from 'lucide-react'
import { ModernButton } from '../ui/ModernButton'

interface NotFoundViewProps {
  type: 'place' | 'folder'
  onNavigateHome: () => void
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ type, onNavigateHome }) => {
  const isPlace = type === 'place'

  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          {isPlace ? (
            <MapPin className="w-8 h-8 text-red-600" />
          ) : (
            <FolderOpen className="w-8 h-8 text-red-600" />
          )}
        </div>
        <h3 className="text-heading-3 mb-3">
          {isPlace ? 'Place not found' : 'List not found'}
        </h3>
        <p className="text-body-secondary mb-8">
          {isPlace
            ? "The place you're looking for might have been deleted or you don't have access to it."
            : "The list you're looking for might have been deleted or you don't have access to it."
          }
        </p>
        <ModernButton
          onClick={onNavigateHome}
          leftIcon={FolderOpen}
        >
          Return to Dashboard
        </ModernButton>
      </div>
    </div>
  )
}
