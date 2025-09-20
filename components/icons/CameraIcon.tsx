import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const CameraIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Ionicons
    name="camera-outline"
    size={size}
    color={color}
  />
);