import React from 'react';
import { Place } from '../types';

interface PlaceCardProps {
  place: Place;
  onDelete: (id: string) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {place.name}
        </h3>
        <button
          onClick={() => onDelete(place.id)}
          className="text-red-500 hover:text-red-700 ml-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-2">{place.address}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {place.rating && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm text-gray-600 ml-1">{place.rating}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {place.categories.map(category => (
              <span
                key={category.id}
                className="px-2 py-1 text-xs rounded-full text-white"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          {new Date(place.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
