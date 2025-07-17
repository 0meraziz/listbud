import React, { useState } from 'react';
import { X, Save, MapPin, ExternalLink, FileText, Star } from 'lucide-react';
import { placesService } from '../services/api';
import { Place } from '../types';
import { Button, Input, Card, Stack, Modal } from './ui';

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
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        tags: [], // Add empty tags array for new places
        visited: false, // Add default visited value
        placeId: undefined, // Add optional placeId
        listId: undefined, // Add optional listId
      };

      const newPlace = await placesService.createPlace(placeData as any);
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Place"
      size="lg"
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Place Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter place name"
              required
              leftIcon={MapPin}
              helperText="The name of the place or business"
            />

            <Input
              label="Rating"
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              placeholder="1.0 - 5.0"
              step="0.1"
              min="1"
              max="5"
              leftIcon={Star}
              helperText="Optional rating from 1 to 5 stars"
            />
          </div>

          <Input
            label="Address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter full address"
            required
            leftIcon={MapPin}
            helperText="The complete address of the place"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="0.0"
              step="any"
              helperText="Optional GPS coordinate"
            />
            <Input
              label="Longitude"
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="0.0"
              step="any"
              helperText="Optional GPS coordinate"
            />
          </div>

          <Input
            label="Website or Link"
            type="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://maps.google.com/..."
            leftIcon={ExternalLink}
            helperText="Website, Google Maps link, or any relevant URL"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any notes about this place..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Any additional information, memories, or tips about this place
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1"
              leftIcon={Save}
              loading={isLoading}
            >
              Add Place
            </Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddPlaceModal;
