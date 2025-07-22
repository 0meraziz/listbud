import React from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical, Tags, Edit, Trash2 } from 'lucide-react'
import { ModernButton } from '../ui/ModernButton'
import { Place } from '../../types'

interface PlaceActionDropdownProps {
  place: Place
  position?: 'left' | 'right'
  openDropdown: string | null
  onToggle: (placeId: string) => void
  onTagEdit: (placeId: string) => void
  onDelete: (placeId: string) => void
  onClose: () => void
}

export const PlaceActionDropdown: React.FC<PlaceActionDropdownProps> = ({
  place,
  position = 'right',
  openDropdown,
  onToggle,
  onTagEdit,
  onDelete,
  onClose
}) => {
  const [buttonRect, setButtonRect] = React.useState<DOMRect | null>(null)
  const buttonRef = React.useRef<HTMLDivElement>(null)

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setButtonRect(rect)
    }
  }

  React.useEffect(() => {
    if (openDropdown === place.id) {
      updatePosition()
      window.addEventListener('scroll', updatePosition)
      window.addEventListener('resize', updatePosition)
      return () => {
        window.removeEventListener('scroll', updatePosition)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [openDropdown, place.id])

  const handleEditPlace = () => {
    // TODO: Implement edit place functionality
    onClose()
  }

  return (
    <div
      className="relative"
      ref={buttonRef}
      onClick={(e) => e.stopPropagation()}
    >
      <ModernButton
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.stopPropagation()
          onToggle(place.id)
        }}
      >
        <MoreVertical className="w-4 h-4" />
      </ModernButton>

      {openDropdown === place.id && createPortal(
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 z-[9998]" onClick={onClose} />
          <div
            className="fixed z-[9999] min-w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 backdrop-blur-sm"
            style={{
              top: buttonRect ? Math.min(
                buttonRect.bottom + window.scrollY + 4,
                window.innerHeight + window.scrollY - 200 // Keep dropdown visible
              ) : 200,
              left: buttonRect ? (() => {
                const dropdownWidth = 208; // min-w-52 = 208px
                let leftPosition;

                if (position === 'left') {
                  // Align right edge of dropdown with right edge of button
                  leftPosition = buttonRect.right - dropdownWidth + window.scrollX;
                } else {
                  // Align left edge of dropdown with left edge of button
                  leftPosition = buttonRect.left + window.scrollX;
                }

                // Ensure dropdown stays within viewport
                const minLeft = window.scrollX + 8;
                const maxLeft = window.scrollX + window.innerWidth - dropdownWidth - 8;

                return Math.max(minLeft, Math.min(leftPosition, maxLeft));
              })() : 200,
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
              onClick={() => onTagEdit(place.id)}
            >
              <Tags className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
              Manage Tags
            </button>
            <button
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
              onClick={handleEditPlace}
            >
              <Edit className="w-4 h-4 group-hover:text-green-600 transition-colors" />
              Edit Place
            </button>
            <hr className="my-2 border-gray-100" />
            <button
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
              onClick={() => onDelete(place.id)}
            >
              <Trash2 className="w-4 h-4" />
              Delete Place
            </button>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
