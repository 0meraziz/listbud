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
  MoreVertical
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
  onAdd?: () => void
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
const SearchButton: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  if (isSearchOpen) {
    return (
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <Input
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          placeholder="Search places, lists..."
          className="w-64"
          autoFocus
          onBlur={() => {
            if (!searchQuery.trim()) {
              setIsSearchOpen(false)
            }
          }}
        />
        <Button size="sm" disabled={!searchQuery.trim()}>
          Search
        </Button>
      </form>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsSearchOpen(true)}
      className="text-gray-600 hover:text-gray-900"
    >
      <Search className="w-4 h-4" />
      <span className="sr-only">Search</span>
    </Button>
  )
}

// Add Button Component (Simple version)
const AddButton: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onAdd}
      className="text-gray-600 hover:text-gray-900"
    >
      <Plus className="w-4 h-4" />
      <span className="sr-only">Add</span>
    </Button>
  )
}

// User Button Component (Simple version)
const UserButton: React.FC<{
  user: { name: string; email?: string; avatar?: string }
}> = ({ user }) => {
  return (
    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-6 h-6 rounded-full"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
      <span className="text-sm font-medium text-gray-700 hidden sm:inline">
        {user.name}
      </span>
    </Button>
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
  onAdd,
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
            {actions.search && <SearchButton onSearch={onSearch} />}
            {actions.add && <AddButton onAdd={onAdd} />}
            {user && <UserButton user={user} />}
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
