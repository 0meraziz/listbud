import React from 'react';
import { X } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  onRemove?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  color,
  onRemove,
  className = ''
}) => {
  const baseClasses = `
    inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200
    ${onRemove ? 'hover:scale-105' : ''}
  `;

  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    primary: 'bg-blue-100 text-blue-700 border border-blue-200',
    secondary: 'bg-gray-100 text-gray-600 border border-gray-200',
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  };

  const colorStyle = color ? {
    backgroundColor: color + '15',
    color: color,
    borderColor: color + '30',
  } : {};

  return (
    <span
      className={`
        ${baseClasses}
        ${!color ? variantClasses[variant] : 'border'}
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={colorStyle}
    >
      {color && (
        <div
          className={`w-2 h-2 rounded-full ${size === 'lg' ? 'w-2.5 h-2.5' : ''}`}
          style={{ backgroundColor: color }}
        />
      )}

      <span>{children}</span>

      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 p-0.5 hover:bg-black/10 rounded-full transition-colors duration-200"
        >
          <X className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />
        </button>
      )}
    </span>
  );
};

export default Badge;
