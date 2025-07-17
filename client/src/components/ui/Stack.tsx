import React from 'react';

interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = ''
}) => {
  const spacingClasses = {
    xs: direction === 'row' ? 'gap-1' : 'gap-1',
    sm: direction === 'row' ? 'gap-2' : 'gap-2',
    md: direction === 'row' ? 'gap-4' : 'gap-4',
    lg: direction === 'row' ? 'gap-6' : 'gap-6',
    xl: direction === 'row' ? 'gap-8' : 'gap-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const baseClasses = `
    flex
    ${direction === 'row' ? 'flex-row' : 'flex-col'}
    ${spacingClasses[spacing]}
    ${alignClasses[align]}
    ${justifyClasses[justify]}
    ${wrap ? 'flex-wrap' : ''}
    ${className}
  `;

  return (
    <div className={baseClasses.trim().replace(/\s+/g, ' ')}>
      {children}
    </div>
  );
};

export default Stack;
