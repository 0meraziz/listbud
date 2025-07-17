import React, { useState } from 'react';
import { Search, X, Filter, Sliders } from 'lucide-react';
import { SearchFilters, Tag } from '../types';
import { Input, Button, Card, Stack, Badge } from './ui';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  tags: Tag[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, tags }) => {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleTagToggle = (tagId: string) => {
    const newSelected = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(newSelected);
    onSearch({
      query,
      tags: newSelected
    });
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedTags([]);
    onSearch({ query: '', tags: [] });
  };

  const hasActiveFilters = query.length > 0 || selectedTags.length > 0;

  return (
    <Card variant="outlined" padding="md" className="bg-white">
      <Stack spacing="md">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search places by name, address, or notes..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch({
                  query: e.target.value,
                  tags: selectedTags
                });
              }}
              leftIcon={Search}
              variant="search"
              className="text-base"
            />
          </div>

          <Button
            variant={selectedTags.length > 0 ? "primary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={Sliders}
            className={selectedTags.length > 0 ? 'bg-blue-600 text-white' : ''}
          >
            Filters
            {selectedTags.length > 0 && (
              <Badge
                variant="secondary"
                size="sm"
                className="ml-2 bg-white text-blue-600"
              >
                {selectedTags.length}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              leftIcon={X}
              className="text-gray-500 hover:text-red-600"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {query && (
              <Badge
                variant="primary"
                size="sm"
                onRemove={() => {
                  setQuery('');
                  onSearch({ query: '', tags: selectedTags });
                }}
              >
                "{query}"
              </Badge>
            )}
            {selectedTags.map((tagId: string) => {
              const tag = tags.find((t: Tag) => t.id === tagId);
              return tag ? (
                <Badge
                  key={tagId}
                  color={tag.color}
                  size="sm"
                  onRemove={() => handleTagToggle(tagId)}
                >
                  {tag.name}
                </Badge>
              ) : null;
            })}
          </div>
        )}

        {showFilters && tags.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
              <span className="text-xs text-gray-500">
                {selectedTags.length} of {tags.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {tags.map((tag: Tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200 border text-left
                    ${selectedTags.includes(tag.id)
                      ? 'border-current shadow-sm scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  style={selectedTags.includes(tag.id) ? {
                    backgroundColor: tag.color + '15',
                    color: tag.color,
                    borderColor: tag.color,
                  } : {}}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="truncate">{tag.name}</span>
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
