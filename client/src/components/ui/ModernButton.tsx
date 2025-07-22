import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Loader2, LucideIcon } from 'lucide-react'

/**
 * Modern Button Component following industry best practices
 * Inspired by Notion, Linear, and Airtable button designs
 */

const buttonVariants = cva(
  'btn', // Base class from design system
  {
    variants: {
      variant: {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
      },
      size: {
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
        icon: 'btn-icon',
        'icon-sm': 'btn-icon-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  fullWidth?: boolean
  children?: React.ReactNode
}

export const ModernButton = React.forwardRef<
  HTMLButtonElement,
  ModernButtonProps
>(({
  className,
  variant,
  size,
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  disabled,
  children,
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        loading && 'btn-loading',
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      ref={ref}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4" />}
          {children}
          {RightIcon && <RightIcon className="w-4 h-4" />}
        </>
      )}
    </button>
  )
})

ModernButton.displayName = 'ModernButton'

export default ModernButton
