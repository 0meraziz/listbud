import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, ArrowLeft, FolderOpen } from 'lucide-react';
import { placesService, categoriesService, foldersService } from '../services/api';
import { Place, Category, Folder, SearchFilters } from '../types';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import PlaceCard from '../components/PlaceCard';
import FolderCard from '../components/FolderCard';
import ImportTakeout from '../components/ImportTakeout';
import CategoryManager from '../components/CategoryManager';
import FolderManager from '../components/FolderManager';
import AddPlaceModal from '../components/AddPlaceModal';
import { Button, Container, Stack, Skeleton } from '../components/ui';

const Dashboard: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [viewMode, setViewMode] = useState<'folders' | 'places'>('folders');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [placesData, categoriesData, foldersData] = await Promise.all([
        placesService.getPlaces(),
        categoriesService.getCategories(),
        foldersService.getFolders()
      ]);

      setPlaces(placesData);
      setCategories(categoriesData);
      setFolders(foldersData);
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
      let filtered = places;
      
      // Apply folder filter if we're in folder view
      if (viewMode === 'places' && currentFolder) {
        filtered = filtered.filter(place => place.folderId === currentFolder.id);
      }
      
      // Apply text search
      if (filters.query && filters.query.trim() !== '') {
        const query = filters.query.toLowerCase();
        filtered = filtered.filter(place => 
          place.name.toLowerCase().includes(query) || 
          place.address.toLowerCase().includes(query) ||
          place.notes?.toLowerCase().includes(query)
        );
      }
      
      // Apply category filter
      if (filters.categories.length > 0) {
        filtered = filtered.filter(place => 
          place.categories.some(category => 
            filters.categories.includes(category.id)
          )
        );
      }
      
      setFilteredPlaces(filtered);
    } catch (err: any) {
      setError('Search failed');
      console.error('Search error:', err);
    }
  };

  const handleAddPlace = (newPlace: Place) => {
    setPlaces(prev => [newPlace, ...prev]);
    setFilteredPlaces(prev => [newPlace, ...prev]);
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

  const handleCategoryChange = async (placeId: string, categoryIds: string[]) => {
    try {
      const place = places.find(p => p.id === placeId);
      if (!place) return;

      // Remove existing categories
      for (const category of place.categories) {
        await categoriesService.removeCategoryFromPlace(category.id, placeId);
      }

      // Add new categories
      for (const categoryId of categoryIds) {
        await categoriesService.addCategoryToPlace(categoryId, placeId);
      }

      // Refresh data
      await loadData();
    } catch (err: any) {
      setError('Failed to update categories');
      console.error('Category update error:', err);
    }
  };

  const handleFolderChange = async (placeId: string, folderId: string | null) => {
    try {
      if (folderId) {
        await foldersService.movePlaceToFolder(folderId, placeId);
      } else {
        // Remove from folder - need to implement this endpoint
        const place = places.find(p => p.id === placeId);
        if (place?.folderId) {
          await foldersService.removePlaceFromFolder(place.folderId, placeId);
        }
      }

      // Refresh data
      await loadData();
    } catch (err: any) {
      setError('Failed to update folder');
      console.error('Folder update error:', err);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL places? This action cannot be undone.')) {
      return;
    }

    try {
      await placesService.deleteAllPlaces();
      setPlaces([]);
      setFilteredPlaces([]);
      setError('');
    } catch (err: any) {
      setError('Failed to delete all places');
      console.error('Delete all error:', err);
    }
  };

  const handleFolderClick = (folder: Folder) => {
    setCurrentFolder(folder);
    setViewMode('places');
    // Filter places for the selected folder
    const folderPlaces = places.filter(place => place.folderId === folder.id);
    setFilteredPlaces(folderPlaces);
  };

  const handleBackToFolders = () => {
    setCurrentFolder(null);
    setViewMode('folders');
    setFilteredPlaces(places);
  };

  const getUnorganizedPlaces = () => {
    return places.filter(place => !place.folderId);
  };

  if (isLoading) {
    return (
      <Layout>
        <Container>
          <Stack spacing="lg">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton height="2rem" width="200px" />
                <Skeleton height="1rem" width="100px" className="mt-2" />
              </div>
              <Skeleton height="2.5rem" width="150px" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <Skeleton height="1.5rem" width="80%" />
                  <Skeleton height="1rem" width="60%" className="mt-2" />
                  <Skeleton height="1rem" width="40%" className="mt-4" />
                </div>
              ))}
            </div>
          </Stack>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Stack spacing="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {viewMode === 'places' && currentFolder && (
                <Button
                  variant="ghost"
                  leftIcon={ArrowLeft}
                  onClick={handleBackToFolders}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Back to Folders
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {viewMode === 'places' && currentFolder ? currentFolder.name : 'My Places'}
                </h1>
                <p className="mt-2 text-gray-600">
                  {viewMode === 'folders' 
                    ? `${folders.length} folders • ${places.length} places total`
                    : `${filteredPlaces.length} places in folder`
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddPlace(true)}
                leftIcon={Plus}
                variant="primary"
              >
                Add Place
              </Button>
              <Button
                onClick={() => setShowImport(!showImport)}
                leftIcon={showImport ? undefined : Upload}
                variant={showImport ? 'secondary' : 'outline'}
              >
                {showImport ? 'Hide Import' : 'Import'}
              </Button>
              {places.length > 0 && (
                <Button
                  onClick={handleDeleteAll}
                  leftIcon={Trash2}
                  variant="danger"
                  size="sm"
                  className="ml-2"
                >
                  Delete All
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {showImport && (
            <ImportTakeout onImportComplete={loadData} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <CategoryManager
                categories={categories}
                onCategoriesChange={loadData}
              />
            </div>
            <div>
              <FolderManager
                folders={folders}
                onFoldersChange={loadData}
              />
            </div>
          </div>

          {/* Only show search bar in places view */}
          {viewMode === 'places' && (
            <div>
              <SearchBar onSearch={handleSearch} categories={categories} />
            </div>
          )}

          {/* Folder View */}
          {viewMode === 'folders' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Folders</h2>
              {folders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <FolderOpen className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No folders yet</h3>
                  <p className="text-gray-500 mb-6">
                    Create folders to organize your places, or import from Google Takeout.
                  </p>
                  <Button onClick={() => setShowImport(true)} leftIcon={Plus}>
                    Import Places
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folders.map(folder => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      placeCount={places.filter(p => p.folderId === folder.id).length}
                      onClick={() => handleFolderClick(folder)}
                    />
                  ))}
                  {/* Show unorganized places */}
                  {getUnorganizedPlaces().length > 0 && (
                    <FolderCard
                      folder={{
                        id: 'unorganized',
                        name: 'Unorganized',
                        color: '#6B7280',
                        userId: '',
                        placeCount: getUnorganizedPlaces().length,
                        createdAt: ''
                      }}
                      placeCount={getUnorganizedPlaces().length}
                      onClick={() => {
                        setCurrentFolder({
                          id: 'unorganized',
                          name: 'Unorganized',
                          color: '#6B7280',
                          userId: '',
                          placeCount: getUnorganizedPlaces().length,
                          createdAt: ''
                        });
                        setViewMode('places');
                        setFilteredPlaces(getUnorganizedPlaces());
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Places View */}
          {viewMode === 'places' && (
            <div>
              {filteredPlaces.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No places found</h3>
                  <p className="text-gray-500 mb-6">
                    {places.length === 0
                      ? 'Get started by importing your places from Google Takeout.'
                      : 'Try adjusting your search criteria.'}
                  </p>
                  {places.length === 0 && (
                    <Button onClick={() => setShowImport(true)} leftIcon={Plus}>
                      Import Places
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlaces.map(place => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      categories={categories}
                      folders={folders}
                      onDelete={handleDeletePlace}
                      onCategoryChange={handleCategoryChange}
                      onFolderChange={handleFolderChange}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </Stack>
      </Container>

      <AddPlaceModal
        isOpen={showAddPlace}
        onClose={() => setShowAddPlace(false)}
        onPlaceAdded={handleAddPlace}
      />
    </Layout>
  );
};

export default Dashboard;
