import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Search, AlertCircle, LucideIcon } from 'lucide-react'

/**
 * Modern Input Component following industry best practices
 * Inspired by Notion, Linear, and Airtable input designs
 */

const inputVariants = cva(
  'input', // Base class from design system
  {
    variants: {
      variant: {
        default: '',
        error: 'input-error',
      },
      size: {
        sm: 'text-sm py-2 px-3',
        md: 'text-sm py-3 px-4',
        lg: 'text-base py-4 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ModernInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helpText?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  loading?: boolean
}

export const ModernInput = React.forwardRef<
  HTMLInputElement,
  ModernInputProps
>(({
  className,
  variant,
  size,
  type = 'text',
  label,
  error,
  helpText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  id,
  ...props
}, ref) => {
  const generatedId = React.useId()
  const inputId = id || generatedId
  const errorId = error ? `${inputId}-error` : undefined
  const helpId = helpText ? `${inputId}-help` : undefined

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          type={type}
          id={inputId}
          ref={ref}
          className={cn(
            inputVariants({ variant: error ? 'error' : variant, size }),
            LeftIcon && 'pl-10',
            RightIcon && 'pr-10',
            loading && 'opacity-50',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(errorId, helpId)}
          disabled={loading || props.disabled}
          {...props}
        />

        {RightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <RightIcon className="w-4 h-4" />
          </div>
        )}

        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <div id={errorId} className="form-error">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}

      {helpText && !error && (
        <div id={helpId} className="form-help">
          {helpText}
        </div>
      )}
    </div>
  )
})

ModernInput.displayName = 'ModernInput'

// Search Input Component
export interface SearchInputProps extends Omit<ModernInputProps, 'leftIcon'> {
  onClear?: () => void
}

export const SearchInput = React.forwardRef<
  HTMLInputElement,
  SearchInputProps
>(({ onClear, ...props }, ref) => {
  return (
    <ModernInput
      ref={ref}
      type="search"
      leftIcon={Search}
      placeholder="Search..."
      {...props}
    />
  )
})

SearchInput.displayName = 'SearchInput'

// Floating Label Input Component
export interface FloatingInputProps extends Omit<ModernInputProps, 'leftIcon' | 'rightIcon' | 'label'> {
  floatingLabel?: string
}

export const FloatingInput = React.forwardRef<
  HTMLInputElement,
  FloatingInputProps
>(({ floatingLabel, className, size, variant, error, helpText, loading, ...props }, ref) => {
  return (
    <div className="input-floating">
      <input
        ref={ref}
        className={cn(
          'input-floating-field',
          inputVariants({ variant: error ? 'error' : variant, size }),
          className
        )}
        placeholder=" "
        disabled={loading || props.disabled}
        {...props}
      />
      {floatingLabel && (
        <label className="input-floating-label">
          {floatingLabel}
        </label>
      )}
    </div>
  )
})

FloatingInput.displayName = 'FloatingInput'

export default ModernInput
