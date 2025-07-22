import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Enhanced Button Component with centralized design system
 * Replaces individual button styling across the application
 */

const buttonVariants = cva(
  // Base button classes - using design system tokens
  'btn',
  {
    variants: {
      variant: {
        default: 'btn-primary',
        destructive: 'btn-destructive',
        outline: 'btn-outline',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        link: 'btn-link',
      },
      size: {
        default: 'btn-md',
        sm: 'btn-sm',
        lg: 'btn-lg',
        icon: 'btn-icon',
        'icon-sm': 'btn-icon-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({
    className,
    variant,
    size,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    asChild = false,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          loading && 'state-loading',
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2 flex-shrink-0">{leftIcon}</span>
        )}
        <span className={cn(loading && 'opacity-0')}>{children}</span>
        {!loading && rightIcon && (
          <span className="ml-2 flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)
EnhancedButton.displayName = 'EnhancedButton'

export { EnhancedButton, buttonVariants }
