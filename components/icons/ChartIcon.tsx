import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const ChartIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Ionicons
    name="stats-chart-outline"
    size={size}
    color={color}
  />
);