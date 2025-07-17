import React from 'react';
import { Folder, MapPin, ChevronRight, MoreVertical } from 'lucide-react';
import { Folder as FolderType } from '../types';
import { Card, Stack, Badge } from './ui';

interface FolderCardProps {
  folder: FolderType;
  placeCount?: number;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  placeCount,
  onClick,
  onEdit,
  onDelete
}) => {
  const count = placeCount ?? folder.placeCount ?? 0;

  return (
    <Card
      className="group relative overflow-hidden"
      onClick={onClick}
      hover={true}
      clickable={true}
      variant="elevated"
    >
      <div className="p-6">
        <Stack spacing="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-sm"
                style={{
                  backgroundColor: folder.color + '15',
                  border: `2px solid ${folder.color}30`
                }}
              >
                <Folder
                  className="w-6 h-6 transition-all duration-200"
                  style={{ color: folder.color }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
                  {folder.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="bg-gray-100 text-gray-600"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {count} {count === 1 ? 'place' : 'places'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group-hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>

          {/* Progress bar showing relative size */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                backgroundColor: folder.color,
                width: `${Math.min(100, Math.max(8, (count / 50) * 100))}%`
              }}
            />
          </div>
        </Stack>
      </div>

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, ${folder.color} 0%, transparent 50%)`,
        }}
      />
    </Card>
  );
};

export default FolderCard;
