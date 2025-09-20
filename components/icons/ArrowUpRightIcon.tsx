import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const ArrowUpRightIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <MaterialIcons
    name="north-east"
    size={size}
    color={color}
  />
);