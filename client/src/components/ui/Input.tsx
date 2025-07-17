import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  variant?: 'default' | 'search' | 'inline';
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  variant = 'default',
  fullWidth = true,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseInputClasses = `
    flex-1 min-w-0 block w-full px-3 py-2 text-base text-gray-900 placeholder-gray-500
    bg-white border border-gray-300 rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
  `;

  const variantClasses = {
    default: baseInputClasses,
    search: `${baseInputClasses} bg-gray-50 border-gray-200`,
    inline: `${baseInputClasses} border-0 border-b-2 rounded-none bg-transparent`,
  };

  const wrapperClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const iconClasses = `
    flex-shrink-0 text-gray-400 transition-colors duration-200
    ${isFocused ? 'text-blue-500' : ''}
    ${error ? 'text-red-500' : ''}
  `;

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon size={16} className={iconClasses} />
          </div>
        )}

        <input
          {...props}
          className={`
            ${variantClasses[variant]}
            ${LeftIcon ? 'pl-10' : ''}
            ${RightIcon ? 'pr-10' : ''}
          `.trim().replace(/\s+/g, ' ')}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />

        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <RightIcon size={16} className={iconClasses} />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
