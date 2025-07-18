import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Star, ExternalLink, Trash2, Edit, Calendar, Tag, FolderIcon, MoreVertical } from 'lucide-react';
import { Place, Tag as TagType, List } from '../types';
import { Card, Button, Stack } from './ui';
import { Dropdown } from './ui/Dropdown';
import { Badge } from './ui/Badge';

interface PlaceCardProps {
  place: Place;
  tags?: TagType[];
  lists?: List[];
  onDelete: (id: string) => void;
  onEdit?: (place: Place) => void;
  onTagChange?: (placeId: string, tagIds: string[]) => void;
  onListChange?: (placeId: string, listId: string | null) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  tags = [],
  lists = [],
  onDelete,
  onEdit,
  onTagChange,
  onListChange
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleTagToggle = (tagId: string) => {
    if (!onTagChange) return;

    const currentTagIds = (place.tags || []).map(tag => tag.id);
    const newTagIds = currentTagIds.includes(tagId)
      ? currentTagIds.filter(id => id !== tagId)
      : [...currentTagIds, tagId];

    onTagChange(place.id, newTagIds);
  };

  const handleListChange = (listId: string | null) => {
    if (!onListChange) return;
    onListChange(place.id, listId);
  };

  const getCurrentList = () => {
    return lists.find((list: List) => list.id === place.listId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const tagMenuItems = tags.map((tag: TagType) => ({
    id: tag.id,
    label: tag.name,
    value: tag.id,
    icon: (
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: tag.color }}
      />
    ),
  }));

  const listMenuItems = [
    {
      id: 'none',
      label: 'None',
      value: null,
      icon: <div className="w-3 h-3 rounded border border-gray-300" />,
    },
    ...lists.map((list: List) => ({
      id: list.id,
      label: list.name,
      value: list.id,
      icon: (
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: list.color }}
        />
      ),
    }))
  ];

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      hover={true}
      variant="default"
    >
      <div className="p-5">
        <Stack spacing="md">
          {/* Header with place name and actions */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                {place.name}
              </h3>
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{place.address}</span>
              </div>
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-1 transition-all duration-200 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
              {place.url && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => window.open(place.url, '_blank')}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}

              {onTagChange && tags.length > 0 && (
                <Dropdown
                  trigger={
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Tag className="w-4 h-4" />
                    </Button>
                  }
                  items={tagMenuItems}
                  selectedIds={(place.tags || []).map(tag => tag.id)}
                  onSelect={(item) => handleTagToggle(item.value)}
                  multiSelect
                />
              )}

              {onListChange && lists.length > 0 && (
                <Dropdown
                  trigger={
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <FolderIcon className="w-4 h-4" />
                    </Button>
                  }
                  items={listMenuItems}
                  onSelect={(item) => handleListChange(item.value)}
                />
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

          {/* Tags display */}
          {(place.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(place.tags || []).map(tag => (
                <Badge
                  key={tag.id}
                  color={tag.color}
                  size="sm"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Rating */}
          {place.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{place.rating}</span>
            </div>
          )}

          {/* Notes */}
          {place.notes && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600 line-clamp-2">{place.notes}</p>
            </div>
          )}

          {/* Footer with date and folder */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Added {formatDate(place.createdAt)}</span>
            </div>
            {getCurrentList() && (
              <div className="flex items-center gap-1">
                <FolderIcon className="w-3 h-3" />
                <span>{getCurrentList()?.name}</span>
              </div>
            )}
          </div>
        </Stack>
      </div>

      {/* Subtle hover effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </Card>
  );
};

export default PlaceCard;
