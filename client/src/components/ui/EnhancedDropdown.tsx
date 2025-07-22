import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

/**
 * Enhanced Dropdown Component with centralized design system
 * Replaces scattered dropdown/menu styling patterns across the application
 */

export interface DropdownItem {
  id: string
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive'
  disabled?: boolean
  onClick?: () => void
}

export interface EnhancedDropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
  onItemClick?: (item: DropdownItem) => void
}

const EnhancedDropdown: React.FC<EnhancedDropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return

    item.onClick?.()
    onItemClick?.(item)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'dropdown-menu absolute top-full mt-1 w-48',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              className={cn(
                'dropdown-item',
                item.variant === 'destructive' && 'dropdown-item-destructive',
                item.disabled && 'state-disabled'
              )}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
            >
              {item.icon && (
                <span className="flex-shrink-0">{item.icon}</span>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { EnhancedDropdown }
