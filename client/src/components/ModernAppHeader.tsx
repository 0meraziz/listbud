import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  Settings,
  Home,
  ChevronRight,
  User,
  LogOut,
  Upload,
  Command
} from 'lucide-react'
import { ModernButton } from './ui/ModernButton'
import { SearchInput } from './ui/ModernInput'

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
  onLogout?: () => void
  className?: string
}

const ModernAppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = {},
  user,
  onSearch,
  currentSearchQuery = '',
  onAdd,
  onImport,
  onLogout,
  className = ''
}) => {
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(currentSearchQuery)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  React.useEffect(() => {
    setSearchQuery(currentSearchQuery)
  }, [currentSearchQuery])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
    setIsSearchOpen(false)
  }

  return (
    <header className={`main-header ${className}`}>
      <div className="container-section">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo, Breadcrumbs, Title */}
          <div className="flex items-center space-x-6 flex-1">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900 hidden sm:block">
                  ListBud
                </span>
              </button>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <nav className="hidden md:flex items-center space-x-1 text-sm text-gray-600">
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    {item.href ? (
                      <button
                        onClick={() => navigate(item.href!)}
                        className="hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span className="text-gray-900 font-medium px-2 py-1">
                        {item.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}

            {/* Title and Subtitle */}
            {breadcrumbs.length === 0 && (
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Right side - Search, Actions, User Menu */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            {actions.search && (
              <div className="hidden md:block">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <SearchInput
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onBlur={() => setTimeout(() => setIsSearchOpen(false), 150)}
                      className="w-64"
                      placeholder="Search lists and places..."
                      autoFocus
                    />
                  </form>
                ) : (
                  <ModernButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(true)}
                    leftIcon={Search}
                    className="hidden lg:flex"
                  >
                    Search
                  </ModernButton>
                )}
              </div>
            )}

            {/* Mobile search button */}
            {actions.search && (
              <ModernButton
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden"
              >
                <Search className="w-4 h-4" />
              </ModernButton>
            )}

            {/* Keyboard shortcut hint */}
            {actions.search && !isSearchOpen && (
              <div className="hidden xl:flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            )}

            {/* Import button */}
            {onImport && (
              <ModernButton
                variant="ghost"
                size="sm"
                onClick={onImport}
                leftIcon={Upload}
                className="hidden sm:flex"
              >
                Import
              </ModernButton>
            )}

            {/* Add button */}
            {actions.add && onAdd && (
              <ModernButton
                variant="primary"
                size="sm"
                onClick={onAdd}
                leftIcon={Plus}
              >
                <span className="hidden sm:inline">Add</span>
              </ModernButton>
            )}

            {/* Settings */}
            {actions.settings && (
              <ModernButton
                variant="ghost"
                size="icon"
                onClick={() => {/* Handle settings */}}
              >
                <Settings className="w-4 h-4" />
              </ModernButton>
            )}

            {/* User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {/* User dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      {user.email && (
                        <p className="text-xs text-gray-500">{user.email}</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        onLogout?.()
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile title */}
        <div className="md:hidden pb-4">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Mobile search overlay */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearchSubmit}>
              <SearchInput
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search lists and places..."
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {(isUserMenuOpen || isSearchOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false)
            setIsSearchOpen(false)
          }}
        />
      )}
    </header>
  )
}

export default ModernAppHeader
