import { useState } from 'react'
import { Tag } from '../types'
import { categoriesService } from '../services/api'

export const useTagManagement = (initialTags: Tag[] = []) => {
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagFilter, setShowTagFilter] = useState(false)
  const [showTagManagement, setShowTagManagement] = useState(false)

  const handleTagCreate = async (name: string, color: string) => {
    try {
      const newTag = await categoriesService.createCategory(name, color)
      setTags(prev => [...prev, newTag])
      return newTag
    } catch (err) {
      console.error('Error creating tag:', err)
      throw err
    }
  }

  const handleTagUpdate = async (tag: Tag) => {
    // TODO: Implement update functionality when API endpoint is available
    console.log('Tag update not yet implemented:', tag)
  }

  const handleTagDelete = async (tagId: string) => {
    try {
      await categoriesService.deleteCategory(tagId)
      setTags(prev => prev.filter(t => t.id !== tagId))
      setSelectedTags(prev => prev.filter(id => id !== tagId))
      return true
    } catch (err) {
      console.error('Error deleting tag:', err)
      throw err
    }
  }

  const handleTagFilter = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const clearTagFilters = () => {
    setSelectedTags([])
  }

  const updateTags = (newTags: Tag[]) => {
    setTags(newTags)
  }

  return {
    tags,
    selectedTags,
    showTagFilter,
    showTagManagement,
    setShowTagFilter,
    setShowTagManagement,
    handleTagCreate,
    handleTagUpdate,
    handleTagDelete,
    handleTagFilter,
    clearTagFilters,
    updateTags
  }
}
