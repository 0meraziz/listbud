import { Place, Folder, Tag } from '../types'

export const decodeHtmlEntities = (text: string): string => {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = text
  return textArea.value
}

export const filterPlaces = (
  places: Place[],
  currentFolder: Folder | null,
  searchQuery: string,
  selectedTags: string[]
): Place[] => {
  return places.filter(place => {
    const matchesFolder = currentFolder ? place.listId === currentFolder.id : true
    const matchesSearch = searchQuery === '' ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address?.toLowerCase().includes(searchQuery.toLowerCase())

    // Tag filtering - place must have all selected tags
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tagId => place.tags?.some(tag => tag.id === tagId))

    return matchesFolder && matchesSearch && matchesTags
  })
}

export const filterFolders = (
  folders: Folder[],
  places: Place[],
  searchQuery: string,
  selectedTags: string[]
): Folder[] => {
  return folders.filter(folder => {
    const matchesSearch = searchQuery === '' ||
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Tag filtering for folders - folder must have places with all selected tags
    if (selectedTags.length === 0) {
      return matchesSearch
    }

    const folderPlaces = places.filter(p => p.listId === folder.id)
    const matchesTags = selectedTags.every(tagId =>
      folderPlaces.some(place => place.tags?.some(tag => tag.id === tagId))
    )

    return matchesSearch && matchesTags
  })
}
