import React, { useState } from 'react';
import { X, Save, MapPin, ExternalLink, FileText } from 'lucide-react';
import { placesService } from '../services/api';
import { Place } from '../types';
import { Button, Input, Card, Stack } from './ui';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceAdded: (place: Place) => void;
}

const AddPlaceModal: React.FC<AddPlaceModalProps> = ({ isOpen, onClose, onPlaceAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    url: '',
    notes: '',
    rating: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address) {
      setError('Name and address are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const placeData = {
        name: formData.name,
        address: formData.address,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        url: formData.url,
        notes: formData.notes,
        rating: formData.rating ? parseFloat(formData.rating) : undefined
      };

      const newPlace = await placesService.createPlace(placeData);
      onPlaceAdded(newPlace);
      onClose();

      // Reset form
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        url: '',
        notes: '',
        rating: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add place');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Place</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing="md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter place name"
                  required
                  leftIcon={MapPin}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  required
                  leftIcon={MapPin}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    step="any"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    step="any"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <Input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                  leftIcon={ExternalLink}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <Input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="1.0 - 5.0"
                  step="0.1"
                  min="1"
                  max="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any notes about this place..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="flex-1"
                  leftIcon={Save}
                >
                  {isLoading ? 'Adding...' : 'Add Place'}
                </Button>
              </div>
            </Stack>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AddPlaceModal;
