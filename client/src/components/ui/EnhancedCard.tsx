import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Enhanced Card Component with centralized design system
 * Replaces scattered card styling patterns across the application
 */

const cardVariants = cva(
  // Base card classes - using design system tokens
  'card',
  {
    variants: {
      variant: {
        default: '',
        elevated: 'card-elevated',
        interactive: 'card-interactive',
      },
      padding: {
        none: '',
        sm: 'card-padding-sm',
        md: 'card-padding-md',
        lg: 'card-padding-lg',
      },
      hover: {
        none: '',
        lift: 'card-hover-lift',
        shadow: 'hover:shadow-lg',
        scale: 'hover:scale-[1.02]',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: 'none',
    },
  }
)

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant, padding, hover, asChild = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover, className }))}
        {...props}
      />
    )
  }
)
EnhancedCard.displayName = 'EnhancedCard'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-header', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-body', className)}
    {...props}
  />
))
CardBody.displayName = 'CardBody'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-footer', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-heading-4 leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-body-secondary', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

export {
  EnhancedCard,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
  cardVariants,
}
