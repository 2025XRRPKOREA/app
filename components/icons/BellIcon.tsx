import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const BellIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Ionicons
    name="notifications-outline"
    size={size}
    color={color}
  />
);