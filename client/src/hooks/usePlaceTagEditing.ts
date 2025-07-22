import { useState } from 'react'
import { Place } from '../types'
import { placesService } from '../services/api'

export const usePlaceTagEditing = () => {
  const [editingPlaceTags, setEditingPlaceTags] = useState<string | null>(null)
  const [selectedPlaceTags, setSelectedPlaceTags] = useState<string[]>([])

  const handlePlaceTagEdit = (place: Place) => {
    setEditingPlaceTags(place.id)
    setSelectedPlaceTags(place.tags?.map(t => t.id) || [])
  }

  const handlePlaceTagSave = async (placeId: string, onSuccess?: () => void) => {
    try {
      await placesService.updatePlaceTags(placeId, selectedPlaceTags)
      setEditingPlaceTags(null)
      setSelectedPlaceTags([])
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error('Error updating place tags:', err)
      throw err
    }
  }

  const handlePlaceTagCancel = () => {
    setEditingPlaceTags(null)
    setSelectedPlaceTags([])
  }

  const handlePlaceTagToggle = (tagId: string) => {
    setSelectedPlaceTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  return {
    editingPlaceTags,
    selectedPlaceTags,
    handlePlaceTagEdit,
    handlePlaceTagSave,
    handlePlaceTagCancel,
    handlePlaceTagToggle
  }
}
