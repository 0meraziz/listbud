import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'text-blue-500',
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  return (
    <Loader2
      className={`animate-spin ${sizeClasses[size]} ${color} ${className}`}
    />
  );
};

interface LoadingButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };

  const spinnerSizes = {
    small: 'small' as const,
    medium: 'small' as const,
    large: 'medium' as const,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && (
        <LoadingSpinner
          size={spinnerSizes[size]}
          color="text-current"
          className="mr-2"
        />
      )}
      {children}
    </button>
  );
};

interface PageLoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Loading...',
  size = 'large',
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

interface InlineLoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = 'Loading...',
  size = 'medium',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <LoadingSpinner size={size} className="mr-2" />
      <span className="text-gray-600 text-sm">{message}</span>
    </div>
  );
};

interface CardLoadingProps {
  className?: string;
}

export const CardLoading: React.FC<CardLoadingProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

interface ListLoadingProps {
  items?: number;
  className?: string;
}

export const ListLoading: React.FC<ListLoadingProps> = ({
  items = 3,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
