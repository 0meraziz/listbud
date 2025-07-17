import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Star, ExternalLink, Trash2, Edit, Calendar, Tag, FolderIcon } from 'lucide-react';
import { Place, Category, Folder } from '../types';
import { Card, Button, Stack } from './ui';

interface PlaceCardProps {
  place: Place;
  categories?: Category[];
  folders?: Folder[];
  onDelete: (id: string) => void;
  onEdit?: (place: Place) => void;
  onCategoryChange?: (placeId: string, categoryIds: string[]) => void;
  onFolderChange?: (placeId: string, folderId: string | null) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  categories,
  folders,
  onDelete,
  onEdit,
  onCategoryChange,
  onFolderChange
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const folderMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setShowCategoryMenu(false);
      }
      if (folderMenuRef.current && !folderMenuRef.current.contains(event.target as Node)) {
        setShowFolderMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    if (!onCategoryChange) return;

    const currentCategoryIds = place.categories.map(cat => cat.id);
    const newCategoryIds = currentCategoryIds.includes(categoryId)
      ? currentCategoryIds.filter(id => id !== categoryId)
      : [...currentCategoryIds, categoryId];

    onCategoryChange(place.id, newCategoryIds);
  };

  const handleFolderChange = (folderId: string | null) => {
    if (!onFolderChange) return;
    onFolderChange(place.id, folderId);
    setShowFolderMenu(false);
  };

  const getCurrentFolder = () => {
    return folders?.find(folder => folder.id === place.folderId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      hover
      padding="md"
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Stack spacing="sm">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {place.name}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{place.address}</span>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {onCategoryChange && (
              <div className="relative" ref={categoryMenuRef}>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Tag className="w-4 h-4" />
                </Button>
                {showCategoryMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-700 mb-2">Categories</p>
                      <div className="max-h-32 overflow-y-auto">
                        {categories?.map(category => (
                          <label key={category.id} className="flex items-center gap-2 py-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={place.categories.some(cat => cat.id === category.id)}
                              onChange={() => handleCategoryToggle(category.id)}
                              className="w-3 h-3 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {onFolderChange && (
              <div className="relative" ref={folderMenuRef}>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowFolderMenu(!showFolderMenu)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <FolderIcon className="w-4 h-4" />
                </Button>
                {showFolderMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-700 mb-2">Move to Folder</p>
                      <div className="max-h-32 overflow-y-auto">
                        <button
                          onClick={() => handleFolderChange(null)}
                          className="w-full text-left py-1 px-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          None
                        </button>
                        {folders?.map(folder => (
                          <button
                            key={folder.id}
                            onClick={() => handleFolderChange(folder.id)}
                            className="w-full text-left py-1 px-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          >
                            {folder.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(place)}
                className="text-gray-500 hover:text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onDelete(place.id)}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <Stack spacing="xs">
          {/* Rating */}
          {place.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{place.rating}</span>
            </div>
          )}

          {/* Notes */}
          {place.notes && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
              {place.notes}
            </div>
          )}

          {/* Categories */}
          {place.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {place.categories.map(category => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                    borderColor: `${category.color}40`,
                  }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </Stack>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(place.createdAt)}
          </div>

          {place.url && (
            <Button
              variant="ghost"
              size="xs"
              as="a"
              href={place.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Stack>
    </Card>
  );
};

export default PlaceCard;
