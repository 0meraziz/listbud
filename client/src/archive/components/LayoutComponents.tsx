import React from 'react'

// Utility function for classnames
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ')

// Types
interface GridProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 2 | 3 | 4 | 6 | 8
  responsive?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  children: React.ReactNode
  className?: string
}

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'
  padding?: boolean
}

interface StackProps {
  direction?: 'row' | 'column'
  spacing?: 1 | 2 | 3 | 4 | 6 | 8
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  children: React.ReactNode
  className?: string
}

// Grid Component
const Grid: React.FC<GridProps> = ({
  cols = 3,
  gap = 4,
  responsive,
  children,
  className
}) => {
  const getGridCols = (num: number) => {
    const colMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6'
    }
    return colMap[num as keyof typeof colMap] || 'grid-cols-3'
  }

  const getGap = (gapSize: number) => {
    const gapMap = {
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8'
    }
    return gapMap[gapSize as keyof typeof gapMap] || 'gap-4'
  }

  const gridClasses = cn(
    "grid",
    getGridCols(1), // Mobile first - always 1 column on mobile
    responsive?.sm ? `sm:${getGridCols(responsive.sm)}` : null,
    responsive?.md ? `md:${getGridCols(responsive.md)}` : null,
    responsive?.lg ? `lg:${getGridCols(responsive.lg)}` : null,
    responsive?.xl ? `xl:${getGridCols(responsive.xl)}` : null,
    // Default responsive behavior if no custom responsive provided
    !responsive && cols > 1 ? `sm:${getGridCols(Math.min(cols, 2))}` : null,
    !responsive && cols > 2 ? `md:${getGridCols(Math.min(cols, 3))}` : null,
    !responsive && cols > 3 ? `lg:${getGridCols(cols)}` : null,
    getGap(gap),
    className
  )

  return <div className={gridClasses}>{children}</div>
}

// Page Container Component
const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  maxWidth = '7xl',
  padding = true
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={cn(
      "min-h-screen bg-gray-50",
      className
    )}>
      <div className={cn(
        maxWidthClasses[maxWidth],
        "mx-auto",
        padding && "px-4 sm:px-6 py-6 lg:py-8"
      )}>
        {children}
      </div>
    </div>
  )
}

// Stack Component (Flexbox utility)
const Stack: React.FC<StackProps> = ({
  direction = 'column',
  spacing = 4,
  align = 'stretch',
  justify = 'start',
  children,
  className
}) => {
  const spacingClasses = {
    1: direction === 'row' ? 'space-x-1' : 'space-y-1',
    2: direction === 'row' ? 'space-x-2' : 'space-y-2',
    3: direction === 'row' ? 'space-x-3' : 'space-y-3',
    4: direction === 'row' ? 'space-x-4' : 'space-y-4',
    6: direction === 'row' ? 'space-x-6' : 'space-y-6',
    8: direction === 'row' ? 'space-x-8' : 'space-y-8',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  return (
    <div className={cn(
      "flex",
      direction === 'row' ? 'flex-row' : 'flex-col',
      spacingClasses[spacing],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  )
}

// Section Component (for organizing page content)
const Section: React.FC<{
  title?: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}> = ({ title, subtitle, action, children, className }) => {
  return (
    <section className={cn("mb-8", className)}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

// Empty State Component
const EmptyState: React.FC<{
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ icon, title, description, action, className }) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="w-16 h-16 mx-auto text-gray-400 mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Loading Skeleton Components
const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("border border-gray-200 rounded-lg p-4 bg-white", className)}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="flex space-x-2 mt-3">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  )
}

const SkeletonText: React.FC<{
  lines?: number
  className?: string
}> = ({ lines = 3, className }) => {
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-4 bg-gray-200 rounded",
            index === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

// Export all components
export {
  Grid,
  PageContainer,
  Stack,
  Section,
  EmptyState,
  SkeletonCard,
  SkeletonText
}

// Export types
export type {
  GridProps,
  PageContainerProps,
  StackProps
}
