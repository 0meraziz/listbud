import React from 'react';
import { Folder, MapPin, ChevronRight } from 'lucide-react';
import { Folder as FolderType } from '../types';
import { Card, Stack } from './ui';

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
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 group"
      onClick={onClick}
    >
      <div className="p-4">
        <Stack spacing="sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: folder.color + '20' }}
              >
                <Folder 
                  className="w-5 h-5" 
                  style={{ color: folder.color }}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {folder.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{placeCount ?? folder.placeCount ?? 0} places</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Stack>
      </div>
    </Card>
  );
};

export default FolderCard;
