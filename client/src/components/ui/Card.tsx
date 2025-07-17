import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  clickable = false,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const baseClasses = `
    bg-white rounded-lg border border-gray-200 shadow-sm
    ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
    ${clickable ? 'cursor-pointer' : ''}
    ${paddingClasses[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      className={baseClasses}
      style={{ color: '#1f2937' }} // Ensure dark text color for better contrast
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
