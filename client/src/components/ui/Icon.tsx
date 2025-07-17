import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 20,
  className = '',
  color
}) => {
  return (
    <IconComponent
      size={size}
      className={className}
      color={color}
    />
  );
};

export default Icon;
