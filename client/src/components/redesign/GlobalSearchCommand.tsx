import React, { useState, useEffect } from 'react'
import { Search, MapPin, Hash, ArrowRight } from 'lucide-react'
import { Place, List, Tag } from '../../types'
import { SimpleDialog } from '../shadcn/dialog'
import { Input } from '../shadcn/input'
import { Badge } from '../shadcn/badge'

interface GlobalSearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  places: Place[]
  lists: List[]
  tags: Tag[]
  onPlaceSelect: (place: Place) => void
  onListSelect: (list: List) => void
}

export const GlobalSearchCommand: React.FC<GlobalSearchCommandProps> = ({
  open,
  onOpenChange,
  places,
  lists,
  tags,
  onPlaceSelect,
  onListSelect,
}) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Filter results based on query
  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(query.toLowerCase()) ||
    place.address.toLowerCase().includes(query.toLowerCase()) ||
    place.notes?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3)

  const allResults = [
    ...filteredLists.map(list => ({ type: 'list' as const, item: list })),
    ...filteredPlaces.map(place => ({ type: 'place' as const, item: place })),
  ]

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % allResults.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + allResults.length) % allResults.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (allResults[selectedIndex]) {
        const { type, item } = allResults[selectedIndex]
        if (type === 'list') {
          onListSelect(item as List)
        } else {
          onPlaceSelect(item as Place)
        }
      }
    }
  }

  return (
    <SimpleDialog open={open} onOpenChange={onOpenChange}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-notion-400" />
          <Input
            placeholder="Search places, lists, and tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-none focus:ring-0 text-lg"
            autoFocus
          />
        </div>

        {query && (
          <div className="max-h-96 overflow-y-auto">
            {allResults.length === 0 ? (
              <div className="text-center py-8 text-notion-500">
                No results found for "{query}"
              </div>
            ) : (
              <div className="space-y-1">
                {allResults.map((result, index) => (
                  <div
                    key={`${result.type}-${result.item.id}`}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex ? 'bg-notion-100' : 'hover:bg-notion-50'
                    }`}
                    onClick={() => {
                      if (result.type === 'list') {
                        onListSelect(result.item as List)
                      } else {
                        onPlaceSelect(result.item as Place)
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {result.type === 'list' ? (
                        <div className="flex-shrink-0">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                            style={{ backgroundColor: (result.item as List).color }}
                          >
                            {(result.item as List).emoji || '📍'}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-lg bg-notion-100 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-notion-600" />
                          </div>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-notion-900 truncate">
                            {result.item.name}
                          </span>
                          {result.type === 'list' && (
                            <Badge variant="secondary" className="text-xs">
                              {(result.item as List).placeCount} places
                            </Badge>
                          )}
                        </div>

                        {result.type === 'place' && (
                          <div className="text-sm text-notion-500 truncate">
                            {(result.item as Place).address}
                          </div>
                        )}

                        {result.type === 'place' && (result.item as Place).tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(result.item as Place).tags.slice(0, 3).map((tag) => (
                              <Badge key={tag.id} variant="outline" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        <ArrowRight className="h-4 w-4 text-notion-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-8 text-notion-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-notion-300" />
            <p>Start typing to search across all your places and lists</p>
            <p className="text-xs mt-2">
              Use ↑↓ to navigate and ⏎ to select
            </p>
          </div>
        )}
      </div>
    </SimpleDialog>
  )
}
