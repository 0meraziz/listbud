import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import {
  Search,
  Plus,
  Settings,
  Home,
  ChevronRight,
  User,
  LogOut,
  MoreVertical,
  Upload
} from 'lucide-react'

// Utility function for classnames (simple version)
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ')

// Types
interface BreadcrumbItem {
  label: string
  href?: string
}

interface AppHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: {
    search?: boolean
    add?: boolean
    settings?: boolean
  }
  user?: {
    name: string
    email?: string
    avatar?: string
  }
  onSearch?: (query: string) => void
  currentSearchQuery?: string
  onAdd?: () => void
  onImport?: () => void
  onLogout?: () => void // NEW
  className?: string
}

// Breadcrumbs Component
const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const navigate = useNavigate()

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          {item.href ? (
            <button
              onClick={() => navigate(item.href!)}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Search Button Component
const SearchButton: React.FC<{ onSearch?: (query: string) => void; currentQuery?: string }> = ({ onSearch, currentQuery = '' }) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState(currentQuery)

  // Update internal state when currentQuery changes
  React.useEffect(() => {
    setSearchQuery(currentQuery)
  }, [currentQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery.trim())
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setSearchQuery(newQuery)
    // Trigger search immediately as user types
    if (onSearch) {
      onSearch(newQuery.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (onSearch) {
        onSearch(searchQuery.trim())
      }
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  if (isSearchOpen || currentQuery) {
    return (
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <div className="relative">
          <input
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search places, lists..."
            className="w-64 bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus={isSearchOpen && !currentQuery}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {!currentQuery && (
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
          >
            Cancel
          </button>
        )}
      </form>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsSearchOpen(true)}
      className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Search className="w-4 h-4" />
      <span className="sr-only">Search</span>
    </button>
  )
}

// Add Button Component
const AddButton: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => {
  return (
    <button
      type="button"
      onClick={() => { console.log('Add button clicked'); if (onAdd) onAdd() }}
      className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded"
    >
      <Plus className="w-4 h-4" />
      <span className="sr-only">Add</span>
    </button>
  )
}

// Import Button Component
const ImportButton: React.FC<{ onImport?: () => void }> = ({ onImport }) => {
  return (
    <button
      type="button"
      onClick={() => { console.log('Import button clicked'); if (onImport) onImport() }}
      className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded"
    >
      <Upload className="w-4 h-4" />
      <span className="sr-only">Import</span>
    </button>
  )
}

// User Button Component with dropdown
const UserButton: React.FC<{
  user: { name: string; email?: string; avatar?: string },
  onLogout?: () => void
}> = ({ user, onLogout }) => {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setTimeout(() => {
          setOpen(false);
        }, 100);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.name}</span>
        <MoreVertical className="w-4 h-4 ml-1 text-gray-400" />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              type="button"
              className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (onLogout) {
                  onLogout();
                }

                setTimeout(() => {
                  setOpen(false);
                }, 50);
              }}
            >
              <LogOut className="w-4 h-4 mr-3 text-gray-500" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Main AppHeader Component
const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions = { search: true, add: true, settings: true },
  user,
  onSearch,
  currentSearchQuery,
  onAdd,
  onImport,
  onLogout,
  className
}) => {
  return (
    <header className={cn(
      "border-b border-gray-200 bg-white sticky top-0 z-50",
      className
    )}>
      <div className="px-4 sm:px-6 py-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          {/* Left side: Logo + Breadcrumbs */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="text-xl">🏠</div>
              <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
                ListBud
              </h1>
            </div>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="hidden md:block">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {actions.search && <SearchButton onSearch={onSearch} currentQuery={currentSearchQuery} />}
            {actions.add && <AddButton onAdd={onAdd} />}
            {onImport && <ImportButton onImport={onImport} />}
            {user && <UserButton user={user} onLogout={onLogout} />}
          </div>
        </div>

        {/* Page title section */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppHeader
