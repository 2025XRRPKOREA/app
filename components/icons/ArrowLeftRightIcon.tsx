import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const ArrowLeftRightIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <MaterialIcons
    name="swap-horiz"
    size={size}
    color={color}
  />
);