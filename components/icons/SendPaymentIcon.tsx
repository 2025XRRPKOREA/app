import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const SendPaymentIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Ionicons
    name="card-outline"
    size={size}
    color={color}
  />
);