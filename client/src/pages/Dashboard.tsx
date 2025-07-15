import React, { useState, useEffect } from 'react';
import { placesService, categoriesService } from '../services/api';
import { Place, Category, SearchFilters } from '../types';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import PlaceCard from '../components/PlaceCard';
import ImportTakeout from '../components/ImportTakeout';

const Dashboard: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [placesData, categoriesData] = await Promise.all([
        placesService.getPlaces(),
        categoriesService.getCategories()
      ]);

      setPlaces(placesData);
      setCategories(categoriesData);
      setFilteredPlaces(placesData);
    } catch (err: any) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    try {
      if (filters.query === '' && filters.categories.length === 0) {
        setFilteredPlaces(places);
      } else {
        const searchResults = await placesService.searchPlaces(filters);
        setFilteredPlaces(searchResults);
      }
    } catch (err: any) {
      setError('Search failed');
      console.error('Search error:', err);
    }
  };

  const handleDeletePlace = async (id: string) => {
    try {
      await placesService.deletePlace(id);
      setPlaces(prev => prev.filter(place => place.id !== id));
      setFilteredPlaces(prev => prev.filter(place => place.id !== id));
    } catch (err: any) {
      setError('Failed to delete place');
      console.error('Delete error:', err);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Places</h1>
            <p className="mt-2 text-sm text-gray-700">
              {places.length} places saved
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowImport(!showImport)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {showImport ? 'Hide Import' : 'Import Places'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {showImport && (
          <div className="mt-6">
            <ImportTakeout />
          </div>
        )}

        <div className="mt-6">
          <SearchBar onSearch={handleSearch} categories={categories} />
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No places found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {places.length === 0
                ? 'Get started by importing your places from Google Takeout.'
                : 'Try adjusting your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlaces.map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                onDelete={handleDeletePlace}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
