import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  clickable = false,
  variant = 'default',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white border border-gray-100 shadow-md',
    outlined: 'bg-white border-2 border-gray-200 shadow-none',
    filled: 'bg-gray-50 border border-gray-100 shadow-sm',
  };

  const baseClasses = `
    rounded-xl transition-all duration-200
    ${variantClasses[variant]}
    ${hover ? 'hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5' : ''}
    ${clickable ? 'cursor-pointer active:scale-[0.98]' : ''}
    ${paddingClasses[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      className={baseClasses}
      style={{ color: '#1f2937' }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
