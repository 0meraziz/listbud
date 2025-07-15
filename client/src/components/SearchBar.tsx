import React, { useState } from 'react';
import { SearchFilters, Category } from '../types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  categories: Category[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, categories }) => {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSearch = () => {
    onSearch({
      query,
      categories: selectedCategories
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    onSearch({ query: '', categories: [] });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search places..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by categories:
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategories.includes(category.id)
                    ? 'text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
                style={
                  selectedCategories.includes(category.id)
                    ? { backgroundColor: category.color }
                    : {}
                }
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
