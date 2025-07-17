import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <div className="border-2 border-current border-t-transparent rounded-full w-full h-full" />
    </div>
  );
};

interface LoadingProps {
  message?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size="lg" className="text-blue-600 mb-4" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default Loading;
