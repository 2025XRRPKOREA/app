import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const ArrowDownLeftIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <MaterialIcons
    name="south-west"
    size={size}
    color={color}
  />
);