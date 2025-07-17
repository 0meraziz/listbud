import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const baseClasses = `
    mx-auto px-4 sm:px-6 lg:px-8
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <div className={baseClasses.trim().replace(/\s+/g, ' ')}>
      {children}
    </div>
  );
};

export default Container;
