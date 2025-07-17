import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  className = '',
  disabled,
  fullWidth = false,
  as = 'button',
  ...props
}) => {
  const Component = as as any;

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500
      border border-blue-600 hover:border-blue-700
    `,
    secondary: `
      bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500
      border border-gray-200 hover:border-gray-300
    `,
    ghost: `
      bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500
      border border-transparent hover:border-gray-200
    `,
    danger: `
      bg-red-600 text-white hover:bg-red-700 focus:ring-red-500
      border border-red-600 hover:border-red-700
    `,
    outline: `
      bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500
      border border-gray-300 hover:border-gray-400
    `,
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const finalClassName = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Component
      {...props}
      className={finalClassName}
      disabled={disabled || loading}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      )}

      {!loading && LeftIcon && (
        <LeftIcon size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
      )}

      {children && (
        <span className={loading ? 'opacity-0' : ''}>
          {children}
        </span>
      )}

      {!loading && RightIcon && (
        <RightIcon size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
      )}
    </Component>
  );
};

export default Button;
