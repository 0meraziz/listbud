import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Modern Card Component following industry best practices
 * Inspired by Notion, Linear, and Airtable card designs
 */

const cardVariants = cva(
  'card', // Base class from design system
  {
    variants: {
      variant: {
        default: '',
        elevated: 'card-elevated',
        interactive: 'card-interactive',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

export interface ModernCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  loading?: boolean
}

export const ModernCard = React.forwardRef<
  HTMLDivElement,
  ModernCardProps
>(({
  className,
  variant,
  padding,
  loading = false,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, padding }),
        loading && 'card-loading',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

ModernCard.displayName = 'ModernCard'

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-header', className)}
    {...props}
  >
    {children}
  </div>
))
CardHeader.displayName = 'CardHeader'

export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-body', className)}
    {...props}
  >
    {children}
  </div>
))
CardBody.displayName = 'CardBody'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-footer', className)}
    {...props}
  >
    {children}
  </div>
))
CardFooter.displayName = 'CardFooter'

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-tight tracking-tight text-gray-900',
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  >
    {children}
  </p>
))
CardDescription.displayName = 'CardDescription'

export default ModernCard
