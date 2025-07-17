import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { SearchFilters, Category } from '../types';
import { Input, Button, Card, Stack } from './ui';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  categories: Category[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, categories }) => {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newSelected);
    onSearch({
      query,
      categories: newSelected
    });
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    onSearch({ query: '', categories: [] });
  };

  const hasActiveFilters = query.length > 0 || selectedCategories.length > 0;

  return (
    <Card padding="md">
      <Stack spacing="md">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search places..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch({
                  query: e.target.value,
                  categories: selectedCategories
                });
              }}
              leftIcon={Search}
              variant="search"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={Filter}
            className={selectedCategories.length > 0 ? 'bg-blue-50 text-blue-600' : ''}
          >
            Filters
            {selectedCategories.length > 0 && (
              <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                {selectedCategories.length}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              leftIcon={X}
              className="text-gray-500"
            >
              Clear
            </Button>
          )}
        </div>

        {showFilters && categories.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`
                    inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full
                    transition-colors duration-200 border
                    ${selectedCategories.includes(category.id)
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  style={selectedCategories.includes(category.id) ? {
                    backgroundColor: category.color,
                    borderColor: category.color,
                  } : {}}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </Stack>
    </Card>
  );
};

export default SearchBar;
