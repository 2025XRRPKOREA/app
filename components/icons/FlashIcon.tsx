import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const FlashIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Ionicons
    name="flash"
    size={size}
    color={color}
  />
);