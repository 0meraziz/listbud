import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownItem {
  id: string;
  label: string;
  value: any;
  color?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  selectedIds?: string[];
  onSelect: (item: DropdownItem) => void;
  onMultiSelect?: (selectedItems: DropdownItem[]) => void;
  placeholder?: string;
  label?: string;
  trigger?: React.ReactNode;
  multiSelect?: boolean;
  searchable?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  selectedIds = [],
  onSelect,
  onMultiSelect,
  placeholder = "Select...",
  label,
  trigger,
  multiSelect = false,
  searchable = false,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = searchable
    ? items.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;

  const selectedItems = items.filter(item => selectedIds.includes(item.id));

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    if (multiSelect) {
      const newSelectedIds = selectedIds.includes(item.id)
        ? selectedIds.filter(id => id !== item.id)
        : [...selectedIds, item.id];

      const newSelectedItems = items.filter(item => newSelectedIds.includes(item.id));
      onMultiSelect?.(newSelectedItems);
    } else {
      onSelect(item);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (selectedItems.length === 0) return placeholder;
    if (multiSelect) {
      return selectedItems.length === 1
        ? selectedItems[0].label
        : `${selectedItems.length} selected`;
    }
    return selectedItems[0]?.label || placeholder;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {trigger ? (
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {trigger}
        </button>
      ) : (
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300
            rounded-lg text-left transition-colors duration-200 hover:border-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span className="text-sm text-gray-700">{getDisplayText()}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                {searchable ? 'No results found' : 'No items available'}
              </div>
            ) : (
              filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 text-left text-sm
                    transition-colors duration-200 hover:bg-gray-50
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${selectedIds.includes(item.id) ? 'bg-blue-50' : ''}
                  `}
                >
                  {item.color && (
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                  )}

                  {item.icon && (
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                  )}

                  <span className="flex-1 font-medium text-gray-900">
                    {item.label}
                  </span>

                  {selectedIds.includes(item.id) && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
