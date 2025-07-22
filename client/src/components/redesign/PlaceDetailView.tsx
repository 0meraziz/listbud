import React, { useState } from 'react'
import { ArrowLeft, MapPin, ExternalLink, Tag as TagIcon } from 'lucide-react'
import { Place, List, Tag } from '../../types'
import { Badge } from '../shadcn/badge'
import { PlaceTagsDialog } from './PlaceTagsDialog'
import { EnhancedButton } from '../ui/EnhancedButton'
import { EnhancedCard } from '../ui/EnhancedCard'

interface PlaceDetailViewProps {
  place: Place
  currentList?: List | null
  allTags?: Tag[]
  onBack: () => void
  onPlaceUpdate?: (place: Place) => void
}

// Utility function to decode HTML entities and handle special characters
const decodeHtmlEntities = (text: string): string => {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = text
  return textArea.value
}

// Helper function to determine if a color field contains an emoji or hex code
const isEmoji = (colorValue: string) => {
  // Check if it's a hex color code
  if (colorValue.startsWith('#') && colorValue.length === 7) {
    return false
  }
  // If it's not a hex code, assume it's an emoji
  return true
}

// Helper function to render tag display (emoji or colored dot)
const renderTagDisplay = (tag: { color: string }) => {
  if (isEmoji(tag.color)) {
    return <span className="text-lg">{tag.color}</span>
  } else {
    return (
      <span
        className="w-3 h-3 rounded-full inline-block"
        style={{ backgroundColor: tag.color }}
      />
    )
  }
}

export const PlaceDetailView: React.FC<PlaceDetailViewProps> = ({
  place,
  currentList,
  allTags = [],
  onBack,
  onPlaceUpdate
}) => {
  const [placeTagsDialogOpen, setPlaceTagsDialogOpen] = useState(false)

  const handleOpenPlaceTagsDialog = () => {
    setPlaceTagsDialogOpen(true)
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="page-header">
        <div className="container-section px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <EnhancedButton
              variant="outline"
              onClick={onBack}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to {currentList ? decodeHtmlEntities(currentList.name) : 'Lists'}
            </EnhancedButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-section px-6 py-8">
        <EnhancedCard className="overflow-hidden">
          <div className="p-8">
            {/* Place Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-heading-1 mb-2">
                  {decodeHtmlEntities(place.name)}
                </h1>
                {place.address && (
                  <div className="flex items-center gap-2 text-body-secondary mb-4">
                    <MapPin className="w-5 h-5" />
                    <span>{place.address}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {place.url && (
                  <EnhancedButton
                    variant="outline"
                    onClick={() => window.open(place.url, '_blank')}
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                  >
                    Open Link
                  </EnhancedButton>
                )}
                <EnhancedButton
                  variant="outline"
                  onClick={() => {
                    const query = encodeURIComponent(`${place.name} ${place.address || ''}`)
                    window.open(`https://www.google.com/maps/search/${query}`, '_blank')
                  }}
                  leftIcon={<MapPin className="w-4 h-4" />}
                >
                  Open in Maps
                </EnhancedButton>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-body-strong">Tags</h3>
                {allTags.length > 0 && onPlaceUpdate && (
                  <EnhancedButton
                    size="sm"
                    variant="outline"
                    onClick={handleOpenPlaceTagsDialog}
                    leftIcon={<TagIcon className="h-4 w-4" />}
                  >
                    Manage Tags
                  </EnhancedButton>
                )}
              </div>

              {place.tags && place.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {place.tags.map(tag => (
                    <Badge key={tag.id} variant="secondary" className="gap-2">
                      {renderTagDisplay(tag)}
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-notion-500">No tags assigned</p>
              )}
            </div>

            {/* Notes */}
            {place.notes && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-notion-700 mb-3">Notes</h3>
                <p className="text-notion-600 leading-relaxed">{place.notes}</p>
              </div>
            )}

            {/* Location Details */}
            {(place.latitude || place.longitude) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-notion-200">
                <div>
                  <h3 className="text-sm font-semibold text-notion-700 mb-2">Coordinates</h3>
                  <div className="text-sm text-notion-600 space-y-1">
                    {place.latitude && (
                      <div>
                        <span className="font-medium">Latitude:</span> {place.latitude}
                      </div>
                    )}
                    {place.longitude && (
                      <div>
                        <span className="font-medium">Longitude:</span> {place.longitude}
                      </div>
                    )}
                  </div>
                </div>

                {place.rating && (
                  <div>
                    <h3 className="text-sm font-semibold text-notion-700 mb-2">Rating</h3>
                    <div className="text-sm text-notion-600">
                      {place.rating}/5 stars
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Place ID (for debugging/reference) */}
            {place.placeId && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-body-strong mb-2">Place ID</h3>
                <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {place.placeId}
                </code>
              </div>
            )}
          </div>
        </EnhancedCard>
      </main>

      {/* Place Tags Dialog */}
      <PlaceTagsDialog
        open={placeTagsDialogOpen}
        onOpenChange={setPlaceTagsDialogOpen}
        place={place}
        allTags={allTags}
        onPlaceUpdate={onPlaceUpdate || (() => {})}
      />
    </div>
  )
}
