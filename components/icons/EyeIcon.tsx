import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const EyeIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Ionicons
    name="eye-outline"
    size={size}
    color={color}
  />
);